import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getUserTenableSettings } from "@/lib/auth/user-service";
import {
  fetchScanDetail,
  fetchScanDetailWithHistory,
  fetchScanHistory,
  fetchScanHostDetail,
  fetchScanHostPlugins,
  fetchScans,
  upsertTenableScan,
} from "@/lib/tenable/tenable-service";
import { getIntegrationSetting, setIntegrationSetting } from "@/lib/settings/integration-settings";
import { getLocalTimestamp } from "@/lib/utils/time";
import {
  ensureAutomationJob,
  updateAutomationJobStatus,
} from "@/lib/auditoria/automation-service";
import {
  linkVulnerabilityToServer,
  upsertVulnerabilityServer,
} from "@/lib/vulnerabilities/vulnerability-service";

function parsePrefixes(raw: string | null) {
  if (!raw) return [];
  return raw
    .split(/[\n,;]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildPrefixVariants(prefix: string) {
  const trimmed = prefix.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) return [trimmed];
  return [`[${trimmed}]`, trimmed];
}

function matchesPrefix(name: string, prefixes: string[]) {
  if (prefixes.length === 0) return true;
  const normalized = name.trim().toUpperCase();
  return prefixes.some((prefix) => {
    const variants = buildPrefixVariants(prefix).map((value) => value.toUpperCase());
    return variants.some((variant) => normalized.startsWith(variant));
  });
}

function normalizeEnvironment(prefixes: string[], scanName: string) {
  if (prefixes.length === 0) return null;
  const normalized = scanName.trim().toUpperCase();
  const match = prefixes.find((prefix) => {
    const variants = buildPrefixVariants(prefix).map((value) => value.toUpperCase());
    return variants.some((variant) => normalized.startsWith(variant));
  });
  if (!match) return null;
  return match.replace(/^\[/, "").replace(/\]$/, "").trim() || null;
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
  }

  const settings = getUserTenableSettings(session.id);
  if (!settings?.tenable_access_key || !settings?.tenable_secret_key) {
    return NextResponse.json(
      { error: "Integração Tenable não configurada." },
      { status: 400 }
    );
  }

  const credentials = {
    accessKey: settings.tenable_access_key,
    secretKey: settings.tenable_secret_key,
  };

  const startedAt = Date.now();
  try {
    const job = await ensureAutomationJob({
      id: "tenable-scans-sync",
      name: "Sync scans Tenable",
      description: "Atualiza execuções e metadados dos scans Tenable.",
      owner: "Automação Tenable",
    });
    await updateAutomationJobStatus(job.id, {
      statusCode: 2,
      logMessage: "Execução iniciada: sincronizando scans Tenable.",
      logLevel: "info",
    });

    if (getIntegrationSetting("tenable_scans_paused") === "true") {
      await updateAutomationJobStatus(job.id, {
        statusCode: 0,
        logMessage: "Sincronização pausada pelo administrador.",
        logLevel: "warning",
      });
      return NextResponse.json(
        { error: "Sincronização pausada." },
        { status: 409 }
      );
    }

    const prefixes = parsePrefixes(getIntegrationSetting("tenable_scan_prefixes"));
    const scans = (await fetchScans(credentials)).filter((scan) => {
      const name = (scan?.name as string | undefined) ?? "";
      return matchesPrefix(name, prefixes);
    });

    let processedHosts = 0;
    let processedPlugins = 0;
    const totalScans = scans.length;

    for (const scan of scans) {
      if (getIntegrationSetting("tenable_scans_paused") === "true") {
        await updateAutomationJobStatus(job.id, {
          statusCode: 0,
          pendingIssues: Math.max(0, totalScans),
          logMessage: "Sincronização pausada pelo administrador.",
          logLevel: "warning",
        });
        return NextResponse.json(
          { error: "Sincronização pausada." },
          { status: 409 }
        );
      }
      const detail = await fetchScanDetail(Number(scan.id), credentials);
      upsertTenableScan(scan, detail);

      const scanId = Number(scan.id);
      const scanName = (scan?.name as string | undefined) ?? "";
      const environment = normalizeEnvironment(prefixes, scanName);

      const histories = await fetchScanHistory(scanId, credentials);
        const completedHistories = histories.filter(
          (history) => history?.status === "completed"
        );

      for (const history of completedHistories) {
        if (getIntegrationSetting("tenable_scans_paused") === "true") {
          await updateAutomationJobStatus(job.id, {
            statusCode: 0,
            pendingIssues: Math.max(0, totalScans),
            logMessage: "Sincronização pausada pelo administrador.",
            logLevel: "warning",
          });
          return NextResponse.json(
            { error: "Sincronização pausada." },
            { status: 409 }
          );
        }
        const historyId = Number(history?.id ?? 0);
        if (!historyId) continue;
        let scanDetail: Record<string, unknown>;
        try {
          scanDetail = await fetchScanDetailWithHistory(
            scanId,
            historyId,
            credentials
          );
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Falha ao carregar scan.";
          await updateAutomationJobStatus(job.id, {
            statusCode: 2,
            logMessage: `Scan ${scanId}: ${message}. Pulando history ${historyId}.`,
            logLevel: "warning",
          });
          continue;
        }
        const hosts = Array.isArray(scanDetail?.hosts)
          ? scanDetail.hosts
          : [];

        let processedInHistory = 0;
        await updateAutomationJobStatus(job.id, {
          statusCode: 2,
          pendingIssues: Math.max(0, hosts.length),
          logMessage: `Scan ${scanId}: processando ${hosts.length} hosts (history ${historyId}).`,
          logLevel: "info",
        });

        for (const host of hosts) {
          if (getIntegrationSetting("tenable_scans_paused") === "true") {
            await updateAutomationJobStatus(job.id, {
              statusCode: 0,
              pendingIssues: Math.max(0, totalScans),
              logMessage: "Sincronização pausada pelo administrador.",
              logLevel: "warning",
            });
            return NextResponse.json(
              { error: "Sincronização pausada." },
              { status: 409 }
            );
          }
          const hostId = Number(host?.host_id ?? host?.id ?? 0);
          if (!hostId) continue;
          let hostDetail: Record<string, unknown>;
          try {
            hostDetail = await fetchScanHostDetail(
              scanId,
              hostId,
              historyId,
              credentials
            );
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Falha ao carregar host.";
            await updateAutomationJobStatus(job.id, {
              statusCode: 2,
              logMessage: `Scan ${scanId}: host ${hostId} ignorado. ${message}`,
              logLevel: "warning",
            });
            continue;
          }

          const hostname =
            (hostDetail?.info?.hostname as string | undefined) ||
            (host?.hostname as string | undefined) ||
            (host?.name as string | undefined) ||
            `host-${hostId}`;
          const ipAddress =
            (hostDetail?.info?.ipv4 as string | undefined) ||
            (hostDetail?.info?.ip as string | undefined) ||
            (host?.ipv4 as string | undefined) ||
            (host?.ip as string | undefined) ||
            "";

          const serverId = `tenable-${hostId}`;
          upsertVulnerabilityServer({
            id: serverId,
            name: hostname,
            ip: ipAddress || "0.0.0.0",
            environment,
          });

          let plugins: Array<Record<string, unknown>> = [];
          let usedHostFallback = false;
          try {
            plugins = await fetchScanHostPlugins(
              scanId,
              hostId,
              historyId,
              credentials
            );
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : "Falha ao carregar plugins do host.";
            await updateAutomationJobStatus(job.id, {
              statusCode: 2,
              logMessage: `Scan ${scanId}: plugins do host ${hostId} não foram coletados. ${message}`,
              logLevel: "warning",
            });
            plugins = [];
          }

          let pluginIds = Array.from(
            new Set(
              plugins
                .map((plugin) => Number(plugin?.plugin_id ?? plugin?.id ?? 0))
                .filter((id) => Number.isFinite(id) && id > 0)
                .map((id) => String(id))
            )
          );

          if (pluginIds.length === 0) {
            const vulnerabilities = Array.isArray((hostDetail as { vulnerabilities?: unknown }).vulnerabilities)
              ? ((hostDetail as { vulnerabilities?: Array<Record<string, unknown>> }).vulnerabilities ?? [])
              : [];
            const fallbackIds = Array.from(
              new Set(
                vulnerabilities
                  .map((item) => Number(item?.plugin_id ?? item?.id ?? 0))
                  .filter((id) => Number.isFinite(id) && id > 0)
                  .map((id) => String(id))
              )
            );
            if (fallbackIds.length > 0) {
              usedHostFallback = true;
              pluginIds = fallbackIds;
            }
          }

          let missingPlugins = 0;
          for (const pluginId of pluginIds) {
            const linked = linkVulnerabilityToServer(pluginId, serverId);
            if (linked) {
              processedPlugins += 1;
            } else {
              missingPlugins += 1;
            }
          }
          if (missingPlugins > 0) {
            await updateAutomationJobStatus(job.id, {
              statusCode: 2,
              logMessage: `Scan ${scanId}: ${missingPlugins} plugin_id ignorados por não existirem no catálogo.`,
              logLevel: "warning",
            });
          }

          processedInHistory += 1;
          processedHosts += 1;
          await updateAutomationJobStatus(job.id, {
            statusCode: 2,
            pendingIssues: Math.max(0, hosts.length - processedInHistory),
            logMessage: `Scan ${scanId}: ${processedHosts} hosts processados, ${processedPlugins} plugins vinculados.${usedHostFallback ? " (fallback host detail)" : ""}`,
            logLevel: "info",
          });
        }
      }
    }
    setIntegrationSetting("tenable_scans_last_sync", getLocalTimestamp());
    const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
    await updateAutomationJobStatus(job.id, {
      statusCode: 1,
      durationSeconds,
      pendingIssues: 0,
      logMessage: `Sincronização concluída. ${totalScans} scans atualizados, ${processedHosts} hosts analisados, ${processedPlugins} plugins vinculados.`,
      logLevel: "info",
    });
    return NextResponse.json({ synced: scans.length });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao sincronizar scans.";
    try {
      const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
      await updateAutomationJobStatus("tenable-scans-sync", {
        statusCode: 0,
        durationSeconds,
        logMessage: message,
        logLevel: "error",
      });
    } catch {
      // ignore audit failures
    }
    return NextResponse.json(
      { error: message, details: message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getUserTenableSettings } from "@/lib/auth/user-service";
import {
  fetchPluginDetail,
  fetchPlugins,
  upsertTenablePlugin,
} from "@/lib/tenable/tenable-service";
import {
  getIntegrationSetting,
  setIntegrationSetting,
} from "@/lib/settings/integration-settings";
import { getLocalTimestamp } from "@/lib/utils/time";
import {
  ensureAutomationJob,
  updateAutomationJobStatus,
} from "@/lib/auditoria/automation-service";

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

  const url = new URL(request.url);
  const isFullSync = url.searchParams.get("full") === "true";
  const startedAt = Date.now();
  const runId = `run_${startedAt}_${Math.random().toString(36).slice(2, 8)}`;
  try {
    const job = await ensureAutomationJob({
      id: "tenable-plugins-sync",
      name: "Sync plugins Tenable",
      description: "Atualiza catálogo de vulnerabilidades a partir dos plugins Tenable.",
      owner: "Automação Tenable",
    });
    if (job.status === "running") {
      if (isFullSync) {
        await updateAutomationJobStatus(job.id, {
          statusCode: 0,
          logMessage: "Sincronização anterior interrompida para full resync.",
          logLevel: "warning",
        });
      } else {
        return NextResponse.json(
          { error: "Sincronização já está em execução." },
          { status: 409 }
        );
      }
    }
    setIntegrationSetting("tenable_plugins_run_id", runId);
    const requester = session.name ?? session.email ?? "Administrador";
    await updateAutomationJobStatus(job.id, {
      statusCode: 2,
      logMessage: `Execução iniciada por ${requester}: sincronizando plugins Tenable.`,
      logLevel: "info",
    });

    if (getIntegrationSetting("tenable_plugins_paused") === "true") {
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

    if (isFullSync) {
      setIntegrationSetting("tenable_plugins_last_updated", "");
      setIntegrationSetting("tenable_plugins_checkpoint_id", "");
    }

    const lastUpdatedSetting = isFullSync
      ? null
      : getIntegrationSetting("tenable_plugins_last_updated") ??
        getIntegrationSetting("tenable_plugins_last_sync");
    const lastUpdatedParam = normalizeLastUpdated(lastUpdatedSetting);
    let plugins = await fetchPluginsWithHeartbeat(
      job.id,
      credentials,
      lastUpdatedParam ?? undefined
    );
    if (plugins.length === 0 && lastUpdatedParam) {
      await updateAutomationJobStatus(job.id, {
        statusCode: 2,
        logMessage:
          "Nenhum plugin retornado com last_updated. Reexecutando sync completo.",
        logLevel: "warning",
      });
      plugins = await fetchPluginsWithHeartbeat(job.id, credentials);
    }
    const total = plugins.length;
    const checkpointRaw = getIntegrationSetting("tenable_plugins_checkpoint_id");
    const checkpointId = checkpointRaw ? Number(checkpointRaw) : null;
    let startIndex = 0;
    if (checkpointId && Number.isFinite(checkpointId)) {
      const foundIndex = plugins.findIndex(
        (plugin) => Number(plugin?.id) === checkpointId
      );
      if (foundIndex >= 0 && foundIndex + 1 < plugins.length) {
        startIndex = foundIndex + 1;
        await updateAutomationJobStatus(job.id, {
          statusCode: 2,
          pendingIssues: Math.max(0, total - startIndex),
          logMessage: `Retomando do plugin ${checkpointId}. Posição ${startIndex + 1}/${total}.`,
          logLevel: "warning",
        });
      } else {
        setIntegrationSetting("tenable_plugins_checkpoint_id", "");
      }
    }
    await updateAutomationJobStatus(job.id, {
      statusCode: 2,
      pendingIssues: Math.max(0, total - startIndex),
      logMessage:
        startIndex > 0
          ? `Plugins encontrados: ${total}. Continuando a partir do item ${startIndex + 1}.`
          : `Plugins encontrados: ${total}. Iniciando processamento.`,
      logLevel: "info",
    });

    let processed = 0;
    let skipped = 0;
    let lastCheckpointId: number | null =
      checkpointId && Number.isFinite(checkpointId) ? checkpointId : null;
    const logEvery = 50;
    const heartbeatEveryMs = 15000;
    let lastHeartbeat = Date.now();
    for (let index = startIndex; index < plugins.length; index += 1) {
      if (getIntegrationSetting("tenable_plugins_run_id") !== runId) {
        const remaining = Math.max(0, total - index);
        await updateAutomationJobStatus(job.id, {
          statusCode: 0,
          pendingIssues: remaining,
          logMessage: "Sincronização interrompida por uma nova execução.",
          logLevel: "warning",
        });
        return NextResponse.json(
          { error: "Sincronização interrompida." },
          { status: 409 }
        );
      }
      const plugin = plugins[index];
      const riskFactor =
        (plugin.attributes as Record<string, unknown> | undefined)?.risk_factor ??
        (plugin as { risk_factor?: unknown }).risk_factor;
      if (
        typeof riskFactor === "string" &&
        riskFactor.trim().toLowerCase() === "none"
      ) {
        skipped += 1;
        continue;
      }
      if (getIntegrationSetting("tenable_plugins_paused") === "true") {
        const remaining = Math.max(0, total - (index));
        await updateAutomationJobStatus(job.id, {
          statusCode: 0,
          pendingIssues: remaining,
          logMessage: "Sincronização pausada pelo administrador.",
          logLevel: "warning",
        });
        if (lastCheckpointId && Number.isFinite(lastCheckpointId)) {
          setIntegrationSetting(
            "tenable_plugins_checkpoint_id",
            String(lastCheckpointId)
          );
        }
        return NextResponse.json(
          { error: "Sincronização pausada." },
          { status: 409 }
        );
      }
      const detail = await fetchPluginDetail(plugin.id, credentials);
      const mergedDetail = {
        ...detail,
        listAttributes: plugin.attributes,
        cve: Array.isArray((plugin as { cve?: unknown }).cve)
          ? (plugin as { cve?: unknown }).cve
          : (plugin.attributes as Record<string, unknown> | undefined)?.cve,
        cpe: Array.isArray((plugin as { cpe?: unknown }).cpe)
          ? (plugin as { cpe?: unknown }).cpe
          : (plugin.attributes as Record<string, unknown> | undefined)?.cpe,
        vpr:
          (plugin as { vpr?: unknown }).vpr ??
          (plugin.attributes as Record<string, unknown> | undefined)?.vpr,
      };
      const saved = upsertTenablePlugin(plugin.id, mergedDetail);
      if (saved) {
        processed += 1;
      } else {
        skipped += 1;
      }
      const handled = processed + skipped + startIndex;
      const checkpointIdValue = Number(plugin.id);
      if (Number.isFinite(checkpointIdValue)) {
        lastCheckpointId = checkpointIdValue;
        setIntegrationSetting("tenable_plugins_checkpoint_id", String(checkpointIdValue));
      }
      if (handled === total || handled % logEvery === 0) {
        const remaining = Math.max(0, total - handled);
        await updateAutomationJobStatus(job.id, {
          statusCode: 2,
          pendingIssues: remaining,
          logMessage: `Processados ${handled}/${total} plugins. Restam ${remaining}. Ignorados: ${skipped}.`,
          logLevel: "info",
        });
      }
      const now = Date.now();
      if (now - lastHeartbeat >= heartbeatEveryMs) {
        lastHeartbeat = now;
        const remaining = Math.max(0, total - handled);
        await updateAutomationJobStatus(job.id, {
          statusCode: 2,
          pendingIssues: remaining,
          logMessage: `Heartbeat: processados ${handled}/${total} plugins. Restam ${remaining}. Ignorados: ${skipped}.`,
          logLevel: "info",
        });
      }
    }
    setIntegrationSetting("tenable_plugins_last_sync", getLocalTimestamp());
    if (plugins.length > 0) {
      setIntegrationSetting("tenable_plugins_last_updated", getLocalDateStamp());
    }
    setIntegrationSetting("tenable_plugins_checkpoint_id", "");
    setIntegrationSetting("tenable_plugins_run_id", "");
    const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
    await updateAutomationJobStatus(job.id, {
      statusCode: 1,
      durationSeconds,
      pendingIssues: 0,
      logMessage: `Sincronização concluída. ${processed} plugins atualizados. Ignorados (Info): ${skipped}.`,
      logLevel: "info",
    });
    return NextResponse.json({ synced: plugins.length });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao sincronizar plugins.";
    try {
      const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
      await updateAutomationJobStatus("tenable-plugins-sync", {
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

async function fetchPluginsWithHeartbeat(
  jobId: string,
  credentials: { accessKey: string; secretKey: string },
  lastUpdated?: string
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  try {
    timer = setTimeout(() => {
      updateAutomationJobStatus(jobId, {
        statusCode: 2,
        logMessage: "Heartbeat: aguardando listagem de plugins do Tenable.",
        logLevel: "info",
      }).catch(() => undefined);
    }, 15000);
    return await fetchPlugins(credentials, lastUpdated);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function normalizeLastUpdated(value: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return formatDateOnly(parsed);
}

function formatDateOnly(date: Date) {
  const pad = (v: number) => String(v).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getLocalDateStamp() {
  return formatDateOnly(new Date());
}

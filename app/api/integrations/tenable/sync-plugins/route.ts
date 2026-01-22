import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getUserTenableSettings } from "@/lib/auth/user-service";
import {
  fetchPluginDetail,
  fetchPlugins,
  upsertTenablePlugin,
} from "@/lib/tenable/tenable-service";
import { setIntegrationSetting } from "@/lib/settings/integration-settings";
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

  const startedAt = Date.now();
  try {
    const job = await ensureAutomationJob({
      id: "tenable-plugins-sync",
      name: "Sync plugins Tenable",
      description: "Atualiza catálogo de vulnerabilidades a partir dos plugins Tenable.",
      owner: "Automação Tenable",
    });
    await updateAutomationJobStatus(job.id, {
      statusCode: 2,
      logMessage: "Execução iniciada: sincronizando plugins Tenable.",
      logLevel: "info",
    });

    const plugins = await fetchPlugins(credentials);
    for (const plugin of plugins) {
      const detail = await fetchPluginDetail(plugin.id, credentials);
      upsertTenablePlugin(plugin.id, detail);
    }
    setIntegrationSetting("tenable_plugins_last_sync", getLocalTimestamp());
    const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
    await updateAutomationJobStatus(job.id, {
      statusCode: 1,
      durationSeconds,
      pendingIssues: 0,
      logMessage: `Sincronização concluída. ${plugins.length} plugins atualizados.`,
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

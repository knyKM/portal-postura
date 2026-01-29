import fs from "fs";
import path from "path";
import { getIntegrationSetting } from "@/lib/settings/integration-settings";
import { getLocalTimestamp } from "@/lib/utils/time";

type RegistryEntry = {
  generatedAt: string;
  users: Array<{
    userId: number;
    templates: Array<{
      id: string;
      name: string;
      widgets: Array<{
        id: number;
        name: string;
        templateId: string;
        entries: Array<{ name: string; jql: string; color?: string }>;
      }>;
    }>;
  }>;
};

type ResultEntry = {
  generatedAt: string;
  source: "dashboard-jql-sync";
  users: Array<{
    userId: number;
    templates: Array<{
      id: string;
      name: string;
      widgets: Array<{
        id: number;
        name: string;
        templateId: string;
        entries: Array<{
          name: string;
          jql: string;
          color?: string;
          total: number;
          error?: string;
          status?: number;
        }>;
      }>;
    }>;
  }>;
};

const dataDir = path.join(process.cwd(), "data");
const registryPath = path.join(dataDir, "dashboard-jqls.json");
const resultPath = path.join(dataDir, "dashboard-jql-results.json");

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function normalizeJiraUrl(url: string) {
  return url.replace(/\/+$/, "");
}

function getDashboardJiraToken() {
  return getIntegrationSetting("dashboard_jira_token") ?? "";
}

function getDashboardJiraUrl() {
  return getIntegrationSetting("dashboard_jira_url") ?? "";
}

async function fetchJqlTotal(baseUrl: string, token: string, jql: string) {
  const response = await fetch(`${baseUrl}/rest/api/2/search`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jql, maxResults: 0, fields: ["id"] }),
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof body?.errorMessages?.[0] === "string"
        ? body.errorMessages[0]
        : body?.error || "Falha ao consultar JQL.";
    const error = new Error(message) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return typeof body?.total === "number" ? body.total : 0;
}

async function run() {
  ensureDataDir();
  if (!fs.existsSync(registryPath)) {
    console.error("Arquivo dashboard-jqls.json não encontrado.");
    process.exit(1);
  }

  const token = getDashboardJiraToken();
  const jiraUrl = getDashboardJiraUrl();
  if (!token || !jiraUrl) {
    console.error("Token ou URL do Jira do dashboard não configurado.");
    process.exit(1);
  }
  const baseUrl = normalizeJiraUrl(jiraUrl);

  const registry = JSON.parse(
    fs.readFileSync(registryPath, "utf-8")
  ) as RegistryEntry;

  const result: ResultEntry = {
    generatedAt: getLocalTimestamp(),
    source: "dashboard-jql-sync",
    users: [],
  };

  for (const user of registry.users ?? []) {
    const templates = [];
    for (const template of user.templates ?? []) {
      const widgets = [];
      for (const widget of template.widgets ?? []) {
        const entries = [];
        for (const entry of widget.entries ?? []) {
          try {
            const total = await fetchJqlTotal(baseUrl, token, entry.jql);
            entries.push({ ...entry, total });
          } catch (error) {
            const err = error as Error & { status?: number };
            entries.push({
              ...entry,
              total: 0,
              error: err.message,
              status: err.status,
            });
          }
        }
        widgets.push({
          id: widget.id,
          name: widget.name,
          templateId: widget.templateId,
          entries,
        });
      }
      templates.push({
        id: template.id,
        name: template.name,
        widgets,
      });
    }
    result.users.push({ userId: user.userId, templates });
  }

  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2), "utf-8");
  console.log(`Export concluído: ${resultPath}`);
}

run().catch((error) => {
  console.error("Falha ao executar sync do dashboard:", error);
  process.exit(1);
});

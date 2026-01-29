import fs from "fs";
import path from "path";
import { getLocalTimestamp } from "@/lib/utils/time";

type JqlEntry = {
  name: string;
  jql: string;
  color?: string;
};

type WidgetRegistryEntry = {
  id: number;
  name: string;
  templateId: string;
  entries: JqlEntry[];
};

type TemplateRegistry = {
  id: string;
  name: string;
  widgets: WidgetRegistryEntry[];
};

type UserRegistry = {
  userId: number;
  templates: TemplateRegistry[];
};

type RegistryPayload = {
  generatedAt?: string;
  users: UserRegistry[];
};

type JiraResultEntry = JqlEntry & {
  total: number;
  updatedAt: string;
};

type ResultsPayload = {
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
        entries: JiraResultEntry[];
      }>;
    }>;
  }>;
};

const dataDir = path.join(process.cwd(), "data");
const jqlFile = path.join(dataDir, "dashboard-jqls.json");
const resultsFile = path.join(dataDir, "dashboard-jql-results.json");

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readJqlRegistry(): RegistryPayload {
  ensureDataDir();
  if (!fs.existsSync(jqlFile)) {
    return { users: [] };
  }
  try {
    const raw = fs.readFileSync(jqlFile, "utf-8");
    if (!raw.trim()) {
      return { users: [] };
    }
    const parsed = JSON.parse(raw) as RegistryPayload;
    return {
      generatedAt: parsed.generatedAt ?? undefined,
      users: Array.isArray(parsed.users) ? parsed.users : [],
    };
  } catch {
    return { users: [] };
  }
}

function writeResults(payload: ResultsPayload) {
  ensureDataDir();
  fs.writeFileSync(resultsFile, JSON.stringify(payload, null, 2), "utf-8");
}

function normalizeJiraUrl(url: string) {
  return url.replace(/\/+$/, "");
}

async function fetchJiraJson(url: string, token: string, body?: unknown) {
  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  const message =
    (json as { errorMessages?: string[]; errors?: Record<string, string> })?.errorMessages?.join(
      "; "
    ) ||
    (json as { error?: string; message?: string })?.error ||
    (json as { message?: string })?.message ||
    text ||
    response.statusText;

  return { ok: response.ok, status: response.status, json, message };
}

export async function syncDashboardJqlResults(input: {
  jiraUrl: string;
  token: string;
}) {
  const jiraUrl = normalizeJiraUrl(input.jiraUrl || "");
  const token = input.token || "";
  if (!jiraUrl || !token) {
    return {
      ok: false,
      status: 400,
      message: "URL e token do Jira são obrigatórios.",
    };
  }

  const registry = readJqlRegistry();
  const users = registry.users ?? [];

  const testResponse = await fetchJiraJson(`${jiraUrl}/rest/api/2/myself`, token);
  if (!testResponse.ok) {
    return {
      ok: false,
      status: testResponse.status,
      message: testResponse.message,
    };
  }

  const now = getLocalTimestamp();
  const results: ResultsPayload = {
    generatedAt: now,
    users: [],
  };

  let totalQueries = 0;

  for (const user of users) {
    const templates: ResultsPayload["users"][number]["templates"] = [];
    for (const template of user.templates ?? []) {
      const widgets: ResultsPayload["users"][number]["templates"][number]["widgets"] = [];
      for (const widget of template.widgets ?? []) {
        const entries: JiraResultEntry[] = [];
        for (const entry of widget.entries ?? []) {
          const jql = entry.jql?.trim() ?? "";
          if (!jql) {
            entries.push({
              name: entry.name ?? "",
              jql: entry.jql ?? "",
              color: entry.color,
              total: 0,
              updatedAt: now,
            });
            continue;
          }
          totalQueries += 1;
          const searchResponse = await fetchJiraJson(
            `${jiraUrl}/rest/api/2/search`,
            token,
            {
              jql,
              maxResults: 0,
              fields: ["id"],
            }
          );
          if (!searchResponse.ok) {
            return {
              ok: false,
              status: searchResponse.status,
              message: searchResponse.message,
              failedJql: jql,
            };
          }
          const total =
            (searchResponse.json as { total?: number })?.total ??
            0;
          entries.push({
            name: entry.name ?? "",
            jql: entry.jql ?? "",
            color: entry.color,
            total,
            updatedAt: now,
          });
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
    results.users.push({
      userId: user.userId,
      templates,
    });
  }

  writeResults(results);

  return {
    ok: true,
    status: 200,
    message: "Sincronização concluída.",
    totals: {
      users: results.users.length,
      templates: results.users.reduce((sum, user) => sum + user.templates.length, 0),
      widgets: results.users.reduce(
        (sum, user) => sum + user.templates.reduce((acc, t) => acc + t.widgets.length, 0),
        0
      ),
      queries: totalQueries,
    },
  };
}

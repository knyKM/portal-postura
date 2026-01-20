import { NextResponse } from "next/server";
import { Agent } from "undici";
import * as XLSX from "xlsx";
import { getSessionUser } from "@/lib/auth/session";
import { getUserJiraSettings } from "@/lib/auth/user-service";
import jiraFieldsJson from "@/data/jira-fields.json";

type JiraConfig = {
  url: string;
  token: string;
  verifySsl: boolean;
};

type JiraField = {
  id: string;
  name: string;
};

class JiraApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function normalizeJiraUrl(url: string) {
  return url.replace(/\/+$/, "");
}

function buildJiraHeaders(token: string) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function jiraFetch(config: JiraConfig, path: string, init?: RequestInit) {
  const baseUrl = normalizeJiraUrl(config.url);
  const dispatcher = config.verifySsl
    ? undefined
    : new Agent({ connect: { rejectUnauthorized: false } });
  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...buildJiraHeaders(config.token),
    },
    dispatcher,
  });
}

function extractErrorMessage(raw: string, data: Record<string, unknown> | null) {
  return (
    (data?.errorMessages as string[] | undefined)?.[0] ||
    (data?.error as string | undefined) ||
    (data?.message as string | undefined) ||
    raw ||
    ""
  );
}

async function fetchIssuesByJql(
  config: JiraConfig,
  jql: string,
  fields: string[]
) {
  const issues: Array<{ key: string; fields: Record<string, unknown> }> = [];
  let startAt = 0;
  const maxResults = 100;
  let total: number | null = null;

  while (total === null || issues.length < total) {
    const response = await jiraFetch(config, "/rest/api/2/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jql,
        startAt,
        maxResults,
        fields: fields.length ? fields : ["summary"],
      }),
    });
    const raw = await response.text();
    let data: Record<string, unknown> | null = null;
    if (raw) {
      try {
        data = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        data = null;
      }
    }
    if (!response.ok) {
      throw new JiraApiError(extractErrorMessage(raw, data), response.status);
    }
    const fetched = Array.isArray((data as { issues?: unknown })?.issues)
      ? (data as { issues: Array<{ key?: string; fields?: Record<string, unknown> }> })
          .issues
      : [];
    fetched.forEach((issue) => {
      if (!issue.key) return;
      issues.push({
        key: issue.key,
        fields: issue.fields ?? {},
      });
    });
    total = typeof data?.total === "number" ? data.total : issues.length;
    startAt += maxResults;
    if (issues.length >= total || fetched.length === 0) {
      break;
    }
  }

  return issues;
}

function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(formatFieldValue).filter(Boolean).join(", ");
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.displayName === "string") return record.displayName;
    if (typeof record.name === "string") return record.name;
    if (typeof record.value === "string") return record.value;
    if (typeof record.key === "string") return record.key;
    if (typeof record.emailAddress === "string") return record.emailAddress;
    return JSON.stringify(record);
  }
  return "";
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | { jql?: string; fields?: string[] }
    | null;
  const jql = payload?.jql?.trim() ?? "";
  const fields = Array.isArray(payload?.fields) ? payload?.fields : [];

  if (!jql) {
    return NextResponse.json({ error: "Informe a JQL para exportar." }, { status: 400 });
  }
  if (!fields.length) {
    return NextResponse.json(
      { error: "Selecione ao menos um campo para exportação." },
      { status: 400 }
    );
  }

  const settings = getUserJiraSettings(session.id);
  const config: JiraConfig = {
    url: settings?.jira_url ?? "",
    token: settings?.jira_token ?? "",
    verifySsl: settings?.jira_verify_ssl !== "false",
  };

  if (!config.url || !config.token) {
    return NextResponse.json(
      { error: "Integração Jira não configurada." },
      { status: 400 }
    );
  }

  const fieldCatalog = jiraFieldsJson as JiraField[];
  const labelById = new Map(
    fieldCatalog.map((field) => [field.id, field.name])
  );
  labelById.set("key", "Issue Key");

  try {
    const fieldsForJira = fields.filter((field) => field !== "key");
    const issues = await fetchIssuesByJql(config, jql, fieldsForJira);
    const headers = fields.map((field) => labelById.get(field) ?? field);
    const rows: string[][] = [headers];

    issues.forEach((issue) => {
      const row = fields.map((field) => {
        if (field === "key") return issue.key;
        return formatFieldValue(issue.fields?.[field]);
      });
      rows.push(row);
    });

    const sheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Export");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    const filename = `jira-export-${Date.now()}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    if (error instanceof JiraApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao exportar." },
      { status: 500 }
    );
  }
}

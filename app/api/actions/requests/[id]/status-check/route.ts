import { NextResponse } from "next/server";
import { Agent } from "undici";
import { getSessionUser } from "@/lib/auth/session";
import { getActionRequestById } from "@/lib/actions/action-request-service";
import { getUserJiraSettings } from "@/lib/auth/user-service";

type JiraConfig = {
  url: string;
  token: string;
  verifySsl: boolean;
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

function parseIssueIds(raw: string) {
  return raw
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
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

async function fetchIssuesByJql(config: JiraConfig, jql: string) {
  const issues: Array<{ key: string }> = [];
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
        fields: ["key"],
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
      const message =
        (data?.errorMessages as string[] | undefined)?.[0] ||
        (data?.error as string | undefined) ||
        raw ||
        `Falha ao consultar issues (status ${response.status}).`;
      throw new JiraApiError(message, response.status);
    }
    const fetched = Array.isArray((data as { issues?: unknown })?.issues)
      ? (data as { issues: Array<{ key?: string }> }).issues
      : [];
    issues.push(
      ...fetched
        .map((item: { key?: string }) => item?.key)
        .filter((key: string | undefined) => typeof key === "string")
        .map((key: string) => ({ key }))
    );
    total = typeof data?.total === "number" ? data.total : issues.length;
    startAt += maxResults;
    if (issues.length >= total || fetched.length === 0) break;
  }
  return issues;
}

function normalizeStatus(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function isCancelledStatus(statusName: string) {
  const normalized = normalizeStatus(statusName);
  return normalized === "cancelado" || normalized === "canceled" || normalized === "cancelled";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { id } = await params;
  const requestId = Number(id);
  if (!requestId) {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const record = getActionRequestById(requestId);
  if (!record) {
    return NextResponse.json({ error: "Solicitação não encontrada." }, { status: 404 });
  }
  if (record.action_type !== "status") {
    return NextResponse.json(
      { error: "Apenas solicitações de alterar status são suportadas." },
      { status: 400 }
    );
  }

  const settings = record.requester_id
    ? getUserJiraSettings(record.requester_id)
    : null;
  const config: JiraConfig = {
    url: settings?.jira_url ?? "",
    token: settings?.jira_token ?? "",
    verifySsl: settings?.jira_verify_ssl !== "false",
  };
  if (!config.url || !config.token) {
    return NextResponse.json(
      { error: "Integração Jira não configurada para o solicitante." },
      { status: 400 }
    );
  }

  try {
    let issueKeys: string[] = [];
    if (record.filter_mode === "ids") {
      issueKeys = parseIssueIds(record.filter_value);
    } else if (record.filter_mode === "jql") {
      const issues = await fetchIssuesByJql(config, record.filter_value);
      issueKeys = issues.map((issue) => issue.key);
    } else {
      return NextResponse.json(
        { error: "Filtro inválido para validação." },
        { status: 400 }
      );
    }

    if (!issueKeys.length) {
      return NextResponse.json({ total: 0, cancelled: [], errors: [] });
    }

    const cancelled: Array<{ key: string; status: string }> = [];
    const errors: Array<{ key: string; message: string; status?: number }> = [];

    for (const key of issueKeys) {
      const response = await jiraFetch(
        config,
        `/rest/api/2/issue/${encodeURIComponent(key)}?fields=status`
      );
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
        const message =
          (data?.errorMessages as string[] | undefined)?.[0] ||
          (data?.error as string | undefined) ||
          raw ||
          `Falha ao consultar issue (status ${response.status}).`;
        errors.push({ key, message, status: response.status });
        continue;
      }
      const statusName =
        (data?.fields as { status?: { name?: string } } | undefined)?.status?.name ??
        "";
      if (statusName && isCancelledStatus(statusName)) {
        cancelled.push({ key, status: statusName });
      }
    }

    return NextResponse.json({
      total: issueKeys.length,
      cancelled,
      errors,
      filterMode: record.filter_mode,
    });
  } catch (error) {
    if (error instanceof JiraApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao validar." },
      { status: 500 }
    );
  }
}

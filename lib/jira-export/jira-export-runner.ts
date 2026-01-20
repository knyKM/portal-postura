import { Agent } from "undici";
import * as XLSX from "xlsx";
import fs from "node:fs/promises";
import path from "node:path";
import jiraFieldsJson from "@/data/jira-fields.json";
import { getLocalTimestamp } from "@/lib/utils/time";
import {
  getJiraExportJobById,
  updateJiraExportJobStatus,
} from "@/lib/jira-export/export-service";
import { getUserContactById, getUserJiraSettings } from "@/lib/auth/user-service";
import { sendEmail } from "@/lib/notifications/email-service";

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

async function jiraFetch(config: JiraConfig, pathUrl: string, init?: RequestInit) {
  const baseUrl = normalizeJiraUrl(config.url);
  const dispatcher = config.verifySsl
    ? undefined
    : new Agent({ connect: { rejectUnauthorized: false } });
  return fetch(`${baseUrl}${pathUrl}`, {
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

function buildDownloadUrl(jobId: number) {
  const baseUrl = process.env.APP_BASE_URL?.replace(/\/+$/, "");
  if (!baseUrl) return `/api/jira-export/jobs/${jobId}/download`;
  return `${baseUrl}/api/jira-export/jobs/${jobId}/download`;
}

export async function runJiraExportJob(jobId: number) {
  const job = getJiraExportJobById(jobId);
  if (!job) return;

  updateJiraExportJobStatus({ id: jobId, status: "running" });
  const requester = getUserContactById(job.requester_id);
  const settings = getUserJiraSettings(job.requester_id);

  if (!settings?.jira_url || !settings?.jira_token) {
    updateJiraExportJobStatus({
      id: jobId,
      status: "failed",
      errorMessage: "Integração Jira não configurada para o solicitante.",
    });
    return;
  }

  const config: JiraConfig = {
    url: settings.jira_url,
    token: settings.jira_token,
    verifySsl: settings.jira_verify_ssl !== "false",
  };

  let fields: string[] = [];
  try {
    fields = JSON.parse(job.fields_json) as string[];
  } catch {
    fields = [];
  }

  if (!fields.length) {
    updateJiraExportJobStatus({
      id: jobId,
      status: "failed",
      errorMessage: "Nenhum campo selecionado para exportação.",
    });
    return;
  }

  try {
    const fieldsForJira = fields.filter((field) => field !== "key");
    const issues = await fetchIssuesByJql(config, job.jql, fieldsForJira);
    const fieldCatalog = jiraFieldsJson as JiraField[];
    const labelById = new Map(
      fieldCatalog.map((field) => [field.id, field.name])
    );
    labelById.set("key", "Issue Key");

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

    const exportDir = path.join(process.cwd(), "tmp", "exports");
    await fs.mkdir(exportDir, { recursive: true });
    const fileName = `jira-export-${jobId}.xlsx`;
    const filePath = path.join(exportDir, fileName);
    await fs.writeFile(filePath, buffer);
    const expiresAt = getLocalTimestamp(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000));

    updateJiraExportJobStatus({
      id: jobId,
      status: "completed",
      filePath,
      fileName,
      expiresAt,
    });

    if (requester?.email) {
      const downloadUrl = buildDownloadUrl(jobId);
      const subject = `Exportação Jira pronta · Solicitação #${jobId}`;
      const text = `Sua exportação está pronta. Baixe em: ${downloadUrl}`;
      const html = `
        <p>Olá ${requester.name},</p>
        <p>Sua exportação do Jira foi concluída.</p>
        <p><a href="${downloadUrl}">Clique aqui para baixar</a></p>
        <p>Solicitação #${jobId} · ${getLocalTimestamp()}</p>
      `;
      await sendEmail({ to: requester.email, subject, text, html });
    }
  } catch (error) {
    const message = error instanceof JiraApiError ? error.message : error instanceof Error ? error.message : "Falha ao exportar.";
    updateJiraExportJobStatus({
      id: jobId,
      status: "failed",
      errorMessage: message,
    });
  }
}

import { Agent } from "undici";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import jiraFieldsJson from "@/data/jira-fields.json";
import { getLocalTimestamp } from "@/lib/utils/time";
import {
  getJiraExportJobById,
  updateJiraExportJobStatus,
  updateJiraExportJobProgress,
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

type JiraIssueLink = {
  inwardIssue?: {
    key?: string;
    fields?: Record<string, unknown>;
  };
  outwardIssue?: {
    key?: string;
    fields?: Record<string, unknown>;
  };
  type?: {
    name?: string;
    inward?: string;
    outward?: string;
  };
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

async function fetchIssuesByJqlPage(
  config: JiraConfig,
  jql: string,
  fields: string[],
  startAt: number,
  maxResults: number
) {
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
  const issues = fetched
    .filter((issue) => Boolean(issue?.key))
    .map((issue) => ({ key: issue.key as string, fields: issue.fields ?? {} }));
  const total = typeof data?.total === "number" ? data.total : issues.length;
  return { issues, total };
}

function formatFieldValue(value: unknown, forceNumber = false): string | number {
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

function extractLinkedIssueValue(link: JiraIssueLink, fieldId: string) {
  const issue = link.inwardIssue ?? link.outwardIssue;
  const direction = link.inwardIssue ? "inward" : link.outwardIssue ? "outward" : "";
  if (!issue) return "";
  if (fieldId === "issuelinks.issueKey") return issue.key ?? "";
  if (fieldId === "issuelinks.summary") {
    return (issue.fields?.summary as string | undefined) ?? "";
  }
  if (fieldId === "issuelinks.status") {
    const status = issue.fields?.status as { name?: string } | undefined;
    return status?.name ?? "";
  }
  if (fieldId === "issuelinks.type") {
    const issueType = issue.fields?.issuetype as { name?: string } | undefined;
    return issueType?.name ?? "";
  }
  if (fieldId === "issuelinks.priority") {
    const priority = issue.fields?.priority as { name?: string } | undefined;
    return priority?.name ?? "";
  }
  if (fieldId === "issuelinks.linkType") {
    return link.type?.name ?? "";
  }
  if (fieldId === "issuelinks.direction") {
    if (!direction) return "";
    if (direction === "inward") return link.type?.inward ?? "inward";
    return link.type?.outward ?? "outward";
  }
  return "";
}

function formatLinkedIssues(values: unknown, fieldId: string) {
  if (!Array.isArray(values)) return "";
  const extracted = values
    .map((link) => extractLinkedIssueValue(link as JiraIssueLink, fieldId))
    .filter((value) => typeof value === "string" && value.length > 0);
  return extracted.join(", ");
}

function formatCsvValue(value: string | number, delimiter: string) {
  const stringValue = String(value ?? "");
  const needsWrap =
    stringValue.includes(delimiter) ||
    stringValue.includes("\"") ||
    stringValue.includes("\n") ||
    stringValue.includes("\r");
  if (!needsWrap) return stringValue;
  return `"${stringValue.replace(/"/g, "\"\"")}"`;
}

function toCsv(rows: Array<Array<string | number>>, delimiter = ";") {
  return rows
    .map((row) => row.map((value) => formatCsvValue(value, delimiter)).join(delimiter))
    .join("\r\n");
}

function toCsvRow(row: Array<string | number>, delimiter = ";") {
  return row.map((value) => formatCsvValue(value, delimiter)).join(delimiter);
}

function buildDownloadUrl(jobId: number) {
  const baseUrl = process.env.APP_BASE_URL?.replace(/\/+$/, "");
  if (!baseUrl) return `/api/jira-export/jobs/${jobId}/download`;
  return `${baseUrl}/api/jira-export/jobs/${jobId}/download`;
}

function slugifyFileName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export async function runJiraExportJob(jobId: number) {
  const job = getJiraExportJobById(jobId);
  if (!job) return;
  if (job.status === "canceled") return;

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

  const isCanceled = () => {
    const latest = getJiraExportJobById(jobId);
    return latest?.status === "canceled";
  };

  try {
    if (isCanceled()) return;
    const fieldsForJira = fields.filter(
      (field) => field !== "key" && !field.startsWith("issuelinks.")
    );
    const hasLinkedIssues =
      fields.includes("issuelinks") ||
      fields.some((field) => field.startsWith("issuelinks."));
    if (hasLinkedIssues && !fieldsForJira.includes("issuelinks")) {
      fieldsForJira.push("issuelinks");
    }
    const fieldCatalog = jiraFieldsJson as JiraField[];
    const labelById = new Map(
      fieldCatalog.map((field) => [field.id, field.name])
    );
    labelById.set("key", "Issue Key");
    labelById.set("issuelinks.issueKey", "Linked Issue Key");
    labelById.set("issuelinks.summary", "Linked Issue Summary");
    labelById.set("issuelinks.status", "Linked Issue Status");
    labelById.set("issuelinks.type", "Linked Issue Type");
    labelById.set("issuelinks.priority", "Linked Issue Priority");
    labelById.set("issuelinks.linkType", "Linked Issue Link Type");
    labelById.set("issuelinks.direction", "Linked Issue Direction");

    const headers = fields.map((field) => labelById.get(field) ?? field);
    const numericFields = new Set(
      fields.filter((field) => {
        const label = labelById.get(field) ?? field;
        return label.toLowerCase().startsWith("total");
      })
    );
    const exportDir = path.join(process.cwd(), "tmp", "exports");
    await fsPromises.mkdir(exportDir, { recursive: true });
    const slug = job.job_name ? slugifyFileName(job.job_name) : "";
    const fileName = slug
      ? `jira-export-${jobId}-${slug}.csv`
      : `jira-export-${jobId}.csv`;
    const filePath = path.join(exportDir, fileName);
    const stream = fs.createWriteStream(filePath, { encoding: "utf8" });
    stream.write("\uFEFF");
    stream.write(`${toCsvRow(headers, ";")}\r\n`);

    let startAt = 0;
    const maxResults = 100;
    let totalIssues: number | null = null;
    let processed = 0;
    while (true) {
      if (isCanceled()) return;
      const { issues, total } = await fetchIssuesByJqlPage(
        config,
        job.jql,
        fieldsForJira,
        startAt,
        maxResults
      );
      if (totalIssues === null) {
        totalIssues = total ?? issues.length;
        updateJiraExportJobProgress({
          id: jobId,
          totalIssues,
          processedIssues: 0,
        });
      }
      for (const issue of issues) {
        if (isCanceled()) return;
        const row = fields.map((field) => {
          if (field === "key") return issue.key;
          if (field.startsWith("issuelinks.")) {
            return formatLinkedIssues(issue.fields?.issuelinks, field);
          }
          const rawValue = issue.fields?.[field];
          if (numericFields.has(field)) {
            if (typeof rawValue === "number") return rawValue;
            if (typeof rawValue === "string") {
              const normalized = rawValue.replace(/\./g, "").replace(",", ".");
              const parsed = Number(normalized);
              return Number.isFinite(parsed) ? parsed : formatFieldValue(rawValue);
            }
          }
          return formatFieldValue(rawValue);
        });
        stream.write(`${toCsvRow(row, ";")}\r\n`);
        processed += 1;
        if (processed % 50 === 0) {
          updateJiraExportJobProgress({
            id: jobId,
            processedIssues: processed,
          });
        }
      }
      if (issues.length < maxResults) {
        break;
      }
      startAt += maxResults;
    }
    updateJiraExportJobProgress({
      id: jobId,
      processedIssues: processed,
    });
    await new Promise<void>((resolve, reject) => {
      stream.end(() => resolve());
      stream.on("error", reject);
    });
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

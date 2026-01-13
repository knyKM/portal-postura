import { Agent } from "undici";
import { getIntegrationSetting } from "@/lib/settings/integration-settings";
import {
  getActionRequestById,
  updateActionRequestExecutionStatus,
} from "@/lib/actions/action-request-service";
import {
  updateJobStatus,
  updateJobProgress,
  listQueuedActionExecutionJobs,
  getRunningJobsCount,
} from "@/lib/actions/action-job-service";

const DEFAULT_MAX_JIRA_RESULTS = 200;
const DEFAULT_MAX_PARALLEL_JOBS = 3;

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

function getJiraConfig(): JiraConfig {
  const url = getIntegrationSetting("jira_url") ?? "";
  const token = getIntegrationSetting("jira_token") ?? "";
  const verifySetting = getIntegrationSetting("jira_verify_ssl");
  return { url, token, verifySsl: verifySetting !== "false" };
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

async function jiraFetch(
  config: JiraConfig,
  path: string,
  init?: RequestInit
) {
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

async function fetchIssuesByJql(config: JiraConfig, jql: string, maxResultsLimit: number) {
  const issues: Array<{ key: string }> = [];
  let startAt = 0;
  const maxResults = 100;

  while (issues.length < maxResultsLimit) {
    const response = await jiraFetch(
      config,
      `/rest/api/2/search?jql=${encodeURIComponent(
        jql
      )}&startAt=${startAt}&maxResults=${maxResults}&fields=key`
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
      throw new JiraApiError(
        (data?.errorMessages as string[] | undefined)?.[0] ||
          (data?.error as string | undefined) ||
          (data?.message as string | undefined) ||
          raw ||
          "",
        response.status
      );
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
    const total = typeof data?.total === "number" ? data.total : issues.length;
    startAt += maxResults;
    if (issues.length >= total || issues.length >= maxResultsLimit) {
      break;
    }
  }

  if (issues.length >= maxResultsLimit) {
    throw new JiraApiError("", 400);
  }

  return issues;
}

async function transitionIssue(
  config: JiraConfig,
  issueKey: string,
  targetStatus: string
) {
  const normalizeStatus = (value: string) =>
    value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  const transitionsResponse = await jiraFetch(
    config,
    `/rest/api/2/issue/${encodeURIComponent(issueKey)}/transitions`
  );
  const transitionsRaw = await transitionsResponse.text();
  let transitionsData: Record<string, unknown> | null = null;
  if (transitionsRaw) {
    try {
      transitionsData = JSON.parse(transitionsRaw) as Record<string, unknown>;
    } catch {
      transitionsData = null;
    }
  }
  if (!transitionsResponse.ok) {
    throw new JiraApiError(
      (transitionsData?.errorMessages as string[] | undefined)?.[0] ||
        (transitionsData?.error as string | undefined) ||
        (transitionsData?.message as string | undefined) ||
        transitionsRaw ||
        "",
      transitionsResponse.status
    );
  }
  const transitions = Array.isArray(
    (transitionsData as { transitions?: unknown })?.transitions
  )
    ? (transitionsData as { transitions: Array<{ name?: string }> }).transitions
    : [];
  const normalizedTarget = normalizeStatus(targetStatus);
  const match = transitions.find(
    (transition: {
      name?: string;
      to?: { name?: string; statusCategory?: { name?: string } };
    }) => {
      const transitionName = transition?.name
        ? normalizeStatus(transition.name)
        : "";
      const targetName = transition?.to?.name
        ? normalizeStatus(transition.to.name)
        : "";
      const categoryName = transition?.to?.statusCategory?.name
        ? normalizeStatus(transition.to.statusCategory.name)
        : "";
      return (
        transitionName === normalizedTarget ||
        targetName === normalizedTarget ||
        (normalizedTarget === "done" && categoryName === "done")
      );
    }
  );
  if (!match?.id) {
    throw new JiraApiError("", transitionsResponse.status);
  }

  const transitionResponse = await jiraFetch(
    config,
    `/rest/api/2/issue/${encodeURIComponent(issueKey)}/transitions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transition: { id: match.id } }),
    }
  );
  if (!transitionResponse.ok) {
    const transitionRaw = await transitionResponse.text();
    let transitionError: Record<string, unknown> | null = null;
    if (transitionRaw) {
      try {
        transitionError = JSON.parse(transitionRaw) as Record<string, unknown>;
      } catch {
        transitionError = null;
      }
    }
    throw new JiraApiError(
      (transitionError?.errorMessages as string[] | undefined)?.[0] ||
        (transitionError?.error as string | undefined) ||
        (transitionError?.message as string | undefined) ||
        transitionRaw ||
        "",
      transitionResponse.status
    );
  }
}

export async function executeStatusActionJob(jobId: number, requestId: number) {
  updateJobStatus({ id: jobId, status: "running" });
  updateActionRequestExecutionStatus({ id: requestId, status: "running" });
  const targetRequest = getActionRequestById(requestId);
  if (!targetRequest) {
    updateJobStatus({ id: jobId, status: "failed", errorMessage: "" });
    updateActionRequestExecutionStatus({ id: requestId, status: "failed", errorMessage: "" });
    return;
  }

  const jiraConfig = getJiraConfig();
  if (!jiraConfig.url || !jiraConfig.token) {
    updateJobStatus({ id: jobId, status: "failed", errorMessage: "" });
    updateActionRequestExecutionStatus({ id: requestId, status: "failed", errorMessage: "" });
    return;
  }

  const maxResultsSetting = Number(
    getIntegrationSetting("jira_max_results") ?? DEFAULT_MAX_JIRA_RESULTS
  );
  const maxResultsLimit = Number.isFinite(maxResultsSetting)
    ? Math.max(1, Math.floor(maxResultsSetting))
    : DEFAULT_MAX_JIRA_RESULTS;
  const targetStatus = targetRequest.requested_status?.trim();
  if (!targetStatus) {
    updateJobStatus({ id: jobId, status: "failed", errorMessage: "" });
    updateActionRequestExecutionStatus({ id: requestId, status: "failed", errorMessage: "" });
    return;
  }

  let issueKeys: string[] = [];
  if (targetRequest.filter_mode === "ids") {
    issueKeys = parseIssueIds(targetRequest.filter_value);
  } else if (targetRequest.filter_mode === "jql") {
    try {
      const issues = await fetchIssuesByJql(
        jiraConfig,
        targetRequest.filter_value,
        maxResultsLimit
      );
      issueKeys = issues.map((issue) => issue.key);
    } catch (err) {
      if (err instanceof JiraApiError) {
        updateJobStatus({ id: jobId, status: "failed", errorMessage: err.message });
        updateActionRequestExecutionStatus({ id: requestId, status: "failed", errorMessage: err.message });
        return;
      }
      updateJobStatus({ id: jobId, status: "failed", errorMessage: "" });
      updateActionRequestExecutionStatus({ id: requestId, status: "failed", errorMessage: "" });
      return;
    }
  } else {
    updateJobStatus({ id: jobId, status: "failed", errorMessage: "" });
    updateActionRequestExecutionStatus({ id: requestId, status: "failed", errorMessage: "" });
    return;
  }

  if (!issueKeys.length) {
    updateJobStatus({ id: jobId, status: "failed", errorMessage: "" });
    updateActionRequestExecutionStatus({ id: requestId, status: "failed", errorMessage: "" });
    return;
  }

  let processedCount = 0;
  updateJobProgress({ id: jobId, totalIssues: issueKeys.length, processedIssues: 0 });
  for (const key of issueKeys) {
    try {
      await transitionIssue(jiraConfig, key, targetStatus);
      processedCount += 1;
      updateJobProgress({ id: jobId, processedIssues: processedCount });
    } catch (err) {
      if (err instanceof JiraApiError) {
        updateJobStatus({ id: jobId, status: "failed", errorMessage: err.message });
        updateActionRequestExecutionStatus({ id: requestId, status: "failed", errorMessage: err.message });
        return;
      }
      updateJobStatus({ id: jobId, status: "failed", errorMessage: "" });
      updateActionRequestExecutionStatus({ id: requestId, status: "failed", errorMessage: "" });
      return;
    }
  }

  updateJobStatus({ id: jobId, status: "completed" });
  updateActionRequestExecutionStatus({ id: requestId, status: "completed" });
  await startQueuedJobs();
}

export async function startQueuedJobs() {
  if (getIntegrationSetting("action_jobs_paused") === "true") {
    return;
  }
  const maxParallelSetting = Number(
    getIntegrationSetting("action_jobs_max_parallel") ?? DEFAULT_MAX_PARALLEL_JOBS
  );
  const maxParallel = Number.isFinite(maxParallelSetting)
    ? Math.max(1, Math.floor(maxParallelSetting))
    : DEFAULT_MAX_PARALLEL_JOBS;
  const runningCount = getRunningJobsCount();
  const available = maxParallel - runningCount;
  if (available <= 0) {
    return;
  }
  const queued = listQueuedActionExecutionJobs(available);
  queued.forEach((job) => {
    updateJobStatus({ id: job.id, status: "running" });
    setTimeout(() => {
      void executeStatusActionJob(job.id, job.request_id);
    }, 0);
  });
}

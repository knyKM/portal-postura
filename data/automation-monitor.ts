export type AutomationJobStatus = "running" | "pending" | "failed" | "success";

export type AutomationJob = {
  id: string;
  name: string;
  description?: string | null;
  status: AutomationJobStatus;
  queueSeconds: number;
  lastRun: string;
  duration: string;
  pendingIssues: number;
  owner: string;
};

export type AutomationLogLevel = "info" | "warning" | "error";

export type AutomationLog = {
  jobId: string;
  createdAt?: string;
  timestamp: string;
  message: string;
  level?: AutomationLogLevel;
};

export const automationJobs: AutomationJob[] = [
  {
    id: "sync-web",
    name: "Sync backlog Web",
    description: "Garante sincronismo entre backlog Jira e DB interno.",
    status: "running",
    queueSeconds: 42,
    lastRun: "há 4 minutos",
    duration: "02m13s",
    pendingIssues: 37,
    owner: "Squad Web",
  },
  {
    id: "close-done",
    name: "Decay 90d",
    description: "Fecha automaticamente issues DONE com mais de 90 dias.",
    status: "pending",
    queueSeconds: 310,
    lastRun: "há 1 hora",
    duration: "01m45s",
    pendingIssues: 120,
    owner: "Squad Jira",
  },
  {
    id: "sla-alert",
    name: "Alertar SLAs críticos",
    description: "Sinaliza squads quando indicadores fogem do SLA.",
    status: "failed",
    queueSeconds: 0,
    lastRun: "há 12 minutos",
    duration: "00m32s",
    pendingIssues: 18,
    owner: "Automação SOC",
  },
  {
    id: "bulk-comment",
    name: "Comentário padrão squads",
    description: "Publica mensagens padronizadas em lotes.",
    status: "success",
    queueSeconds: 0,
    lastRun: "há 20 minutos",
    duration: "03m21s",
    pendingIssues: 0,
    owner: "Squad Backlog",
  },
];

export const automationLogs: AutomationLog[] = [
  {
    jobId: "sync-web",
    timestamp: "09:21",
    message: "37 issues sincronizadas. Jira: OK · DB: OK",
    level: "info",
  },
  {
    jobId: "sla-alert",
    timestamp: "09:16",
    message: "Erro HTTP 429 ao consultar API Jira. Será reexecutado em 5 minutos.",
    level: "error",
  },
  {
    jobId: "close-done",
    timestamp: "08:54",
    message: "Fila aguardando slot livre. Esperando aprovação manual.",
    level: "warning",
  },
  {
    jobId: "bulk-comment",
    timestamp: "08:42",
    message: "Comentário aplicado em 64 issues. Sem falhas.",
    level: "info",
  },
];

export function getAutomationSnapshot() {
  return {
    jobs: automationJobs.map((job) => ({ ...job })),
    logs: automationLogs.map((log) => ({ ...log })),
    generatedAt: new Date().toISOString(),
  };
}

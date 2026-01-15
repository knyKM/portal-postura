"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { ASSIGNEE_CUSTOM_FIELDS } from "@/lib/actions/assignee-fields";

type Vulnerability = {
  id: string;
  title: string;
  severity: "Crítica" | "Alta" | "Média" | "Baixa";
  description: string;
  observations: string;
  remediation: string;
  affected: string;
  score: number;
};

type Server = {
  id: string;
  name: string;
  ip: string;
  environment: string;
};

type LinkEntry = {
  status: "active" | "resolved";
  occurrences: number;
  resolvedCount: number;
  lastChangedAt: string;
  occurrenceDates: string[];
  resolvedDates: string[];
};

const demoVulnerabilities: Vulnerability[] = [
  {
    id: "vuln-001",
    title: "CVE-2023-1023 · Exposição de credenciais",
    severity: "Crítica",
    description: "Credenciais expostas em endpoint de diagnóstico.",
    observations:
      "O endpoint retorna variáveis sensíveis quando executado com um token desatualizado.",
    remediation:
      "Desabilitar endpoint, rotacionar segredos e aplicar patch do fornecedor.",
    affected: "API Gateway · Auth Service · Batch Notifier",
    score: 9.4,
  },
  {
    id: "vuln-002",
    title: "CVE-2024-2211 · Execução remota",
    severity: "Alta",
    description: "Falha em biblioteca de parsing utilizada por serviços web.",
    observations:
      "A biblioteca aceita payloads maliciosos quando o parâmetro debug está ativo.",
    remediation:
      "Atualizar dependência e bloquear upload de arquivos temporários.",
    affected: "Web Portal · Relatórios",
    score: 8.1,
  },
  {
    id: "vuln-003",
    title: "CVE-2022-7789 · Privilege escalation",
    severity: "Média",
    description: "Permissões excessivas em serviço legado.",
    observations:
      "Contas de serviço com escopo amplo herdam permissões administrativas.",
    remediation:
      "Revisar IAM e remover papéis não utilizados.",
    affected: "Legacy Jobs · Scheduler",
    score: 6.3,
  },
  {
    id: "vuln-004",
    title: "CVE-2021-4450 · Weak TLS config",
    severity: "Baixa",
    description: "Cifragem fraca habilitada em servidores antigos.",
    observations:
      "TLS 1.0 habilitado em servidores de homologação.",
    remediation:
      "Forçar TLS 1.2+ e revisar ciphers legados.",
    affected: "Homologação · Proxy",
    score: 4.2,
  },
];

const demoServers: Server[] = Array.from({ length: 20 }, (_, index) => {
  const id = `srv-${String(index + 1).padStart(2, "0")}`;
  return {
    id,
    name: `server-${String(index + 1).padStart(2, "0")}`,
    ip: `10.10.${Math.floor(index / 5) + 1}.${11 + index}`,
    environment: index < 8 ? "Produção" : index < 14 ? "Homologação" : "Dev",
  };
});

const demoServerOwners: Record<string, Record<string, string>> = demoServers.reduce(
  (acc, server, index) => {
    const ownerSuffix = String(index + 1).padStart(2, "0");
    const values: Record<string, string> = {};
    ASSIGNEE_CUSTOM_FIELDS.forEach((field, fieldIndex) => {
      values[field.id] = `Responsável ${fieldIndex + 1}-${ownerSuffix}`;
    });
    acc[server.id] = values;
    return acc;
  },
  {} as Record<string, Record<string, string>>
);

const initialLinks: Record<string, Record<string, LinkEntry>> = {
  "vuln-001": {
    "srv-01": {
      status: "active",
      occurrences: 1,
      resolvedCount: 0,
      lastChangedAt: "2026-01-15 10:14",
      occurrenceDates: ["2026-01-15 10:14"],
      resolvedDates: [],
    },
    "srv-02": {
      status: "resolved",
      occurrences: 1,
      resolvedCount: 1,
      lastChangedAt: "2026-01-12 08:20",
      occurrenceDates: ["2026-01-10 09:02"],
      resolvedDates: ["2026-01-12 08:20"],
    },
    "srv-03": {
      status: "active",
      occurrences: 2,
      resolvedCount: 1,
      lastChangedAt: "2026-01-14 18:02",
      occurrenceDates: ["2026-01-11 13:22", "2026-01-14 18:02"],
      resolvedDates: ["2026-01-12 16:40"],
    },
  },
  "vuln-002": {
    "srv-05": {
      status: "active",
      occurrences: 1,
      resolvedCount: 0,
      lastChangedAt: "2026-01-15 09:48",
      occurrenceDates: ["2026-01-15 09:48"],
      resolvedDates: [],
    },
    "srv-06": {
      status: "resolved",
      occurrences: 2,
      resolvedCount: 2,
      lastChangedAt: "2026-01-10 16:30",
      occurrenceDates: ["2026-01-06 10:05", "2026-01-09 14:50"],
      resolvedDates: ["2026-01-07 08:20", "2026-01-10 16:30"],
    },
  },
  "vuln-003": {
    "srv-10": {
      status: "resolved",
      occurrences: 1,
      resolvedCount: 1,
      lastChangedAt: "2026-01-08 14:12",
      occurrenceDates: ["2026-01-06 12:40"],
      resolvedDates: ["2026-01-08 14:12"],
    },
  },
  "vuln-004": {
    "srv-15": {
      status: "active",
      occurrences: 1,
      resolvedCount: 0,
      lastChangedAt: "2026-01-13 13:40",
      occurrenceDates: ["2026-01-13 13:40"],
      resolvedDates: [],
    },
  },
};

export default function VulnerabilidadesPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<Record<string, Record<string, LinkEntry>>>(
    initialLinks
  );
  const [selectedServerByVuln, setSelectedServerByVuln] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("postura_user");
      if (!raw) {
        router.replace("/login");
        return;
      }
      setAuthorized(true);
    } catch {
      router.replace("/login");
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const serverById = useMemo(
    () =>
      demoServers.reduce<Record<string, Server>>((acc, server) => {
        acc[server.id] = server;
        return acc;
      }, {}),
    []
  );
  const severityBadgeClasses: Record<Vulnerability["severity"], string> = {
    Crítica: "bg-rose-500/15 text-rose-300 border-rose-500/40",
    Alta: "bg-orange-500/15 text-orange-300 border-orange-500/40",
    Média: "bg-amber-500/15 text-amber-200 border-amber-500/40",
    Baixa: "bg-emerald-500/15 text-emerald-200 border-emerald-500/40",
  };

  function getServerCounters(serverId: string) {
    let open = 0;
    let resolved = 0;
    Object.values(links).forEach((entries) => {
      const entry = entries?.[serverId];
      if (!entry) return;
      if (entry.status === "active") {
        open += 1;
      } else {
        resolved += 1;
      }
    });
    return { open, resolved };
  }

  function ensureEntry(vulnId: string, serverId: string) {
    setLinks((prev) => {
      const current = prev[vulnId] ?? {};
      const entry = current[serverId];
      const now = new Date().toLocaleString("pt-BR");
      const nextEntry: LinkEntry = entry
        ? {
            ...entry,
            status: "active",
            occurrences: entry.occurrences + 1,
            lastChangedAt: now,
            occurrenceDates: [...entry.occurrenceDates, now],
          }
        : {
            status: "active",
            occurrences: 1,
            resolvedCount: 0,
            lastChangedAt: now,
            occurrenceDates: [now],
            resolvedDates: [],
          };
      return {
        ...prev,
        [vulnId]: {
          ...current,
          [serverId]: nextEntry,
        },
      };
    });
  }

  function resolveEntry(vulnId: string, serverId: string) {
    setLinks((prev) => {
      const current = prev[vulnId] ?? {};
      const entry = current[serverId];
      if (!entry) return prev;
      const now = new Date().toLocaleString("pt-BR");
      return {
        ...prev,
        [vulnId]: {
          ...current,
          [serverId]: {
            ...entry,
            status: "resolved",
            resolvedCount: entry.resolvedCount + 1,
            lastChangedAt: now,
            resolvedDates: [...entry.resolvedDates, now],
          },
        },
      };
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-sm text-zinc-400">
        Carregando...
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <DashboardShell
      pageTitle="Vulnerabilidades"
      pageSubtitle="Catálogo único com vínculos de ativos e histórico de correções."
    >
      <div className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          {demoVulnerabilities.map((vuln) => {
            const entries = links[vuln.id] ?? {};
            const activeServers = Object.entries(entries).filter(
              ([, entry]) => entry.status === "active"
            );
            const resolvedServers = Object.entries(entries).filter(
              ([, entry]) => entry.status === "resolved"
            );
            return (
              <Card
                key={vuln.id}
                className={cn(
                  "rounded-3xl border p-4 shadow-[0_20px_60px_rgba(88,28,135,0.15)]",
                  isDark
                    ? "border-white/5 bg-[#050816]/80 text-white"
                    : "border-slate-200 bg-white text-slate-900"
                )}
              >
                <CardContent className="p-0 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.35em]",
                          severityBadgeClasses[vuln.severity]
                        )}
                      >
                        {vuln.severity}
                      </span>
                      <h3 className="mt-2 text-lg font-semibold">{vuln.title}</h3>
                      <p className="mt-1 text-sm text-zinc-400 max-w-2xl">
                        {vuln.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-zinc-500">
                        <span>Score {vuln.score.toFixed(1)}</span>
                        <span>•</span>
                        <span>{vuln.affected}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={selectedServerByVuln[vuln.id] ?? ""}
                        onChange={(event) =>
                          setSelectedServerByVuln((prev) => ({
                            ...prev,
                            [vuln.id]: event.target.value,
                          }))
                        }
                        className={cn(
                          "rounded-xl border px-3 py-2 text-xs",
                          isDark
                            ? "border-white/10 bg-[#050816] text-white"
                            : "border-slate-200 bg-white text-slate-700"
                        )}
                      >
                        <option value="">Selecionar servidor</option>
                        {demoServers.map((server) => (
                          <option key={server.id} value={server.id}>
                            {server.name} · {server.ip}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => {
                          const serverId = selectedServerByVuln[vuln.id];
                          if (!serverId) return;
                          ensureEntry(vuln.id, serverId);
                        }}
                      >
                        Vincular ativo
                      </Button>
                      <Link
                        href={`/vulnerabilidades/${vuln.id}`}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-[11px] font-semibold",
                          isDark
                            ? "border-white/10 text-zinc-200"
                            : "border-slate-200 text-slate-700"
                        )}
                      >
                        Ver detalhes
                      </Link>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                        Ativos vulneráveis
                      </p>
                      {activeServers.length === 0 ? (
                        <p className="mt-2 text-xs text-zinc-500">
                          Nenhum ativo vulnerável no momento.
                        </p>
                      ) : (
                        <div className="mt-2 space-y-2">
                          {activeServers.map(([serverId, entry]) => {
                            const server = serverById[serverId];
                            if (!server) return null;
                            return (
                              <div
                                key={`${vuln.id}-${serverId}`}
                                className={cn(
                                  "rounded-2xl border px-3 py-2 text-xs",
                                  isDark
                                    ? "border-white/10 bg-white/5 text-zinc-200"
                                    : "border-slate-200 bg-slate-50 text-slate-700"
                                )}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    <p className="font-semibold">
                                      {server.name} · {server.ip}
                                    </p>
                                    <p className="text-[11px] text-zinc-500">
                                      {server.environment} · {entry.occurrences} ocorrência
                                      {entry.occurrences > 1 ? "s" : ""}
                                    </p>
                                    <p className="text-[11px] text-zinc-500">
                                      Última: {entry.occurrenceDates.at(-1) ?? "-"}
                                    </p>
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="rounded-xl text-[11px]"
                                    onClick={() => resolveEntry(vuln.id, serverId)}
                                  >
                                    Marcar corrigida
                                  </Button>
                                  <Link
                                    href={`/vulnerabilidades/ativos/${serverId}`}
                                    className={cn(
                                      "rounded-xl border px-3 py-2 text-[11px] font-semibold",
                                      isDark
                                        ? "border-white/10 text-zinc-200"
                                        : "border-slate-200 text-slate-700"
                                    )}
                                  >
                                    Ver ativo
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                        Histórico corrigido
                      </p>
                      {resolvedServers.length === 0 ? (
                        <p className="mt-2 text-xs text-zinc-500">
                          Nenhuma correção registrada.
                        </p>
                      ) : (
                        <div className="mt-2 space-y-2">
                          {resolvedServers.map(([serverId, entry]) => {
                            const server = serverById[serverId];
                            if (!server) return null;
                            return (
                              <div
                                key={`${vuln.id}-${serverId}-resolved`}
                                className={cn(
                                  "rounded-2xl border px-3 py-2 text-xs",
                                  isDark
                                    ? "border-white/10 bg-white/5 text-zinc-200"
                                    : "border-slate-200 bg-slate-50 text-slate-700"
                                )}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    <p className="font-semibold">
                                      {server.name} · {server.ip}
                                    </p>
                                    <p className="text-[11px] text-zinc-500">
                                      Corrigida {entry.resolvedCount} vez
                                      {entry.resolvedCount > 1 ? "es" : ""} ·{" "}
                                      {entry.occurrences} ocorrência
                                      {entry.occurrences > 1 ? "s" : ""}
                                    </p>
                                    <p className="text-[11px] text-zinc-500">
                                      Última correção: {entry.resolvedDates.at(-1) ?? "-"}
                                    </p>
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="rounded-xl text-[11px]"
                                    onClick={() => ensureEntry(vuln.id, serverId)}
                                  >
                                    Reabrir
                                  </Button>
                                  <Link
                                    href={`/vulnerabilidades/ativos/${serverId}`}
                                    className={cn(
                                      "rounded-xl border px-3 py-2 text-[11px] font-semibold",
                                      isDark
                                        ? "border-white/10 text-zinc-200"
                                        : "border-slate-200 text-slate-700"
                                    )}
                                  >
                                    Ver ativo
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card
          className={cn(
            "rounded-3xl border p-4",
            isDark
              ? "border-white/5 bg-[#050816]/80 text-white"
              : "border-slate-200 bg-white text-slate-900"
          )}
        >
          <CardContent className="p-0 space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
              Servidores de teste
            </p>
            <h3 className="text-lg font-semibold">Catálogo de ativos (20)</h3>
            <p className="text-sm text-zinc-400">
              Use estes servidores para simular vínculo, correção e reabertura.
            </p>
            <div className="mt-3 space-y-2">
              {demoServers.map((server) => (
                <div
                  key={server.id}
                  className={cn(
                    "rounded-2xl border px-3 py-2 text-xs",
                    isDark
                      ? "border-white/10 bg-white/5 text-zinc-200"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  )}
                >
                  <p className="font-semibold">
                    {server.name} · {server.ip}
                  </p>
                  <p className="text-[11px] text-zinc-500">{server.environment}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Link
                      href={`/vulnerabilidades/ativos/${server.id}`}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-[11px] font-semibold",
                        isDark
                          ? "border-white/10 text-zinc-200"
                          : "border-slate-200 text-slate-700"
                      )}
                    >
                      Ver ativo
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

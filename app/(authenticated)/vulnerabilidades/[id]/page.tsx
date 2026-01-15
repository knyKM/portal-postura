"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";

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

export default function VulnerabilidadeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const vulnerability = demoVulnerabilities.find(
    (item) => item.id === params.id
  );

  const severityBadgeClasses: Record<Vulnerability["severity"], string> = {
    Crítica: "bg-rose-500/15 text-rose-300 border-rose-500/40",
    Alta: "bg-orange-500/15 text-orange-300 border-orange-500/40",
    Média: "bg-amber-500/15 text-amber-200 border-amber-500/40",
    Baixa: "bg-emerald-500/15 text-emerald-200 border-emerald-500/40",
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-sm text-zinc-400">
        Carregando...
      </div>
    );
  }

  if (!authorized || !vulnerability) {
    return null;
  }

  const entries = initialLinks[vulnerability.id] ?? {};

  return (
    <DashboardShell
      pageTitle="Detalhes da vulnerabilidade"
      pageSubtitle="Descrição completa, recomendações e histórico por ativo."
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.35em]",
              severityBadgeClasses[vulnerability.severity]
            )}
          >
            {vulnerability.severity}
          </span>
          <h2 className="mt-2 text-2xl font-semibold">{vulnerability.title}</h2>
          <p className="mt-2 text-sm text-zinc-400">{vulnerability.description}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-zinc-500">
            <span>Score {vulnerability.score.toFixed(1)}</span>
            <span>•</span>
            <span>{vulnerability.affected}</span>
          </div>
        </div>
        <Link
          href="/vulnerabilidades"
          className={cn(
            "rounded-xl border px-4 py-2 text-sm font-semibold",
            isDark ? "border-white/10 text-zinc-200" : "border-slate-200 text-slate-700"
          )}
        >
          Voltar
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card
          className={cn(
            "rounded-3xl border p-4",
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
          )}
        >
          <CardContent className="p-0">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Observações
            </p>
            <p className="mt-2 text-sm text-zinc-200">{vulnerability.observations}</p>
          </CardContent>
        </Card>
        <Card
          className={cn(
            "rounded-3xl border p-4",
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
          )}
        >
          <CardContent className="p-0">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Correção recomendada
            </p>
            <p className="mt-2 text-sm text-zinc-200">{vulnerability.remediation}</p>
          </CardContent>
        </Card>
      </div>

      <Card
        className={cn(
          "mt-6 rounded-3xl border p-4",
          isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
        )}
      >
        <CardContent className="p-0">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
            Histórico por ativo
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {Object.entries(entries).length === 0 ? (
              <p className="text-sm text-zinc-500">
                Nenhum ativo registrado nesta vulnerabilidade.
              </p>
            ) : (
              Object.entries(entries).map(([serverId, entry]) => {
                const server = serverById[serverId];
                if (!server) return null;
                return (
                  <div
                    key={`${vulnerability.id}-${serverId}`}
                    className={cn(
                      "rounded-2xl border px-3 py-2 text-xs",
                      isDark
                        ? "border-white/10 bg-black/20 text-zinc-200"
                        : "border-slate-200 bg-white text-slate-700"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold">
                          {server.name} · {server.ip}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          Ocorrências ({entry.occurrences}):{" "}
                          {entry.occurrenceDates.join(" · ") || "-"}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          Correções ({entry.resolvedCount}):{" "}
                          {entry.resolvedDates.join(" · ") || "-"}
                        </p>
                      </div>
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
              })
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

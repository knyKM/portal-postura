"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { ASSIGNEE_CUSTOM_FIELDS } from "@/lib/actions/assignee-fields";

type Vulnerability = {
  id: string;
  title: string;
  severity: "Crítica" | "Alta" | "Média" | "Baixa";
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
  },
  {
    id: "vuln-002",
    title: "CVE-2024-2211 · Execução remota",
    severity: "Alta",
  },
  {
    id: "vuln-003",
    title: "CVE-2022-7789 · Privilege escalation",
    severity: "Média",
  },
  {
    id: "vuln-004",
    title: "CVE-2021-4450 · Weak TLS config",
    severity: "Baixa",
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

export default function VulnerabilidadeAtivoPage() {
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

  const server = demoServers.find((item) => item.id === params.id);
  const ownerMap = server ? demoServerOwners[server.id] ?? {} : {};

  const relatedVulns = useMemo(() => {
    if (!server) return [];
    return demoVulnerabilities
      .map((vuln) => {
        const entry = initialLinks[vuln.id]?.[server.id];
        if (!entry) return null;
        return { vuln, entry };
      })
      .filter(Boolean) as Array<{ vuln: Vulnerability; entry: LinkEntry }>;
  }, [server]);

  const counters = relatedVulns.reduce(
    (acc, item) => {
      if (item.entry.status === "active") {
        acc.open += 1;
      } else {
        acc.resolved += 1;
      }
      return acc;
    },
    { open: 0, resolved: 0 }
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

  if (!authorized || !server) {
    return null;
  }

  return (
    <DashboardShell
      pageTitle="Detalhes do ativo"
      pageSubtitle="Responsáveis e vulnerabilidades associadas."
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
            Ativo
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {server.name} · {server.ip}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">{server.environment}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-zinc-500">
            <span>Abertas: {counters.open}</span>
            <span>•</span>
            <span>Corrigidas: {counters.resolved}</span>
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
              Responsáveis
            </p>
            <div className="mt-3 space-y-2 text-xs">
              {ASSIGNEE_CUSTOM_FIELDS.map((field) => (
                <div
                  key={`${server.id}-${field.id}`}
                  className={cn(
                    "rounded-xl border px-3 py-2",
                    isDark
                      ? "border-white/10 bg-black/20 text-zinc-200"
                      : "border-slate-200 bg-white text-slate-700"
                  )}
                >
                  <p className="text-[11px] text-zinc-500">{field.label}</p>
                  <p className="mt-1 font-semibold">{ownerMap[field.id] ?? "-"}</p>
                </div>
              ))}
            </div>
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
              Vulnerabilidades do ativo
            </p>
            <div className="mt-3 space-y-2 text-xs">
              {relatedVulns.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Nenhuma vulnerabilidade registrada para este ativo.
                </p>
              ) : (
                relatedVulns.map(({ vuln, entry }) => (
                  <div
                    key={`${server.id}-${vuln.id}`}
                    className={cn(
                      "rounded-xl border px-3 py-2",
                      isDark
                        ? "border-white/10 bg-black/20 text-zinc-200"
                        : "border-slate-200 bg-white text-slate-700"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{vuln.title}</p>
                        <p className="mt-1 text-[11px] text-zinc-500">
                          Status: {entry.status === "active" ? "Aberta" : "Corrigida"}
                          {" · "}Ocorrências: {entry.occurrences}
                          {" · "}Correções: {entry.resolvedCount}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.3em]",
                          severityBadgeClasses[vuln.severity]
                        )}
                      >
                        {vuln.severity}
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-zinc-500">
                      Ocorrências: {entry.occurrenceDates.join(" · ") || "-"}
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-500">
                      Correções: {entry.resolvedDates.join(" · ") || "-"}
                    </div>
                    <div className="mt-2">
                      <Link
                        href={`/vulnerabilidades/${vuln.id}`}
                        className={cn(
                          "inline-flex rounded-xl border px-3 py-1 text-[11px] font-semibold",
                          isDark
                            ? "border-white/10 text-zinc-200"
                            : "border-slate-200 text-slate-700"
                        )}
                      >
                        Ver vulnerabilidade
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

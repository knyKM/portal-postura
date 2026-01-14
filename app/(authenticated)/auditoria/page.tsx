"use client";

import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { Activity, ClipboardList, History } from "lucide-react";

const audits = [
  {
    id: "automacoes",
    title: "Auditoria de Automação",
    description: "Status em tempo real e histórico dos jobs do Jira.",
    href: "/auditoria/automacoes",
    icon: Activity,
  },
  {
    id: "acoes",
    title: "Auditoria de Ações",
    description: "Chamados em aberto e encerrados nas ações em massa.",
    href: "/auditoria/acoes",
    icon: ClipboardList,
  },
  {
    id: "fila",
    title: "Auditoria da Fila de Aprovação",
    description: "Histórico de aprovações, devoluções e reprovações.",
    href: "/auditoria/fila-aprovacoes",
    icon: History,
  },
];

export default function AuditoriaHubPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <DashboardShell
      pageTitle="Auditoria"
      pageSubtitle="Selecione a auditoria desejada para visualizar histórico e exportar dados"
    >
      <div className="flex w-full flex-col gap-6 px-4 lg:px-10">
        <div
          className={cn(
            "rounded-3xl border px-6 py-6",
            isDark
              ? "border-white/5 bg-gradient-to-br from-[#0c1024] to-[#06040c] text-zinc-100"
              : "border-slate-200 bg-white text-slate-800"
          )}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                Governança de Operações
              </p>
              <h2 className="text-2xl font-semibold">Centros de auditoria</h2>
              <p className="text-sm text-zinc-400">
                Acesse o histórico completo de automações, ações e aprovações.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {audits.map((audit) => {
            const Icon = audit.icon;
            return (
              <Link
                key={audit.id}
                href={audit.href}
                className={cn(
                  "group block rounded-3xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40",
                  isDark
                    ? "border-zinc-800 bg-[#050816]/80 hover:border-purple-500/40"
                    : "border-slate-200 bg-white hover:border-purple-300"
                )}
              >
                <Card className="border-0 bg-transparent">
                  <CardHeader className="flex flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <CardTitle className="text-lg">{audit.title}</CardTitle>
                        <p className="text-sm text-zinc-500">{audit.description}</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em]",
                        isDark
                          ? "border border-white/10 text-zinc-300"
                          : "border border-slate-200 text-slate-500"
                      )}
                    >
                      Abrir
                    </span>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}

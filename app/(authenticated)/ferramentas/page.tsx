"use client";

import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import {
  Activity,
  FileText,
  Filter,
  FileDown,
  KanbanSquare,
  Network,
  Target,
  Terminal,
} from "lucide-react";

const tools = [
  {
    id: "ping",
    title: "Ping ICMP",
    description: "Verifique latência simulada e disponibilidade de hosts.",
    href: "/ferramentas/ping",
    icon: Activity,
  },
  {
    id: "telnet",
    title: "Teste Telnet",
    description: "Valide abertura de portas TCP em hosts remotos.",
    href: "/ferramentas/telnet",
    icon: Terminal,
  },
  {
    id: "kanban",
    title: "Kanban",
    description: "Gerencie tarefas em um quadro visual e colaborativo.",
    href: "/kanban",
    icon: KanbanSquare,
  },
  {
    id: "topologia",
    title: "Topologia",
    description: "Monte diagramas de rede com drag & drop e links.",
    href: "/topologia",
    icon: Network,
  },
  {
    id: "sensores",
    title: "Gestão de Sensores",
    description: "Cadastre e monitore sensores de rede em tempo real.",
    href: "/ferramentas/sensores",
    icon: Network,
  },
  {
    id: "metas",
    title: "Cadastro de Metas",
    description: "Acompanhe metas do time com metas-alvo e evolução.",
    href: "/ferramentas/metas",
    icon: Target,
  },
  {
    id: "gestao-contratos",
    title: "Gestão de Contratos",
    description: "Centralize contratos e acompanhamento operacional.",
    href: "/ferramentas/gestao-contratos",
    icon: FileText,
  },
  {
    id: "validador-status",
    title: "Validador de Status",
    description: "Peneire chamados de alteração de status antes da aprovação.",
    href: "/ferramentas/validador-status",
    icon: Filter,
  },
  {
    id: "exporter-jira",
    title: "Exporter Jira",
    description: "Extraia relatórios em XLSX a partir de JQL.",
    href: "/ferramentas/exporter-jira",
    icon: FileDown,
  },
];

export default function FerramentasPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <DashboardShell
      pageTitle="Ferramentas"
      pageSubtitle="Acesse diagnósticos e laboratórios do Postura SM"
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
                Laboratório Postura SM
              </p>
              <h2 className="text-2xl font-semibold">Ferramentas disponíveis</h2>
              <p className="text-sm text-zinc-400">
                Selecione a ferramenta desejada para abrir o ambiente de uso.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
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
                        <CardTitle className="text-lg">{tool.title}</CardTitle>
                        <p className="text-sm text-zinc-500">{tool.description}</p>
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

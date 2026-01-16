"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { Sparkles, Bug } from "lucide-react";

export default function SugestoesProblemasPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("postura_user");
      if (!raw) {
        router.replace("/login");
        return;
      }
    } catch {
      router.replace("/login");
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-sm text-zinc-400">
        Carregando...
      </div>
    );
  }

  return (
    <DashboardShell
      pageTitle="Sugestões/Problemas"
      pageSubtitle="Escolha o canal certo para acompanhar ideias e problemas."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/sugestoes/jira" className="group">
          <Card
            className={cn(
              "h-full rounded-3xl border p-6 transition-all duration-200",
              isDark
                ? "border-white/10 bg-[#050816]/80 text-white hover:border-purple-500/40 hover:bg-[#0b1226]"
                : "border-slate-200 bg-white text-slate-900 hover:border-purple-300 hover:bg-purple-50"
            )}
          >
            <CardContent className="flex h-full flex-col p-0">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "rounded-2xl border p-3",
                    isDark
                      ? "border-white/10 bg-white/10 text-purple-200"
                      : "border-purple-200 bg-purple-100 text-purple-600"
                  )}
                >
                  <Bug className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    Jira
                  </p>
                  <h3 className="text-lg font-semibold">
                    Sugestões/Problemas Jira
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-sm text-zinc-400">
                Registre solicitações e acompanhe o fluxo de atendimento no
                Kanban.
              </p>
              <div
                className={cn(
                  "mt-6 flex min-h-[360px] flex-1 flex-col justify-between rounded-[28px] border px-6 py-6",
                  isDark
                    ? "border-white/10 bg-gradient-to-br from-[#0a1024] to-[#05060f]"
                    : "border-slate-200 bg-gradient-to-br from-white to-purple-50"
                )}
              >
                <div className="flex flex-1 items-center justify-center">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.5em] text-zinc-400">
                      Logo
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-purple-200">
                      JIRA
                    </p>
                  </div>
                </div>
                <div className="text-sm text-zinc-400">
                  JIRA · Registre solicitações e acompanhe atendimentos.
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/sugestoes" className="group">
          <Card
            className={cn(
              "h-full rounded-3xl border p-6 transition-all duration-200",
              isDark
                ? "border-white/10 bg-[#050816]/80 text-white hover:border-cyan-500/40 hover:bg-[#0b1226]"
                : "border-slate-200 bg-white text-slate-900 hover:border-cyan-200 hover:bg-cyan-50"
            )}
          >
            <CardContent className="flex h-full flex-col p-0">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "rounded-2xl border p-3",
                    isDark
                      ? "border-white/10 bg-white/10 text-cyan-200"
                      : "border-cyan-200 bg-cyan-100 text-cyan-600"
                  )}
                >
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    Plataforma
                  </p>
                  <h3 className="text-lg font-semibold">
                    Sugestões/Problemas Postura SM
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-sm text-zinc-400">
                Envie ideias e melhorias para o backlog interno da plataforma.
              </p>
              <div
                className={cn(
                  "mt-6 flex min-h-[360px] flex-1 flex-col justify-between rounded-[28px] border px-6 py-6",
                  isDark
                    ? "border-white/10 bg-gradient-to-br from-[#0a1024] to-[#05060f]"
                    : "border-slate-200 bg-gradient-to-br from-white to-cyan-50"
                )}
              >
                <div className="flex flex-1 items-center justify-center">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.5em] text-zinc-400">
                      Logo
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-cyan-200">
                      Postura SM
                    </p>
                  </div>
                </div>
                <div className="text-sm text-zinc-400">
                  Postura SM · Envie sugestões para o backlog interno.
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </DashboardShell>
  );
}

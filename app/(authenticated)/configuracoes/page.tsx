"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  ShieldCheck,
  User,
  Settings2,
  MonitorSmartphone,
  SlidersHorizontal,
  Cog,
  Cloud,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";

type UserData = {
  name: string;
  email: string;
  role?: string;
};

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [jiraToken, setJiraToken] = useState("");
  const [jiraUrl, setJiraUrl] = useState("");
  const [jiraVerifySsl, setJiraVerifySsl] = useState(true);
  const [jiraMaxResults, setJiraMaxResults] = useState(200);
  const [loadingJiraToken, setLoadingJiraToken] = useState(true);
  const [jiraMessage, setJiraMessage] = useState<string | null>(null);
  const [jiraError, setJiraError] = useState<string | null>(null);
  const [isTestingJira, setIsTestingJira] = useState(false);

  // pega dados básicos do usuário só para exibir na tela
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("postura_user");
      if (!raw) return;
      const parsed = JSON.parse(raw) as UserData;
      setUser(parsed);
    } catch {
      // se der erro, só ignora – DashboardShell já faz a guarda de auth
    }
  }, []);

  useEffect(() => {
    if (!user?.role || user.role !== "admin") {
      setLoadingJiraToken(false);
      return;
    }
    setLoadingJiraToken(true);
    fetch("/api/integrations/jira-token")
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        if (data?.error) {
          throw new Error(data.error);
        }
        setJiraToken(data?.token ?? "");
        setJiraUrl(data?.url ?? "");
        setJiraVerifySsl(data?.verifySsl ?? true);
        setJiraMaxResults(
          typeof data?.maxResults === "number" ? data.maxResults : 200
        );
      })
      .catch((err) => {
        setJiraError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar o token Jira."
        );
      })
      .finally(() => setLoadingJiraToken(false));
  }, [user]);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("postura_user");
    }
    router.replace("/login");
  }

  return (
    <DashboardShell
      pageTitle="Configurações"
      pageSubtitle="Preferências da Postura Security Management"
    >
      <div className="flex w-full flex-col gap-6 px-4 pb-12 lg:px-10">
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border px-6 py-6",
            isDark
              ? "border-white/5 bg-gradient-to-br from-[#090f1f] via-[#050816] to-[#05060f] text-zinc-100"
              : "border-slate-200 bg-white text-slate-800"
          )}
        >
          <div className="absolute inset-y-0 right-6 hidden w-40 rounded-full bg-gradient-to-b from-sky-500/30 via-purple-500/30 to-amber-400/20 blur-3xl md:block" />
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-500 text-white shadow-xl">
                  <SlidersHorizontal className="h-6 w-6" />
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-rose-500 to-purple-600 text-white shadow-xl">
                  <Cog className="h-6 w-6" />
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                  Central de configurações
                </p>
                <h2 className="text-2xl font-semibold">Configuração da plataforma</h2>
                <p className="text-sm text-zinc-400">
                  Administre integrações, identidades e preferências operacionais em um só lugar.
                </p>
              </div>
            </div>
            <div
              className={cn(
                "rounded-2xl border px-4 py-3 text-xs",
                isDark
                  ? "border-purple-500/30 bg-purple-500/5 text-purple-200"
                  : "border-purple-200 bg-purple-50 text-purple-700"
              )}
            >
              Identidade · {user?.role ?? "analista"} · Painel Postura
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Perfis", value: user?.role ?? "analista" },
              { label: "Integrador", value: "Jira + Postura", helper: "Tokens seguros" },
              { label: "Fluxo ativo", value: "Governança", helper: "Auditoria centralizada" },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-sm",
                  isDark
                    ? "border-white/5 bg-white/5 text-zinc-100"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                )}
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-purple-300">
                  {item.label}
                </p>
                <p className="text-lg font-semibold">{item.value}</p>
                {item.helper && <p className="text-xs text-zinc-400">{item.helper}</p>}
              </div>
            ))}
          </div>
        </div>
        {/* Linha de cima: Perfil + Sessão */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* PERFIL DA CONTA */}
          <Card
            className={cn(
              "rounded-3xl border overflow-hidden",
              isDark
                ? "border-zinc-800 bg-[#050816]/80"
                : "border-slate-200 bg-white"
            )}
          >
            <CardHeader className="border-b border-zinc-800/40 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600/90 text-white">
                    <User className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col">
                    <CardTitle className="text-sm font-semibold">
                      Perfil da conta
                    </CardTitle>
                    <span className="text-[11px] text-zinc-500">
                      Identidade no Postura Security Management
                    </span>
                  </div>
                </div>

                <span className="rounded-full bg-purple-600/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-purple-400">
                  Postura SM
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 py-4 text-sm">
              <p className="text-xs text-zinc-500">
                Informações do usuário autenticado neste ambiente de teste.
              </p>

              <div className="space-y-2 rounded-2xl border border-dashed border-zinc-700/60 px-3 py-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-zinc-500">Nome</span>
                  <span className="font-medium text-zinc-100">
                    {user?.name ?? "Administrador Postura SM"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-zinc-500">E-mail</span>
                  <span className="font-mono text-[11px] text-zinc-100">
                    {user?.email ?? "admin111@postura.com"}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500">
                Futuramente aqui você poderá editar dados do perfil, foto e
                preferências pessoais.
              </p>
            </CardContent>
          </Card>

          {/* SESSÃO E SEGURANÇA */}
          <Card
            className={cn(
              "rounded-3xl border overflow-hidden",
              isDark
                ? "border-zinc-800 bg-[#050816]/80"
                : "border-slate-200 bg-white"
            )}
          >
            <CardHeader className="border-b border-zinc-800/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/90 text-white">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <CardTitle className="text-sm font-semibold">
                    Sessão e segurança
                  </CardTitle>
                  <span className="text-[11px] text-zinc-500">
                    Controle de login na Postura SM
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 py-4 text-sm">
              <div
                className={cn(
                  "rounded-2xl border px-3 py-3 text-xs",
                  isDark
                    ? "border-emerald-600/60 bg-emerald-950/40 text-emerald-200"
                    : "border-emerald-200 bg-emerald-50 text-emerald-800"
                )}
              >
                <p className="font-medium">Sessão ativa</p>
                <p className="text-[11px] opacity-90">
                  Ambiente de teste conectado. Nenhuma alteração será aplicada
                  em sistemas reais.
                </p>
              </div>

              <p className="text-[11px] text-zinc-500">
                Ao sair da conta, será necessário autenticar novamente com seu
                e-mail corporativo para acessar o Postura Security Management.
              </p>

              <Button
                type="button"
                onClick={handleLogout}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-xs font-medium text-white shadow-md transition-all hover:bg-red-500"
              >
                <LogOut className="h-4 w-4" />
                Sair da conta
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ADMIN: INTEGRAÇÃO JIRA */}
        {user?.role === "admin" && (
          <Card
            className={cn(
              "rounded-3xl border overflow-hidden",
              isDark
                ? "border-zinc-800 bg-[#050816]/80"
                : "border-slate-200 bg-white"
            )}
          >
            <CardHeader className="pb-3 border-b border-zinc-800/40">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/90 text-white">
                    <Settings2 className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col">
                    <CardTitle className="text-sm font-semibold">
                      Integração Jira
                    </CardTitle>
                    <span className="text-[11px] text-zinc-500">
                      Configure o token e a URL usados para executar automações.
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                    isDark
                      ? "border border-purple-400/40 text-purple-300"
                      : "border border-purple-200 text-purple-700"
                  )}
                >
                  React + Vite ready
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-400">
              {jiraError && (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
                  {jiraError}
                </div>
              )}
              {jiraMessage && (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                  {jiraMessage}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400">
                  URL do Jira
                </label>
                <Input
                  type="url"
                  value={jiraUrl}
                  disabled={loadingJiraToken}
                  onChange={(event) => setJiraUrl(event.target.value)}
                  placeholder="https://suaempresa.atlassian.net"
                />
                <p className="text-[11px] text-zinc-500">
                  Informe o domínio do Jira que será utilizado nas automações.
                </p>
                <label className="flex items-center gap-2 text-[11px] text-zinc-500">
                  <input
                    type="checkbox"
                    checked={!jiraVerifySsl}
                    onChange={(event) => setJiraVerifySsl(!event.target.checked)}
                  />
                  Ignorar verificação SSL (ambiente interno)
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400">
                  Token de API Jira
                </label>
                <Input
                  type="password"
                  value={jiraToken}
                  disabled={loadingJiraToken}
                  onChange={(event) => setJiraToken(event.target.value)}
                  placeholder="Cole aqui o token gerado no Jira"
                />
                <p className="text-[11px] text-zinc-500">
                  O token será usado para autenticar chamadas às APIs do Jira nas automações.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400">
                  Limite máximo de issues por ação
                </label>
                <Input
                  type="number"
                  min={1}
                  value={jiraMaxResults}
                  disabled={loadingJiraToken}
                  onChange={(event) =>
                    setJiraMaxResults(
                      Math.max(1, Math.floor(Number(event.target.value || 1)))
                    )
                  }
                  placeholder="Ex: 200"
                />
                <p className="text-[11px] text-zinc-500">
                  Controla quantas issues podem ser processadas em uma aprovação de
                  alteração de status.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loadingJiraToken || isTestingJira}
                  onClick={async () => {
                    try {
                      if (!jiraUrl.trim()) {
                        setJiraError("Informe a URL do Jira antes de testar.");
                        return;
                      }
                      setJiraError(null);
                      setJiraMessage(null);
                      setIsTestingJira(true);
                      const response = await fetch(
                        "/api/integrations/jira-test",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            token: jiraToken,
                            url: jiraUrl,
                            verifySsl: jiraVerifySsl,
                            maxResults: jiraMaxResults,
                          }),
                        }
                      );
                      const data = await response.json().catch(() => null);
                      if (!response.ok) {
                        throw new Error(
                          data?.error || "Falha ao testar a comunicação."
                        );
                      }
                      setJiraMessage("Conexão com o Jira confirmada.");
                    } catch (err) {
                      setJiraError(
                        err instanceof Error
                          ? err.message
                          : "Não foi possível testar a comunicação."
                      );
                    } finally {
                      setIsTestingJira(false);
                    }
                  }}
                  className={cn(
                    "rounded-xl",
                    isDark
                      ? "border-zinc-700 text-zinc-200 hover:border-zinc-500"
                      : "border-slate-300 text-slate-700 hover:border-slate-400"
                  )}
                >
                  {isTestingJira ? "Testando..." : "Testar conexão"}
                </Button>
                <Button
                  type="button"
                  disabled={loadingJiraToken}
                  onClick={async () => {
                    try {
                      setJiraError(null);
                      setJiraMessage(null);
                      const response = await fetch(
                        "/api/integrations/jira-token",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            token: jiraToken,
                            url: jiraUrl,
                            verifySsl: jiraVerifySsl,
                          }),
                        }
                      );
                      const data = await response.json().catch(() => null);
                      if (!response.ok) {
                        throw new Error(data?.error || "Falha ao salvar token.");
                      }
                      setJiraMessage("Token salvo com sucesso.");
                    } catch (err) {
                      setJiraError(
                        err instanceof Error
                          ? err.message
                          : "Não foi possível salvar o token."
                      );
                    }
                  }}
                  className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  Salvar token
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* PREFERÊNCIAS / FUTURO */}
        <Card
          className={cn(
            "rounded-3xl border overflow-hidden",
            isDark
              ? "border-zinc-800 bg-[#050816]/80"
              : "border-slate-200 bg-white"
          )}
        >
          <CardHeader className="pb-3 border-b border-zinc-800/40">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/90 text-white">
                <Cloud className="h-4 w-4" />
              </span>
              <div className="flex flex-col">
                <CardTitle className="text-sm font-semibold">
                  Preferências avançadas
                </CardTitle>
                <span className="text-[11px] text-zinc-500">
                  Tema, integrações e notificações centralizadas
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-400">
            <div
              className={cn(
                "rounded-[22px] border px-4 py-3",
                isDark
                  ? "border-white/5 bg-white/5 text-zinc-200"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              )}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                Roadmap
              </p>
              <p className="text-sm">
                Configure notificações push, integrações com Grafana e roteiros multi-cloud
                em um único painel inspirado no tema React + Vite.
              </p>
            </div>
            <p className="flex items-center gap-1 text-[11px]">
              <MonitorSmartphone className="h-3 w-3" />
              Experiência responsiva garantida, espelhando a Postura SM em dispositivos móveis.
            </p>
            <p className="text-[11px] opacity-70">
              Este ambiente de teste prioriza validação de navegação, fluxo de autenticação e
              visual premium. Em breve adicionaremos controles finos de notificações e temas.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

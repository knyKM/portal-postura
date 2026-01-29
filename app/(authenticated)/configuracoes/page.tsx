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
  Shield,
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
  const [loadingJiraToken, setLoadingJiraToken] = useState(true);
  const [jiraMessage, setJiraMessage] = useState<string | null>(null);
  const [jiraError, setJiraError] = useState<string | null>(null);
  const [dashboardToken, setDashboardToken] = useState("");
  const [dashboardJiraUrl, setDashboardJiraUrl] = useState("");
  const [dashboardTokenLoading, setDashboardTokenLoading] = useState(true);
  const [dashboardTokenSaving, setDashboardTokenSaving] = useState(false);
  const [dashboardTokenMessage, setDashboardTokenMessage] = useState<string | null>(null);
  const [dashboardTokenError, setDashboardTokenError] = useState<string | null>(null);
  const [dashboardSyncLoading, setDashboardSyncLoading] = useState(false);
  const [dashboardSyncMessage, setDashboardSyncMessage] = useState<string | null>(null);
  const [dashboardSyncError, setDashboardSyncError] = useState<string | null>(null);
  const [dashboardJiraSyncLoading, setDashboardJiraSyncLoading] = useState(false);
  const [dashboardJiraSyncMessage, setDashboardJiraSyncMessage] = useState<string | null>(null);
  const [dashboardJiraSyncError, setDashboardJiraSyncError] = useState<string | null>(null);
  const [tenableAccessKey, setTenableAccessKey] = useState("");
  const [tenableSecretKey, setTenableSecretKey] = useState("");
  const [tenableVerifySsl, setTenableVerifySsl] = useState(true);
  const [tenableProxyHost, setTenableProxyHost] = useState("");
  const [tenableProxyPort, setTenableProxyPort] = useState("");
  const [tenableScanPrefixes, setTenableScanPrefixes] = useState("");
  const [loadingTenable, setLoadingTenable] = useState(true);
  const [tenableMessage, setTenableMessage] = useState<string | null>(null);
  const [tenableError, setTenableError] = useState<string | null>(null);
  const [tenableSyncMessage, setTenableSyncMessage] = useState<string | null>(null);
  const [tenableSyncError, setTenableSyncError] = useState<string | null>(null);
  const [tenableSyncing, setTenableSyncing] = useState(false);
  const [tenableSslSaving, setTenableSslSaving] = useState(false);
  const [tenableProxySaving, setTenableProxySaving] = useState(false);
  const [tenablePrefixesSaving, setTenablePrefixesSaving] = useState(false);
  const [jobsPaused, setJobsPaused] = useState(false);
  const [jobsMessage, setJobsMessage] = useState<string | null>(null);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsMaxParallel, setJobsMaxParallel] = useState(3);
  const [isJiraTestModalOpen, setIsJiraTestModalOpen] = useState(false);
  const [jiraIssueId, setJiraIssueId] = useState("");
  const [jiraTestResult, setJiraTestResult] = useState<{
    status: number;
    message: string;
    summary?: string;
  } | null>(null);
  const [jiraTestError, setJiraTestError] = useState<{
    status: number;
    message: string;
  } | null>(null);
  const [isTestingIssue, setIsTestingIssue] = useState(false);

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
    if (!user) {
      setLoadingJiraToken(false);
      setLoadingTenable(false);
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
      })
      .catch((err) => {
        setJiraError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar o token Jira."
        );
      })
      .finally(() => setLoadingJiraToken(false));

    setDashboardTokenLoading(true);
    fetch("/api/integrations/dashboard-token")
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        if (data?.error) {
          throw new Error(data.error);
        }
        setDashboardToken(data?.token ?? "");
        setDashboardJiraUrl(data?.url ?? "");
      })
      .catch((err) => {
        setDashboardTokenError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar o token do dashboard."
        );
      })
      .finally(() => setDashboardTokenLoading(false));

    setLoadingTenable(true);
    fetch("/api/integrations/tenable-token")
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        if (data?.error) {
          throw new Error(data.error);
        }
        setTenableAccessKey(data?.accessKey ?? "");
        setTenableSecretKey(data?.secretKey ?? "");
      })
      .catch((err) => {
        setTenableError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar o token Tenable."
        );
      })
      .finally(() => setLoadingTenable(false));

    fetch("/api/integrations/tenable/ssl")
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        if (typeof data?.verifySsl === "boolean") {
          setTenableVerifySsl(data.verifySsl);
        }
      })
      .catch(() => null);

    if (user?.role === "admin") {
      fetch("/api/integrations/tenable/proxy")
        .then((res) => res.json().catch(() => null))
        .then((data) => {
          if (!data?.error) {
            setTenableProxyHost(data?.host ?? "");
            setTenableProxyPort(data?.port ?? "");
          }
        })
        .catch(() => null);
    }

    fetch("/api/integrations/tenable/scans-prefixes")
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        if (!data?.error) {
          setTenableScanPrefixes(data?.prefixes ?? "");
        }
      })
      .catch(() => null);

    fetch("/api/actions/jobs?settings=1")
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        if (typeof data?.paused === "boolean") {
          setJobsPaused(data.paused);
        }
        if (typeof data?.maxParallel === "number") {
          setJobsMaxParallel(data.maxParallel);
        }
      })
      .catch(() => null);
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

        {/* INTEGRAÇÃO JIRA */}
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
              {user?.role === "admin" && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400">
                    Execuções em fila
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-[11px] text-zinc-500">
                      <input
                        type="checkbox"
                        checked={jobsPaused}
                        disabled={jobsLoading}
                        onChange={async (event) => {
                          const nextPaused = event.target.checked;
                          setJobsLoading(true);
                          setJobsError(null);
                          setJobsMessage(null);
                          try {
                            const response = await fetch("/api/actions/jobs", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ paused: nextPaused }),
                            });
                            const data = await response.json().catch(() => null);
                            if (!response.ok) {
                              throw new Error(data?.error || "");
                            }
                            setJobsPaused(Boolean(data?.paused ?? nextPaused));
                            setJobsMessage(
                              nextPaused
                                ? "Fila pausada. Novas aprovações ficarão aguardando."
                                : "Fila liberada. As execuções serão retomadas."
                            );
                          } catch (err) {
                            setJobsError(err instanceof Error ? err.message : "");
                          } finally {
                            setJobsLoading(false);
                          }
                        }}
                      />
                      Pausar execuções da fila
                    </label>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                      <span>Máximo em paralelo</span>
                      <Input
                        type="number"
                        min={1}
                        value={jobsMaxParallel}
                        disabled={jobsLoading}
                        onChange={(event) =>
                          setJobsMaxParallel(
                            Math.max(1, Math.floor(Number(event.target.value || 1)))
                          )
                        }
                        className="h-8 w-20"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={jobsLoading}
                        className={cn(
                          "rounded-xl text-[11px]",
                          isDark
                            ? "border-white/10 text-zinc-200 hover:border-white/30"
                            : "border-slate-200 text-slate-700 hover:border-slate-300"
                        )}
                        onClick={async () => {
                          setJobsLoading(true);
                          setJobsError(null);
                          setJobsMessage(null);
                          try {
                            const response = await fetch("/api/actions/jobs", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ maxParallel: jobsMaxParallel }),
                            });
                            const data = await response.json().catch(() => null);
                            if (!response.ok) {
                              throw new Error(data?.error || "");
                            }
                            setJobsMaxParallel(
                              typeof data?.maxParallel === "number"
                                ? data.maxParallel
                                : jobsMaxParallel
                            );
                            setJobsMessage("Limite de execuções atualizado.");
                          } catch (err) {
                            setJobsError(err instanceof Error ? err.message : "");
                          } finally {
                            setJobsLoading(false);
                          }
                        }}
                      >
                        Salvar
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={jobsLoading}
                      className={cn(
                        "rounded-xl text-xs",
                        isDark
                          ? "border-white/10 text-zinc-200 hover:border-white/30"
                          : "border-slate-200 text-slate-700 hover:border-slate-300"
                      )}
                      onClick={async () => {
                        setJobsLoading(true);
                        setJobsError(null);
                        setJobsMessage(null);
                        try {
                          const response = await fetch("/api/actions/jobs", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ resume: true }),
                          });
                          const data = await response.json().catch(() => null);
                          if (!response.ok) {
                            throw new Error(data?.error || "");
                          }
                          setJobsPaused(false);
                          setJobsMessage("Execuções retomadas.");
                        } catch (err) {
                          setJobsError(err instanceof Error ? err.message : "");
                        } finally {
                          setJobsLoading(false);
                        }
                      }}
                    >
                      Iniciar execuções pendentes
                    </Button>
                  </div>
                  {jobsError && (
                    <p className="text-[11px] text-rose-400">{jobsError}</p>
                  )}
                  {jobsMessage && (
                    <p className="text-[11px] text-emerald-400">{jobsMessage}</p>
                  )}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loadingJiraToken}
                  onClick={async () => {
                    setJiraTestResult(null);
                    setJiraTestError(null);
                    setJiraIssueId("");
                    setIsJiraTestModalOpen(true);
                  }}
                  className={cn(
                    "rounded-xl",
                    isDark
                      ? "border-zinc-700 text-zinc-200 hover:border-zinc-500"
                      : "border-slate-300 text-slate-700 hover:border-slate-400"
                  )}
                >
                  Testar conexão
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
                      setJiraVerifySsl(data?.verifySsl ?? jiraVerifySsl);
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
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500/90 text-white">
                  <MonitorSmartphone className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <CardTitle className="text-sm font-semibold">
                    Token Dashboard (Jira)
                  </CardTitle>
                  <span className="text-[11px] text-zinc-500">
                    Token compartilhado para widgets JQL do dashboard.
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-400">
              {dashboardTokenError && (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
                  {dashboardTokenError}
                </div>
              )}
              {dashboardTokenMessage && (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                  {dashboardTokenMessage}
                </div>
              )}
              {dashboardSyncError && (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
                  {dashboardSyncError}
                </div>
              )}
              {dashboardSyncMessage && (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                  {dashboardSyncMessage}
                </div>
              )}
              {dashboardJiraSyncError && (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
                  {dashboardJiraSyncError}
                </div>
              )}
              {dashboardJiraSyncMessage && (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                  {dashboardJiraSyncMessage}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400">
                  URL do Jira (Dashboard)
                </label>
                <Input
                  value={dashboardJiraUrl}
                  disabled={dashboardTokenLoading || user?.role !== "admin"}
                  onChange={(event) => setDashboardJiraUrl(event.target.value)}
                  placeholder="https://seu-jira.exemplo.com"
                />
                <p className="text-[11px] text-zinc-500">
                  URL base utilizada nas consultas JQL do dashboard.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400">
                  Token do dashboard
                </label>
                <Input
                  type="password"
                  value={dashboardToken}
                  disabled={dashboardTokenLoading || user?.role !== "admin"}
                  onChange={(event) => setDashboardToken(event.target.value)}
                  placeholder="Cole aqui o token do dashboard"
                />
                <p className="text-[11px] text-zinc-500">
                  Todos os usuários usam o mesmo token configurado por administradores.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  disabled={dashboardTokenSaving || user?.role !== "admin"}
                  onClick={async () => {
                    setDashboardTokenSaving(true);
                    setDashboardTokenError(null);
                    setDashboardTokenMessage(null);
                    try {
                      const response = await fetch("/api/integrations/dashboard-token", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          token: dashboardToken,
                          url: dashboardJiraUrl,
                        }),
                      });
                      const data = await response.json().catch(() => null);
                      if (!response.ok) {
                        throw new Error(data?.error || "Não foi possível salvar.");
                      }
                      setDashboardToken(data?.token ?? dashboardToken);
                      setDashboardJiraUrl(data?.url ?? dashboardJiraUrl);
                      setDashboardTokenMessage("Token salvo com sucesso.");
                    } catch (err) {
                      setDashboardTokenError(
                        err instanceof Error ? err.message : "Falha ao salvar token."
                      );
                    } finally {
                      setDashboardTokenSaving(false);
                    }
                  }}
                >
                  {dashboardTokenSaving ? "Salvando..." : "Salvar token"}
                </Button>
                {user?.role !== "admin" && (
                  <span className="text-[11px] text-zinc-500">
                    Somente admin pode alterar.
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl"
                  disabled={dashboardSyncLoading || user?.role !== "admin"}
                  onClick={async () => {
                    if (
                      !window.confirm(
                        "Deseja sincronizar o JSON de JQLs com os templates atuais?"
                      )
                    ) {
                      return;
                    }
                    setDashboardSyncLoading(true);
                    setDashboardSyncError(null);
                    setDashboardSyncMessage(null);
                    try {
                      const response = await fetch("/api/dashboards/sync-jqls", {
                        method: "POST",
                      });
                      const data = await response.json().catch(() => null);
                      if (!response.ok) {
                        throw new Error(data?.error || "Falha ao sincronizar JQLs.");
                      }
                      const result = data?.result;
                      setDashboardSyncMessage(
                        `JSON atualizado. ${result?.templates ?? 0} templates, ${
                          result?.widgets ?? 0
                        } widgets.`
                      );
                    } catch (err) {
                      setDashboardSyncError(
                        err instanceof Error ? err.message : "Falha ao sincronizar JQLs."
                      );
                    } finally {
                      setDashboardSyncLoading(false);
                    }
                  }}
                >
                  {dashboardSyncLoading ? "Sincronizando..." : "Atualizar JSON de JQLs"}
                </Button>
                {user?.role !== "admin" && (
                  <span className="text-[11px] text-zinc-500">
                    Somente admin pode executar.
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl border-purple-500/40 text-purple-200"
                  disabled={dashboardJiraSyncLoading || user?.role !== "admin"}
                  onClick={async () => {
                    if (
                      !window.confirm(
                        "Deseja sincronizar os dados do Jira para o dashboard? Isso irá atualizar o dashboard-jql-results.json."
                      )
                    ) {
                      return;
                    }
                    setDashboardJiraSyncLoading(true);
                    setDashboardJiraSyncError(null);
                    setDashboardJiraSyncMessage(null);
                    try {
                      const response = await fetch("/api/dashboards/sync-jira", {
                        method: "POST",
                      });
                      const data = await response.json().catch(() => null);
                      if (!response.ok) {
                        throw new Error(data?.error || "Falha ao sincronizar dados do Jira.");
                      }
                      const totals = data?.totals;
                      setDashboardJiraSyncMessage(
                        `Sync concluído. ${totals?.queries ?? 0} JQLs consultadas.`
                      );
                    } catch (err) {
                      setDashboardJiraSyncError(
                        err instanceof Error
                          ? err.message
                          : "Falha ao sincronizar dados do Jira."
                      );
                    } finally {
                      setDashboardJiraSyncLoading(false);
                    }
                  }}
                >
                  {dashboardJiraSyncLoading ? "Sincronizando Jira..." : "Sincronizar Jira"}
                </Button>
                {user?.role !== "admin" && (
                  <span className="text-[11px] text-zinc-500">
                    Somente admin pode executar.
                  </span>
                )}
              </div>
            </CardContent>
          </Card>


        {/* INTEGRAÇÃO TENABLE */}
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
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/90 text-white">
                    <Shield className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col">
                    <CardTitle className="text-sm font-semibold">
                      Integração Tenable
                    </CardTitle>
                    <span className="text-[11px] text-zinc-500">
                      Configure as chaves para sincronizar plugins e scans.
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-400">
              {tenableError && (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
                  {tenableError}
                </div>
              )}
              {tenableMessage && (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                  {tenableMessage}
                </div>
              )}
              {tenableSyncError && (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
                  <p className="font-semibold uppercase tracking-[0.3em] text-rose-200/80">
                    Log de erro
                  </p>
                  <p className="mt-2 whitespace-pre-wrap">{tenableSyncError}</p>
                </div>
              )}
              {tenableSyncMessage && (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                  {tenableSyncMessage}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400">
                  Access Key
                </label>
                <Input
                  value={tenableAccessKey}
                  disabled={loadingTenable}
                  onChange={(event) => setTenableAccessKey(event.target.value)}
                  placeholder="Cole a access key da Tenable"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400">
                  Secret Key
                </label>
                <Input
                  type="password"
                  value={tenableSecretKey}
                  disabled={loadingTenable}
                  onChange={(event) => setTenableSecretKey(event.target.value)}
                  placeholder="Cole a secret key da Tenable"
                />
              </div>
              <p className="text-[11px] text-zinc-500">
                As chaves serão usadas para sincronizar plugins e scans do Tenable
                Vulnerability Management.
              </p>
              <label className="flex items-center gap-2 text-[11px] text-zinc-500">
                <input
                  type="checkbox"
                  checked={!tenableVerifySsl}
                  onChange={(event) => setTenableVerifySsl(!event.target.checked)}
                  disabled={tenableSslSaving}
                />
                Ignorar verificação SSL (ambiente interno)
              </label>
              <div className="grid gap-3 rounded-2xl border border-white/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                  Prefixos de scans
                </p>
                <Input
                  value={tenableScanPrefixes}
                  onChange={(event) => setTenableScanPrefixes(event.target.value)}
                  placeholder="Ex.: [PRODV], [PRODH]"
                  className="rounded-xl"
                />
                <p className="text-[11px] text-zinc-500">
                  Separe por vírgula. Apenas scans cujo nome inicia com esses
                  prefixos serão sincronizados.
                </p>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={tenablePrefixesSaving}
                    onClick={async () => {
                      setTenablePrefixesSaving(true);
                      setTenableError(null);
                      setTenableMessage(null);
                      try {
                        const response = await fetch(
                          "/api/integrations/tenable/scans-prefixes",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ prefixes: tenableScanPrefixes }),
                          }
                        );
                        const data = await response.json().catch(() => null);
                        if (!response.ok) {
                          throw new Error(
                            data?.error || "Não foi possível salvar os prefixos."
                          );
                        }
                        setTenableScanPrefixes(data?.prefixes ?? tenableScanPrefixes);
                        setTenableMessage("Prefixos salvos com sucesso.");
                      } catch (err) {
                        setTenableError(
                          err instanceof Error
                            ? err.message
                            : "Não foi possível salvar os prefixos."
                        );
                      } finally {
                        setTenablePrefixesSaving(false);
                      }
                    }}
                  >
                    Salvar prefixos
                  </Button>
                </div>
              </div>
              {user?.role === "admin" && (
                <div className="grid gap-3 rounded-2xl border border-white/10 p-4">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                    Proxy Tenable
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      value={tenableProxyHost}
                      onChange={(event) => setTenableProxyHost(event.target.value)}
                      placeholder="Host do proxy (ex.: proxy.local)"
                      className="rounded-xl"
                    />
                    <Input
                      value={tenableProxyPort}
                      onChange={(event) => setTenableProxyPort(event.target.value)}
                      placeholder="Porta (ex.: 8080)"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={tenableProxySaving}
                      onClick={async () => {
                        setTenableProxySaving(true);
                        setTenableError(null);
                        setTenableMessage(null);
                        try {
                          const response = await fetch("/api/integrations/tenable/proxy", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              host: tenableProxyHost,
                              port: tenableProxyPort,
                            }),
                          });
                          const data = await response.json().catch(() => null);
                          if (!response.ok) {
                            throw new Error(data?.error || "Falha ao salvar proxy.");
                          }
                          setTenableProxyHost(data?.host ?? tenableProxyHost);
                          setTenableProxyPort(data?.port ?? tenableProxyPort);
                          setTenableMessage("Proxy salvo com sucesso.");
                        } catch (err) {
                          setTenableError(
                            err instanceof Error
                              ? err.message
                              : "Não foi possível salvar o proxy."
                          );
                        } finally {
                          setTenableProxySaving(false);
                        }
                      }}
                    >
                      Salvar proxy
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  disabled={loadingTenable}
                  onClick={async () => {
                    try {
                      setTenableError(null);
                      setTenableMessage(null);
                      const response = await fetch(
                        "/api/integrations/tenable-token",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            accessKey: tenableAccessKey,
                            secretKey: tenableSecretKey,
                          }),
                        }
                      );
                      const data = await response.json().catch(() => null);
                      if (!response.ok) {
                        throw new Error(data?.error || "Falha ao salvar token.");
                      }
                      setTenableMessage("Chaves salvas com sucesso.");
                    } catch (err) {
                      setTenableError(
                        err instanceof Error
                          ? err.message
                          : "Não foi possível salvar as chaves."
                      );
                    }
                  }}
                  className="rounded-xl bg-cyan-600 text-white hover:bg-cyan-500"
                >
                  Salvar chaves
                </Button>
                {user?.role === "admin" && (
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={tenableSslSaving}
                    onClick={async () => {
                      setTenableSslSaving(true);
                      setTenableError(null);
                      setTenableMessage(null);
                      try {
                        const response = await fetch("/api/integrations/tenable/ssl", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ verifySsl: tenableVerifySsl }),
                        });
                        const data = await response.json().catch(() => null);
                        if (!response.ok) {
                          throw new Error(data?.error || "Falha ao salvar SSL.");
                        }
                        setTenableMessage("Preferência SSL salva com sucesso.");
                      } catch (err) {
                        setTenableError(
                          err instanceof Error
                            ? err.message
                            : "Não foi possível salvar a preferência SSL."
                        );
                      } finally {
                        setTenableSslSaving(false);
                      }
                    }}
                  >
                    Salvar SSL
                  </Button>
                )}
              </div>
              {user?.role === "admin" && (
                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={tenableSyncing}
                    onClick={async () => {
                      setTenableSyncing(true);
                      setTenableSyncError(null);
                      setTenableSyncMessage(null);
                      try {
                        const response = await fetch(
                          "/api/integrations/tenable/sync-plugins",
                          { method: "POST" }
                        );
                        const data = await response.json().catch(() => null);
                        if (!response.ok) {
                          const details = data?.details ? `\n${data.details}` : "";
                          throw new Error(
                            `${data?.error || "Falha ao sincronizar plugins."}${details}`
                          );
                        }
                        setTenableSyncMessage(
                          `Plugins sincronizados: ${data?.synced ?? 0}`
                        );
                      } catch (err) {
                        setTenableSyncError(
                          err instanceof Error
                            ? err.message
                            : "Não foi possível sincronizar plugins."
                        );
                      } finally {
                        setTenableSyncing(false);
                      }
                    }}
                  >
                    Sincronizar plugins
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={tenableSyncing}
                    onClick={async () => {
                      setTenableSyncing(true);
                      setTenableSyncError(null);
                      setTenableSyncMessage(null);
                      try {
                        const response = await fetch(
                          "/api/integrations/tenable/sync-scans",
                          { method: "POST" }
                        );
                        const data = await response.json().catch(() => null);
                        if (!response.ok) {
                          const details = data?.details ? `\n${data.details}` : "";
                          throw new Error(
                            `${data?.error || "Falha ao sincronizar scans."}${details}`
                          );
                        }
                        setTenableSyncMessage(
                          `Scans sincronizados: ${data?.synced ?? 0}`
                        );
                      } catch (err) {
                        setTenableSyncError(
                          err instanceof Error
                            ? err.message
                            : "Não foi possível sincronizar scans."
                        );
                      } finally {
                        setTenableSyncing(false);
                      }
                    }}
                  >
                    Sincronizar scans
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

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
      {isJiraTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div
            className={cn(
              "w-full max-w-lg rounded-3xl border p-6",
              isDark ? "border-zinc-800 bg-[#050816]" : "border-slate-200 bg-white"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                  Integração Jira
                </p>
                <h3 className="text-xl font-semibold">Testar conexão</h3>
                <p className="text-xs text-zinc-500">
                  Informe uma issue para validar o acesso via API.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsJiraTestModalOpen(false)}
              >
                Fechar
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400">
                  ID da issue
                </label>
                <Input
                  value={jiraIssueId}
                  onChange={(event) => setJiraIssueId(event.target.value)}
                  placeholder="Ex: ASSETN-1234"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  disabled={!jiraIssueId.trim() || isTestingIssue}
                  onClick={async () => {
                    setIsTestingIssue(true);
                    setJiraTestResult(null);
                    setJiraTestError(null);
                    try {
                      const response = await fetch("/api/integrations/jira-test", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          token: jiraToken,
                          url: jiraUrl,
                          verifySsl: jiraVerifySsl,
                          issueId: jiraIssueId.trim(),
                        }),
                      });
                      const data = await response.json().catch(() => null);
                      if (!response.ok) {
                        setJiraTestError({
                          status: data?.status ?? response.status,
                          message: data?.message ?? "",
                        });
                        return;
                      }
                      setJiraTestResult({
                        status: data?.status ?? response.status,
                        message: data?.message ?? "",
                        summary: data?.summary ?? "",
                      });
                    } finally {
                      setIsTestingIssue(false);
                    }
                  }}
                  className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  {isTestingIssue ? "Testando..." : "Testar conexão"}
                </Button>
              </div>

              {jiraTestResult && (
                <div
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-xs",
                    isDark
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  )}
                >
                  <p>Status: {jiraTestResult.status}</p>
                  <p>Mensagem: {jiraTestResult.message}</p>
                  {jiraTestResult.summary && <p>Summary: {jiraTestResult.summary}</p>}
                </div>
              )}

              {jiraTestError && (
                <div
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-xs",
                    isDark
                      ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                  )}
                >
                  <p>Status: {jiraTestError.status}</p>
                  <p>Mensagem: {jiraTestError.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

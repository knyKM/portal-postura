"use client";

import { useEffect, useState, ReactNode, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type User = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role?: string;
  security_level?: string;
  allowed_routes?: string[];
};

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  type: string;
  created_at: string;
  read_at: string | null;
  is_read: boolean;
  payload?: Record<string, unknown> | null;
};

type DashboardShellProps = {
  children?: ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
};

export function DashboardShell({
  children,
  pageTitle = "Dashboard",
  pageSubtitle = "Visão Geral de Vulnerabilidades",
}: DashboardShellProps) {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [accessReady, setAccessReady] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState<string | null>(
    null
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [clearingNotifications, setClearingNotifications] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Guarda de autenticação
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("postura_user")
          : null;

      if (!raw) {
        router.replace("/login");
        setCheckingAuth(false);
        return;
      }

      const parsed = JSON.parse(raw) as User;
      setUser(parsed);
      setAccessReady(
        parsed?.role === "admin" ||
          (Array.isArray(parsed?.allowed_routes) && parsed.allowed_routes.length > 0)
      );
      setCheckingAuth(false);
    } catch {
      localStorage.removeItem("postura_user");
      router.replace("/login");
      setCheckingAuth(false);
    }
  }, [router]);

  useEffect(() => {
    if (!user) return;
    let ignore = false;
    void (async () => {
      try {
        const response = await fetch("/api/users/me", { cache: "no-store" });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          return;
        }
        if (ignore) return;
        if (data?.user) {
          setUser(data.user);
          setAccessReady(true);
          if (typeof window !== "undefined") {
            localStorage.setItem("postura_user", JSON.stringify(data.user));
            window.dispatchEvent(new Event("postura_user_updated"));
          }
        }
      } catch {
        // ignore refresh failures
      }
    })();
    return () => {
      ignore = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user || !pathname || !accessReady) return;
    if (user.role === "admin") return;
    const allowedRoutes = user.allowed_routes ?? [];
    const alwaysAllowed = [
      "/vulnerabilidades/insights",
      "/configuracoes",
      "/changelog",
      "/changelog/manual",
      "/dashboard",
    ];
    const isAllowed = allowedRoutes.some(
      (allowed) => pathname === allowed || pathname.startsWith(`${allowed}/`)
    );
    const isAlwaysAllowed = alwaysAllowed.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
    if (!isAlwaysAllowed && !isAllowed) {
      router.replace("/vulnerabilidades/insights");
    }
  }, [user, pathname, router]);

  const alwaysAllowed = [
    "/vulnerabilidades/insights",
    "/configuracoes",
    "/changelog",
    "/changelog/manual",
    "/dashboard",
  ];
  const isDenied =
    user &&
    accessReady &&
    user.role !== "admin" &&
    !alwaysAllowed.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    ) &&
    !(user.allowed_routes ?? []).some(
      (allowed) => pathname === allowed || pathname.startsWith(`${allowed}/`)
    );

  // Sidebar começa colapsada em telas pequenas
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  }, []);

  const fetchNotifications = useCallback(
    async (silent = false, ignoreState?: { current: boolean }) => {
      if (!user) return;
      if (!silent) {
        setNotificationsLoading(true);
        setNotificationsError(null);
      }
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(
            data?.error || "Não foi possível carregar notificações."
          );
        }
        if (ignoreState?.current) return;
        setNotifications(data?.notifications ?? []);
        setUnreadCount(data?.unreadCount ?? 0);
      } catch (err) {
        if (ignoreState?.current) return;
        setNotificationsError(
          err instanceof Error
            ? err.message
            : "Falha ao carregar notificações."
        );
      } finally {
        if (ignoreState?.current) return;
        if (!silent) {
          setNotificationsLoading(false);
        }
      }
    },
    [user]
  );

  useEffect(() => {
    if (!user) return;
    const ignoreState = { current: false };
    fetchNotifications(false, ignoreState);
    const interval = setInterval(() => {
      fetchNotifications(true, ignoreState);
    }, 45000);
    return () => {
      ignoreState.current = true;
      clearInterval(interval);
    };
  }, [user, fetchNotifications]);

  const markAllNotificationsAsRead = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch("/api/notifications", { method: "PATCH" });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Não foi possível marcar como lidas.");
      }
      const readTimestamp = new Date().toISOString();
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: true,
          read_at: notification.read_at ?? readTimestamp,
        }))
      );
      setUnreadCount(0);
    } catch (err) {
      setNotificationsError(
        err instanceof Error
          ? err.message
          : "Falha ao atualizar status das notificações."
      );
    }
  }, [user]);

  function handleNotificationsToggle() {
    const next = !showNotifications;
    setShowNotifications(next);
    if (next && unreadCount > 0) {
      markAllNotificationsAsRead();
    }
  }

  async function handleClearNotifications() {
    if (clearingNotifications) return;
    setNotificationsError(null);
    setClearingNotifications(true);
    try {
      const response = await fetch("/api/notifications", { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Não foi possível limpar notificações.");
      }
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      setNotificationsError(
        err instanceof Error
          ? err.message
          : "Falha ao limpar notificações."
      );
    } finally {
      setClearingNotifications(false);
    }
  }

  function getNotificationMeta(type: string) {
    if (type.includes("action")) {
      return {
        label: "Fluxo de ações",
        accent: "from-purple-500/40 via-indigo-500/20 to-sky-500/10",
        badgeClass: "text-purple-200 border-purple-400/40 bg-purple-500/10",
      };
    }
    if (type.includes("audit") || type.includes("job")) {
      return {
        label: "Auditoria",
        accent: "from-emerald-500/30 via-teal-500/10 to-cyan-500/10",
        badgeClass: "text-emerald-200 border-emerald-400/40 bg-emerald-500/10",
      };
    }
    return {
      label: "Sistema",
      accent: "from-zinc-500/20 via-slate-500/10 to-gray-500/5",
      badgeClass: "text-zinc-200 border-white/10 bg-white/5",
    };
  }

  if (checkingAuth || !user || (!accessReady && user.role !== "admin") || isDenied) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex h-screen w-full",
        isDark
          ? "bg-[#050816] text-zinc-100"
          : "bg-slate-100 text-slate-900"
      )}
    >
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((prev) => !prev)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header
          className={cn(
            "relative z-50 flex h-16 items-center justify-between border-b px-4 md:px-6 backdrop-blur",
            isDark
              ? "border-zinc-800 bg-[#050816]/90"
              : "border-slate-200 bg-white/80"
          )}
        >
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-zinc-500">
              {pageSubtitle}
            </span>
            <h1 className="text-lg md:text-xl font-semibold">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* BOTÃO DE NOTIFICAÇÕES */}
            <button
              onClick={handleNotificationsToggle}
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-full border text-xs transition-colors",
                isDark
                  ? "border-zinc-700 bg-[#050816] text-zinc-200 hover:bg-zinc-900"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              )}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>

            {/* Info do usuário */}
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs opacity-70">{user.email}</span>
            </div>

            <div className="relative h-8 w-8 md:h-9 md:w-9 overflow-hidden rounded-full border">
              <Image
                src={user.avatar || "/logo_vivo_sem_fundo.png"}
                alt="Avatar do usuário"
                fill
                className="object-contain"
              />
            </div>
            {/* Botão de sair foi removido daqui – agora está na página Configurações */}
          </div>

          {/* PAINEL DE NOTIFICAÇÕES */}
          {showNotifications && (
            <div
              className={cn(
                "absolute right-4 top-16 z-50 w-96 overflow-hidden rounded-3xl border p-4 shadow-2xl backdrop-blur",
                isDark
                  ? "border-zinc-800/80 bg-gradient-to-b from-[#0b0f24]/95 via-[#070a19]/95 to-[#050611]/95"
                  : "border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white"
              )}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-8 right-0 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl" />
                <div className="absolute -bottom-10 left-0 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl" />
              </div>
              <div className="relative mb-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] uppercase tracking-[0.3em]",
                        isDark
                          ? "border-white/10 bg-white/5 text-purple-200"
                          : "border-purple-200 bg-purple-50 text-purple-700"
                      )}
                    >
                      Central de alertas
                    </Badge>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] text-zinc-500">
                      Atualiza automaticamente
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fetchNotifications(false)}
                        className={cn(
                          "rounded-full px-3 py-1 text-[11px] font-semibold transition",
                          isDark
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30"
                            : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
                        )}
                      >
                        Atualizar
                      </button>
                      <button
                        type="button"
                        onClick={handleClearNotifications}
                        disabled={clearingNotifications}
                        className={cn(
                          "rounded-full px-3 py-1 text-[11px] font-semibold transition",
                          clearingNotifications
                            ? "cursor-not-allowed opacity-60"
                            : isDark
                              ? "border border-white/20 text-zinc-200 hover:bg-white/10"
                              : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        Limpar
                      </button>
                    </div>
                  </div>
                </div>
                {notificationsError && (
                  <div className="rounded-2xl border border-rose-500/40 bg-rose-500/15 px-3 py-2 text-xs text-rose-100">
                    {notificationsError}
                  </div>
                )}
              </div>

              <div className="relative max-h-80 space-y-3 overflow-y-auto text-xs pr-1">
                {notificationsLoading && notifications.length === 0 ? (
                  <p className="text-[11px] text-zinc-500">
                    Carregando notificações...
                  </p>
                ) : notifications.length === 0 ? (
                  <p className="text-[11px] text-zinc-500">
                    Nenhuma notificação recente.
                  </p>
                ) : (
                  notifications.map((notification) => (
                    (() => {
                      const actionLink =
                        notification.type === "action_request_received" &&
                        notification.payload &&
                        typeof notification.payload.requestId === "number"
                          ? `/fila-aprovacoes#request-${notification.payload.requestId}`
                          : null;
                      const meta = getNotificationMeta(notification.type);
                      const content = (
                        <>
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                              {new Date(notification.created_at).toLocaleString(
                                "pt-BR",
                                { timeZone: "America/Sao_Paulo" }
                              )}
                            </p>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px]",
                                meta.badgeClass,
                                notification.is_read &&
                                  (isDark
                                    ? "border-zinc-700/60 text-zinc-400"
                                    : "border-slate-200 text-slate-500")
                              )}
                            >
                              {meta.label}
                            </Badge>
                          </div>
                          <p
                            className={cn(
                              "text-sm font-semibold",
                              isDark ? "text-zinc-100" : "text-slate-900"
                            )}
                          >
                            {notification.title}
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            {notification.message}
                          </p>
                          {actionLink && (
                            <span className="text-[10px] font-semibold text-purple-300 underline">
                              Abrir solicitação
                            </span>
                          )}
                        </>
                      );
                      const baseClasses = cn(
                        "relative block overflow-hidden rounded-2xl border px-4 py-3 transition",
                        notification.is_read
                          ? isDark
                            ? "border-zinc-800/70 bg-zinc-900/40"
                            : "border-slate-200 bg-white/70"
                          : isDark
                            ? "border-white/10 bg-white/5"
                            : "border-purple-200 bg-purple-50/80",
                        "hover:border-purple-400/60 hover:shadow-lg"
                      );
                      const card = (
                        <>
                          <div
                            className={cn(
                              "pointer-events-none absolute inset-0 opacity-50",
                              `bg-gradient-to-r ${meta.accent}`
                            )}
                          />
                          <div className="relative">{content}</div>
                        </>
                      );
                      return actionLink ? (
                        <Link key={notification.id} href={actionLink} className={baseClasses}>
                          {card}
                        </Link>
                      ) : (
                        <div key={notification.id} className={baseClasses}>
                          {card}
                        </div>
                      );
                    })()
                  ))
                )}
              </div>
            </div>
          )}
        </header>

        <main
          className={cn(
            "flex-1 overflow-auto px-4 py-4 md:px-6 md:py-6",
            isDark
              ? "bg-gradient-to-b from-[#050816] via-[#050816] to-[#02010d]"
              : "bg-gradient-to-b from-slate-100 via-slate-100 to-slate-200"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

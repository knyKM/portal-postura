"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Terminal,
  Settings,
  Sun,
  Moon,
  Search,
  Users,
  Workflow,
  ClipboardCheck,
  History,
  KanbanSquare,
  Activity,
  Sparkles,
  Blocks,
  NotebookPen,
} from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";

type SidebarProps = {
  isCollapsed: boolean;
  onToggle: () => void;
};

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  requiresAdmin?: boolean;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/vulnerabilidades/insights" },
  { label: "Ações", icon: Workflow, href: "/acoes" },
  {
    label: "Playbooks",
    icon: Blocks,
    href: "/playbooks",
  },
  { label: "Ferramentas", icon: Terminal, href: "/ferramentas" },
  { label: "Auditoria", icon: Activity, href: "/auditoria" },
  {
    label: "Sugestões",
    icon: Sparkles,
    href: "/sugestoes",
    requiresAdmin: true,
  },
  { label: "Kanban", icon: KanbanSquare, href: "/kanban" },
  {
    label: "Fila de Aprovações",
    icon: ClipboardCheck,
    href: "/fila-aprovacoes",
    requiresAdmin: true,
  },
  { label: "Usuários", icon: Users, href: "/usuarios" },
  { label: "Changelog", icon: History, href: "/changelog" },
  { label: "Manual", icon: NotebookPen, href: "/changelog/manual" },
  { label: "Configurações", icon: Settings, href: "/configuracoes" },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const raw = window.localStorage.getItem("postura_user");
      if (!raw) return false;
      const parsed = JSON.parse(raw) as { role?: string };
      return parsed?.role === "admin";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    function handleStorage(event: StorageEvent) {
      if (event.key && event.key !== "postura_user") return;
      try {
        const value = event.newValue ?? window.localStorage.getItem("postura_user");
        if (!value) {
          setIsAdmin(false);
          return;
        }
        const parsed = JSON.parse(value) as { role?: string };
        setIsAdmin(parsed?.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const mainItems = navItems.filter(
    (i) =>
      i.label !== "Configurações" &&
      i.label !== "Changelog" &&
      i.label !== "Manual" &&
      (!i.requiresAdmin || isAdmin)
  );
  const settingsItem = navItems.find((i) => i.label === "Configurações");
  const changelogItem = navItems.find((i) => i.label === "Changelog");
  const manualItem = navItems.find((i) => i.label === "Manual");
  const visibleNavHrefs = [
    ...mainItems.map((item) => item.href),
    ...(changelogItem ? [changelogItem.href] : []),
    ...(manualItem ? [manualItem.href] : []),
    ...(settingsItem ? [settingsItem.href] : []),
  ];

  function isRouteActive(href: string) {
    if (pathname === href) {
      return true;
    }
    if (!pathname.startsWith(href + "/")) {
      return false;
    }
    const hasMoreSpecificMatch = visibleNavHrefs.some(
      (otherHref) =>
        otherHref !== href &&
        pathname.startsWith(otherHref) &&
        otherHref.length > href.length
    );
    return !hasMoreSpecificMatch;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-screen flex-col border-r transition-[width,background-color,border-color] duration-300",
          isDark ? "border-zinc-800 bg-[#050814]" : "border-zinc-200 bg-slate-50",
          isCollapsed ? "w-[80px]" : "w-64"
        )}
      >
        {/* TOPO: LOGO + NOME */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <Image
                src="/logo_vivo_sem_fundo.png"
                alt="Postura"
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
            {!isCollapsed && (
              <span
                className={cn(
                  "text-lg font-bold tracking-tight",
                  isDark ? "text-zinc-100" : "text-slate-900"
                )}
              >
                Postura SM
              </span>
            )}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className={cn(
                  "h-8 w-8 rounded-lg border bg-transparent",
                  isDark
                    ? "border-zinc-800 hover:bg-[#0b1020]"
                    : "border-slate-200 hover:bg-slate-100"
                )}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isCollapsed ? "Expandir menu" : "Recolher menu"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div
          className={cn(
            "mb-2 border-b",
            isDark ? "border-zinc-800" : "border-slate-200"
          )}
        />

        {/* BUSCA */}
        {!isCollapsed ? (
          <div className="px-3 pb-3">
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3",
                isDark
                  ? "border-zinc-800 bg-[#050816]"
                  : "border-slate-200 bg-white"
              )}
            >
              <Search className="h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Buscar..."
                className="h-9 border-none bg-transparent p-0 text-sm shadow-none outline-none focus-visible:ring-0"
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center pb-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9 rounded-xl",
                    isDark
                      ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Buscar</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* NAVEGAÇÃO PRINCIPAL */}
        <nav className="flex-1 space-y-1 px-2">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = isRouteActive(item.href);

            if (!isCollapsed) {
              const button = (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "group flex w-full items-center justify-start gap-3 rounded-xl px-3 py-2 text-sm font-medium tracking-tight transition-all duration-150",
                    isActive
                      ? "bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-md"
                      : isDark
                      ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );

              return (
                <Link key={item.href} href={item.href}>
                  {button}
                </Link>
              );
            }

            const collapsedButton = (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-150",
                  isActive
                    ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md"
                    : isDark
                    ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href} className="flex justify-center py-1">
                    {collapsedButton}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* CHANGES + CONFIG BOTTOM */}
        {(settingsItem || changelogItem || manualItem) && (
          <div className="px-2 pb-2 space-y-2">
            <div
              className={cn(
                "mb-2 border-t",
                isDark ? "border-zinc-800" : "border-slate-200"
              )}
            />
            {[changelogItem, manualItem, settingsItem]
              .filter(Boolean)
              .map((item) => {
                if (!item) return null;
                const isActive = isRouteActive(item.href);
                const ButtonContent = () => (
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "flex w-full items-center justify-start gap-3 rounded-xl px-3 py-2 text-sm font-medium tracking-tight transition-all duration-150",
                      isActive
                        ? "bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-md"
                        : isDark
                        ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );

                if (!isCollapsed) {
                  return (
                    <Link key={item.href} href={item.href}>
                      <ButtonContent />
                    </Link>
                  );
                }

                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className="flex justify-center py-1"
                      >
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-150",
                            isActive
                              ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md"
                              : isDark
                              ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
          </div>
        )}

        {/* RODAPÉ */}
        <div
          className={cn(
            "border-t px-3 py-3 text-[11px]",
            isDark
              ? "border-zinc-800 text-zinc-500"
              : "border-slate-200 text-slate-500"
          )}
        >
          {!isCollapsed ? (
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-1">
                <p
                  className={cn(
                    "font-medium",
                    isDark ? "text-zinc-400" : "text-slate-700"
                  )}
                >
                  Postura Security Management
                </p>
                <p>v1.4.0</p>
              </div>

              {/* Botão tema claro/escuro */}
              <button
                onClick={toggleTheme}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-all duration-200",
                  isDark
                    ? "border-zinc-700 bg-[#050816] text-zinc-100 hover:bg-zinc-900"
                    : "border-slate-300 bg-white text-yellow-400 hover:bg-slate-100"
                )}
              >
                {isDark ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-medium">Postura SM</span>
              <button
                onClick={toggleTheme}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-[10px] transition-all duration-200",
                  isDark
                    ? "border-zinc-700 bg-[#050816] text-zinc-100 hover:bg-zinc-900"
                    : "border-slate-300 bg-white text-yellow-400 hover:bg-slate-100"
                )}
              >
                {isDark ? (
                  <Moon className="h-3 w-3" />
                ) : (
                  <Sun className="h-3 w-3" />
                )}
              </button>
              <span className="text-[9px]">v1.4.0</span>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Shield, UserPlus, Users, UserRound } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { createPortal } from "react-dom";

const roleOptions = [
  { value: "admin", label: "Administrador" },
  { value: "analista", label: "Analista" },
  { value: "leitor", label: "Leitor" },
];

const roleDescriptions: Record<string, string> = {
  admin: "Acesso total ao Postura Security Management.",
  analista: "Gerencia vulnerabilidades, integrações e fluxos.",
  leitor: "Visibilidade para auditorias e squads parceiras.",
};

type CreatedUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  security_level: string;
  created_at?: string;
  is_active: boolean;
};

type ApiUserResponse = {
  id: number;
  name: string;
  email: string;
  role: string;
  security_level?: string;
  created_at?: string;
  is_active?: boolean;
};

type SecurityLevel = {
  key: string;
  name: string;
  description: string | null;
  allowedRoutes?: string[];
  createdAt: string;
};

const securityRouteOptions = [
  { label: "Vulnerabilidades", value: "/vulnerabilidades" },
  { label: "Ações", value: "/acoes" },
  { label: "Playbooks", value: "/playbooks" },
  { label: "Ferramentas", value: "/ferramentas" },
  { label: "Auditoria", value: "/auditoria" },
  { label: "Sugestões/Problemas", value: "/sugestoes-problemas" },
  { label: "Sugestões Postura SM", value: "/sugestoes" },
  { label: "Sugestões Jira", value: "/sugestoes/jira" },
  { label: "Fila de Aprovações", value: "/fila-aprovacoes" },
  { label: "Usuários", value: "/usuarios" },
];

function generatePassword() {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < 16; i += 1) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

export default function UsuariosPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("analista");
  const [securityLevel, setSecurityLevel] = useState("padrao");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<CreatedUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersActionError, setUsersActionError] = useState<string | null>(null);
  const [usersActionMessage, setUsersActionMessage] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [securityEdits, setSecurityEdits] = useState<Record<number, string>>({});
  const [updatingSecurityId, setUpdatingSecurityId] = useState<number | null>(null);
  const [securityLevels, setSecurityLevels] = useState<SecurityLevel[]>([]);
  const [levelsLoading, setLevelsLoading] = useState(false);
  const [levelsError, setLevelsError] = useState<string | null>(null);
  const [newLevelName, setNewLevelName] = useState("");
  const [newLevelDescription, setNewLevelDescription] = useState("");
  const [newLevelRoutes, setNewLevelRoutes] = useState<string[]>(
    securityRouteOptions.map((option) => option.value)
  );
  const [editingLevelKey, setEditingLevelKey] = useState<string | null>(null);
  const [editingLevelName, setEditingLevelName] = useState("");
  const [editingLevelDescription, setEditingLevelDescription] = useState("");
  const [editingLevelRoutes, setEditingLevelRoutes] = useState<string[]>([]);
  const [deletingLevelKey, setDeletingLevelKey] = useState<string | null>(null);
  const [editingLevelLoading, setEditingLevelLoading] = useState(false);
  const [creatingLevel, setCreatingLevel] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const isEditingLevel = Boolean(editingLevelKey);
  const portalTarget = typeof window !== "undefined" ? document.body : null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("postura_user");
      if (!raw) {
        router.replace("/login");
        return;
      }
      const parsed = JSON.parse(raw) as { role?: string; id?: number };
      const userRole = parsed?.role ?? "analista";
      setCurrentRole(userRole);
      setCurrentUserId(typeof parsed?.id === "number" ? parsed.id : null);
      if (userRole !== "admin") {
        setAccessDenied(true);
      }
    } catch {
      setAccessDenied(true);
    } finally {
      setLoadingRole(false);
    }
  }, [router]);

  useEffect(() => {
    if (loadingRole) return;
    if (accessDenied) return;
    if (currentRole !== "admin") return;

    setLoadingUsers(true);
    setUsersError(null);
    setUsersActionError(null);
    setUsersActionMessage(null);
    fetch("/api/users")
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        if (data?.error) {
          throw new Error(data.error);
        }
        const fetchedUsers = Array.isArray(data?.users)
          ? (data.users as ApiUserResponse[])
          : [];
        setUsers(
          fetchedUsers.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            security_level: user.security_level ?? "padrao",
            created_at: user.created_at,
            is_active: Boolean(user.is_active),
          }))
        );
        setSecurityEdits(
          fetchedUsers.reduce<Record<number, string>>((acc, user) => {
            acc[user.id] = user.security_level ?? "padrao";
            return acc;
          }, {})
        );
      })
      .catch((err) => {
        setUsersError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar os usuários."
        );
      })
      .finally(() => setLoadingUsers(false));
  }, [loadingRole, accessDenied, currentRole]);

  useEffect(() => {
    if (loadingRole || accessDenied || currentRole !== "admin") return;
    setLevelsLoading(true);
    setLevelsError(null);
    fetch("/api/security-levels")
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        if (data?.error) {
          throw new Error(data.error);
        }
        const levels = Array.isArray(data?.levels) ? (data.levels as SecurityLevel[]) : [];
        setSecurityLevels(levels);
        if (levels.length > 0) {
          setSecurityLevel(levels[0].key);
        }
      })
      .catch((err) => {
        setLevelsError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar níveis."
        );
      })
      .finally(() => setLevelsLoading(false));
  }, [loadingRole, accessDenied, currentRole]);

  useEffect(() => {
    if (!isSecurityModalOpen) return;
    setNewLevelRoutes(securityRouteOptions.map((option) => option.value));
  }, [isSecurityModalOpen]);

  function handleGeneratePassword() {
    const newPassword = generatePassword();
    setPassword(newPassword);
    setGeneratedPassword(newPassword);
    setError(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, securityLevel }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Falha ao criar usuário.");
      }

      if (!data?.user) {
        throw new Error("Resposta inválida do servidor.");
      }

      const creationTimestamp =
        typeof data?.user?.created_at === "string"
          ? data.user.created_at
          : new Date().toISOString();

      const normalizedUser: CreatedUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        security_level: data.user.security_level ?? securityLevel,
        is_active: Boolean(data.user.is_active),
        created_at: creationTimestamp,
      };

      setCreatedUser(normalizedUser);
      if (!generatedPassword) {
        setGeneratedPassword(password);
      }
      setName("");
      setEmail("");
      setPassword("");
      setRole("analista");
      setSecurityLevel("padrao");
      setUsers((prev) => [normalizedUser, ...prev]);
    } catch (err) {
      setCreatedUser(null);
      setGeneratedPassword(null);
      setError(
        err instanceof Error ? err.message : "Não foi possível registrar o usuário."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateSecurityLevel() {
    if (creatingLevel) return;
    setLevelsError(null);
    setCreatingLevel(true);
    try {
      const response = await fetch("/api/security-levels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newLevelName,
          description: newLevelDescription,
          allowedRoutes: newLevelRoutes,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao criar nível.");
      }
      const created = data?.level as SecurityLevel | undefined;
      if (created) {
        setSecurityLevels((prev) => [...prev, created]);
        setSecurityLevel(created.key);
        setNewLevelName("");
        setNewLevelDescription("");
        setNewLevelRoutes(securityRouteOptions.map((option) => option.value));
      }
    } catch (err) {
      setLevelsError(
        err instanceof Error ? err.message : "Não foi possível criar nível."
      );
    } finally {
      setCreatingLevel(false);
    }
  }

  async function handleUpdateSecurityLevel() {
    if (!editingLevelKey || editingLevelLoading) return;
    setLevelsError(null);
    setEditingLevelLoading(true);
    try {
      const response = await fetch("/api/security-levels", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: editingLevelKey,
          name: editingLevelName,
          description: editingLevelDescription,
          allowedRoutes: editingLevelRoutes,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao atualizar nível.");
      }
      const updated = data?.level as SecurityLevel | undefined;
      if (updated) {
        setSecurityLevels((prev) =>
          prev.map((level) => (level.key === updated.key ? updated : level))
        );
      }
      setEditingLevelKey(null);
      setEditingLevelName("");
      setEditingLevelDescription("");
      setEditingLevelRoutes([]);
    } catch (err) {
      setLevelsError(
        err instanceof Error ? err.message : "Não foi possível atualizar nível."
      );
    } finally {
      setEditingLevelLoading(false);
    }
  }

  async function handleSecurityLevelSubmit(event: FormEvent) {
    event.preventDefault();
    if (isEditingLevel) {
      await handleUpdateSecurityLevel();
      return;
    }
    await handleCreateSecurityLevel();
  }

  async function handleDeleteSecurityLevel(key: string) {
    if (editingLevelLoading) return;
    setLevelsError(null);
    setEditingLevelLoading(true);
    try {
      const response = await fetch("/api/security-levels", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao excluir nível.");
      }
      setSecurityLevels((prev) => prev.filter((level) => level.key !== key));
      setDeletingLevelKey(null);
    } catch (err) {
      setLevelsError(
        err instanceof Error ? err.message : "Não foi possível excluir nível."
      );
    } finally {
      setEditingLevelLoading(false);
    }
  }

  async function handleToggleUserStatus(userId: number, isActive: boolean) {
    if (accessDenied) return;
    if (isActive && currentUserId && currentUserId === userId) {
      setUsersActionMessage(null);
      setUsersActionError("Você não pode inativar o próprio usuário conectado.");
      return;
    }

    setUsersActionError(null);
    setUsersActionMessage(null);
    setUpdatingUserId(userId);

    try {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !isActive }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível atualizar o usuário.");
      }

      const updatedStatus = Boolean(data?.user?.is_active);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, is_active: updatedStatus } : user
        )
      );

      setUsersActionMessage(
        updatedStatus
          ? "Usuário reativado com sucesso."
          : "Usuário inativado com sucesso."
      );
    } catch (err) {
      setUsersActionError(
        err instanceof Error
          ? err.message
          : "Não foi possível alterar o status do usuário."
      );
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function handleUpdateUserSecurityLevel(userId: number) {
    const nextLevel = securityEdits[userId];
    if (!nextLevel) return;
    setUsersActionError(null);
    setUsersActionMessage(null);
    setUpdatingSecurityId(userId);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ securityLevel: nextLevel }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível atualizar o nível.");
      }
      const updatedLevel =
        typeof data?.user?.security_level === "string"
          ? data.user.security_level
          : nextLevel;
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, security_level: updatedLevel }
            : user
        )
      );
      setUsersActionMessage("Nível de segurança atualizado com sucesso.");
    } catch (err) {
      setUsersActionError(
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar o nível."
      );
    } finally {
      setUpdatingSecurityId(null);
    }
  }

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.is_active).length;
  const inactiveUsers = Math.max(totalUsers - activeUsers, 0);
  const roleCounts = users.reduce<Record<string, number>>((acc, user) => {
    acc[user.role] = (acc[user.role] ?? 0) + 1;
    return acc;
  }, {});

  const adminCount = roleCounts.admin ?? 0;
  const analystCount = roleCounts.analista ?? 0;
  const readerCount = roleCounts.leitor ?? 0;

  const highlightCards = [
    {
      label: "Usuários ativos",
      value: activeUsers,
      helper:
        totalUsers > 0 ? `${activeUsers} de ${totalUsers} identidades` : "Nenhum cadastro ainda",
    },
    {
      label: "Administradores",
      value: adminCount,
      helper: `${analystCount} analistas · ${readerCount} leitores`,
    },
    {
      label: "Fluxo de onboarding",
      value: "Automatizado",
      helper: "Integração com aprovações e auditoria",
      accent: "from-amber-400/40 via-pink-500/40 to-purple-600/40",
    },
  ];

  return (
    <DashboardShell
      pageTitle="Cadastro de Usuários"
      pageSubtitle="Controle de identidades do Postura SM"
    >
      <div className="flex w-full flex-col gap-6 px-4 pb-10 lg:px-10">
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
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                  Central de identidades
                </p>
                <h2 className="text-2xl font-semibold">Gestão completa de usuários</h2>
                <p className="text-sm text-zinc-400">
                  Centralize perfis, permissões e status de ativação com visual consistente do Postura.
                </p>
              </div>
            </div>
            <div
              className={cn(
                "rounded-2xl border px-4 py-3 text-sm",
                isDark
                  ? "border-purple-500/30 bg-purple-500/5 text-purple-200"
                  : "border-purple-200 bg-purple-50 text-purple-700"
              )}
            >
              {activeUsers} usuários ativos · {inactiveUsers} aguardando reativação
            </div>
          </div>
          <div className="mt-4 grid gap-3 text-xs text-zinc-200 sm:grid-cols-3">
            <div
              className={cn(
                "rounded-2xl border px-4 py-3",
                isDark
                  ? "border-white/5 bg-white/5 text-zinc-100"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              )}
            >
              <p className="uppercase tracking-[0.3em] text-purple-300">Perfis ativos</p>
              <p className="text-base font-semibold">{activeUsers}</p>
            </div>
            <div
              className={cn(
                "rounded-2xl border px-4 py-3",
                isDark
                  ? "border-white/5 bg-white/5 text-zinc-100"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              )}
            >
              <p className="uppercase tracking-[0.3em] text-purple-300">Aguardando ação</p>
              <p className="text-base font-semibold">{inactiveUsers}</p>
            </div>
            <div
              className={cn(
                "rounded-2xl border px-4 py-3",
                isDark
                  ? "border-white/5 bg-white/5 text-zinc-100"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              )}
            >
              <p className="uppercase tracking-[0.3em] text-purple-300">Identidades</p>
              <p className="text-base font-semibold">{totalUsers || "Sem cadastros"}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {highlightCards.map((card) => (
            <div
              key={card.label}
              className={cn(
                "rounded-2xl border px-4 py-4",
                card.accent
                  ? `border-transparent bg-gradient-to-br ${card.accent} text-white`
                  : isDark
                  ? "border-zinc-800 bg-[#050816]/80 text-zinc-200"
                  : "border-slate-200 bg-white text-slate-600"
              )}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em]">
                {card.label}
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {typeof card.value === "number" ? card.value : card.value}
              </p>
              <p
                className={cn(
                  "text-xs",
                  card.accent
                    ? "text-white/70"
                    : isDark
                    ? "text-zinc-400"
                    : "text-slate-500"
                )}
              >
                {card.helper}
              </p>
            </div>
          ))}
        </div>

        {!accessDenied && (
          <Card
            className={cn(
              "rounded-3xl border",
              isDark
                ? "border-zinc-800 bg-[#050816]/80"
                : "border-slate-200 bg-white"
            )}
          >
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                  <Users className="h-5 w-5" />
                </span>
                <div>
                  <CardTitle className="text-lg">Usuários cadastrados</CardTitle>
                  <p className="text-sm text-zinc-500">
                    Visão geral dos perfis criados na plataforma.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-zinc-700 text-xs text-zinc-200 hover:bg-zinc-800"
                  onClick={() => setIsSecurityModalOpen(true)}
                >
                  Níveis de segurança
                </Button>
                <Button
                  type="button"
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white"
                  onClick={() => setIsUserModalOpen(true)}
                >
                  Novo usuário
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-300">
              {usersError && (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">
                  {usersError}
                </div>
              )}
              {usersActionError && (
                <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs text-amber-100">
                  {usersActionError}
                </div>
              )}
              {usersActionMessage && (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
                  {usersActionMessage}
                </div>
              )}
              {loadingUsers ? (
                <p className="text-xs text-zinc-500">Carregando usuários...</p>
              ) : users.length === 0 ? (
                <p className="text-xs text-zinc-500">
                  Nenhum usuário registrado até o momento.
                </p>
              ) : (
                <div
                  className={cn(
                    "overflow-x-auto rounded-2xl border",
                    isDark ? "border-zinc-800" : "border-slate-200"
                  )}
                >
                  <table className="min-w-full text-left text-xs">
                    <thead
                      className={cn(
                        isDark ? "bg-[#040414] text-zinc-400" : "bg-slate-100 text-slate-600"
                      )}
                    >
                      <tr>
                        <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">
                          Nome
                        </th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">
                          E-mail
                        </th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">
                          Perfil
                        </th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">
                          Nível de segurança
                        </th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">
                          Status
                        </th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">
                          Criado em
                        </th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className={cn(isDark ? "bg-[#050816]" : "bg-white")}>
                      {users.map((userItem) => (
                        <tr
                          key={userItem.id}
                          className={cn(
                            "border-t",
                            isDark ? "border-zinc-800/60" : "border-slate-200"
                          )}
                        >
                          <td
                            className={cn(
                              "px-4 py-3 font-medium",
                              isDark ? "text-zinc-100" : "text-slate-800"
                            )}
                          >
                            {userItem.name}
                          </td>
                          <td
                            className={cn(
                              "px-4 py-3 font-mono text-[11px]",
                              isDark ? "text-zinc-400" : "text-slate-500"
                            )}
                          >
                            {userItem.email}
                          </td>
                          <td
                            className={cn(
                              "px-4 py-3 capitalize",
                              isDark ? "text-zinc-300" : "text-slate-600"
                            )}
                          >
                            {userItem.role}
                          </td>
                          <td className="px-4 py-3 text-zinc-400">
                            {accessDenied ? (
                              securityLevels.find(
                                (level) => level.key === userItem.security_level
                              )?.name ?? userItem.security_level
                            ) : (
                              <div className="flex items-center gap-2">
                                <select
                                  value={securityEdits[userItem.id] ?? userItem.security_level}
                                  onChange={(event) =>
                                    setSecurityEdits((prev) => ({
                                      ...prev,
                                      [userItem.id]: event.target.value,
                                    }))
                                  }
                                  className={cn(
                                    "rounded-lg border bg-transparent px-2 py-1 text-[11px] focus-visible:outline-none",
                                    isDark
                                      ? "border-zinc-700 text-zinc-100"
                                      : "border-slate-200 text-slate-700"
                                  )}
                                >
                                  {securityLevels.map((level) => (
                                    <option
                                      key={level.key}
                                      value={level.key}
                                      className={cn(
                                        isDark
                                          ? "bg-[#050816] text-white"
                                          : "bg-white text-slate-700"
                                      )}
                                    >
                                      {level.name}
                                    </option>
                                  ))}
                                </select>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="rounded-lg border-zinc-700 text-[11px] text-zinc-200 hover:bg-zinc-800"
                                  disabled={updatingSecurityId === userItem.id}
                                  onClick={() => handleUpdateUserSecurityLevel(userItem.id)}
                                >
                                  {updatingSecurityId === userItem.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    "Salvar"
                                  )}
                                </Button>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                                userItem.is_active
                                  ? "bg-emerald-500/10 text-emerald-300"
                                  : "bg-zinc-700/40 text-zinc-400"
                              )}
                            >
                              {userItem.is_active ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-400">
                            {userItem.created_at
                              ? new Date(userItem.created_at).toLocaleString(
                                  "pt-BR",
                                  { }
                                )
                              : "-"}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="rounded-xl border-zinc-700 text-xs text-zinc-200 hover:bg-zinc-800"
                              disabled={
                                updatingUserId === userItem.id ||
                                (currentUserId === userItem.id && userItem.is_active)
                              }
                              onClick={() =>
                                handleToggleUserStatus(
                                  userItem.id,
                                  userItem.is_active
                                )
                              }
                            >
                              {updatingUserId === userItem.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : userItem.is_active ? (
                                "Inativar"
                              ) : (
                                "Reativar"
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {createdUser && (
          <Card className="rounded-3xl border border-emerald-700/60 bg-emerald-500/10">
            <CardHeader className="flex flex-row items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/80 text-white">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <CardTitle className="text-base text-emerald-200">
                  Usuário criado com sucesso
                </CardTitle>
                <p className="text-xs text-emerald-200/70">
                  Compartilhe a senha de forma segura.
                </p>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-emerald-100 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-500/40 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                  Nome
                </p>
                <p className="text-lg font-semibold">{createdUser.name}</p>
              </div>
              <div className="rounded-2xl border border-emerald-500/40 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                  E-mail
                </p>
                <p className="font-mono text-base">{createdUser.email}</p>
              </div>
              <div className="rounded-2xl border border-emerald-500/40 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                  Perfil
                </p>
                <p className="font-semibold capitalize">{createdUser.role}</p>
              </div>
              <div className="rounded-2xl border border-emerald-500/40 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                  Nível de segurança
                </p>
                <p className="font-semibold">
                  {securityLevels.find((level) => level.key === createdUser.security_level)
                    ?.name ?? createdUser.security_level}
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-500/40 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                  Status
                </p>
                <p className="font-semibold">
                  {createdUser.is_active ? "Ativo" : "Inativo"}
                </p>
              </div>
              {generatedPassword && (
                <div className="rounded-2xl border border-emerald-500/40 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                    Senha atribuída
                  </p>
                  <p className="font-mono text-base">{generatedPassword}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card
          className={cn(
            "rounded-3xl border",
            isDark ? "border-zinc-800 bg-[#050816]/80" : "border-slate-200 bg-white"
          )}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600/70 text-white">
                <Shield className="h-4 w-4" />
              </span>
              <CardTitle className="text-base">Perfis disponíveis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {roleOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "rounded-2xl border px-4 py-3",
                  isDark
                    ? "border-dashed border-zinc-700 text-zinc-100"
                    : "border-dashed border-slate-200 text-slate-700"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{option.label}</p>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-xs font-semibold",
                      isDark
                        ? "border-white/10 text-zinc-300"
                        : "border-slate-200 text-slate-600"
                    )}
                  >
                    {roleCounts[option.value] ?? 0}
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-1 text-sm",
                    isDark ? "text-zinc-400" : "text-slate-500"
                  )}
                >
                  {roleDescriptions[option.value] ?? "Perfil disponível no sistema."}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {portalTarget && isUserModalOpen &&
          createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div
                className={cn(
                  "w-full max-w-3xl rounded-3xl border p-6",
                  isDark ? "border-zinc-800 bg-[#050816]" : "border-slate-200 bg-white"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg">
                      <UserPlus className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                        Novo usuário
                      </p>
                      <h3 className="text-xl font-semibold">
                        Defina o perfil e o nível de segurança
                      </h3>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsUserModalOpen(false)}
                  >
                    Fechar
                  </Button>
                </div>
                <div className="mt-4">
                  {accessDenied && !loadingRole && (
                    <div className="mb-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                      Seu perfil atual ({currentRole ?? "desconhecido"}) não possui permissão para criar usuários. Solicite a um administrador.
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">
                        Nome completo
                      </label>
                      <Input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Digite o nome do colaborador"
                        disabled={accessDenied}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">
                        E-mail corporativo
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="usuario@postura.com"
                        disabled={accessDenied}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">
                        Senha
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={password}
                          onChange={(event) => {
                            setPassword(event.target.value);
                            setGeneratedPassword(null);
                          }}
                          placeholder="Clique em gerar ou informe manualmente"
                          disabled={accessDenied}
                          required
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleGeneratePassword}
                          className="shrink-0 rounded-xl bg-zinc-800 text-xs text-white hover:bg-zinc-700"
                          disabled={accessDenied}
                        >
                          Gerar
                        </Button>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Mínimo de 8 caracteres. Senhas geradas têm 16 caracteres.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">
                        Perfil do usuário
                      </label>
                      <div
                        className={cn(
                          "rounded-2xl border",
                          isDark
                            ? "border-zinc-700 bg-[#050816]"
                            : "border-slate-200 bg-white",
                          accessDenied && "opacity-60"
                        )}
                      >
                        <select
                          value={role}
                          onChange={(event) => setRole(event.target.value)}
                          disabled={accessDenied}
                          className={cn(
                            "w-full rounded-2xl bg-transparent px-3 py-2 text-sm focus-visible:outline-none disabled:cursor-not-allowed",
                            isDark ? "text-zinc-100" : "text-slate-700"
                          )}
                        >
                          {roleOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              className={cn(
                                isDark ? "bg-[#050816] text-white" : "bg-white text-slate-700"
                              )}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Usaremos esse perfil para permissões futuras.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">
                        Nível de segurança
                      </label>
                      <div
                        className={cn(
                          "rounded-2xl border",
                          isDark
                            ? "border-zinc-700 bg-[#050816]"
                            : "border-slate-200 bg-white",
                          accessDenied && "opacity-60"
                        )}
                      >
                        <select
                          value={securityLevel}
                          onChange={(event) => setSecurityLevel(event.target.value)}
                          disabled={accessDenied || levelsLoading}
                          className={cn(
                            "w-full rounded-2xl bg-transparent px-3 py-2 text-sm focus-visible:outline-none disabled:cursor-not-allowed",
                            isDark ? "text-zinc-100" : "text-slate-700"
                          )}
                        >
                          {securityLevels.map((level) => (
                            <option
                              key={level.key}
                              value={level.key}
                              className={cn(
                                isDark ? "bg-[#050816] text-white" : "bg-white text-slate-700"
                              )}
                            >
                              {level.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Esses níveis serão usados para controlar acesso a módulos.
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      {error && (
                        <div className="rounded-2xl border border-rose-500/60 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                          {error}
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting || accessDenied || loadingRole}
                        className={cn(
                          "w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-semibold text-white shadow-lg",
                          isSubmitting && "opacity-70"
                        )}
                      >
                        {isSubmitting ? "Registrando..." : "Cadastrar usuário"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>,
            portalTarget
          )}

        {portalTarget && isSecurityModalOpen &&
          createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div
                className={cn(
                  "w-full max-w-4xl rounded-3xl border p-6",
                  isDark ? "border-zinc-800 bg-[#050816]" : "border-slate-200 bg-white"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg">
                      <Shield className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
                        Níveis de segurança
                      </p>
                      <h3 className="text-xl font-semibold">
                        Organize acessos por módulos
                      </h3>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsSecurityModalOpen(false)}
                  >
                    Fechar
                  </Button>
                </div>
                <div className="mt-4 space-y-4">
                  {levelsError && (
                    <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">
                      {levelsError}
                    </div>
                  )}
                  <form
                    onSubmit={handleSecurityLevelSubmit}
                    className="grid gap-3 md:grid-cols-3"
                  >
                    {isEditingLevel && (
                      <div
                        className={cn(
                          "md:col-span-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border px-3 py-2 text-xs",
                          isDark
                            ? "border-purple-500/40 bg-purple-500/10 text-purple-200"
                            : "border-purple-200 bg-purple-50 text-purple-700"
                        )}
                      >
                        <span>
                          Editando nível:{" "}
                          <strong className="font-semibold">
                            {editingLevelName || editingLevelKey}
                          </strong>
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingLevelKey(null);
                            setEditingLevelName("");
                            setEditingLevelDescription("");
                            setEditingLevelRoutes([]);
                          }}
                        >
                          Cancelar edição
                        </Button>
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">
                        Nome do nível
                      </label>
                      <Input
                        value={isEditingLevel ? editingLevelName : newLevelName}
                        onChange={(event) =>
                          isEditingLevel
                            ? setEditingLevelName(event.target.value)
                            : setNewLevelName(event.target.value)
                        }
                        placeholder="Ex: Operacional"
                        disabled={creatingLevel || editingLevelLoading}
                        required
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-semibold text-zinc-400">
                        Descrição
                      </label>
                      <Input
                        value={
                          isEditingLevel ? editingLevelDescription : newLevelDescription
                        }
                        onChange={(event) =>
                          isEditingLevel
                            ? setEditingLevelDescription(event.target.value)
                            : setNewLevelDescription(event.target.value)
                        }
                        placeholder="Visibilidade e permissões planejadas"
                        disabled={creatingLevel || editingLevelLoading}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <p className="text-xs font-semibold text-zinc-400">
                        Módulos permitidos
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Dashboard, Configurações, Changelog e Manual são liberados para todos.
                      </p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {securityRouteOptions.map((option) => {
                          const checked = (
                            isEditingLevel ? editingLevelRoutes : newLevelRoutes
                          ).includes(option.value);
                          return (
                            <label
                              key={option.value}
                              className={cn(
                                "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs",
                                isDark
                                  ? "border-white/10 bg-white/5 text-zinc-200"
                                  : "border-slate-200 bg-white text-slate-700"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={creatingLevel || editingLevelLoading}
                                onChange={() =>
                                  isEditingLevel
                                    ? setEditingLevelRoutes((prev) =>
                                        checked
                                          ? prev.filter((value) => value !== option.value)
                                          : [...prev, option.value]
                                      )
                                    : setNewLevelRoutes((prev) =>
                                        checked
                                          ? prev.filter((value) => value !== option.value)
                                          : [...prev, option.value]
                                      )
                                }
                              />
                              <span>{option.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <Button
                        type="submit"
                        disabled={creatingLevel || editingLevelLoading}
                        className={cn(
                          "rounded-2xl text-sm font-semibold text-white",
                          isEditingLevel
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                            : "bg-gradient-to-r from-sky-500 to-blue-600"
                        )}
                      >
                        {creatingLevel || editingLevelLoading
                          ? "Salvando..."
                          : isEditingLevel
                          ? "Salvar alterações"
                          : "Criar nível de segurança"}
                      </Button>
                    </div>
                  </form>
                  <div
                    className={cn(
                      "grid gap-3 md:grid-cols-3",
                      levelsLoading && "opacity-70"
                    )}
                  >
                    {securityLevels.map((level) => (
                      <div
                        key={level.key}
                        className={cn(
                          "rounded-2xl border px-4 py-3",
                          isDark
                            ? "border-zinc-800 bg-[#040513]"
                            : "border-slate-200 bg-slate-50"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-sky-400">
                              {level.name}
                            </p>
                            <p className="mt-1 text-sm text-zinc-400">
                              {level.description ?? "Sem descrição cadastrada."}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="rounded-xl text-[11px]"
                              onClick={() => {
                                setEditingLevelKey(level.key);
                                setEditingLevelName(level.name);
                                setEditingLevelDescription(level.description ?? "");
                                setEditingLevelRoutes(level.allowedRoutes ?? []);
                                setDeletingLevelKey(null);
                              }}
                            >
                              Editar
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="rounded-xl text-[11px] text-rose-300"
                              onClick={() =>
                                setDeletingLevelKey((prev) =>
                                  prev === level.key ? null : level.key
                                )
                              }
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                        {deletingLevelKey === level.key && (
                          <div className="mt-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-100">
                            <p>Tem certeza que deseja excluir este nível?</p>
                            <div className="mt-2 flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                className="rounded-xl bg-rose-500 text-white hover:bg-rose-600"
                                onClick={() => handleDeleteSecurityLevel(level.key)}
                                disabled={editingLevelLoading}
                              >
                                Sim, excluir
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => setDeletingLevelKey(null)}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>,
            portalTarget
          )}
      </div>
    </DashboardShell>
  );
}

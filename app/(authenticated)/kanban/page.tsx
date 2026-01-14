"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PlusCircle, Sparkles, Pencil, X } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";

type UserInfo = {
  name?: string;
  email?: string;
};

type KanbanTask = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  dueDate?: string;
  completedAt?: string;
  comments?: string;
  column: BoardColumnKey;
};

const columnsConfig = {
  todo: {
    label: "A Fazer",
    badgeDark: "border-sky-500/40 bg-sky-500/10 text-sky-200",
    badgeLight: "border-sky-200 bg-sky-50 text-sky-700",
  },
  progress: {
    label: "Em Progresso",
    badgeDark: "border-amber-500/40 bg-amber-500/10 text-amber-200",
    badgeLight: "border-amber-200 bg-amber-50 text-amber-700",
  },
  done: {
    label: "Concluído",
    badgeDark: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    badgeLight: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
} as const;

type BoardColumnKey = keyof typeof columnsConfig;

type BoardState = Record<BoardColumnKey, KanbanTask[]>;

function createEmptyBoard(): BoardState {
  return {
    todo: [],
    progress: [],
    done: [],
  };
}

const columnOptions: { value: BoardColumnKey; label: string }[] = [
  { value: "todo", label: "A Fazer" },
  { value: "progress", label: "Em Progresso" },
  { value: "done", label: "Concluído" },
];

const storageKeyFor = (email: string) =>
  `postura_kanban_${email.toLowerCase()}`;

function createTaskId() {
  return `task-${Date.now()}-${Math.round(Math.random() * 9999)}`;
}

export default function KanbanPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [board, setBoard] = useState<BoardState>(() => createEmptyBoard());
  const [boardLoaded, setBoardLoaded] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newColumn, setNewColumn] = useState<BoardColumnKey>("todo");
  const [newDueDate, setNewDueDate] = useState("");
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editCompletedAt, setEditCompletedAt] = useState("");
  const [editComments, setEditComments] = useState("");
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const cardClasses = cn(
    "rounded-3xl border",
    isDark ? "border-zinc-800 bg-[#050816]/80" : "border-slate-200 bg-white"
  );
  const labelMuted = isDark ? "text-zinc-500" : "text-slate-500";
  const inputClasses = cn(
    "rounded-2xl border px-3 py-2 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-purple-500/40",
    isDark
      ? "border-zinc-700 bg-[#050818] text-zinc-100 placeholder:text-zinc-500"
      : "border-slate-300 bg-white text-slate-700 placeholder:text-slate-400"
  );
  const textareaClasses = cn(
    "min-h-[60px] rounded-2xl border px-3 py-2 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-purple-500/40",
    isDark
      ? "border-zinc-700 bg-[#050818] text-zinc-100 placeholder:text-zinc-500"
      : "border-slate-300 bg-white text-slate-700 placeholder:text-slate-400"
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("postura_user");
      if (!raw) {
        router.replace("/login");
        return;
      }
      const parsed = JSON.parse(raw) as UserInfo;
      if (!parsed?.email) {
        router.replace("/login");
        return;
      }
      setUser(parsed);
    } catch {
      router.replace("/login");
    } finally {
      setLoadingUser(false);
    }
  }, [router]);

  useEffect(() => {
    if (!user?.email) return;
    const key = storageKeyFor(user.email);
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as BoardState;
        setBoard({
          todo: Array.isArray(parsed.todo) ? parsed.todo : [],
          progress: Array.isArray(parsed.progress) ? parsed.progress : [],
          done: Array.isArray(parsed.done) ? parsed.done : [],
        });
      } catch {
        setBoard(createEmptyBoard());
      }
    } else {
      setBoard(createEmptyBoard());
    }
    setBoardLoaded(true);
  }, [user]);

  useEffect(() => {
    if (!user?.email || !boardLoaded) return;
    const key = storageKeyFor(user.email);
    localStorage.setItem(key, JSON.stringify(board));
  }, [board, boardLoaded, user]);

  const totalTasks = useMemo(
    () =>
      board.todo.length + board.progress.length + board.done.length,
    [board]
  );

  function addTask() {
    if (!newTitle.trim()) return;
    const task: KanbanTask = {
      id: createTaskId(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      createdAt: new Date().toISOString(),
      dueDate: newDueDate ? newDueDate : undefined,
      column: newColumn,
    };
    setBoard((prev) => ({
      ...prev,
      [newColumn]: [task, ...prev[newColumn]],
    }));
    setNewTitle("");
    setNewDescription("");
    setNewColumn("todo");
    setNewDueDate("");
  }

  function changeTaskColumn(task: KanbanTask, nextColumn: BoardColumnKey) {
    if (task.column === nextColumn) return;
    setBoard((prev) => {
      const updated: BoardState = {
        todo: prev.todo.filter((item) => item.id !== task.id),
        progress: prev.progress.filter((item) => item.id !== task.id),
        done: prev.done.filter((item) => item.id !== task.id),
      };
      updated[nextColumn] = [
        { ...task, column: nextColumn },
        ...updated[nextColumn],
      ];
      return updated;
    });
  }

  function updateTask(taskId: string, updater: (task: KanbanTask) => KanbanTask) {
    setBoard((prev) => {
      const next: BoardState = {
        todo: prev.todo.map((task) => (task.id === taskId ? updater(task) : task)),
        progress: prev.progress.map((task) =>
          task.id === taskId ? updater(task) : task
        ),
        done: prev.done.map((task) => (task.id === taskId ? updater(task) : task)),
      };
      return next;
    });
  }

  function openEditModal(task: KanbanTask) {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDueDate(task.dueDate ?? "");
    setEditCompletedAt(task.completedAt ?? "");
    setEditComments(task.comments ?? "");
  }

  function closeEditModal() {
    setEditingTask(null);
  }

  function saveTaskEdits() {
    if (!editingTask) return;
    updateTask(editingTask.id, (task) => ({
      ...task,
      title: editTitle.trim() || task.title,
      description: editDescription.trim(),
      dueDate: editDueDate || undefined,
      completedAt: editCompletedAt || undefined,
      comments: editComments.trim() || undefined,
    }));
    closeEditModal();
  }

  function formatDateLabel(dateString?: string) {
    if (!dateString) return null;
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) {
      return dateString;
    }
    return parsed.toLocaleDateString("pt-BR", {
      
    });
  }

  function handleDragStart(event: React.DragEvent<HTMLDivElement>, task: KanbanTask) {
    event.dataTransfer.setData("application/json", JSON.stringify(task));
    event.dataTransfer.effectAllowed = "move";
    setDraggingTaskId(task.id);
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
    targetColumn: BoardColumnKey
  ) {
    event.preventDefault();
    const payload = event.dataTransfer.getData("application/json");
    if (!payload) return;
    try {
      const task = JSON.parse(payload) as KanbanTask;
      changeTaskColumn(task, targetColumn);
      setDraggingTaskId(null);
    } catch {
      // ignore parsing errors
    }
  }

  function allowDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleCardClick(
    task: KanbanTask,
    event: React.MouseEvent<HTMLDivElement>
  ) {
    if (draggingTaskId) return;
    const target = event.target as HTMLElement;
    if (target.closest("[data-kanban-control=\"true\"]")) {
      return;
    }
    openEditModal(task);
  }

  if (loadingUser) {
    return (
      <div
        className={cn(
          "flex min-h-screen items-center justify-center text-sm",
          isDark
            ? "bg-[#050816] text-zinc-400"
            : "bg-slate-50 text-slate-500"
        )}
      >
        Carregando seu Kanban...
      </div>
    );
  }

  if (!user?.email) {
    return null;
  }

  return (
    <DashboardShell
      pageTitle="Kanban pessoal"
      pageSubtitle="Organize suas iniciativas no Postura SM"
    >
      <div className="flex w-full flex-col gap-6 px-4 lg:px-10">
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border px-6 py-6",
            isDark
              ? "border-white/5 bg-gradient-to-r from-[#0c132d] via-[#070b1f] to-[#050713] text-zinc-100"
              : "border-slate-200 bg-gradient-to-r from-white to-slate-50 text-slate-800"
          )}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl">
                <PlusCircle className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                  Workspace pessoal
                </p>
                <h2 className="text-2xl font-semibold">
                  {user.name ?? user.email}
                </h2>
                <p className={cn("text-sm", isDark ? "text-zinc-400" : "text-slate-500")}>
                  Cards salvos apenas para você. Ideal para rascunhos antes de enviar ações oficiais.
                </p>
              </div>
            </div>
            <div
              className={cn(
                "rounded-2xl border px-4 py-3 text-right text-sm",
                isDark
                  ? "border-purple-500/30 bg-purple-500/5 text-purple-200"
                  : "border-purple-200 bg-purple-50 text-purple-700"
              )}
            >
              <p>Total de cards</p>
              <p className="text-2xl font-semibold text-white">{totalTasks}</p>
            </div>
          </div>
        </div>

        <Card
          className={cn(
            "rounded-3xl border shadow-lg",
            isDark
              ? "border-white/5 bg-gradient-to-r from-[#0c132d] via-[#080b1f] to-[#050713]"
              : "border-slate-200 bg-gradient-to-r from-white to-slate-50"
          )}
        >
          <CardHeader className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
              Adicionar card
            </p>
            <CardTitle className="text-xl">Nova ideia ou tarefa</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.2em]",
                  labelMuted
                )}
              >
                Título
              </label>
              <Input
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="Ex: Refinar relatório semanal"
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <label
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.2em]",
                  labelMuted
                )}
              >
                Coluna
              </label>
              <Select
                value={newColumn}
                onValueChange={(value) =>
                  setNewColumn(value as BoardColumnKey)
                }
              >
                <SelectTrigger
                  className={cn(
                    "h-12 rounded-2xl text-sm",
                    isDark
                      ? "border border-zinc-700 bg-[#080b1f]"
                      : "border border-slate-300 bg-white"
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columnOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.2em]",
                  labelMuted
                )}
              >
                Descrição
              </label>
              <Textarea
                value={newDescription}
                onChange={(event) => setNewDescription(event.target.value)}
                placeholder="Detalhes do card"
                className={textareaClasses}
              />
            </div>
            <div className="space-y-2">
              <label
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.2em]",
                  labelMuted
                )}
              >
                Data prevista
              </label>
              <Input
                type="date"
                value={newDueDate}
                onChange={(event) => setNewDueDate(event.target.value)}
                className={inputClasses}
              />
            </div>
            <div className="md:col-span-4">
              <Button
                type="button"
                className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-semibold"
                onClick={addTask}
                disabled={!newTitle.trim()}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar card
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {(Object.keys(columnsConfig) as BoardColumnKey[]).map((columnKey) => {
            const config = columnsConfig[columnKey];
            const tasks = board[columnKey];

            const badgeClass = isDark ? config.badgeDark : config.badgeLight;
            return (
              <Card
                key={columnKey}
                className={cn(
                  "rounded-3xl border shadow-lg",
                  isDark
                    ? "border-white/5 bg-[#060818]"
                    : "border-slate-200 bg-white"
                )}
                onDragOver={allowDrop}
                onDrop={(event) => handleDrop(event, columnKey)}
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {config.label}
                    </CardTitle>
                    <p className={cn("text-xs", labelMuted)}>
                      {tasks.length} {tasks.length === 1 ? "card" : "cards"}
                    </p>
                  </div>
                  <Badge className={cn("rounded-full border", badgeClass)}>
                    {config.label}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasks.length === 0 ? (
                    <p
                      className={cn(
                        "rounded-2xl border border-dashed px-3 py-6 text-center text-xs",
                        isDark
                          ? "border-zinc-700/80 text-zinc-500"
                          : "border-slate-200 text-slate-500"
                      )}
                    >
                      Sem cards. Que tal criar um?
                    </p>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "rounded-2xl border p-4 shadow-sm transition hover:shadow-lg",
                          isDark
                            ? "border-zinc-800 bg-[#0a0f25]"
                            : "border-slate-200 bg-slate-50"
                        )}
                        draggable
                        onDragStart={(event) => handleDragStart(event, task)}
                        onDragEnd={() => setDraggingTaskId(null)}
                        onClick={(event) => handleCardClick(task, event)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p
                              className={cn(
                                "text-sm font-semibold",
                                isDark ? "text-white" : "text-slate-800"
                              )}
                            >
                              {task.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              data-kanban-control="true"
                              className={cn(
                                "rounded-xl px-3 py-1 text-xs",
                                isDark ? "text-zinc-200" : "text-slate-700"
                              )}
                              onClick={(event) => {
                                event.stopPropagation();
                                openEditModal(task);
                              }}
                            >
                              <Pencil className="mr-1 h-3 w-3" />
                              Editar
                            </Button>
                            <Select
                              value={task.column}
                              onValueChange={(value) =>
                                changeTaskColumn(task, value as BoardColumnKey)
                              }
                            >
                              <SelectTrigger
                                data-kanban-control="true"
                                className={cn(
                                  "h-9 w-fit rounded-xl text-xs",
                                  isDark
                                    ? "border border-zinc-700 bg-[#0b1025]"
                                    : "border border-slate-300 bg-white"
                                )}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {columnOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {task.description && (
                          <p
                            className={cn(
                              "mt-2 text-xs",
                              isDark ? "text-zinc-400" : "text-slate-500"
                            )}
                          >
                            {task.description}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5",
                              isDark
                                ? "bg-white/5 text-zinc-300"
                                : "bg-white text-slate-600"
                            )}
                          >
                            Criado: {formatDateLabel(task.createdAt)}
                          </span>
                          {task.dueDate && (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5",
                                isDark
                                  ? "bg-white/5 text-zinc-300"
                                  : "bg-white text-slate-600"
                              )}
                            >
                              Prazo: {formatDateLabel(task.dueDate)}
                            </span>
                          )}
                          {task.completedAt && (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5",
                                isDark
                                  ? "bg-emerald-500/10 text-emerald-200"
                                  : "bg-emerald-50 text-emerald-700"
                              )}
                            >
                              Conclusão: {formatDateLabel(task.completedAt)}
                            </span>
                          )}
                        </div>
                        {task.comments && (
                          <p
                            className={cn(
                              "mt-2 text-xs italic",
                              isDark ? "text-zinc-400" : "text-slate-500"
                            )}
                          >
                            Comentários: {task.comments}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {editingTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div
              className={cn(
                "w-full max-w-2xl rounded-3xl border p-6 shadow-2xl",
                isDark
                  ? "border-zinc-800 bg-[#040714]"
                  : "border-slate-200 bg-white"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                    Editar card
                  </p>
                  <h3
                    className={cn(
                      "text-xl font-semibold",
                      isDark ? "text-white" : "text-slate-900"
                    )}
                  >
                    {editingTask.title}
                  </h3>
                  <p className={cn("text-xs", labelMuted)}>
                    {columnsConfig[editingTask.column].label}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-2xl",
                    isDark ? "text-zinc-400" : "text-slate-600"
                  )}
                  onClick={closeEditModal}
                  aria-label="Fechar edição"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Título
                  </label>
                  <Input
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Comentários
                  </label>
                  <Textarea
                    value={editComments}
                    onChange={(event) => setEditComments(event.target.value)}
                    placeholder="Observações adicionais"
                    className={textareaClasses}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Descrição
                  </label>
                  <Textarea
                    value={editDescription}
                    onChange={(event) => setEditDescription(event.target.value)}
                    placeholder="Atualize os detalhes do card"
                    className={textareaClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Data prevista
                  </label>
                  <Input
                    type="date"
                    value={editDueDate}
                    onChange={(event) => setEditDueDate(event.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Data de conclusão
                  </label>
                  <Input
                    type="date"
                    value={editCompletedAt}
                    onChange={(event) => setEditCompletedAt(event.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
              <p
                className={cn(
                  "mt-4 text-[11px] uppercase tracking-[0.2em]",
                  labelMuted
                )}
              >
                Criado em{" "}
                {new Date(editingTask.createdAt).toLocaleString("pt-BR", {
                  
                })}
              </p>
              <div className="mt-6 flex flex-col gap-3 border-t border-dashed pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-2xl"
                  onClick={closeEditModal}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  onClick={saveTaskEdits}
                >
                  Salvar alterações
                </Button>
              </div>
            </div>
          </div>
        )}

        <Card className={cardClasses}>
          <CardContent
            className={cn(
              "flex flex-col gap-3 py-6 text-sm md:flex-row md:items-center md:justify-between",
              isDark ? "text-zinc-400" : "text-slate-600"
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-2xl",
                  isDark ? "bg-purple-600/10 text-purple-300" : "bg-purple-100 text-purple-600"
                )}
              >
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isDark ? "text-zinc-200" : "text-slate-800"
                  )}
                >
                  Evolução futura
                </p>
                <p className={cn("text-xs", labelMuted)}>
                  Em breve, sincronização segura desses cards diretamente com Jira.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className={cn(
                "rounded-2xl",
                isDark ? "border-zinc-700" : "border-slate-300 text-slate-700"
              )}
            >
              Saiba mais
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

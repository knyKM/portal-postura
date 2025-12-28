"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, FileCode2, Folder } from "lucide-react";

type ScriptEntry = {
  name: string;
  relativePath: string;
  absolutePath: string;
  type: "file" | "directory";
  size: number | null;
  lastModified: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  initialPath?: string;
};

export function ScriptPickerModal({
  open,
  onClose,
  onSelect,
  initialPath,
}: Props) {
  const [currentAbsolutePath, setCurrentAbsolutePath] = useState("");
  const [currentRelativePath, setCurrentRelativePath] = useState("");
  const [entries, setEntries] = useState<ScriptEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<{
    absolute: string;
    relative: string;
  } | null>(null);
  const [rootPath, setRootPath] = useState("");

  async function loadEntries(path = "") {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(
        `/api/scripts${path ? `?path=${encodeURIComponent(path)}` : ""}`
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao listar scripts.");
      }
      if (data.type === "directory") {
        setRootPath(data.root ?? "");
        setCurrentAbsolutePath(data.absolutePath ?? "");
        setCurrentRelativePath(data.path ?? "");
        setEntries(data.entries ?? []);
      } else {
        setCurrentAbsolutePath(data.absolutePath ?? "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao abrir diretório.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    if (initialPath) {
      setSelected({ absolute: initialPath, relative: initialPath });
    } else {
      setSelected(null);
    }
    loadEntries("");
  }, [open, initialPath]);

  function goUp() {
    if (!currentRelativePath) return;
    const parts = currentRelativePath.split("/").filter(Boolean);
    parts.pop();
    loadEntries(parts.join("/"));
  }

  function handleEntryClick(entry: ScriptEntry) {
    if (entry.type === "directory") {
      loadEntries(entry.relativePath);
      return;
    }
    setSelected({
      absolute: entry.absolutePath,
      relative: entry.relativePath,
    });
  }

  if (!open) return null;

  const headerPath =
    currentAbsolutePath || rootPath || selected?.absolute || "/";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#040313] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-purple-300">
              Scripts no servidor
            </p>
            <p className="text-sm text-zinc-300">{headerPath}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-xl border-white/20 text-xs text-white hover:bg-white/10"
              onClick={() => loadEntries(currentRelativePath)}
              disabled={loading}
            >
              Atualizar
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-white/20 text-xs text-white hover:bg-white/10"
              onClick={goUp}
              disabled={!currentRelativePath}
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Voltar
            </Button>
          </div>
        </div>

        <div className="grid gap-0 border-b border-white/5 px-6 py-4 text-sm sm:grid-cols-[2fr,1fr]">
          <div className="pr-4">
            {loading ? (
              <p className="text-zinc-400">Carregando...</p>
            ) : (
              <div className="space-y-2 max-h-[22rem] overflow-y-auto pr-1">
                {entries.map((entry) => {
                  const isSelected =
                    selected?.relative === entry.relativePath ||
                    selected?.absolute === entry.absolutePath;
                  return (
                    <button
                      key={entry.relativePath}
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition",
                        entry.type === "directory"
                          ? "border-white/10 text-white hover:border-white/30 hover:bg-white/5"
                          : "border-white/10 text-zinc-200 hover:border-sky-400/40 hover:bg-sky-400/5",
                        isSelected && "border-purple-400 bg-purple-500/10"
                      )}
                      onClick={() => handleEntryClick(entry)}
                    >
                      <span className="flex items-center gap-2 text-sm">
                        {entry.type === "directory" ? (
                          <Folder className="h-4 w-4 text-yellow-300" />
                        ) : (
                          <FileCode2 className="h-4 w-4 text-sky-300" />
                        )}
                        {entry.name}
                      </span>
                      {entry.type === "file" && (
                        <span className="text-[11px] text-zinc-400">
                          {entry.size ?? 0} bytes
                        </span>
                      )}
                    </button>
                  );
                })}
                {entries.length === 0 && (
                  <p className="text-zinc-400">
                    Nenhum arquivo nesse diretório.
                  </p>
                )}
              </div>
            )}
            {error && (
              <p className="mt-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                {error}
              </p>
            )}
          </div>
          <div className="mt-4 border-t border-white/10 pt-4 sm:mt-0 sm:border-0 sm:pt-0">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Seleção
            </p>
            <div className="mt-2 rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-zinc-300">
              {selected?.absolute || "Escolha um arquivo .sh ou .py"}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-6 py-4">
          <Button
            variant="ghost"
            className="rounded-xl text-sm text-zinc-300 hover:bg-white/5"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            className="rounded-xl bg-purple-600 px-4 py-2 text-sm hover:bg-purple-500 disabled:bg-zinc-600"
            disabled={!selected?.absolute}
            onClick={() => {
              if (!selected?.absolute) return;
              onSelect(selected.absolute);
              onClose();
            }}
          >
            <Check className="mr-2 h-4 w-4" />
            Selecionar script
          </Button>
        </div>
      </div>
    </div>
  );
}

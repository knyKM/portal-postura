"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Folder, FileCode2, ArrowLeft } from "lucide-react";

type ScriptEntry = {
  name: string;
  relativePath: string;
  absolutePath: string;
  type: "file" | "directory";
  size: number | null;
  lastModified: string;
};

type DirectoryResponse = {
  type: "directory";
  root: string;
  path: string;
  absolutePath: string;
  entries: ScriptEntry[];
};

type FileResponse = {
  type: "file";
  root: string;
  path: string;
  absolutePath: string;
  content: string;
  size: number;
  lastModified: string;
};

export default function ScriptsExplorerPage() {
  const [rootPath, setRootPath] = useState("");
  const [currentRelativePath, setCurrentRelativePath] = useState("");
  const [currentAbsolutePath, setCurrentAbsolutePath] = useState("");
  const [entries, setEntries] = useState<ScriptEntry[]>([]);
  const [fileContent, setFileContent] = useState<FileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadScripts(path = "") {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(
        `/api/scripts${path ? `?path=${encodeURIComponent(path)}` : ""}`
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível listar scripts.");
      }
      if (data.type === "directory") {
        setRootPath(data.root ?? "");
        setCurrentRelativePath(data.path ?? "");
        setCurrentAbsolutePath(data.absolutePath ?? "");
        setEntries(data.entries ?? []);
        setFileContent(null);
      } else if (data.type === "file") {
        setRootPath(data.root ?? "");
        setFileContent(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadScripts();
  }, []);

  function handleOpen(entry: ScriptEntry) {
    if (entry.type === "directory") {
      loadScripts(entry.relativePath);
    } else {
      loadScripts(entry.relativePath);
    }
  }

  function goUp() {
    if (!currentRelativePath) return;
    const parts = currentRelativePath.split("/").filter(Boolean);
    parts.pop();
    loadScripts(parts.join("/"));
  }

  const displayPath =
    fileContent?.absolutePath ||
    currentAbsolutePath ||
    rootPath ||
    "/";

  return (
    <DashboardShell
      pageTitle="Scripts automação"
      pageSubtitle="Explore os scripts bash/python que os playbooks executam no servidor."
    >
      <div className="flex w-full flex-col gap-4 px-4 pb-10 lg:px-10">
        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-purple-200">
              Caminho atual
            </p>
            <p className="text-sm text-white">{displayPath}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-xl border-white/30 text-xs text-white hover:bg-white/10"
              onClick={() => loadScripts(currentRelativePath)}
              disabled={loading}
            >
              Atualizar
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-white/30 text-xs text-white hover:bg-white/10"
              onClick={goUp}
              disabled={!currentRelativePath}
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Voltar
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          <Card className="border border-white/10 bg-[#050514]/80 text-zinc-100">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Explorador de scripts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-zinc-400">Carregando scripts...</p>
              ) : (
                <div className="space-y-2 max-h-[26rem] overflow-y-auto pr-1">
                  {entries.length === 0 && (
                    <p className="text-sm text-zinc-400">
                      Nenhum arquivo encontrado nesse diretório.
                    </p>
                  )}
                  {entries.map((entry) => (
                    <button
                      key={entry.relativePath}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border border-white/10 px-3 py-2 text-left text-sm transition hover:border-white/30 hover:bg-white/5",
                        entry.type === "directory" ? "text-white" : "text-zinc-300"
                      )}
                      onClick={() => handleOpen(entry)}
                    >
                      <span className="flex items-center gap-2">
                        {entry.type === "directory" ? (
                          <Folder className="h-4 w-4 text-yellow-300" />
                        ) : (
                          <FileCode2 className="h-4 w-4 text-sky-300" />
                        )}
                        {entry.name}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {entry.type === "file"
                          ? `${entry.size ?? 0} bytes`
                          : "pasta"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[#040314]/80 text-zinc-100">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Conteúdo
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[300px] text-sm">
              {fileContent ? (
                <div className="space-y-2">
                  <p className="text-xs text-zinc-400">
                    <span className="font-semibold text-white">Arquivo:</span>{" "}
                    {fileContent.absolutePath}
                  </p>
                  <p className="text-xs text-zinc-400">
                    Tamanho: {fileContent.size} bytes · Última modificação:{" "}
                    {new Date(fileContent.lastModified).toLocaleString(
                      "pt-BR",
                      { timeZone: "America/Sao_Paulo" }
                    )}
                  </p>
                  <pre className="mt-3 max-h-[22rem] overflow-auto rounded-2xl border border-white/10 bg-black/50 p-3 text-xs text-purple-100">
                    {fileContent.content}
                  </pre>
                </div>
              ) : (
                <p className="text-sm text-zinc-400">
                  Selecione um script para visualizar o conteúdo.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

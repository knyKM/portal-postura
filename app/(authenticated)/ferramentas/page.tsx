"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { Activity, Terminal } from "lucide-react";

type ToolId = "ping" | "telnet";

type ToolConfig = {
  id: ToolId;
  title: string;
  description: string;
  icon: typeof Activity;
  buttonLabel: string;
  helper: string;
  endpoint: string;
  supportsPort?: boolean;
  defaultPort?: string;
};

const toolConfigs: ToolConfig[] = [
  {
    id: "ping",
    title: "Ping ICMP",
    description: "Verifica a latência média simulada de hosts.",
    icon: Activity,
    buttonLabel: "Executar ping",
    helper:
      "Informe uma lista de IPs ou importe um arquivo .txt/.csv. A API executa ping real do servidor desta aplicação.",
    endpoint: "ping",
  },
  {
    id: "telnet",
    title: "Teste Telnet",
    description: "Validar abertura de portas TCP em hosts remotos.",
    icon: Terminal,
    buttonLabel: "Executar telnet",
    helper:
      "Escolha uma porta (ex.: 22, 443) e liste os IPs. A API tenta conectar-se realmente ao host.",
    endpoint: "telnet",
    supportsPort: true,
    defaultPort: "443",
  },
];

type ToolState = {
  input: string;
  fileName: string | null;
  ips: string[];
  isRunning: boolean;
  results: Array<{ ip: string; status: "ok" | "error"; detail: string }>;
  port?: string;
  error?: string | null;
};

const initialToolState = toolConfigs.reduce<Record<ToolId, ToolState>>(
  (acc, tool) => {
    acc[tool.id] = {
      input: "",
      fileName: null,
      ips: [],
      isRunning: false,
      results: [],
      port: tool.defaultPort,
      error: null,
    };
    return acc;
  },
  {} as Record<ToolId, ToolState>
);

function parseIps(raw: string) {
  return raw
    .split(/[\r\n,;]+/)
    .map((ip) => ip.trim())
    .filter(Boolean);
}

export default function FerramentasPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [toolStates, setToolStates] = useState(initialToolState);

  function updateToolState(id: ToolId, updates: Partial<ToolState>) {
    setToolStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...updates,
      },
    }));
  }

  function handleTextChange(id: ToolId, value: string) {
    updateToolState(id, { input: value, ips: parseIps(value) });
  }

  function handlePortChange(id: ToolId, value: string) {
    updateToolState(id, { port: value });
  }

  function handleFileUpload(id: ToolId, event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      updateToolState(id, {
        input: text,
        fileName: file.name,
        ips: parseIps(text),
        error: null,
      });
    };
    reader.readAsText(file);
  }

  async function handleExecute(tool: ToolConfig) {
    const state = toolStates[tool.id];
    const ips = state.ips.length ? state.ips : parseIps(state.input);
    if (ips.length === 0) {
      updateToolState(tool.id, {
        error: "Informe pelo menos um IP ou carregue um arquivo.",
      });
      return;
    }
    updateToolState(tool.id, { isRunning: true, error: null, results: [] });
    try {
      const response = await fetch(`/api/tools/${tool.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ips,
          port: tool.supportsPort ? Number(state.port) || Number(tool.defaultPort) : undefined,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !Array.isArray(data?.results)) {
        throw new Error(data?.error || "Falha ao executar a ferramenta.");
      }
      updateToolState(tool.id, { isRunning: false, results: data.results });
    } catch (err) {
      updateToolState(tool.id, {
        isRunning: false,
        error: err instanceof Error ? err.message : "Não foi possível executar.",
      });
    }
  }

  return (
    <DashboardShell
      pageTitle="Ferramentas"
      pageSubtitle="Utilitários para validação rápida (simulados neste ambiente)"
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
              <h2 className="text-2xl font-semibold">Ferramentas de diagnóstico</h2>
              <p className="text-sm text-zinc-400">
                Ping, telnet e outras verificações são simuladas localmente para agilizar o fluxo de aprovação.
              </p>
            </div>
            <div
              className={cn(
                "rounded-2xl border px-4 py-3 text-xs",
                isDark
                  ? "border-purple-500/30 bg-purple-500/5 text-purple-200"
                  : "border-purple-200 bg-purple-50 text-purple-700"
              )}
            >
              Ambiente de teste · sem acesso real à rede
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {toolConfigs.map((tool) => {
            const Icon = tool.icon;
            const state = toolStates[tool.id];
            return (
              <Card
                key={tool.id}
                className={cn(
                  "rounded-3xl border",
                  isDark ? "border-zinc-800 bg-[#050816]/80" : "border-slate-200 bg-white"
                )}
              >
                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <p className="text-sm text-zinc-500">{tool.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  {tool.supportsPort && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-500">
                        Porta
                      </label>
                      <Input
                        type="number"
                        min={1}
                        max={65535}
                        value={state.port ?? ""}
                        onChange={(event) => handlePortChange(tool.id, event.target.value)}
                        className="rounded-2xl border border-zinc-700 bg-transparent px-3 py-2 text-sm text-zinc-100 focus-visible:ring-purple-500/40"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500">
                      Lista de IPs
                    </label>
                    <Textarea
                      value={state.input}
                      onChange={(event) => handleTextChange(tool.id, event.target.value)}
                      placeholder="Ex: 10.1.1.1&#10;10.1.1.2"
                      className="min-h-[120px] rounded-2xl border border-zinc-700 bg-transparent px-3 py-2 text-sm text-zinc-100 focus-visible:ring-purple-500/40"
                    />
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex cursor-pointer flex-1 items-center justify-center rounded-2xl border border-dashed border-purple-500/40 px-3 py-2 text-xs text-purple-200">
                        Anexar arquivo .txt/.csv
                        <input
                          type="file"
                          accept=".txt,.csv"
                          className="hidden"
                          onChange={(event) => handleFileUpload(tool.id, event)}
                        />
                      </label>
                      <Button
                        type="button"
                        onClick={() => handleExecute(tool)}
                        disabled={state.isRunning}
                        className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white"
                      >
                        {state.isRunning ? "Executando..." : tool.buttonLabel}
                      </Button>
                    </div>
                    <p className="text-[11px] text-zinc-500">{tool.helper}</p>
                    {state.fileName && (
                      <p className="text-[11px] text-zinc-500">
                        Arquivo carregado: {state.fileName}
                      </p>
                    )}
                    {state.error && (
                      <p className="text-[11px] text-rose-400">{state.error}</p>
                    )}
                  </div>

                  {state.results.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                        Resultados simulados
                      </p>
                      <div className="space-y-1 rounded-2xl border border-zinc-700 px-4 py-3">
                        {state.results.map((result) => (
                          <div
                            key={`${tool.id}-${result.ip}`}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="font-mono text-zinc-200">{result.ip}</span>
                            <span
                              className={cn(
                                "text-xs font-semibold",
                                result.status === "ok"
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              )}
                            >
                              {result.detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}

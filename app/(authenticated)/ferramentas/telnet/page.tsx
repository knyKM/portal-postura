"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { Terminal } from "lucide-react";

type ToolState = {
  input: string;
  fileName: string | null;
  ips: string[];
  isRunning: boolean;
  results: Array<{ ip: string; status: "ok" | "error"; detail: string }>;
  port: string;
  error?: string | null;
};

const initialState: ToolState = {
  input: "",
  fileName: null,
  ips: [],
  isRunning: false,
  results: [],
  port: "443",
  error: null,
};

function parseIps(raw: string) {
  return raw
    .split(/[\r\n,;]+/)
    .map((ip) => ip.trim())
    .filter(Boolean);
}

export default function TelnetToolPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [state, setState] = useState(initialState);

  function updateState(updates: Partial<ToolState>) {
    setState((prev) => ({ ...prev, ...updates }));
  }

  function handleTextChange(value: string) {
    updateState({ input: value, ips: parseIps(value) });
  }

  function handlePortChange(value: string) {
    updateState({ port: value });
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      updateState({
        input: text,
        fileName: file.name,
        ips: parseIps(text),
        error: null,
      });
    };
    reader.readAsText(file);
  }

  async function handleExecute() {
    const ips = state.ips.length ? state.ips : parseIps(state.input);
    if (ips.length === 0) {
      updateState({ error: "Informe pelo menos um IP ou carregue um arquivo." });
      return;
    }
    updateState({ isRunning: true, error: null, results: [] });
    try {
      const response = await fetch("/api/tools/telnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ips,
          port: Number(state.port) || 443,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !Array.isArray(data?.results)) {
        throw new Error(data?.error || "Falha ao executar o telnet.");
      }
      updateState({ isRunning: false, results: data.results });
    } catch (err) {
      updateState({
        isRunning: false,
        error: err instanceof Error ? err.message : "Não foi possível executar.",
      });
    }
  }

  return (
    <DashboardShell
      pageTitle="Teste Telnet"
      pageSubtitle="Valide abertura de portas TCP em hosts remotos."
    >
      <div className="flex w-full flex-col gap-6 px-4 lg:px-10">
        <Card
          className={cn(
            "rounded-3xl border",
            isDark ? "border-zinc-800 bg-[#050816]/80" : "border-slate-200 bg-white"
          )}
        >
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl">
                <Terminal className="h-6 w-6" />
              </span>
              <div>
                <CardTitle className="text-lg">Teste Telnet</CardTitle>
                <p className="text-sm text-zinc-500">
                  Valide portas TCP e simule abertura de conexões.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500">Porta</label>
              <Input
                type="number"
                min={1}
                max={65535}
                value={state.port}
                onChange={(event) => handlePortChange(event.target.value)}
                className="rounded-2xl border border-zinc-700 bg-transparent px-3 py-2 text-sm text-zinc-100 focus-visible:ring-purple-500/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500">Lista de IPs</label>
              <Textarea
                value={state.input}
                onChange={(event) => handleTextChange(event.target.value)}
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
                    onChange={handleFileUpload}
                  />
                </label>
                <Button
                  type="button"
                  onClick={handleExecute}
                  disabled={state.isRunning}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white"
                >
                  {state.isRunning ? "Executando..." : "Executar telnet"}
                </Button>
              </div>
              <p className="text-[11px] text-zinc-500">
                Escolha a porta e liste os IPs para validação simulada.
              </p>
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
                      key={result.ip}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-mono text-zinc-200">{result.ip}</span>
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          result.status === "ok" ? "text-emerald-400" : "text-rose-400"
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
      </div>
    </DashboardShell>
  );
}

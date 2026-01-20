"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { Download, Filter, Search } from "lucide-react";
import jiraFieldsJson from "@/data/jira-fields.json";

type JiraField = {
  id: string;
  name: string;
  custom: boolean;
  clauseNames?: string[];
};

const baseFieldCatalog = jiraFieldsJson as JiraField[];
const fieldCatalog: JiraField[] = [
  { id: "key", name: "Issue Key", custom: false },
  ...baseFieldCatalog,
];

export default function ExporterJiraPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [jql, setJql] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>(["key", "summary"]);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("postura_user");
      if (!raw) {
        router.replace("/login");
        return;
      }
    } catch {
      router.replace("/login");
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const filteredFields = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return fieldCatalog;
    return fieldCatalog.filter((field) => {
      const haystack = [
        field.name,
        field.id,
        ...(field.clauseNames ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [search]);

  function toggleField(fieldId: string) {
    setSelectedFields((prev) => {
      if (prev.includes(fieldId)) {
        return prev.filter((item) => item !== fieldId);
      }
      return [...prev, fieldId];
    });
  }

  function handleSelectAll() {
    setSelectedFields(fieldCatalog.map((field) => field.id));
  }

  function handleClearAll() {
    setSelectedFields([]);
  }

  async function handleExport() {
    setExporting(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/jira-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jql, fields: selectedFields }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Falha ao exportar.");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `jira-export-${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setMessage("Exportação concluída.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao exportar.");
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-sm text-zinc-400">
        Carregando...
      </div>
    );
  }

  return (
    <DashboardShell
      pageTitle="Exporter Jira"
      pageSubtitle="Extraia relatórios em XLSX a partir de uma JQL."
    >
      <div className="flex w-full flex-col gap-6 px-4 pb-10 lg:px-10">
        <section
          className={cn(
            "rounded-3xl border px-6 py-6",
            isDark
              ? "border-white/10 bg-[#050816] text-zinc-100"
              : "border-slate-200 bg-white text-slate-800"
          )}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge
                variant="outline"
                className={cn(
                  "border-purple-500/60 bg-purple-500/10 text-[11px] uppercase tracking-[0.3em]",
                  isDark ? "text-purple-200" : "text-purple-700"
                )}
              >
                Exportação Jira
              </Badge>
              <h2 className="mt-2 text-2xl font-semibold">
                Relatórios sob demanda
              </h2>
              <p className="text-sm text-zinc-400">
                Informe a JQL e selecione os campos que deseja incluir no XLSX.
              </p>
            </div>
            <Button
              type="button"
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              onClick={handleExport}
              disabled={exporting}
            >
              <Download className="mr-2 h-4 w-4" />
              {exporting ? "Exportando..." : "Exportar XLSX"}
            </Button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card
            className={cn(
              "border",
              isDark
                ? "border-white/10 bg-[#050816] text-zinc-100"
                : "border-slate-200 bg-white text-slate-800"
            )}
          >
            <CardHeader>
              <CardTitle className="text-base">JQL da extração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  value={jql}
                  onChange={(event) => setJql(event.target.value)}
                  placeholder="project = ASSETN AND status = 'In Analysis'"
                  className={cn(
                    "pl-9 text-sm",
                    isDark
                      ? "border-white/10 bg-black/40 text-white"
                      : "border-slate-200 bg-white"
                  )}
                />
              </div>
              <p className="text-xs text-zinc-500">
                A consulta seguirá o padrão do Jira Data Center (/rest/api/2/search).
              </p>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "border",
              isDark
                ? "border-white/10 bg-[#050816] text-zinc-100"
                : "border-slate-200 bg-white text-slate-800"
            )}
          >
            <CardHeader>
              <CardTitle className="text-base">Campos da exportação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar campo pelo nome ou ID"
                  className={cn(
                    "pl-9 text-sm",
                    isDark
                      ? "border-white/10 bg-black/40 text-white"
                      : "border-slate-200 bg-white"
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Button type="button" variant="secondary" onClick={handleSelectAll}>
                  Selecionar todos
                </Button>
                <Button type="button" variant="secondary" onClick={handleClearAll}>
                  Limpar seleção
                </Button>
                <span className="text-zinc-500">
                  {selectedFields.length} selecionado(s)
                </span>
              </div>
              <ScrollArea className="h-[360px] rounded-2xl border border-white/10 p-3">
                <div className="space-y-2">
                  {filteredFields.map((field) => {
                    const checked = selectedFields.includes(field.id);
                    return (
                      <label
                        key={field.id}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-xs",
                          checked
                            ? isDark
                              ? "border-purple-500/50 bg-purple-500/10 text-purple-100"
                              : "border-purple-300 bg-purple-50 text-purple-700"
                            : isDark
                            ? "border-white/10 bg-black/20 text-zinc-200"
                            : "border-slate-200 bg-white text-slate-700"
                        )}
                      >
                        <div>
                          <p className="font-semibold">{field.name}</p>
                          <p className="text-[11px] text-zinc-500">{field.id}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleField(field.id)}
                        />
                      </label>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </section>

        {error && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              isDark
                ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
                : "border-rose-200 bg-rose-50 text-rose-700"
            )}
          >
            {error}
          </div>
        )}
        {message && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              isDark
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            )}
          >
            {message}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";

type ApprovalHistory = {
  id: number;
  request_id: number;
  type: string;
  message: string | null;
  actor_name: string | null;
  created_at: string;
  action_type: string | null;
  requester_name: string | null;
  requester_email: string | null;
  requested_status: string | null;
  filter_mode: string | null;
  filter_value: string | null;
};

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildCsv(rows: string[][]) {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const normalized = String(cell ?? "");
          if (normalized.includes('"') || normalized.includes(",") || normalized.includes("\n")) {
            return `"${normalized.replace(/"/g, '""')}"`;
          }
          return normalized;
        })
        .join(",")
    )
    .join("\n");
}

function formatDateTime(value: string | null) {
  if (!value) return "-";
  const hasTimeZone = /Z|[+-]\d{2}:?\d{2}$/.test(value);
  if (hasTimeZone) {
    return new Date(value).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  }
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  return new Date(normalized).toLocaleString("pt-BR");
}

const decisionLabels: Record<string, string> = {
  approved: "Aprovado",
  returned: "Devolvido",
  declined: "Reprovado",
};

export default function AuditoriaFilaAprovacoesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [history, setHistory] = useState<ApprovalHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const tableHeader = cn(
    isDark ? "bg-[#080c1a] text-zinc-400" : "bg-slate-100 text-slate-600"
  );
  const tableBody = cn(
    isDark ? "bg-[#050816] text-zinc-300" : "bg-white text-slate-600"
  );

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    void (async () => {
      try {
        const response = await fetch("/api/actions/approval-history?limit=300");
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "Falha ao carregar histórico.");
        }
        setHistory(data?.history ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar auditoria.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const rows = useMemo(
    () => [
      [
        "evento_id",
        "chamado_id",
        "decisao",
        "aprovador",
        "solicitante",
        "email_solicitante",
        "acao",
        "status_alvo",
        "conjunto",
        "data",
        "motivo",
      ],
      ...history.map((entry) => [
        String(entry.id),
        String(entry.request_id),
        decisionLabels[entry.type] ?? entry.type,
        entry.actor_name ?? "",
        entry.requester_name ?? "",
        entry.requester_email ?? "",
        entry.action_type ?? "",
        entry.requested_status ?? "",
        entry.filter_value ?? "",
        formatDateTime(entry.created_at),
        entry.message ?? "",
      ]),
    ],
    [history]
  );

  function exportHistory(format: "csv" | "xlsx") {
    const content = buildCsv(rows);
    downloadFile(
      content,
      `auditoria-fila-aprovacoes.${format}`,
      format === "csv"
        ? "text/csv;charset=utf-8"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  }

  return (
    <DashboardShell
      pageTitle="Auditoria da Fila de Aprovação"
      pageSubtitle="Histórico completo de aprovações, devoluções e reprovações"
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
                Histórico executivo
              </p>
              <h2 className="text-2xl font-semibold">Fila de aprovação</h2>
              <p className="text-sm text-zinc-400">
                Decisões registradas por administradores com motivo e contexto.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-full border-white/20 text-[11px]"
                onClick={() => exportHistory("csv")}
              >
                Exportar CSV
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-full border-white/20 text-[11px]"
                onClick={() => exportHistory("xlsx")}
              >
                Exportar XLSX
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-xs",
              isDark
                ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
                : "border-rose-200 bg-rose-50 text-rose-700"
            )}
          >
            {error}
          </div>
        )}

        <Card
          className={cn(
            "rounded-3xl border",
            isDark ? "border-zinc-800 bg-[#050816]/80" : "border-slate-200 bg-white"
          )}
        >
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Histórico de decisões</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className={tableHeader}>
                <tr>
                  <th className="px-4 py-3">ID evento</th>
                  <th className="px-4 py-3">Chamado</th>
                  <th className="px-4 py-3">Decisão</th>
                  <th className="px-4 py-3">Aprovador</th>
                  <th className="px-4 py-3">Solicitante</th>
                  <th className="px-4 py-3">Ação</th>
                  <th className="px-4 py-3">Status alvo</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Motivo</th>
                </tr>
              </thead>
              <tbody className={tableBody}>
                {isLoading ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-xs text-zinc-500" colSpan={9}>
                      Carregando histórico...
                    </td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-xs text-zinc-500" colSpan={9}>
                      Nenhuma decisão registrada.
                    </td>
                  </tr>
                ) : (
                  history.map((entry) => (
                    <tr
                      key={entry.id}
                      className={cn(
                        "border-t",
                        isDark ? "border-zinc-800/60" : "border-slate-200"
                      )}
                    >
                      <td className="px-4 py-3 font-semibold">{entry.id}</td>
                      <td className="px-4 py-3">#{entry.request_id}</td>
                      <td className="px-4 py-3">
                        {decisionLabels[entry.type] ?? entry.type}
                      </td>
                      <td className="px-4 py-3">{entry.actor_name ?? "-"}</td>
                      <td className="px-4 py-3">
                        <p>{entry.requester_name ?? "-"}</p>
                        <p className="text-[11px] text-zinc-500">
                          {entry.requester_email ?? ""}
                        </p>
                      </td>
                      <td className="px-4 py-3">{entry.action_type ?? "-"}</td>
                      <td className="px-4 py-3">{entry.requested_status ?? "-"}</td>
                      <td className="px-4 py-3">{formatDateTime(entry.created_at)}</td>
                      <td className="px-4 py-3 text-xs">{entry.message ?? "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

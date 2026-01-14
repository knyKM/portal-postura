"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";

type ActionRequest = {
  id: number;
  action_type: string;
  filter_mode: string;
  filter_value: string;
  requested_status: string | null;
  requester_name: string | null;
  requester_email: string | null;
  status: string;
  created_at: string;
  approved_at: string | null;
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

export default function AuditoriaAcoesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [openRequests, setOpenRequests] = useState<ActionRequest[]>([]);
  const [closedRequests, setClosedRequests] = useState<ActionRequest[]>([]);
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
        const [openRes, closedRes] = await Promise.all([
          fetch("/api/actions/requests?status=open&limit=200"),
          fetch("/api/actions/requests?status=closed&limit=200"),
        ]);
        const openData = await openRes.json().catch(() => null);
        const closedData = await closedRes.json().catch(() => null);
        if (!openRes.ok) {
          throw new Error(openData?.error || "Falha ao buscar chamados abertos.");
        }
        if (!closedRes.ok) {
          throw new Error(closedData?.error || "Falha ao buscar chamados encerrados.");
        }
        setOpenRequests(openData?.requests ?? []);
        setClosedRequests(closedData?.requests ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar auditoria.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const openRows = useMemo(
    () => [
      ["id", "acao", "status", "solicitante", "email", "criado_em", "conjunto", "status_alvo"],
      ...openRequests.map((request) => [
        String(request.id),
        request.action_type,
        request.status,
        request.requester_name ?? "",
        request.requester_email ?? "",
        formatDateTime(request.created_at),
        request.filter_value,
        request.requested_status ?? "",
      ]),
    ],
    [openRequests]
  );

  const closedRows = useMemo(
    () => [
      ["id", "acao", "status", "solicitante", "email", "criado_em", "aprovado_em", "conjunto", "status_alvo"],
      ...closedRequests.map((request) => [
        String(request.id),
        request.action_type,
        request.status,
        request.requester_name ?? "",
        request.requester_email ?? "",
        formatDateTime(request.created_at),
        formatDateTime(request.approved_at),
        request.filter_value,
        request.requested_status ?? "",
      ]),
    ],
    [closedRequests]
  );

  function exportRows(rows: string[][], label: string, format: "csv" | "xlsx") {
    const content = buildCsv(rows);
    downloadFile(
      content,
      `auditoria-acoes-${label}.${format}`,
      format === "csv"
        ? "text/csv;charset=utf-8"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  }

  return (
    <DashboardShell
      pageTitle="Auditoria de Ações"
      pageSubtitle="Chamados em aberto e encerrados com detalhes de execução"
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
                Auditoria operacional
              </p>
              <h2 className="text-2xl font-semibold">Chamados em massa</h2>
              <p className="text-sm text-zinc-400">
                Exportações disponíveis para auditoria de chamados abertos e encerrados.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-full border-white/20 text-[11px]"
                onClick={() => exportRows(openRows, "abertos", "csv")}
              >
                Exportar abertos CSV
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-full border-white/20 text-[11px]"
                onClick={() => exportRows(openRows, "abertos", "xlsx")}
              >
                Exportar abertos XLSX
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-full border-white/20 text-[11px]"
                onClick={() => exportRows(closedRows, "encerrados", "csv")}
              >
                Exportar encerrados CSV
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-full border-white/20 text-[11px]"
                onClick={() => exportRows(closedRows, "encerrados", "xlsx")}
              >
                Exportar encerrados XLSX
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
            <CardTitle className="text-sm font-semibold">Chamados em aberto</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className={tableHeader}>
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Ação</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Solicitante</th>
                  <th className="px-4 py-3">Criado em</th>
                  <th className="px-4 py-3">Conjunto</th>
                  <th className="px-4 py-3">Status alvo</th>
                </tr>
              </thead>
              <tbody className={tableBody}>
                {isLoading ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-xs text-zinc-500" colSpan={7}>
                      Carregando chamados...
                    </td>
                  </tr>
                ) : openRequests.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-xs text-zinc-500" colSpan={7}>
                      Nenhum chamado aberto encontrado.
                    </td>
                  </tr>
                ) : (
                  openRequests.map((request) => (
                    <tr
                      key={request.id}
                      className={cn(
                        "border-t",
                        isDark ? "border-zinc-800/60" : "border-slate-200"
                      )}
                    >
                      <td className="px-4 py-3 font-semibold">{request.id}</td>
                      <td className="px-4 py-3">{request.action_type}</td>
                      <td className="px-4 py-3">{request.status}</td>
                      <td className="px-4 py-3">
                        <p>{request.requester_name ?? "-"}</p>
                        <p className="text-[11px] text-zinc-500">
                          {request.requester_email ?? ""}
                        </p>
                      </td>
                      <td className="px-4 py-3">{formatDateTime(request.created_at)}</td>
                      <td className="px-4 py-3 text-xs">{request.filter_value}</td>
                      <td className="px-4 py-3">{request.requested_status ?? "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "rounded-3xl border",
            isDark ? "border-zinc-800 bg-[#050816]/80" : "border-slate-200 bg-white"
          )}
        >
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Chamados encerrados</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className={tableHeader}>
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Ação</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Solicitante</th>
                  <th className="px-4 py-3">Criado em</th>
                  <th className="px-4 py-3">Aprovado em</th>
                  <th className="px-4 py-3">Conjunto</th>
                  <th className="px-4 py-3">Status alvo</th>
                </tr>
              </thead>
              <tbody className={tableBody}>
                {isLoading ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-xs text-zinc-500" colSpan={8}>
                      Carregando chamados...
                    </td>
                  </tr>
                ) : closedRequests.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-xs text-zinc-500" colSpan={8}>
                      Nenhum chamado encerrado encontrado.
                    </td>
                  </tr>
                ) : (
                  closedRequests.map((request) => (
                    <tr
                      key={request.id}
                      className={cn(
                        "border-t",
                        isDark ? "border-zinc-800/60" : "border-slate-200"
                      )}
                    >
                      <td className="px-4 py-3 font-semibold">{request.id}</td>
                      <td className="px-4 py-3">{request.action_type}</td>
                      <td className="px-4 py-3">{request.status}</td>
                      <td className="px-4 py-3">
                        <p>{request.requester_name ?? "-"}</p>
                        <p className="text-[11px] text-zinc-500">
                          {request.requester_email ?? ""}
                        </p>
                      </td>
                      <td className="px-4 py-3">{formatDateTime(request.created_at)}</td>
                      <td className="px-4 py-3">{formatDateTime(request.approved_at)}</td>
                      <td className="px-4 py-3 text-xs">{request.filter_value}</td>
                      <td className="px-4 py-3">{request.requested_status ?? "-"}</td>
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

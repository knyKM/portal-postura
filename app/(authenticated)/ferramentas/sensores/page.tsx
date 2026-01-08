"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { Download, RefreshCcw, Server } from "lucide-react";

type SensorStatus = "up" | "down" | "unknown";

type Sensor = {
  id: number;
  hostname: string;
  ip: string;
  environment: string | null;
  ownerTool: string | null;
  status: SensorStatus;
  lastDetail: string | null;
  lastCheckedAt: string | null;
};

const CSV_HEADERS = ["hostname", "ip", "ambiente", "ferramenta_responsavel"];
const CSV_TEMPLATE = `${CSV_HEADERS.join(",")}
srv-lnx-01,10.0.0.10,Producao,Monitoramento
srv-win-02,10.0.0.11,Homologacao,InfraSec
`;

function parseCsv(text: string) {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (rows.length <= 1) return [];
  const delimiter = rows[0].includes(";") ? ";" : ",";
  const headers = rows[0]
    .split(delimiter)
    .map((header) => header.trim().toLowerCase());
  return rows.slice(1).map((line) => {
    const columns = line.split(delimiter).map((entry) => entry.trim());
    const getValue = (key: string) => {
      const index = headers.indexOf(key);
      return index >= 0 ? columns[index] ?? "" : "";
    };
    return {
      hostname: getValue("hostname"),
      ip: getValue("ip"),
      environment: getValue("ambiente"),
      ownerTool: getValue("ferramenta_responsavel"),
    };
  });
}

export default function SensoresPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hostname, setHostname] = useState("");
  const [ip, setIp] = useState("");
  const [environment, setEnvironment] = useState("");
  const [ownerTool, setOwnerTool] = useState("");
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);

  async function loadSensors() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/sensors");
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível carregar sensores.");
      }
      setSensors(Array.isArray(data?.sensors) ? data.sensors : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao carregar sensores."
      );
    } finally {
      setLoading(false);
    }
  }

  async function refreshSensors() {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const response = await fetch("/api/sensors/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao atualizar status.");
      }
      const updated = Array.isArray(data?.sensors) ? data.sensors : [];
      if (updated.length > 0) {
        setSensors((prev) =>
          prev.map((sensor) => {
            const match = updated.find((item: Sensor) => item.id === sensor.id);
            return match ?? sensor;
          })
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao atualizar status."
      );
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadSensors();
    refreshSensors();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshSensors();
    }, 20 * 60_000);
    return () => clearInterval(interval);
  }, []);

  async function handleCreateSensor(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hostname.trim() || !ip.trim()) {
      setError("Hostname e IP são obrigatórios.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/sensors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostname,
          ip,
          environment,
          ownerTool,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao cadastrar sensor.");
      }
      if (data?.sensor) {
        setSensors((prev) => [data.sensor, ...prev]);
        setHostname("");
        setIp("");
        setEnvironment("");
        setOwnerTool("");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao cadastrar sensor."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleCsvUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseCsv(text).filter((item) => item.hostname && item.ip);
    if (parsed.length === 0) {
      setError("Arquivo CSV inválido ou vazio.");
      return;
    }
    setBulkSaving(true);
    setBulkMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/sensors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sensors: parsed }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao importar sensores.");
      }
      const created = Array.isArray(data?.sensors) ? data.sensors : [];
      if (created.length > 0) {
        setSensors((prev) => [...created, ...prev]);
        setBulkMessage(`${created.length} sensores importados com sucesso.`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao importar sensores."
      );
    } finally {
      setBulkSaving(false);
      event.target.value = "";
    }
  }

  function handleDownloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sensores_template.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const statusBadge = useMemo(
    () => ({
      up: "bg-emerald-500/10 text-emerald-300",
      down: "bg-rose-500/10 text-rose-300",
      unknown: "bg-zinc-500/10 text-zinc-400",
    }),
    []
  );

  return (
    <DashboardShell
      pageTitle="Gestão de Sensores"
      pageSubtitle="Cadastre e monitore servidores Linux e Windows"
    >
      <div className="flex w-full flex-col gap-6 px-4 pb-10 lg:px-10">
        <Card
          className={cn(
            "rounded-3xl border",
            isDark ? "border-zinc-800 bg-[#050816]/80" : "border-slate-200 bg-white"
          )}
        >
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl">
                <Server className="h-6 w-6" />
              </span>
              <div>
                <CardTitle className="text-lg">Cadastro de sensores</CardTitle>
                <p className="text-sm text-zinc-500">
                  Inclua servidores com hostname, IP e responsáveis pela operação.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}
            <form onSubmit={handleCreateSensor} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500">
                  Hostname
                </label>
                <Input
                  value={hostname}
                  onChange={(event) => setHostname(event.target.value)}
                  placeholder="srv-linux-01"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500">IP</label>
                <Input
                  value={ip}
                  onChange={(event) => setIp(event.target.value)}
                  placeholder="10.0.0.10"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500">
                  Ambiente
                </label>
                <Input
                  value={environment}
                  onChange={(event) => setEnvironment(event.target.value)}
                  placeholder="Producao, Homologacao, Dev"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500">
                  Ferramenta responsável
                </label>
                <Input
                  value={ownerTool}
                  onChange={(event) => setOwnerTool(event.target.value)}
                  placeholder="Monitoramento, InfraSec"
                />
              </div>
              <div className="md:col-span-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-semibold text-white"
                >
                  {saving ? "Salvando..." : "Cadastrar sensor"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "rounded-3xl border",
            isDark ? "border-zinc-800 bg-[#050816]/80" : "border-slate-200 bg-white"
          )}
        >
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg">Importação em massa</CardTitle>
              <p className="text-sm text-zinc-500">
                Use o modelo CSV para cadastrar múltiplos sensores.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleDownloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Baixar modelo CSV
              </Button>
              <label
                className={cn(
                  "inline-flex cursor-pointer items-center rounded-2xl border border-dashed px-3 py-2 text-xs",
                  isDark
                    ? "border-purple-500/40 text-purple-200"
                    : "border-purple-300 text-purple-600"
                )}
              >
                {bulkSaving ? "Importando..." : "Importar CSV"}
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCsvUpload}
                  disabled={bulkSaving}
                />
              </label>
            </div>
          </CardHeader>
          <CardContent>
            {bulkMessage && (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
                {bulkMessage}
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          className={cn(
            "rounded-3xl border",
            isDark ? "border-zinc-800 bg-[#050816]/80" : "border-slate-200 bg-white"
          )}
        >
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg">Sensores cadastrados</CardTitle>
              <p className="text-sm text-zinc-500">
                Status atualizado a cada 20 minutos.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={refreshSensors}
              disabled={refreshing}
            >
              <RefreshCcw className={cn("mr-2 h-4 w-4", refreshing && "animate-spin")} />
              Atualizar agora
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-zinc-500">Carregando sensores...</p>
            ) : sensors.length === 0 ? (
              <p className="text-sm text-zinc-500">
                Nenhum sensor cadastrado até o momento.
              </p>
            ) : (
              <div className={cn("overflow-x-auto rounded-2xl border", isDark ? "border-zinc-800" : "border-slate-200")}>
                <table className="min-w-full text-left text-xs">
                  <thead className={cn(isDark ? "bg-[#040414] text-zinc-400" : "bg-slate-100 text-slate-600")}>
                    <tr>
                      <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">
                        Hostname
                      </th>
                      <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">
                        IP
                      </th>
                      <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">
                        Ambiente
                      </th>
                      <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">
                        Ferramenta
                      </th>
                      <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">
                        Status
                      </th>
                      <th className="px-4 py-3 font-semibold uppercase tracking-[0.2em]">
                        Última checagem
                      </th>
                    </tr>
                  </thead>
                  <tbody className={cn(isDark ? "bg-[#050816]" : "bg-white")}>
                    {sensors.map((sensor) => (
                      <tr
                        key={sensor.id}
                        className={cn(
                          "border-t",
                          isDark ? "border-zinc-800/60" : "border-slate-200"
                        )}
                      >
                        <td className={cn("px-4 py-3 font-medium", isDark ? "text-zinc-100" : "text-slate-800")}>
                          {sensor.hostname}
                        </td>
                        <td className={cn("px-4 py-3 font-mono text-[11px]", isDark ? "text-zinc-400" : "text-slate-500")}>
                          {sensor.ip}
                        </td>
                        <td className="px-4 py-3 text-zinc-400">
                          {sensor.environment ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-zinc-400">
                          {sensor.ownerTool ?? "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                              statusBadge[sensor.status]
                            )}
                          >
                            {sensor.status === "up"
                              ? "Online"
                              : sensor.status === "down"
                              ? "Offline"
                              : "Desconhecido"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-400">
                          {sensor.lastCheckedAt
                            ? new Date(sensor.lastCheckedAt).toLocaleString("pt-BR", {
                                timeZone: "America/Sao_Paulo",
                              })
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

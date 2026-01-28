"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";

type BaseSdAsset = {
  id?: number;
  hostname?: string | null;
  month_inclusion?: string | null;
  asset_type?: string | null;
  cmdb?: string | null;
  tlv_cmdb?: string | null;
  valid?: string | null;
  ip?: string | null;
  os?: string | null;
  coverage_tools?: string | null;
  obs_cofre?: string | null;
  obs_tenable?: string | null;
  obs_guardicore?: string | null;
  obs_deep_security?: string | null;
  obs_crowdstrike?: string | null;
  obs_wazuh?: string | null;
  obs_trellix?: string | null;
};

const coverageLabels = [
  "Cofre",
  "Tenable Scans",
  "Tenable Agents",
  "Guardicore",
  "Deep Security",
  "Crowdstrike",
  "Wazuh",
  "Trellix",
];

const coverageMatchers: Record<string, string[]> = {
  Cofre: ["cofre"],
  "Tenable Scans": ["tenable scans", "tenable scan", "tenable"],
  "Tenable Agents": ["tenable agents", "tenable agent"],
  Guardicore: ["guardicore"],
  "Deep Security": ["deep security", "deepsecurity"],
  Crowdstrike: ["crowdstrike"],
  Wazuh: ["wazuh"],
  Trellix: ["trellix"],
};

function normalizeCoverageValue(value: string) {
  return value.trim().toLowerCase();
}

export default function BaseSdPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [assets, setAssets] = useState<BaseSdAsset[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    let active = true;
    async function fetchAssets() {
      setLoadingList(true);
      try {
        const response = await fetch(`/api/base-sd?limit=${pageSize}&page=${page}`);
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "Não foi possível carregar os ativos.");
        }
        if (active) {
          setAssets(Array.isArray(data?.assets) ? data.assets : []);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Falha ao carregar ativos.");
        }
      } finally {
        if (active) setLoadingList(false);
      }
    }
    fetchAssets();
    return () => {
      active = false;
    };
  }, [page]);

  const assetCards = useMemo(() => {
    const grouped = new Map<
      string,
      {
        asset: BaseSdAsset;
        ips: string[];
        coverageSet: Set<string>;
      }
    >();

    assets.forEach((asset) => {
      const hostnameKey = (asset.hostname ?? "—").trim() || "—";
      const rawCoverage = asset.coverage_tools ?? "";
      const coverageTokens = rawCoverage
        .split(",")
        .map((value) => normalizeCoverageValue(value))
        .filter(Boolean);
      const coverageSet = new Set<string>();
      coverageLabels.forEach((label) => {
        const matchers = coverageMatchers[label] ?? [normalizeCoverageValue(label)];
        if (matchers.some((matcher) => coverageTokens.some((token) => token.includes(matcher)))) {
          coverageSet.add(normalizeCoverageValue(label));
        }
      });
      const ipValue = (asset.ip ?? "").trim();

      if (!grouped.has(hostnameKey)) {
        grouped.set(hostnameKey, {
          asset,
          ips: ipValue ? [ipValue] : [],
          coverageSet,
        });
        return;
      }

      const entry = grouped.get(hostnameKey);
      if (!entry) return;
      if (ipValue && !entry.ips.includes(ipValue)) {
        entry.ips.push(ipValue);
      }
      coverageSet.forEach((tool) => entry.coverageSet.add(tool));
    });

    return Array.from(grouped.values());
  }, [assets]);

  async function handleUpload() {
    if (!file) {
      setError("Selecione um arquivo CSV para importar.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/base-sd/import", {
        method: "POST",
        body: formData,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível importar o CSV.");
      }
      const inserted = Array.isArray(data?.assets) ? data.assets : [];
      if (page === 1) {
        setAssets((prev) => [...inserted, ...prev].slice(0, pageSize));
      }
      setSuccess(
        `Importação concluída: ${data?.inserted ?? 0} registros inseridos, ${data?.skipped ?? 0} ignorados.`
      );
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao importar CSV.");
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    if (!window.confirm("Tem certeza que deseja apagar toda a base SD?")) return;
    setClearing(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("/api/base-sd/clear", { method: "DELETE" });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível limpar a base.");
      }
      setAssets([]);
      setPage(1);
      setSuccess("Base SD limpa com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao limpar base.");
    } finally {
      setClearing(false);
    }
  }

  return (
    <DashboardShell pageTitle="Base SD" pageSubtitle="Base de ativos operacional.">
      <div className="flex w-full flex-col gap-6 px-4 pb-10 lg:px-10">
        <section
          className={cn(
            "relative overflow-hidden rounded-3xl border px-6 py-6",
            isDark
              ? "border-white/10 bg-gradient-to-br from-[#0b1226] via-[#080717] to-[#0a0217] text-zinc-100"
              : "border-slate-200 bg-white text-slate-900"
          )}
        >
          <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl" />
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                Importação de ativos
              </p>
              <h1 className="text-2xl font-semibold">Base SD</h1>
              <p className="max-w-2xl text-sm text-zinc-400">
                Envie o CSV com delimitador “;” ou “,” para alimentar o cadastro.
                Os ativos processados ficam listados logo abaixo.
              </p>
              <p className="text-[11px] text-zinc-500">
                Headers: Hostname, Mês inclusão, Type, CMDB, TLV CMDB, Valid, IP,
                SO, Cobertura atual - Ferramentas, Observação Cofre, Observação Tenable,
                Observação Guardicore, Observação Deep Security, Observação Crowdstrike,
                Observação Wazuh, Observação Trellix.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
              <Input
                type="file"
                accept=".csv,text/csv"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className={cn(
                  "w-full rounded-2xl text-sm sm:w-80",
                  isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                )}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  disabled={loading}
                  onClick={handleUpload}
                >
                  {loading ? "Importando..." : "Importar CSV"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="rounded-2xl"
                  disabled={clearing}
                  onClick={handleClear}
                >
                  {clearing ? "Limpando..." : "Limpar base"}
                </Button>
              </div>
            </div>
          </div>
          {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}
          {success && <p className="mt-3 text-xs text-emerald-400">{success}</p>}
        </section>

        <section className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Página {page}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={page === 1 || loadingList}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Anterior
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={assets.length < pageSize || loadingList}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Próxima
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loadingList && assets.length === 0 ? (
            <div
              className={cn(
                "rounded-2xl border px-4 py-4 text-sm",
                isDark
                  ? "border-white/10 bg-[#050816] text-zinc-400"
                  : "border-slate-200 bg-white text-slate-500"
              )}
            >
              Carregando ativos...
            </div>
          ) : assetCards.length === 0 ? (
            <div
              className={cn(
                "rounded-2xl border px-4 py-4 text-sm",
                isDark
                  ? "border-white/10 bg-[#050816] text-zinc-400"
                  : "border-slate-200 bg-white text-slate-500"
              )}
            >
              Nenhum ativo carregado ainda.
            </div>
          ) : (
            assetCards.map(({ asset, coverageSet, ips }, index) => (
              <div
                key={asset.id ?? `${asset.hostname}-${index}`}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border p-4",
                  isDark
                    ? "border-white/10 bg-[#050816] text-zinc-100"
                    : "border-slate-200 bg-white text-slate-800"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <p className="relative text-base font-semibold text-white">
                  {asset.hostname || "—"}
                </p>
                <div className="mt-2 space-y-1 text-xs text-zinc-400">
                  <p>Mês inclusão: {asset.month_inclusion || "—"}</p>
                  <p>IP: {ips.length ? ips.join(", ") : "—"}</p>
                  <p>SO: {asset.os || "—"}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {coverageLabels.map((label) => {
                    const enabled = coverageSet.has(normalizeCoverageValue(label));
                    return (
                      <Badge
                        key={label}
                        variant={enabled ? "default" : "outline"}
                        className={cn(
                          "text-[11px]",
                          enabled
                            ? "bg-emerald-500/20 text-emerald-200"
                            : isDark
                            ? "border-white/10 text-zinc-500"
                            : "border-slate-200 text-slate-500"
                        )}
                      >
                        {label}
                      </Badge>
                    );
                  })}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => router.push(`/base-sd/${asset.id}`)}
                  >
                    Ver ativo
                  </Button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </DashboardShell>
  );
}

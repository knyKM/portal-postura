"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";

const coverageLabels = [
  "Cofre",
  "Tenable",
  "Guardicore",
  "Deep Security",
  "Crowdstrike",
  "Wazuh",
  "Trellix",
];

const coverageObservationKey: Record<string, string> = {
  Cofre: "obs_cofre",
  Tenable: "obs_tenable",
  Guardicore: "obs_guardicore",
  "Deep Security": "obs_deep_security",
  Crowdstrike: "obs_crowdstrike",
  Wazuh: "obs_wazuh",
  Trellix: "obs_trellix",
};

function normalizeCoverageValue(value: string) {
  return value.trim().toLowerCase();
}

type BaseSdAsset = {
  id: number;
  hostname: string | null;
  month_inclusion: string | null;
  asset_type: string | null;
  cmdb: string | null;
  tlv_cmdb: string | null;
  valid: string | null;
  ip: string | null;
  os: string | null;
  coverage_tools: string | null;
  obs_cofre: string | null;
  obs_tenable: string | null;
  obs_guardicore: string | null;
  obs_deep_security: string | null;
  obs_crowdstrike: string | null;
  obs_wazuh: string | null;
  obs_trellix: string | null;
  created_at: string;
};

export function BaseSdAssetDetail({ assetId }: { assetId: number }) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asset, setAsset] = useState<BaseSdAsset | null>(null);
  const [activeBadge, setActiveBadge] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function fetchAsset() {
      try {
        const response = await fetch(`/api/base-sd?id=${assetId}`);
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "Não foi possível carregar o ativo.");
        }
        if (active) {
          setAsset(data?.asset ?? null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Falha ao carregar ativo.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    if (assetId) {
      fetchAsset();
    } else {
      setLoading(false);
      setError("ID inválido.");
    }
    return () => {
      active = false;
    };
  }, [assetId]);

  const coverageSet = useMemo(() => {
    if (!asset?.coverage_tools) return new Set<string>();
    return new Set(
      asset.coverage_tools
        .split(",")
        .map((value) => normalizeCoverageValue(value))
        .filter(Boolean)
    );
  }, [asset?.coverage_tools]);

  const activeObservation = useMemo(() => {
    if (!asset || !activeBadge) return "";
    const key = coverageObservationKey[activeBadge];
    if (!key) return "";
    return (asset as Record<string, string | null>)[key] ?? "";
  }, [asset, activeBadge]);

  return (
    <DashboardShell
      pageTitle="Base SD"
      pageSubtitle="Detalhes do ativo selecionado."
    >
      <div className="flex w-full flex-col gap-6 px-4 pb-10 lg:px-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Ativo</p>
            <h1 className="text-2xl font-semibold">{asset?.hostname ?? "—"}</h1>
          </div>
          <Button type="button" variant="secondary" onClick={() => router.push("/base-sd")}>
            Voltar
          </Button>
        </div>

        {loading && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-4 text-sm",
              isDark
                ? "border-white/10 bg-[#050816] text-zinc-400"
                : "border-slate-200 bg-white text-slate-500"
            )}
          >
            Carregando ativo...
          </div>
        )}

        {error && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-4 text-sm",
              isDark
                ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
                : "border-rose-200 bg-rose-50 text-rose-700"
            )}
          >
            {error}
          </div>
        )}

        {!loading && asset && (
          <>
            <Card
              className={cn(
                "border",
                isDark ? "border-white/10 bg-[#050816]" : "border-slate-200 bg-white"
              )}
            >
              <CardContent className="space-y-4 p-6 text-sm">
                <div className="grid gap-3 text-xs text-zinc-400 md:grid-cols-2">
                  <div>
                    <p className="uppercase tracking-[0.2em]">Mês inclusão</p>
                    <p className="text-sm text-zinc-200">{asset.month_inclusion || "—"}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.2em]">Type</p>
                    <p className="text-sm text-zinc-200">{asset.asset_type || "—"}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.2em]">CMDB</p>
                    <p className="text-sm text-zinc-200">{asset.cmdb || "—"}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.2em]">TLV CMDB</p>
                    <p className="text-sm text-zinc-200">{asset.tlv_cmdb || "—"}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.2em]">Valid</p>
                    <p className="text-sm text-zinc-200">{asset.valid || "—"}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.2em]">IP</p>
                    <p className="text-sm text-zinc-200">{asset.ip || "—"}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.2em]">SO</p>
                    <p className="text-sm text-zinc-200">{asset.os || "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={cn(
                "border",
                isDark ? "border-white/10 bg-[#050816]" : "border-slate-200 bg-white"
              )}
            >
              <CardContent className="space-y-4 p-6 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                    Cobertura atual - Ferramentas
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {coverageLabels.map((label) => {
                      const enabled = coverageSet.has(normalizeCoverageValue(label));
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setActiveBadge(label)}
                          className="focus:outline-none"
                        >
                          <Badge
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
                        </button>
                      );
                    })}
                  </div>
                </div>
                {activeBadge && (
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-200">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      Observação {activeBadge}
                    </p>
                    <p className="mt-2 text-sm">
                      {activeObservation ? activeObservation : "Sem observação registrada."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardShell>
  );
}

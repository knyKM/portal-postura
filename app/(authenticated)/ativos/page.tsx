"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";

type Server = {
  id: string;
  name: string;
  ip: string;
  environment: string;
  asset_class?: string | null;
  counts: {
    active: number;
    resolved: number;
    total: number;
  };
};

export default function AtivosPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [servers, setServers] = useState<Server[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [queryDraft, setQueryDraft] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("postura_user");
      if (!raw) {
        router.replace("/login");
        return;
      }
      setAuthorized(true);
    } catch {
      router.replace("/login");
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

  async function fetchData(nextPage = page, nextPageSize = pageSize, nextQuery = query) {
    setDataLoading(true);
    setDataError(null);
    try {
      const response = await fetch(
        `/api/ativos?page=${nextPage}&limit=${nextPageSize}&q=${encodeURIComponent(nextQuery)}`
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao carregar ativos.");
      }
      setServers(Array.isArray(data?.servers) ? data.servers : []);
      setPage(data?.pagination?.page ?? nextPage);
      setPageSize(data?.pagination?.limit ?? nextPageSize);
      setTotalCount(data?.pagination?.total ?? 0);
      setTotalPages(data?.pagination?.totalPages ?? 1);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : "Falha ao carregar ativos.");
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    if (!authorized) return;
    void fetchData(1, pageSize, query);
  }, [authorized]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-sm text-zinc-400">
        Carregando...
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <DashboardShell
      pageTitle="Ativos"
      pageSubtitle="Inventário de servidores vinculados às vulnerabilidades."
    >
      <Card
        className={cn(
          "mb-5 rounded-3xl border p-4",
          isDark
            ? "border-white/5 bg-[#050816]/80 text-white"
            : "border-slate-200 bg-white text-slate-900"
        )}
      >
        <CardContent className="p-0 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                Consulta
              </p>
              <h3 className="mt-1 text-lg font-semibold">
                Busque por servidor, IP ou ambiente
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                Use o campo abaixo para localizar ativos no catálogo.
              </p>
            </div>
            <div className="text-xs text-zinc-500">
              {servers.length} de {totalCount} resultado{totalCount === 1 ? "" : "s"}
            </div>
          </div>
          <form
            className="flex flex-col gap-2 md:flex-row md:items-center"
            onSubmit={(event) => {
              event.preventDefault();
              const nextQuery = queryDraft.trim();
              setQuery(nextQuery);
              setPage(1);
              void fetchData(1, pageSize, nextQuery);
            }}
          >
            <Input
              value={queryDraft}
              onChange={(event) => setQueryDraft(event.target.value)}
              placeholder="Ex: SRV-001 ou 10.10.10.5"
              className={cn(
                "h-11 rounded-2xl text-sm",
                isDark
                  ? "border-white/10 bg-black/40 text-white"
                  : "border-slate-200 bg-white"
              )}
            />
            <Button
              type="submit"
              className="h-11 rounded-2xl px-5"
              variant="outline"
            >
              Buscar
            </Button>
          </form>
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <span>Itens por página</span>
            <select
              value={pageSize}
              onChange={(event) => {
                const nextSize = Number(event.target.value);
                setPage(1);
                setPageSize(nextSize);
                void fetchData(1, nextSize, query);
              }}
              className={cn(
                "rounded-xl border px-3 py-2 text-xs",
                isDark
                  ? "border-white/10 bg-[#050816] text-white"
                  : "border-slate-200 bg-white text-slate-700"
              )}
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>
              Página {page} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-xl px-3"
                onClick={() => {
                  const nextPage = Math.max(1, page - 1);
                  setPage(nextPage);
                  void fetchData(nextPage, pageSize, query);
                }}
                disabled={page <= 1 || dataLoading}
              >
                Anterior
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-xl px-3"
                onClick={() => {
                  const nextPage = Math.min(totalPages, page + 1);
                  setPage(nextPage);
                  void fetchData(nextPage, pageSize, query);
                }}
                disabled={page >= totalPages || dataLoading}
              >
                Próxima
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {dataError && (
        <div
          className={cn(
            "mb-4 rounded-2xl border px-4 py-3 text-sm",
            isDark
              ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
              : "border-rose-200 bg-rose-50 text-rose-700"
          )}
        >
          {dataError}
        </div>
      )}

      {dataLoading ? (
        <p className={cn("text-sm", isDark ? "text-zinc-400" : "text-slate-500")}>
          Carregando ativos...
        </p>
      ) : servers.length === 0 ? (
        <p className={cn("text-sm", isDark ? "text-zinc-400" : "text-slate-500")}>
          Nenhum ativo encontrado.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {servers.map((server) => (
            <Card
              key={server.id}
              className={cn(
                "rounded-3xl border p-4",
                isDark
                  ? "border-white/5 bg-[#050816]/80 text-white"
                  : "border-slate-200 bg-white text-slate-900"
              )}
            >
              <CardContent className="p-0 space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                    {server.asset_class ?? "Ativo"}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{server.name}</h3>
                  <p className="text-sm text-zinc-400">
                    {server.ip} · {server.environment ?? "Sem ambiente"}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-zinc-400">
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      Abertas
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {server.counts.active}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      Corrigidas
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {server.counts.resolved}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      Total
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {server.counts.total}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/vulnerabilidades/ativos/${server.id}`}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-[11px] font-semibold",
                      isDark
                        ? "border-white/10 text-zinc-200"
                        : "border-slate-200 text-slate-700"
                    )}
                  >
                    Ver detalhes
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

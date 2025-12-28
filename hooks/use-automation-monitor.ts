"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AutomationJob, AutomationLog } from "@/data/automation-monitor";

type AutomationApiResponse = {
  jobs?: AutomationJob[];
  logs?: AutomationLog[];
  generatedAt?: string;
};

const STORAGE_KEY = "postura_automation_snapshot";

type PersistedSnapshot = {
  jobs: AutomationJob[];
  logs: AutomationLog[];
  generatedAt: string;
};

export function useAutomationMonitor(pollInterval = 15000) {
  const [jobs, setJobs] = useState<AutomationJob[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const hydratedRef = useRef(false);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    if (typeof window === "undefined") return;
    const cached = window.sessionStorage.getItem(STORAGE_KEY);
    if (!cached) return;
    try {
      const parsed = JSON.parse(cached) as PersistedSnapshot;
      setJobs(parsed.jobs ?? []);
      setLogs(parsed.logs ?? []);
      setLastUpdated(parsed.generatedAt ? new Date(parsed.generatedAt) : null);
      setIsLoading(false);
    } catch {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const requestSnapshot = useCallback(async () => {
    const response = await fetch("/api/auditoria", {
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => ({}))) as AutomationApiResponse;

    if (!response.ok) {
      const message = typeof payload?.error === "string" ? payload.error : response.statusText;
      throw new Error(message || "Falha ao consultar auditoria.");
    }

    return {
      jobs: payload.jobs ?? [],
      logs: payload.logs ?? [],
      generatedAt: payload.generatedAt ?? new Date().toISOString(),
    };
  }, []);

  const updateSnapshot = useCallback(
    async (showSpinner: boolean) => {
      if (showSpinner) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const { jobs: fetchedJobs, logs: fetchedLogs, generatedAt } = await requestSnapshot();
        if (!mountedRef.current) return;
        setJobs(fetchedJobs);
        setLogs(fetchedLogs);
        setLastUpdated(new Date(generatedAt));
        if (typeof window !== "undefined") {
          const payload: PersistedSnapshot = {
            jobs: fetchedJobs,
            logs: fetchedLogs,
            generatedAt,
          };
          window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        }
      } catch (err) {
        if (!mountedRef.current) return;
        const message = err instanceof Error ? err.message : "Não foi possível atualizar os dados.";
        setError(message);
      } finally {
        if (showSpinner && mountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [requestSnapshot]
  );

  useEffect(() => {
    updateSnapshot(true);
    const interval = window.setInterval(() => {
      updateSnapshot(false);
    }, pollInterval);

    return () => {
      window.clearInterval(interval);
    };
  }, [pollInterval, updateSnapshot]);

  const refetch = useCallback(async () => {
    await updateSnapshot(true);
  }, [updateSnapshot]);

  return {
    jobs,
    logs,
    lastUpdated,
    isLoading,
    error,
    refetch,
  };
}

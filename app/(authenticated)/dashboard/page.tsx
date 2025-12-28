"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("postura_user");
    if (!user) {
      router.push("/login");
    }
  }, []);

  return (
    <DashboardShell
      pageTitle="Dashboard"
      pageSubtitle="Visão Geral de Vulnerabilidades"
    >
      <DashboardContent />
    </DashboardShell>
  );
}

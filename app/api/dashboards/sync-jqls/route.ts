"use server";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { rebuildDashboardJqlRegistryFromDatabase } from "@/lib/dashboards/jql-registry";

export async function POST(request: Request) {
  const sessionUser = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!sessionUser) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  if (sessionUser.role !== "admin") {
    return NextResponse.json({ error: "Permissão insuficiente." }, { status: 403 });
  }

  try {
    const result = rebuildDashboardJqlRegistryFromDatabase();
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Falha ao sincronizar JQLs.",
      },
      { status: 500 }
    );
  }
}

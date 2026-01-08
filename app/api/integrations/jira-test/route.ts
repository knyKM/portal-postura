import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";

type JiraTestPayload = {
  url?: string;
  token?: string;
};

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as JiraTestPayload | null;
  const url = body?.url?.trim() ?? "";
  const token = body?.token?.trim() ?? "";

  if (!url) {
    return NextResponse.json(
      { error: "Informe a URL base do Jira." },
      { status: 400 }
    );
  }

  const sanitizedUrl = url.replace(/\/+$/, "");
  const target = `${sanitizedUrl}/rest/api/3/serverInfo`;
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(target, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Falha na comunicação com o Jira (status ${response.status}).`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? `Não foi possível conectar ao Jira: ${err.message}`
            : "Não foi possível conectar ao Jira.",
      },
      { status: 400 }
    );
  } finally {
    clearTimeout(timeout);
  }
}

import { NextResponse } from "next/server";
import { Agent } from "undici";
import { getSessionUser } from "@/lib/auth/session";

type JiraTestPayload = {
  url?: string;
  token?: string;
  verifySsl?: boolean;
  issueId?: string;
};

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as JiraTestPayload | null;
  const url = body?.url?.trim() ?? "";
  const token = body?.token?.trim() ?? "";
  const verifySsl = body?.verifySsl ?? true;
  const issueId = body?.issueId?.trim() ?? "";

  if (!url) {
    return NextResponse.json(
      { error: "Informe a URL base do Jira." },
      { status: 400 }
    );
  }

  const sanitizedUrl = url.replace(/\/+$/, "");
  const target = issueId
    ? `${sanitizedUrl}/rest/api/3/issue/${encodeURIComponent(
        issueId
      )}?fields=summary`
    : `${sanitizedUrl}/rest/api/3/serverInfo`;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const dispatcher = verifySsl
      ? undefined
      : new Agent({ connect: { rejectUnauthorized: false } });
    const response = await fetch(target, {
      method: "GET",
      headers,
      signal: controller.signal,
      dispatcher,
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.errorMessages?.[0] || data?.error || data?.message || "";
      return NextResponse.json(
        {
          status: response.status,
          message,
        },
        { status: response.status }
      );
    }

    if (issueId) {
      return NextResponse.json({
        status: response.status,
        message: data?.message ?? response.statusText ?? "",
        summary: data?.fields?.summary ?? data?.summary ?? "",
      });
    }

    return NextResponse.json({
      status: response.status,
      message: data?.message ?? response.statusText ?? "",
    });
  } finally {
    clearTimeout(timeout);
  }
}

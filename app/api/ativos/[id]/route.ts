import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { updateVulnerabilityServerClass } from "@/lib/vulnerabilities/vulnerability-service";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Ativo inválido." }, { status: 400 });
  }

  const payload = (await request.json().catch(() => null)) as {
    assetClass?: string;
  } | null;
  if (!payload || typeof payload.assetClass !== "string") {
    return NextResponse.json({ error: "Classe inválida." }, { status: 400 });
  }

  const nextClass = payload.assetClass.trim();
  if (!nextClass) {
    return NextResponse.json({ error: "Classe inválida." }, { status: 400 });
  }

  updateVulnerabilityServerClass(id, nextClass);

  return NextResponse.json({ ok: true });
}

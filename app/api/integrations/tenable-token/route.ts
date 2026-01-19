import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  getUserTenableSettings,
  updateUserTenableSettings,
} from "@/lib/auth/user-service";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const settings = getUserTenableSettings(session.id);
  return NextResponse.json({
    accessKey: settings?.tenable_access_key ?? "",
    secretKey: settings?.tenable_secret_key ?? "",
  });
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { accessKey?: string; secretKey?: string }
    | null;

  const accessKey = body?.accessKey?.trim() ?? "";
  const secretKey = body?.secretKey?.trim() ?? "";
  if (!accessKey || !secretKey) {
    return NextResponse.json(
      { error: "Informe access key e secret key do Tenable." },
      { status: 400 }
    );
  }

  const updated = updateUserTenableSettings(session.id, {
    accessKey,
    secretKey,
  });
  if (!updated) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }
  return NextResponse.json({
    accessKey: updated.tenable_access_key ?? "",
    secretKey: updated.tenable_secret_key ?? "",
  });
}

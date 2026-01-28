import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/auth/database";

export async function DELETE(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  try {
    db.prepare("DELETE FROM base_sd_assets").run();
    return NextResponse.json({ cleared: true });
  } catch (error) {
    console.error("[base-sd:clear]", error);
    return NextResponse.json(
      { error: "Não foi possível limpar a base." },
      { status: 500 }
    );
  }
}

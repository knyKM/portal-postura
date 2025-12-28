import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { listOnlineAdmins } from "@/lib/auth/user-service";

export async function GET(request: Request) {
  const sessionUser = await getSessionUser(request.headers.get("cookie") ?? undefined);

  if (!sessionUser) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (sessionUser.role !== "admin") {
    return NextResponse.json({ error: "Permissão insuficiente." }, { status: 403 });
  }

  const onlineAdmins = listOnlineAdmins();
  return NextResponse.json({
    users: onlineAdmins.map((admin) => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      last_seen_at: admin.last_seen_at,
    })),
  });
}

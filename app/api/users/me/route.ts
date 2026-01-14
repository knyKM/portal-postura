import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/user-service";
import { getSecurityLevelByKey } from "@/lib/security/security-level-service";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const user = findUserById(session.id);
  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  const level = getSecurityLevelByKey(user.security_level);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      security_level: user.security_level,
      allowed_routes: level?.allowedRoutes ?? [],
      is_active: Boolean(user.is_active),
    },
  });
}

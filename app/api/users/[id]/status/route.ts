import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { updateUserActiveStatus } from "@/lib/auth/user-service";

type RouteContext =
  | {
      params?: {
        id?: string;
      };
    }
  | undefined;

type UpdateStatusRequest = {
  active?: boolean;
};

function resolveUserId(request: Request, context?: RouteContext): number {
  const paramId = context?.params?.id;
  if (paramId) {
    return Number(paramId);
  }

  const pathname = new URL(request.url).pathname;
  const segments = pathname.split("/").filter(Boolean);
  const usersIndex = segments.findIndex((segment) => segment === "users");
  if (usersIndex >= 0 && segments.length > usersIndex + 1) {
    return Number(segments[usersIndex + 1]);
  }

  return Number.NaN;
}

export async function PATCH(request: Request, context?: RouteContext) {
  const sessionUser = await getSessionUser(request.headers.get("cookie") ?? undefined);

  if (!sessionUser) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (sessionUser.role !== "admin") {
    return NextResponse.json(
      { error: "Permissão insuficiente." },
      { status: 403 }
    );
  }

  const userId = resolveUserId(request, context);

  if (Number.isNaN(userId) || userId <= 0) {
    return NextResponse.json({ error: "Usuário inválido." }, { status: 400 });
  }

  const payload = (await request.json()) as UpdateStatusRequest | null;
  const desiredState = payload?.active;

  if (typeof desiredState !== "boolean") {
    return NextResponse.json(
      { error: "Informe o status desejado." },
      { status: 400 }
    );
  }

  if (!desiredState && sessionUser.id === userId) {
    return NextResponse.json(
      { error: "Você não pode inativar o próprio usuário." },
      { status: 400 }
    );
  }

  const updated = updateUserActiveStatus(userId, desiredState);

  if (!updated) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      is_active: Boolean(updated.is_active),
    },
  });
}

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  countUnreadNotifications,
  listUserNotifications,
  markNotificationsAsRead,
  deleteUserNotifications,
  NotificationRecord,
} from "@/lib/notifications/notification-service";

function parsePayload(raw: string | null) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function serializeNotification(record: NotificationRecord) {
  return {
    id: record.id,
    type: record.type,
    title: record.title,
    message: record.message,
    payload: parsePayload(record.payload),
    is_read: Boolean(record.is_read),
    created_at: record.created_at,
    read_at: record.read_at,
  };
}

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json(
      { error: "Sessão inválida." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get("limit") ?? 20);
  const limit = Number.isNaN(limitParam)
    ? 20
    : Math.max(1, Math.min(50, limitParam));

  const notifications = listUserNotifications(session.id, limit).map(
    serializeNotification
  );
  const unreadCount = countUnreadNotifications(session.id);

  return NextResponse.json({ notifications, unreadCount });
}

type MarkNotificationsPayload = {
  ids?: number[];
};

export async function PATCH(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json(
      { error: "Sessão inválida." },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => null)) as
    | MarkNotificationsPayload
    | null;

  let ids: number[] | undefined = undefined;
  if (Array.isArray(body?.ids) && body.ids.length > 0) {
    ids = body.ids
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0);
    if (ids.length === 0) {
      ids = undefined;
    }
  }

  markNotificationsAsRead(session.id, ids);

  return NextResponse.json({
    success: true,
    unreadCount: countUnreadNotifications(session.id),
  });
}

export async function DELETE(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json(
      { error: "Sessão inválida." },
      { status: 401 }
    );
  }

  deleteUserNotifications(session.id);

  return NextResponse.json({ success: true, notifications: [], unreadCount: 0 });
}

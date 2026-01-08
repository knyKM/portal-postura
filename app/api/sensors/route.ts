"use server";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  createSensor,
  createSensorsBulk,
  listSensors,
} from "@/lib/sensors/sensor-service";

type CreateSensorPayload = {
  hostname?: string;
  ip?: string;
  environment?: string;
  ownerTool?: string;
};

type BulkPayload = {
  sensors?: CreateSensorPayload[];
};

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  return NextResponse.json({ sensors: listSensors() });
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | CreateSensorPayload
    | BulkPayload
    | null;
  if (!payload) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const sensors = Array.isArray((payload as BulkPayload).sensors)
    ? (payload as BulkPayload).sensors
    : null;

  if (sensors) {
    const cleaned = sensors
      .map((item) => ({
        hostname: item.hostname?.trim() ?? "",
        ip: item.ip?.trim() ?? "",
        environment: item.environment?.trim() ?? "",
        ownerTool: item.ownerTool?.trim() ?? "",
      }))
      .filter((item) => item.hostname && item.ip);
    if (cleaned.length === 0) {
      return NextResponse.json(
        { error: "Informe sensores válidos para importar." },
        { status: 400 }
      );
    }
    const created = createSensorsBulk(cleaned);
    return NextResponse.json({ sensors: created }, { status: 201 });
  }

  const hostname = (payload as CreateSensorPayload).hostname?.trim() ?? "";
  const ip = (payload as CreateSensorPayload).ip?.trim() ?? "";
  if (!hostname || !ip) {
    return NextResponse.json(
      { error: "Hostname e IP são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const sensor = createSensor({
      hostname,
      ip,
      environment: (payload as CreateSensorPayload).environment,
      ownerTool: (payload as CreateSensorPayload).ownerTool,
    });
    return NextResponse.json({ sensor }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao criar sensor." },
      { status: 500 }
    );
  }
}

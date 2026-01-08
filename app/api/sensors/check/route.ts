"use server";

import { NextResponse } from "next/server";
import { promisify } from "util";
import { exec } from "child_process";
import { getSessionUser } from "@/lib/auth/session";
import {
  listSensors,
  listStaleSensors,
  updateSensorStatus,
} from "@/lib/sensors/sensor-service";

const execAsync = promisify(exec);
const STALE_MINUTES = 20;

type CheckPayload = {
  ids?: number[];
};

async function pingHost(ip: string) {
  const sanitizedIp = ip.trim();
  try {
    const command = `ping -c 1 -W 1 ${sanitizedIp}`;
    const { stdout } = await execAsync(command);
    const match = stdout.match(/time[=<]([\\d.]+)/);
    const latency = match ? `${Number(match[1]).toFixed(1)} ms` : "resposta recebida";
    return { status: "up" as const, detail: `Latência ${latency}` };
  } catch {
    return { status: "down" as const, detail: "Timeout ou host inacessível" };
  }
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as CheckPayload | null;
  const ids = Array.isArray(payload?.ids) ? payload?.ids : null;

  const targets = ids?.length
    ? listSensors().filter((sensor) => ids.includes(sensor.id))
    : listStaleSensors(STALE_MINUTES);

  const now = new Date().toISOString();
  const updated = await Promise.all(
    targets.map(async (sensor) => {
      const result = await pingHost(sensor.ip);
      return updateSensorStatus(sensor.id, result.status, result.detail, now);
    })
  );

  return NextResponse.json({
    checked: targets.length,
    sensors: updated.filter(Boolean),
    checkedAt: now,
  });
}

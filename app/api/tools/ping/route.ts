import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const ips = Array.isArray(body?.ips)
      ? body.ips.filter((ip: unknown) => typeof ip === "string" && ip.trim())
      : [];
    if (!ips.length) {
      return NextResponse.json(
        { error: "Informe uma lista de IPs para ping." },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      ips.map(async (ip: string) => {
        const sanitizedIp = ip.trim();
        try {
          const command = `ping -c 1 -W 1 ${sanitizedIp}`;
          const { stdout } = await execAsync(command);
          const match = stdout.match(/time[=<]([\\d.]+)/);
          const latency = match ? `${Number(match[1]).toFixed(1)} ms` : "resposta recebida";
          return { ip: sanitizedIp, status: "ok", detail: `Latência ${latency}` };
        } catch {
          return { ip: sanitizedIp, status: "error", detail: "Timeout ou host inacessível" };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha ao executar ping.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


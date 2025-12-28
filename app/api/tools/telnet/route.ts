import { NextResponse } from "next/server";
import net from "net";

function testPort(ip: string, port: number, timeoutMs = 2000) {
  return new Promise<{ ip: string; status: "ok" | "error"; detail: string }>((resolve) => {
    const socket = new net.Socket();
    let settled = false;
    function finish(status: "ok" | "error", detail: string) {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve({ ip, status, detail });
    }

    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish("ok", `Porta ${port} aberta`));
    socket.once("timeout", () => finish("error", `Porta ${port} não respondeu`));
    socket.once("error", () => finish("error", `Conexão recusada ou indisponível`));

    try {
      socket.connect(port, ip);
    } catch {
      finish("error", "Falha ao iniciar conexão");
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const ips = Array.isArray(body?.ips)
      ? body.ips.filter((ip: unknown) => typeof ip === "string" && ip.trim())
      : [];
    const port = Number(body?.port);
    if (!ips.length) {
      return NextResponse.json(
        { error: "Informe IPs para validar." },
        { status: 400 }
      );
    }
    if (!Number.isFinite(port) || port < 1 || port > 65535) {
      return NextResponse.json(
        { error: "Informe uma porta válida (1-65535)." },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      ips.map((ip: string) => testPort(ip.trim(), port))
    );

    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha ao executar telnet.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  try {
    const filePath = path.join(process.cwd(), "data", "dashboard-jql-results.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ users: [], generatedAt: null });
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    const payload = JSON.parse(raw);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("[dashboard-jql-results:GET]", error);
    return NextResponse.json(
      { error: "Não foi possível carregar os resultados." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getBaseSdAssetById, listBaseSdAssets } from "@/lib/base-sd/base-sd-service";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const idParam = url.searchParams.get("id");
    if (idParam) {
      const id = Number(idParam);
      if (!Number.isFinite(id) || id <= 0) {
        return NextResponse.json({ error: "ID inválido." }, { status: 400 });
      }
      const asset = getBaseSdAssetById(id);
      if (!asset) {
        return NextResponse.json({ error: "Ativo não encontrado." }, { status: 404 });
      }
      return NextResponse.json({ asset });
    }
    const limitParam = url.searchParams.get("limit");
    const pageParam = url.searchParams.get("page");
    const limit = limitParam ? Number(limitParam) : 20;
    const page = pageParam ? Number(pageParam) : 1;
    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 20;
    const safePage = Number.isFinite(page) ? Math.max(page, 1) : 1;
    const offset = (safePage - 1) * safeLimit;
    return NextResponse.json({ assets: listBaseSdAssets(safeLimit, offset) });
  } catch (error) {
    console.error("[base-sd:GET]", error);
    return NextResponse.json(
      { error: "Não foi possível carregar a base." },
      { status: 500 }
    );
  }
}

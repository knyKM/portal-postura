import { NextResponse } from "next/server";
import { listAutomationSnapshot } from "@/lib/auditoria/automation-service";

export async function GET() {
  try {
    const snapshot = await listAutomationSnapshot();
    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[auditoria:snapshot]", error);
    return NextResponse.json(
      { error: "Não foi possível consultar os jobs monitorados." },
      { status: 500 }
    );
  }
}

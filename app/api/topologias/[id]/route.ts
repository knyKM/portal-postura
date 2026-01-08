"use server";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  updateTopology,
  deleteTopology,
  getTopologyById,
  TopologyLink,
  TopologyNode,
  TopologyCustomType,
} from "@/lib/topology/topology-service";

type ParamsPromise = Promise<{ id: string }>;

export async function GET(
  request: Request,
  { params }: { params: ParamsPromise }
) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const topology = getTopologyById(id);
  if (!topology) {
    return NextResponse.json({ error: "Topologia não encontrada." }, { status: 404 });
  }

  return NextResponse.json({ topology });
}

type UpdatePayload = {
  name?: string;
  nodes?: TopologyNode[];
  links?: TopologyLink[];
  customTypes?: TopologyCustomType[];
};

export async function PATCH(
  request: Request,
  { params }: { params: ParamsPromise }
) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const payload = (await request.json().catch(() => null)) as UpdatePayload | null;
  if (!payload) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  try {
    const topology = updateTopology(id, {
      name: payload.name,
      nodes: payload.nodes,
      links: payload.links,
      customTypes: payload.customTypes,
    });
    return NextResponse.json({ topology });
  } catch (error) {
    console.error("[topologias:PATCH]", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar a topologia." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: ParamsPromise }
) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }
  if (session.role !== "admin") {
    return NextResponse.json(
      { error: "Apenas administradores podem excluir topologias." },
      { status: 403 }
    );
  }

  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    const removed = deleteTopology(id);
    if (!removed) {
      return NextResponse.json({ error: "Topologia não encontrada." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[topologias:DELETE]", error);
    return NextResponse.json(
      { error: "Não foi possível remover a topologia." },
      { status: 500 }
    );
  }
}

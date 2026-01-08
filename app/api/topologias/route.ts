"use server";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  listTopologies,
  createTopology,
  TopologyLink,
  TopologyNode,
  TopologyCustomType,
} from "@/lib/topology/topology-service";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }
  return NextResponse.json({ topologies: listTopologies() });
}

type CreatePayload = {
  name?: string;
  nodes?: TopologyNode[];
  links?: TopologyLink[];
  customTypes?: TopologyCustomType[];
};

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as CreatePayload | null;
  if (!body?.name) {
    return NextResponse.json({ error: "Informe o nome da topologia." }, { status: 400 });
  }

  try {
    const topology = createTopology({
      name: body.name,
      nodes: Array.isArray(body.nodes) ? body.nodes : [],
      links: Array.isArray(body.links) ? body.links : [],
      customTypes: Array.isArray(body.customTypes) ? body.customTypes : [],
    });
    return NextResponse.json({ topology }, { status: 201 });
  } catch (error) {
    console.error("[topologias:POST]", error);
    return NextResponse.json(
      { error: "Falha ao criar topologia." },
      { status: 500 }
    );
  }
}

import { db } from "@/lib/auth/database";
import { getLocalTimestamp } from "@/lib/utils/time";

export type TopologyNode = {
  id: string;
  label: string;
  iconId: string;
  x: number;
  y: number;
};

export type TopologyLink = {
  id: string;
  from: string;
  to: string;
};

export type TopologyCustomType = {
  id: string;
  label: string;
  iconKey: string;
};

export type TopologyRecord = {
  id: number;
  name: string;
  nodes: string;
  links: string;
  custom_types: string;
  created_at: string;
  updated_at: string;
};

export type Topology = {
  id: number;
  name: string;
  nodes: TopologyNode[];
  links: TopologyLink[];
  customTypes: TopologyCustomType[];
  createdAt: string;
  updatedAt: string;
};

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mapRecord(record: TopologyRecord): Topology {
  return {
    id: record.id,
    name: record.name,
    nodes: parseJson<TopologyNode[]>(record.nodes, []),
    links: parseJson<TopologyLink[]>(record.links, []),
    customTypes: parseJson<TopologyCustomType[]>(record.custom_types ?? "[]", []),
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export function listTopologies(): Topology[] {
  const stmt = db.prepare<TopologyRecord>(
    "SELECT * FROM topologies ORDER BY updated_at DESC, created_at DESC"
  );
  return stmt.all().map(mapRecord);
}

export function getTopologyById(id: number): Topology | null {
  const stmt = db.prepare<TopologyRecord>("SELECT * FROM topologies WHERE id = ?");
  const record = stmt.get(id);
  return record ? mapRecord(record) : null;
}

type CreateTopologyInput = {
  name: string;
  nodes: TopologyNode[];
  links: TopologyLink[];
  customTypes?: TopologyCustomType[];
};

export function createTopology(data: CreateTopologyInput): Topology {
  const now = getLocalTimestamp();
  const stmt = db.prepare(
    `INSERT INTO topologies (name, nodes, links, custom_types, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  const info = stmt.run(
    data.name,
    JSON.stringify(data.nodes ?? []),
    JSON.stringify(data.links ?? []),
    JSON.stringify(data.customTypes ?? []),
    now,
    now
  );
  const fetch = db.prepare<TopologyRecord>(
    "SELECT * FROM topologies WHERE id = ?"
  );
  const record = fetch.get(Number(info.lastInsertRowid));
  if (!record) {
    throw new Error("Falha ao criar topologia");
  }
  return mapRecord(record);
}

type UpdateTopologyInput = Partial<{
  name: string;
  nodes: TopologyNode[];
  links: TopologyLink[];
  customTypes: TopologyCustomType[];
}>;

export function updateTopology(
  id: number,
  input: UpdateTopologyInput
): Topology {
  const existing = getTopologyById(id);
  if (!existing) {
    throw new Error("Topologia não encontrada");
  }

  const stmt = db.prepare(
    `UPDATE topologies
     SET name = ?, nodes = ?, links = ?, custom_types = ?, updated_at = datetime('now','localtime')
     WHERE id = ?`
  );

  stmt.run(
    input.name ?? existing.name,
    JSON.stringify(input.nodes ?? existing.nodes),
    JSON.stringify(input.links ?? existing.links),
    JSON.stringify(input.customTypes ?? existing.customTypes),
    id
  );

  const refreshed = getTopologyById(id);
  if (!refreshed) {
    throw new Error("Falha ao atualizar topologia");
  }
  return refreshed;
}

export function deleteTopology(id: number): boolean {
  const stmt = db.prepare("DELETE FROM topologies WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}

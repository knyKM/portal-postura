"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import {
  Cloud,
  Cpu,
  Database,
  Download,
  FileText,
  Globe,
  HardDrive,
  Laptop,
  Link2,
  Monitor,
  Printer,
  Router,
  Server,
  Shield,
  Smartphone,
  Wifi,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

type IconId = string;
type IconKey = string;

type TopologyNode = {
  id: string;
  label: string;
  iconId: IconId;
  x: number;
  y: number;
  ip?: string;
  description?: string;
};

type TopologyLink = {
  id: string;
  from: string;
  to: string;
};

type TopologyCustomType = {
  id: string;
  label: string;
  iconKey: IconKey;
};

type TopologyEntry = {
  id: number;
  name: string;
  nodes: TopologyNode[];
  links: TopologyLink[];
  customTypes?: TopologyCustomType[];
  createdAt: string;
  updatedAt: string;
};

type DragState = {
  id: string;
  offsetX: number;
  offsetY: number;
};

const NODE_WIDTH = 160;
const NODE_HEIGHT = 72;

const iconLibrary: Array<{ id: IconKey; label: string; Icon: typeof Server }> = [
  { id: "server", label: "Servidor", Icon: Server },
  { id: "laptop", label: "Notebook", Icon: Laptop },
  { id: "router", label: "Roteador", Icon: Router },
  { id: "database", label: "Banco de dados", Icon: Database },
  { id: "cloud", label: "Nuvem", Icon: Cloud },
  { id: "globe", label: "Internet", Icon: Globe },
  { id: "shield", label: "Firewall", Icon: Shield },
  { id: "cpu", label: "Processador", Icon: Cpu },
  { id: "hard-drive", label: "Storage", Icon: HardDrive },
  { id: "monitor", label: "Monitor", Icon: Monitor },
  { id: "printer", label: "Impressora", Icon: Printer },
  { id: "smartphone", label: "Mobile", Icon: Smartphone },
  { id: "wifi", label: "Wi-Fi", Icon: Wifi },
];

const baseIconOptions: Array<{ id: IconId; label: string; Icon: typeof Server }> = [
  { id: "server", label: "Servidor", Icon: Server },
  { id: "laptop", label: "Notebook", Icon: Laptop },
  { id: "router", label: "Roteador", Icon: Router },
  { id: "database", label: "Banco de dados", Icon: Database },
];

const defaultNodes: TopologyNode[] = [
  {
    id: "node-1",
    label: "Gateway",
    iconId: "router",
    x: 120,
    y: 140,
  },
  {
    id: "node-2",
    label: "Servidor de Apps",
    iconId: "server",
    x: 380,
    y: 100,
  },
];

const defaultLinks: TopologyLink[] = [
  { id: "link-1", from: "node-1", to: "node-2" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function TopologiaPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const nextNodeId = useRef(3);
  const nextLinkId = useRef(2);

  const [nodes, setNodes] = useState<TopologyNode[]>(() => defaultNodes);
  const [links, setLinks] = useState<TopologyLink[]>(() => defaultLinks);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("node-1");
  const [linkMode, setLinkMode] = useState(false);
  const [linkFromId, setLinkFromId] = useState<string | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [topologies, setTopologies] = useState<TopologyEntry[]>([]);
  const [selectedTopologyId, setSelectedTopologyId] = useState<number | null>(
    null
  );
  const [topologyName, setTopologyName] = useState("Nova topologia");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [customTypes, setCustomTypes] = useState<TopologyCustomType[]>([]);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeIconId, setNewTypeIconId] = useState<IconKey>("server");
  const [newTypeError, setNewTypeError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [editingCustomTypeId, setEditingCustomTypeId] = useState<string | null>(
    null
  );

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  const iconOptions = useMemo(() => {
    const customOptions = customTypes.map((type) => {
      const Icon =
        iconLibrary.find((icon) => icon.id === type.iconKey)?.Icon ?? Server;
      return { id: type.id, label: type.label, Icon };
    });
    return [...baseIconOptions, ...customOptions];
  }, [customTypes]);

  const zoomLabel = `${Math.round(zoom * 100)}%`;
  const zoomMin = 0.6;
  const zoomMax = 1.6;
  const zoomStep = 0.1;

  function normalizeTypeId(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  function resetIdCounters(
    nextNodes: TopologyNode[],
    nextLinks: TopologyLink[]
  ) {
    const maxNodeId = nextNodes.reduce((acc, node) => {
      const value = Number(node.id.replace("node-", ""));
      return Number.isFinite(value) ? Math.max(acc, value) : acc;
    }, 0);
    const maxLinkId = nextLinks.reduce((acc, link) => {
      const value = Number(link.id.replace("link-", ""));
      return Number.isFinite(value) ? Math.max(acc, value) : acc;
    }, 0);
    nextNodeId.current = maxNodeId + 1;
    nextLinkId.current = maxLinkId + 1;
  }

  function applyTopology(topology: TopologyEntry) {
    setNodes(topology.nodes);
    setLinks(topology.links);
    setTopologyName(topology.name);
    setSelectedTopologyId(topology.id);
    setCustomTypes(topology.customTypes ?? []);
    setIsCreatingNew(false);
    setSelectedNodeId(null);
    setSelectedLinkId(null);
    setLinkFromId(null);
    setLinkMode(false);
    resetIdCounters(topology.nodes, topology.links);
  }

  function resetToNewTopology() {
    setNodes(defaultNodes);
    setLinks(defaultLinks);
    setTopologyName("Nova topologia");
    setSelectedTopologyId(null);
    setCustomTypes([]);
    setIsCreatingNew(true);
    setSelectedNodeId(null);
    setSelectedLinkId(null);
    setLinkFromId(null);
    setLinkMode(false);
    resetIdCounters(defaultNodes, defaultLinks);
  }

  useEffect(() => {
    async function loadTopologies() {
      setIsLoading(true);
      setSaveError(null);
      try {
        const response = await fetch("/api/topologias");
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "Não foi possível carregar topologias.");
        }
        const list = Array.isArray(data?.topologies) ? data.topologies : [];
        setTopologies(list);
        if (list.length > 0) {
          applyTopology(list[0]);
        } else {
          resetToNewTopology();
        }
      } catch (error) {
        setSaveError(
          error instanceof Error
            ? error.message
            : "Falha ao carregar topologias."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadTopologies();
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragRef.current || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const nextX = clamp(
        (event.clientX - rect.left) / zoom - dragRef.current.offsetX,
        0,
        rect.width - NODE_WIDTH
      );
      const nextY = clamp(
        (event.clientY - rect.top) / zoom - dragRef.current.offsetY,
        0,
        rect.height - NODE_HEIGHT
      );
      setNodes((prev) =>
        prev.map((node) =>
          node.id === dragRef.current?.id
            ? { ...node, x: nextX, y: nextY }
            : node
        )
      );
    };

    const handlePointerUp = () => {
      dragRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  function createNodeAt(iconId: IconId, x: number, y: number) {
    const id = `node-${nextNodeId.current}`;
    const label = `Maquina ${nextNodeId.current}`;
    nextNodeId.current += 1;
    setNodes((prev) => [
      ...prev,
      {
        id,
        label,
        iconId,
        x,
        y,
        ip: "",
        description: "",
      },
    ]);
    setSelectedNodeId(id);
  }

  function handleCanvasDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const iconId = event.dataTransfer.getData("application/x-topology-icon");
    if (!iconId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clamp(
      (event.clientX - rect.left) / zoom - NODE_WIDTH / 2,
      0,
      rect.width - NODE_WIDTH
    );
    const y = clamp(
      (event.clientY - rect.top) / zoom - NODE_HEIGHT / 2,
      0,
      rect.height - NODE_HEIGHT
    );
    createNodeAt(iconId as IconId, x, y);
  }

  function handleCanvasClick() {
    setSelectedNodeId(null);
    setSelectedLinkId(null);
    if (!linkMode) {
      setLinkFromId(null);
    }
  }

  function handleNodePointerDown(event: React.PointerEvent, node: TopologyNode) {
    if (linkMode) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSelectedLinkId(null);
    setSelectedNodeId(node.id);
    dragRef.current = {
      id: node.id,
      offsetX: (event.clientX - rect.left) / zoom - node.x,
      offsetY: (event.clientY - rect.top) / zoom - node.y,
    };
  }

  function toggleLinkMode() {
    setLinkMode((prev) => {
      if (prev) {
        setLinkFromId(null);
      }
      return !prev;
    });
  }

  function handleNodeClick(node: TopologyNode) {
    setSelectedLinkId(null);
    setSelectedNodeId(node.id);
    if (!linkMode) return;
    if (!linkFromId) {
      setLinkFromId(node.id);
      return;
    }
    if (linkFromId === node.id) return;
    const exists = links.some(
      (link) =>
        (link.from === linkFromId && link.to === node.id) ||
        (link.from === node.id && link.to === linkFromId)
    );
    if (!exists) {
      const linkId = `link-${nextLinkId.current}`;
      nextLinkId.current += 1;
      setLinks((prev) => [...prev, { id: linkId, from: linkFromId, to: node.id }]);
    }
    setLinkFromId(null);
  }

  function updateSelectedNode(updates: Partial<TopologyNode>) {
    if (!selectedNodeId) return;
    setNodes((prev) =>
      prev.map((node) =>
        node.id === selectedNodeId ? { ...node, ...updates } : node
      )
    );
  }

  function handleAddCustomType() {
    const label = newTypeName.trim();
    if (!label) {
      setNewTypeError("Informe o nome do dispositivo.");
      return;
    }
    const id = normalizeTypeId(label);
    if (!id) {
      setNewTypeError("Nome invalido para o dispositivo.");
      return;
    }
    if (baseIconOptions.some((option) => option.id === id)) {
      setNewTypeError("Este nome ja pertence a um tipo base.");
      return;
    }
    if (customTypes.some((option) => option.id === id)) {
      setNewTypeError("Ja existe um dispositivo com esse nome.");
      return;
    }
    setCustomTypes((prev) => [
      ...prev,
      { id, label, iconKey: newTypeIconId },
    ]);
    setNewTypeName("");
    setNewTypeError(null);
  }

  function handleRenameCustomType(id: string, value: string) {
    setCustomTypes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label: value } : item))
    );
  }

  function handleRenameCustomTypeBlur(id: string, value: string) {
    const next = value.trim();
    if (next) return;
    setCustomTypes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, label: "Tipo personalizado" } : item
      )
    );
  }

  async function persistCustomTypes(nextCustomTypes: TopologyCustomType[]) {
    if (!selectedTopologyId) return;
    try {
      const response = await fetch(`/api/topologias/${selectedTopologyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customTypes: nextCustomTypes }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível salvar o tipo.");
      }
      const updated = data?.topology as TopologyEntry | undefined;
      if (updated) {
        setTopologies((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        applyTopology(updated);
      }
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Falha ao salvar o tipo."
      );
    }
  }

  async function handleSaveTopology() {
    const name = topologyName.trim();
    if (!name) {
      setSaveError("Informe um nome para a topologia.");
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      const payload = { name, nodes, links, customTypes };
      if (selectedTopologyId) {
        const response = await fetch(`/api/topologias/${selectedTopologyId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(
            data?.error || "Não foi possível atualizar a topologia."
          );
        }
        const updated = data?.topology as TopologyEntry | undefined;
        if (updated) {
          setTopologies((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );
          applyTopology(updated);
        }
      } else {
        const response = await fetch("/api/topologias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "Não foi possível salvar a topologia.");
        }
        const created = data?.topology as TopologyEntry | undefined;
        if (created) {
          setTopologies((prev) => [created, ...prev]);
          applyTopology(created);
        }
      }
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Falha ao salvar topologia."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function removeSelectedNode() {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((node) => node.id !== selectedNodeId));
    setLinks((prev) =>
      prev.filter(
        (link) => link.from !== selectedNodeId && link.to !== selectedNodeId
      )
    );
    setSelectedNodeId(null);
  }

  function removeLink(linkId: string) {
    setLinks((prev) => prev.filter((link) => link.id !== linkId));
    setSelectedLinkId((prev) => (prev === linkId ? null : prev));
  }

  const gridStyle = {
    backgroundImage: isDark
      ? "linear-gradient(rgba(148,163,184,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.1) 1px, transparent 1px)"
      : "linear-gradient(rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.2) 1px, transparent 1px)",
    backgroundSize: "28px 28px",
  } as const;

  function drawTopology(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    const background = isDark ? "#050816" : "#ffffff";
    const borderColor = isDark ? "#334155" : "#cbd5f5";
    const lineColor = isDark ? "#94a3b8" : "#64748b";
    const textColor = isDark ? "#e2e8f0" : "#0f172a";
    const subTextColor = isDark ? "#94a3b8" : "#475569";

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    links.forEach((link) => {
      const fromNode = nodes.find((node) => node.id === link.from);
      const toNode = nodes.find((node) => node.id === link.to);
      if (!fromNode || !toNode) return;
      ctx.beginPath();
      ctx.moveTo(fromNode.x + NODE_WIDTH / 2, fromNode.y + NODE_HEIGHT / 2);
      ctx.lineTo(toNode.x + NODE_WIDTH / 2, toNode.y + NODE_HEIGHT / 2);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    nodes.forEach((node) => {
      const option = iconOptions.find((item) => item.id === node.iconId);
      const label = option?.label ?? "Maquina";
      const iconLetter = label.charAt(0).toUpperCase();

      const x = node.x;
      const y = node.y;

      ctx.fillStyle = isDark ? "#0b1220" : "#ffffff";
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1.5;
      const radius = 12;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + NODE_WIDTH - radius, y);
      ctx.quadraticCurveTo(x + NODE_WIDTH, y, x + NODE_WIDTH, y + radius);
      ctx.lineTo(x + NODE_WIDTH, y + NODE_HEIGHT - radius);
      ctx.quadraticCurveTo(
        x + NODE_WIDTH,
        y + NODE_HEIGHT,
        x + NODE_WIDTH - radius,
        y + NODE_HEIGHT
      );
      ctx.lineTo(x + radius, y + NODE_HEIGHT);
      ctx.quadraticCurveTo(x, y + NODE_HEIGHT, x, y + NODE_HEIGHT - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isDark ? "#111a2b" : "#eef2ff";
      ctx.beginPath();
      ctx.roundRect?.(x + 12, y + 16, 40, 40, 10);
      if (!ctx.roundRect) {
        ctx.rect(x + 12, y + 16, 40, 40);
      }
      ctx.fill();

      ctx.fillStyle = isDark ? "#e2e8f0" : "#4338ca";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(iconLetter, x + 32, y + 36);

      ctx.fillStyle = textColor;
      ctx.font = "600 14px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(node.label, x + 60, y + 18);

      ctx.fillStyle = subTextColor;
      ctx.font = "12px sans-serif";
      ctx.fillText(label, x + 60, y + 36);

      const extra = node.ip || node.description;
      if (extra) {
        ctx.fillStyle = subTextColor;
        ctx.font = "11px sans-serif";
        ctx.fillText(extra, x + 60, y + 52);
      }
    });
  }

  async function exportPng() {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const width = Math.max(rect.width, NODE_WIDTH + 40);
    const height = Math.max(rect.height, NODE_HEIGHT + 40);
    const scale = window.devicePixelRatio || 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(scale, scale);
    drawTopology(ctx, width, height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `topologia-${Date.now()}.png`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function exportPdf() {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const width = Math.max(rect.width, NODE_WIDTH + 40);
    const height = Math.max(rect.height, NODE_HEIGHT + 40);
    const scale = window.devicePixelRatio || 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(scale, scale);
    drawTopology(ctx, width, height);
    const dataUrl = canvas.toDataURL("image/png");
    const popup = window.open("", "_blank");
    if (!popup) return;
    popup.document.write(`
      <html>
        <head>
          <title>Exportar topologia</title>
          <style>
            body { margin: 0; padding: 24px; background: #fff; }
            img { width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" />
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    setTimeout(() => {
      popup.print();
    }, 300);
  }

  return (
    <DashboardShell
      pageTitle="Topologia"
      pageSubtitle="Monte diagramas de rede com drag & drop, icones e links"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Construtor de topologia</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Arraste os icones para o canvas, reposicione maquinas e conecte
                  os elementos.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={
                    selectedTopologyId
                      ? String(selectedTopologyId)
                      : isCreatingNew
                      ? "new"
                      : undefined
                  }
                  onValueChange={(value) => {
                    if (value === "new") {
                      resetToNewTopology();
                      return;
                    }
                    const id = Number(value);
                    const topology = topologies.find((item) => item.id === id);
                    if (topology) {
                      applyTopology(topology);
                    }
                  }}
                >
                  <SelectTrigger className="h-9 w-[200px]">
                    <SelectValue
                      placeholder={isLoading ? "Carregando..." : "Topologias salvas"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {topologies.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        Nenhuma topologia salva
                      </SelectItem>
                    ) : (
                      topologies.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))
                    )}
                    <SelectItem value="new">&lt;criar nova topologia&gt;</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSaveTopology} disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar"}
                </Button>
                <Button
                  variant={linkMode ? "secondary" : "outline"}
                  onClick={toggleLinkMode}
                >
                  <Link2 className="mr-2 h-4 w-4" />
                  {linkMode ? "Finalizar link" : "Modo link"}
                </Button>
                <Button variant="outline" onClick={exportPng}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PNG
                </Button>
                <Button variant="outline" onClick={exportPdf}>
                  <FileText className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setZoom((prev) => clamp(Number((prev - zoomStep).toFixed(2)), zoomMin, zoomMax))
                    }
                    disabled={zoom <= zoomMin}
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[56px] text-center text-xs text-muted-foreground">
                    {zoomLabel}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setZoom((prev) => clamp(Number((prev + zoomStep).toFixed(2)), zoomMin, zoomMax))
                    }
                    disabled={zoom >= zoomMax}
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            {saveError && (
              <div className="text-sm text-red-500">{saveError}</div>
            )}
            {!selectedTopologyId && (
              <div>
                <Badge variant="outline">Rascunho não salvo</Badge>
              </div>
            )}
            {isCreatingNew && (
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Nome da topologia
                </label>
                <Input
                  value={topologyName}
                  onChange={(event) => setTopologyName(event.target.value)}
                  className="h-9 w-[240px]"
                  placeholder="Informe o nome"
                />
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-[240px_1fr_260px]">
              <div className="space-y-3">
                <div className="rounded-xl border p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Paleta drag & drop
                  </p>
                  <div className="mt-3 space-y-2">
                    {iconOptions.map((option) => (
                      <button
                        key={option.id}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData(
                            "application/x-topology-icon",
                            option.id
                          );
                          event.dataTransfer.effectAllowed = "copy";
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm transition",
                          isDark
                            ? "border-zinc-800 bg-[#0b1220] text-zinc-100 hover:bg-[#111a2b]"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <option.Icon className="h-4 w-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Novo tipo
                    </p>
                    <Input
                      value={newTypeName}
                      onChange={(event) => setNewTypeName(event.target.value)}
                      placeholder="Nome do dispositivo"
                      className="h-8"
                    />
                    <div className="grid grid-cols-4 gap-2">
                      {iconLibrary.map((option) => {
                        const isSelected = newTypeIconId === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setNewTypeIconId(option.id)}
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-lg border text-xs transition",
                              isSelected
                                ? "border-sky-500 bg-sky-500/10 text-sky-200"
                                : isDark
                                ? "border-zinc-800 bg-[#0b1220] text-zinc-200"
                                : "border-slate-200 bg-white text-slate-700"
                            )}
                            title={option.label}
                          >
                            <option.Icon className="h-4 w-4" />
                          </button>
                        );
                      })}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAddCustomType}
                    >
                      Adicionar tipo
                    </Button>
                    {newTypeError && (
                      <p className="text-xs text-red-500">{newTypeError}</p>
                    )}
                  </div>
                  {customTypes.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Tipos personalizados
                      </p>
                      <div className="space-y-2">
                        {customTypes.map((type) => {
                          const Icon =
                            iconLibrary.find((icon) => icon.id === type.iconKey)
                              ?.Icon ?? Server;
                          return (
                            <div
                              key={type.id}
                              onDoubleClick={() => setEditingCustomTypeId(type.id)}
                              className={cn(
                                "flex items-center gap-2 rounded-lg border px-2 py-2",
                                "cursor-text",
                                isDark
                                  ? "border-zinc-800 bg-[#0b1220]"
                                  : "border-slate-200 bg-white"
                              )}
                            >
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              {editingCustomTypeId === type.id ? (
                                <Input
                                  value={type.label}
                                  autoFocus
                                  onChange={(event) =>
                                    handleRenameCustomType(
                                      type.id,
                                      event.target.value
                                    )
                                  }
                                  onBlur={(event) => {
                                    handleRenameCustomTypeBlur(
                                      type.id,
                                      event.target.value
                                    );
                                    const nextValue = event.target.value.trim()
                                      ? event.target.value
                                      : "Tipo personalizado";
                                    const nextCustomTypes = customTypes.map((item) =>
                                      item.id === type.id
                                        ? { ...item, label: nextValue }
                                        : item
                                    );
                                    setCustomTypes(nextCustomTypes);
                                    setEditingCustomTypeId(null);
                                    persistCustomTypes(nextCustomTypes);
                                  }}
                                  className="h-8"
                                />
                              ) : (
                                <span className="flex-1 text-left text-xs text-muted-foreground">
                                  {type.label}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <div className="rounded-xl border p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Maquinas</span>
                      <Badge variant="secondary">{nodes.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Links</span>
                      <Badge variant="secondary">{links.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Modo link</span>
                      <Badge variant={linkMode ? "default" : "outline"}>
                        {linkMode ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div
                ref={canvasRef}
                className={cn(
                  "relative h-[540px] overflow-hidden rounded-2xl border",
                  isDark
                    ? "border-zinc-800 bg-[#050816]"
                    : "border-slate-200 bg-slate-50"
                )}
                style={gridStyle}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleCanvasDrop}
                onClick={handleCanvasClick}
              >
                <div
                  className="absolute inset-0 origin-top-left"
                  style={{
                    transform: `scale(${zoom})`,
                    width: `${100 / zoom}%`,
                    height: `${100 / zoom}%`,
                  }}
                >
                  <svg className="pointer-events-none absolute inset-0 h-full w-full">
                    {links.map((link) => {
                      const fromNode = nodes.find((node) => node.id === link.from);
                      const toNode = nodes.find((node) => node.id === link.to);
                      if (!fromNode || !toNode) return null;
                      const x1 = fromNode.x + NODE_WIDTH / 2;
                      const y1 = fromNode.y + NODE_HEIGHT / 2;
                      const x2 = toNode.x + NODE_WIDTH / 2;
                      const y2 = toNode.y + NODE_HEIGHT / 2;
                      return (
                        <line
                          key={link.id}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={isDark ? "#64748b" : "#94a3b8"}
                          strokeWidth={2}
                          strokeDasharray="6 6"
                        />
                      );
                    })}
                  </svg>

                  {nodes.map((node) => {
                    const option = iconOptions.find((item) => item.id === node.iconId);
                    const Icon = option?.Icon ?? Server;
                    const isSelected = node.id === selectedNodeId;
                    const isLinkSource = node.id === linkFromId;
                    return (
                      <div
                        key={node.id}
                        onPointerDown={(event) => {
                          event.stopPropagation();
                          handleNodePointerDown(event, node);
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleNodeClick(node);
                        }}
                        className={cn(
                          "absolute flex h-[72px] w-[160px] cursor-grab select-none items-center gap-3 rounded-xl border px-3 shadow-sm transition",
                          isSelected
                            ? "border-sky-500 ring-2 ring-sky-500/40"
                            : isDark
                            ? "border-zinc-800 bg-[#0b1220] text-zinc-100"
                            : "border-slate-200 bg-white text-slate-700",
                          isLinkSource && "border-emerald-500 ring-2 ring-emerald-500/40"
                        )}
                        style={{ left: node.x, top: node.y }}
                      >
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg",
                            isDark ? "bg-[#111a2b]" : "bg-slate-100"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{node.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {option?.label ?? "Maquina"}
                          </p>
                          {(node.ip || node.description) && (
                            <p className="mt-1 truncate text-[10px] text-muted-foreground">
                              {node.ip ? node.ip : node.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Detalhes
                  </p>
                  {selectedNode ? (
                    <div className="mt-3 space-y-3">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">
                          Nome da maquina
                        </label>
                        <Input
                          value={selectedNode.label}
                          onChange={(event) =>
                            updateSelectedNode({ label: event.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">
                          Icone
                        </label>
                        <Select
                          value={selectedNode.iconId}
                          onValueChange={(val) =>
                            updateSelectedNode({ iconId: val as IconId })
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Selecione o icone" />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">
                          IP
                        </label>
                        <Input
                          value={selectedNode.ip ?? ""}
                          onChange={(event) =>
                            updateSelectedNode({ ip: event.target.value })
                          }
                          placeholder="192.168.0.10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">
                          Descricao breve
                        </label>
                        <Input
                          value={selectedNode.description ?? ""}
                          onChange={(event) =>
                            updateSelectedNode({ description: event.target.value })
                          }
                          placeholder="Descricao do dispositivo"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        onClick={removeSelectedNode}
                      >
                        Remover dispositivo
                      </Button>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Selecione uma maquina para editar nome e icone.
                    </p>
                  )}
                </div>
                <div className="rounded-xl border p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Links
                  </p>
                  {links.length === 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Nenhum link criado ainda.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {links.map((link) => {
                        const fromNode = nodes.find((node) => node.id === link.from);
                        const toNode = nodes.find((node) => node.id === link.to);
                        const label = `${fromNode?.label ?? link.from} -> ${
                          toNode?.label ?? link.to
                        }`;
                        return (
                          <div
                            key={link.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedLinkId(link.id)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                setSelectedLinkId(link.id);
                              }
                            }}
                            className={cn(
                              "flex w-full items-center justify-between gap-2 rounded-lg border px-2 py-2 text-left text-xs",
                              selectedLinkId === link.id
                                ? "border-sky-500 bg-sky-500/10 text-sky-200"
                                : isDark
                                ? "border-zinc-800 bg-[#0b1220] text-zinc-200"
                                : "border-slate-200 bg-white text-slate-700"
                            )}
                          >
                            <span className="truncate">{label}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(event) => {
                                event.stopPropagation();
                                removeLink(link.id);
                              }}
                            >
                              Remover
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="rounded-xl border p-3 text-xs text-muted-foreground">
                  <p className="font-semibold uppercase tracking-wide">
                    Como conectar
                  </p>
                  <ol className="mt-2 list-decimal space-y-1 pl-4">
                    <li>Ative o modo link.</li>
                    <li>Escolha a maquina de origem.</li>
                    <li>Clique na maquina de destino.</li>
                  </ol>
                  {linkFromId && (
                    <div className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-2 text-[11px] text-emerald-200">
                      Origem selecionada. Clique no destino para criar o link.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

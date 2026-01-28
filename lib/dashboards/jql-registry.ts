import fs from "fs";
import path from "path";
import { listAllDashboardWidgets } from "@/lib/dashboards/dashboard-widget-service";
import { getLocalTimestamp } from "@/lib/utils/time";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "dashboard-jqls.json");

type JqlEntry = {
  name: string;
  jql: string;
  color?: string;
};

type WidgetRegistryEntry = {
  id: number;
  userId: number;
  name: string;
  templateId: string;
  entries: JqlEntry[];
};

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export function buildDashboardJqlRegistry(): {
  generatedAt: string;
  widgets: WidgetRegistryEntry[];
} {
  const widgets = listAllDashboardWidgets();
  const mapped: WidgetRegistryEntry[] = widgets.map((widget) => {
    const config = widget.config as { jqlEntries?: JqlEntry[] };
    return {
      id: widget.id,
      userId: widget.userId,
      name: widget.name,
      templateId: widget.templateId,
      entries: Array.isArray(config?.jqlEntries) ? config.jqlEntries : [],
    };
  });
  return {
    generatedAt: getLocalTimestamp(),
    widgets: mapped,
  };
}

export function writeDashboardJqlRegistry() {
  ensureDataDir();
  const payload = buildDashboardJqlRegistry();
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
  return { path: filePath, total: payload.widgets.length };
}

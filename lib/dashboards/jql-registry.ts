import fs from "fs";
import path from "path";
import { getLocalTimestamp } from "@/lib/utils/time";
import { listDashboardTemplates } from "@/lib/dashboards/dashboard-service";
import { listAllDashboardWidgets } from "@/lib/dashboards/dashboard-widget-service";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "dashboard-jqls.json");

type JqlEntry = {
  name: string;
  jql: string;
  color?: string;
};

type WidgetRegistryEntry = {
  id: number;
  name: string;
  templateId: string;
  entries: JqlEntry[];
};

type TemplateRegistry = {
  id: string;
  name: string;
  widgets: WidgetRegistryEntry[];
};

type UserRegistry = {
  userId: number;
  templates: TemplateRegistry[];
};

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

type RegistryPayload = {
  generatedAt: string;
  users: UserRegistry[];
};

function readRegistry(): RegistryPayload {
  ensureDataDir();
  if (!fs.existsSync(filePath)) {
    return { generatedAt: getLocalTimestamp(), users: [] };
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    if (!raw.trim()) {
      return { generatedAt: getLocalTimestamp(), users: [] };
    }
    const parsed = JSON.parse(raw) as RegistryPayload;
    return {
      generatedAt: parsed.generatedAt ?? getLocalTimestamp(),
      users: Array.isArray(parsed.users) ? parsed.users : [],
    };
  } catch {
    return { generatedAt: getLocalTimestamp(), users: [] };
  }
}

function writeRegistry(payload: RegistryPayload) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
  const totalWidgets = payload.users.reduce(
    (sum, user) =>
      sum +
      user.templates.reduce((acc, template) => acc + template.widgets.length, 0),
    0
  );
  return { path: filePath, total: totalWidgets };
}

export function upsertRegistryTemplate(input: {
  userId: number;
  templateId: string;
  name: string;
}) {
  const registry = readRegistry();
  const users = registry.users;
  const user = users.find((entry) => entry.userId === input.userId);
  if (!user) {
    users.push({
      userId: input.userId,
      templates: [
        {
          id: input.templateId,
          name: input.name,
          widgets: [],
        },
      ],
    });
  } else {
    const template = user.templates.find((entry) => entry.id === input.templateId);
    if (!template) {
      user.templates.push({
        id: input.templateId,
        name: input.name,
        widgets: [],
      });
    } else {
      template.name = input.name;
    }
  }
  registry.generatedAt = getLocalTimestamp();
  return writeRegistry(registry);
}

export function renameRegistryTemplate(input: { templateId: string; name: string }) {
  const registry = readRegistry();
  registry.users.forEach((user) => {
    const template = user.templates.find((entry) => entry.id === input.templateId);
    if (template) {
      template.name = input.name;
    }
  });
  registry.generatedAt = getLocalTimestamp();
  return writeRegistry(registry);
}

export function removeRegistryTemplate(templateId: string) {
  const registry = readRegistry();
  registry.users.forEach((user) => {
    user.templates = user.templates.filter((entry) => entry.id !== templateId);
  });
  registry.generatedAt = getLocalTimestamp();
  return writeRegistry(registry);
}

export function upsertRegistryWidget(input: {
  userId: number;
  templateId: string;
  widgetId: number;
  widgetName: string;
  templateType: string;
  entries: JqlEntry[];
}) {
  const registry = readRegistry();
  let user = registry.users.find((entry) => entry.userId === input.userId);
  if (!user) {
    user = { userId: input.userId, templates: [] };
    registry.users.push(user);
  }
  let template = user.templates.find((entry) => entry.id === input.templateId);
  if (!template) {
    template = {
      id: input.templateId,
      name: `Template ${input.templateId}`,
      widgets: [],
    };
    user.templates.push(template);
  }
  const widget = template.widgets.find((entry) => entry.id === input.widgetId);
  if (!widget) {
    template.widgets.push({
      id: input.widgetId,
      name: input.widgetName,
      templateId: input.templateType,
      entries: input.entries,
    });
  } else {
    widget.name = input.widgetName;
    widget.templateId = input.templateType;
    widget.entries = input.entries;
  }
  registry.generatedAt = getLocalTimestamp();
  return writeRegistry(registry);
}

export function removeRegistryWidget(input: {
  userId: number;
  templateId: string;
  widgetId: number;
}) {
  const registry = readRegistry();
  const user = registry.users.find((entry) => entry.userId === input.userId);
  if (!user) {
    return writeRegistry(registry);
  }
  const template = user.templates.find((entry) => entry.id === input.templateId);
  if (!template) {
    return writeRegistry(registry);
  }
  template.widgets = template.widgets.filter((entry) => entry.id !== input.widgetId);
  registry.generatedAt = getLocalTimestamp();
  return writeRegistry(registry);
}

export function rebuildDashboardJqlRegistryFromDatabase() {
  const templates = listDashboardTemplates();
  const widgets = listAllDashboardWidgets();
  const templateMap = new Map(
    templates.map((template) => [String(template.id), template])
  );
  const usersMap = new Map<number, UserRegistry>();

  widgets.forEach((widget) => {
    const config = (widget.config ?? {}) as {
      dashboardId?: string;
      jqlEntries?: Array<{ name?: string; jql?: string; color?: string }>;
    };
    const dashboardId = String(config.dashboardId ?? "default");
    if (dashboardId === "default") return;
    const templateInfo = templateMap.get(dashboardId);
    if (!templateInfo) return;

    const entries = Array.isArray(config.jqlEntries)
      ? config.jqlEntries
          .map((entry) => ({
            name: entry?.name?.trim() ?? "",
            jql: entry?.jql?.trim() ?? "",
            color: entry?.color,
          }))
          .filter((entry) => entry.name || entry.jql)
      : [];

    if (!usersMap.has(widget.userId)) {
      usersMap.set(widget.userId, { userId: widget.userId, templates: [] });
    }
    const user = usersMap.get(widget.userId)!;
    let template = user.templates.find((item) => item.id === dashboardId);
    if (!template) {
      template = {
        id: dashboardId,
        name: templateInfo.name,
        widgets: [],
      };
      user.templates.push(template);
    }

    template.widgets = template.widgets.filter((item) => item.id !== widget.id);
    template.widgets.push({
      id: widget.id,
      name: widget.name,
      templateId: widget.templateId,
      entries,
    });
  });

  const users = Array.from(usersMap.values())
    .map((user) => ({
      ...user,
      templates: user.templates.filter((template) => template.widgets.length > 0),
    }))
    .filter((user) => user.templates.length > 0)
    .sort((a, b) => a.userId - b.userId);

  const payload: RegistryPayload = {
    generatedAt: getLocalTimestamp(),
    users,
  };
  const summary = writeRegistry(payload);
  return {
    ...summary,
    users: users.length,
    templates: users.reduce((sum, user) => sum + user.templates.length, 0),
    widgets: users.reduce(
      (sum, user) =>
        sum +
        user.templates.reduce((acc, template) => acc + template.widgets.length, 0),
      0
    ),
  };
}

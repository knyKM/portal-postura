"use client";

import * as React from "react";
import {
  Legend,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from "recharts";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: string;
    color?: string;
  }
>;

type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartConfig | null>(null);

export function ChartContainer({ config, className, children, ...props }: ChartContainerProps) {
  return (
    <ChartContext.Provider value={config}>
      <div className={cn("h-full w-full", className)} {...props}>
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export function ChartLegend(props: React.ComponentProps<typeof Legend>) {
  return <Legend verticalAlign="bottom" height={36} {...props} />;
}

type LegendContentProps = {
  payload?: Array<{
    dataKey?: string;
    color?: string;
  }>;
};

export function ChartLegendContent({ payload }: LegendContentProps) {
  const config = React.useContext(ChartContext) ?? {};
  if (!payload?.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
      {payload.map((entry) => {
        const key = entry.dataKey ?? "";
        const label = config[key]?.label ?? key;
        const color = config[key]?.color ?? entry.color ?? "#a855f7";
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ChartTooltip(props: TooltipProps<number, string>) {
  return (
    <Tooltip
      {...props}
      contentStyle={{
        background: "#0f111a",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#fff",
      }}
    />
  );
}

type ChartTooltipContentProps = {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    value?: number | string;
    color?: string;
  }>;
  label?: string;
  indicator?: "dot" | "line";
  labelFormatter?: (label: string) => string;
};

export function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = "dot",
  labelFormatter,
}: ChartTooltipContentProps) {
  const config = React.useContext(ChartContext) ?? {};
  if (!active || !payload?.length) return null;
  return (
    <div className="space-y-1 rounded-xl bg-[#0f111a] px-3 py-2 text-xs text-white shadow-lg">
      {label && (
        <div className="text-[11px] text-zinc-400">
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((entry) => {
          const key = entry.dataKey ?? "";
          const color = config[key]?.color ?? entry.color ?? "#a855f7";
          const labelText = config[key]?.label ?? key;
          return (
            <div key={key} className="flex items-center gap-2">
              {indicator === "dot" ? (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ) : (
                <span
                  className="h-0.5 w-4 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
              <span className="text-zinc-300">{labelText}:</span>
              <span className="font-semibold text-white">{entry.value ?? 0}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

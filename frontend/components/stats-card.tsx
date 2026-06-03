import * as React from "react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const accentMap = {
  primary: "bg-primary/10 text-primary",
  ai: "bg-ai/10 text-ai",
  success: "bg-success/12 text-success",
  brand: "bg-brand/10 text-brand",
  warning: "bg-warning/15 text-[#b45309]",
} as const;

export function StatsCard({
  label,
  value,
  icon: Icon,
  accent = "primary",
  trend,
  hint,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent?: keyof typeof accentMap;
  trend?: { value: string; positive?: boolean };
  hint?: string;
}) {
  return (
    <Card className="gap-0 py-5">
      <div className="flex items-start justify-between px-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {(trend || hint) && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs">
              {trend && (
                <span
                  className={cn(
                    "font-medium",
                    trend.positive === false ? "text-destructive" : "text-success"
                  )}
                >
                  {trend.value}
                </span>
              )}
              {hint && <span className="text-muted-foreground">{hint}</span>}
            </p>
          )}
        </div>
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-lg",
            accentMap[accent]
          )}
        >
          <Icon className="size-6" />
        </span>
      </div>
    </Card>
  );
}

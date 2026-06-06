"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import type { FacetOption } from "@/lib/domain-types";

export function FacetFilter({
  title,
  icon: Icon,
  options,
  selected,
  onToggle,
  defaultOpen = true,
  maxVisible = 6,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  options: FacetOption[];
  selected: string[];
  onToggle: (value: string) => void;
  defaultOpen?: boolean;
  maxVisible?: number;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [showAll, setShowAll] = React.useState(false);
  const visible = showAll ? options : options.slice(0, maxVisible);

  return (
    <div className="border-b border-border pb-4 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-1 text-sm font-semibold text-foreground"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="size-4 text-muted-foreground" />}
          {title}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-0.5">
          {visible.map((opt) => {
            const isSelected = selected.includes(opt.label);
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => onToggle(opt.label)}
                className="flex w-full items-center gap-2.5 rounded-md px-1.5 py-1.5 text-left text-sm transition-colors hover:bg-muted"
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background"
                  )}
                >
                  {isSelected && <Check className="size-3" />}
                </span>
                <span
                  className={cn(
                    "flex-1 truncate",
                    isSelected ? "font-medium text-foreground" : "text-muted-foreground"
                  )}
                >
                  {opt.label}
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {opt.count}
                </span>
              </button>
            );
          })}

          {options.length > maxVisible && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="mt-1 px-1.5 text-left text-xs font-medium text-primary hover:underline"
            >
              {showAll ? "Voir moins" : `Voir ${options.length - maxVisible} de plus`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronDown, LayoutGrid } from "lucide-react";

import { cn } from "@/lib/utils";
import { currentPortalId, portals } from "@/lib/portals";

export function PortalSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const currentId = currentPortalId(pathname);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <LayoutGrid className="size-4 text-muted-foreground" />
        <span className="hidden sm:inline">Espaces</span>
        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-lg"
        >
          <p className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Changer d&apos;espace
          </p>
          {portals.map((p) => {
            const active = p.id === currentId;
            return (
              <Link
                key={p.id}
                href={p.href}
                role="menuitem"
                className={cn(
                  "flex items-start gap-3 rounded-lg px-2.5 py-2 transition-colors",
                  active ? "bg-secondary" : "hover:bg-muted"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                    p.accent
                  )}
                >
                  <p.icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-foreground">
                      {p.label}
                    </span>
                    {active && <Check className="size-3.5 text-primary" />}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {p.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

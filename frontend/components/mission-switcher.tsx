"use client";

import Link from "next/link";

import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

const PORTAL_LABELS: Record<string, { label: string; href: string }> = {
  admin: { label: "Administration", href: "/admin/dashboard" },
  validation: { label: "Validation", href: "/validation/dashboard" },
  deposant: { label: "Déposant", href: "/deposant/dashboard" },
};

export function MissionSwitcher({ current }: { current: "admin" | "validation" | "deposant" }) {
  const { user } = useAuth();
  const portals = (user?.capabilities?.portals || []).filter((portal) => PORTAL_LABELS[portal]);

  if (portals.length <= 1) return null;

  return (
    <div className="hidden items-center gap-1 rounded-full border border-border bg-card p-1 sm:flex">
      {portals.map((portal) => {
        const config = PORTAL_LABELS[portal];
        const active = portal === current;
        return (
          <Link
            key={portal}
            href={config.href}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              active
                ? "bg-brand text-brand-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {config.label}
          </Link>
        );
      })}
    </div>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ExternalLink, LogOut, Menu, ShieldCheck, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  openDossiersCount,
  validationNav,
} from "@/lib/validation-data";
import { useAuth } from "@/components/auth-provider";
import { MissionSwitcher } from "@/components/mission-switcher";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/validation/dashboard"
        onClick={onNavigate}
        className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-4"
      >
        <Image
          src="/logo-emblem.png"
          alt="OpenScience Hub"
          width={36}
          height={36}
          className="size-9 shrink-0 object-contain"
        />
        <span className="flex flex-col leading-none">
          <span className="font-heading text-sm font-semibold tracking-tight text-sidebar-foreground">
            OpenScience Hub
          </span>
          <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-ai/15 px-1.5 py-0.5 text-[10px] font-medium text-[var(--ai)]">
            <ShieldCheck className="size-2.5" />
            Validation
          </span>
        </span>
      </Link>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {validationNav.map((group) => (
          <div key={group.title}>
            <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const count =
                  item.href === "/validation/a-traiter"
                    ? openDossiersCount
                    : 0;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/70 hover:bg-white/10 hover:text-sidebar-foreground"
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {count > 0 && (
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                            active
                              ? "bg-white/20 text-white"
                              : "bg-ai/20 text-[var(--ai)]"
                          )}
                        >
                          {count}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-white/10 hover:text-sidebar-foreground"
        >
          <ArrowLeft className="size-4" />
          Retour au site public
        </Link>
      </div>
    </div>
  );
}

export function ValidationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const displayName = user?.full_name || user?.email || "Validateur";
  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "VA";

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const currentLabel = React.useMemo(() => {
    if (pathname.startsWith("/validation/dossiers")) return "Détail du dossier";
    for (const group of validationNav) {
      const item = group.items.find(
        (i) => pathname === i.href || pathname.startsWith(i.href + "/")
      );
      if (item) return item.label;
    }
    return "Validation académique";
  }, [pathname]);

  return (
    <div className="min-h-screen max-w-[100vw] overflow-x-hidden bg-muted/40 text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>

      {open && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-brand/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85%] border-r border-sidebar-border bg-sidebar">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="absolute right-3 top-3.5 inline-flex size-8 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-white/10"
            >
              <X className="size-5" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-h-screen min-w-0 max-w-[100vw] flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 max-w-[100vw] items-center justify-between gap-3 overflow-hidden border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <div className="min-w-0">
              <p className="truncate font-heading text-base font-semibold tracking-tight text-foreground">
                {currentLabel}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                File de mission selon vos rôles et périmètres
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <MissionSwitcher current="validation" />
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
            >
              <ExternalLink className="size-3.5" />
              Site public
            </Link>
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-1 pr-2 sm:gap-2.5 sm:pr-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-ai text-xs font-semibold text-ai-foreground">
                {initials}
              </span>
              <span className="hidden leading-tight sm:flex sm:flex-col">
                <span className="text-xs font-semibold text-foreground">
                  {displayName}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Validation académique
                </span>
              </span>
              <button
                type="button"
                onClick={logout}
                aria-label="Se déconnecter"
                className="ml-1 grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          </div>
        </header>

        <main className="min-w-0 max-w-[100vw] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full min-w-0 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

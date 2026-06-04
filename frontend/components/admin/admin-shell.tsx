"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Menu, ShieldCheck, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { INSTITUTION } from "@/lib/mock-data";
import { adminAccount, adminNav } from "@/lib/admin-data";
import { PortalSwitcher } from "@/components/layout/portal-switcher";

function useActive() {
  const pathname = usePathname();
  return React.useCallback(
    (href: string) => pathname === href || pathname.startsWith(href + "/"),
    [pathname]
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const isActive = useActive();

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/admin/dashboard"
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
          <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-sidebar-primary/12 px-1.5 py-0.5 text-[10px] font-medium text-sidebar-primary">
            <ShieldCheck className="size-2.5" />
            Administration
          </span>
        </span>
      </Link>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {adminNav.map((group) => (
          <div key={group.title}>
            <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
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
                      {item.label}
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

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const currentLabel = React.useMemo(() => {
    for (const group of adminNav) {
      const item = group.items.find(
        (i) => pathname === i.href || pathname.startsWith(i.href + "/")
      );
      if (item) return item.label;
    }
    return "Administration";
  }, [pathname]);

  return (
    <div className="min-h-screen bg-muted/40 text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
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

      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6">
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
                {INSTITUTION}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <PortalSwitcher />
            <div className="flex items-center gap-2.5 rounded-full border border-border bg-card py-1 pl-1 pr-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-brand text-xs font-semibold text-brand-foreground">
                {adminAccount.initials}
              </span>
              <span className="hidden leading-tight sm:flex sm:flex-col">
                <span className="text-xs font-semibold text-foreground">
                  {adminAccount.name}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {adminAccount.role}
                </span>
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

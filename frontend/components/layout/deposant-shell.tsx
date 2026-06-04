"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderTree,
  House,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  UploadCloud,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { depositor } from "@/lib/mock-data";
import { PortalSwitcher } from "@/components/layout/portal-switcher";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  also?: string[];
};

const primaryNav: NavItem[] = [
  { label: "Tableau de bord", href: "/deposant/dashboard", icon: LayoutDashboard },
  {
    label: "Mes dossiers",
    href: "/deposant/mes-dossiers",
    icon: FolderTree,
    also: ["/deposant/dossier", "/deposant/preuve"],
  },
  { label: "Déposer un document", href: "/deposant/deposer", icon: UploadCloud },
];

const secondaryNav: NavItem[] = [
  { label: "Explorer le répertoire", href: "/explorer", icon: Search },
  { label: "Retour au site", href: "/", icon: House },
];

function isActive(item: NavItem, pathname: string) {
  const match = (p: string) => pathname === p || pathname.startsWith(p + "/");
  return match(item.href) || (item.also?.some(match) ?? false);
}

function sectionTitle(pathname: string) {
  if (pathname.startsWith("/deposant/mes-dossiers")) return "Mes dossiers";
  if (pathname.startsWith("/deposant/deposer")) return "Déposer un document";
  if (pathname.startsWith("/deposant/dossier")) return "Détail du dossier";
  if (pathname.startsWith("/deposant/preuve")) return "Preuve d'authenticité";
  return "Tableau de bord";
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <Link
        href="/deposant/dashboard"
        onClick={onNavigate}
        className="flex h-16 shrink-0 items-center gap-2.5 border-b border-sidebar-border px-5"
      >
        <span className="grid size-9 place-items-center rounded-xl bg-white p-1">
          <Image
            src="/logo-emblem.png"
            alt="OpenScience Hub"
            width={28}
            height={28}
            className="size-full object-contain"
          />
        </span>
        <span className="flex flex-col leading-none">
          <span className="font-heading text-sm font-semibold text-sidebar-foreground">
            OpenScience Hub
          </span>
          <span className="text-[11px] text-sidebar-foreground/55">
            Espace déposant
          </span>
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-3 pb-2 text-[11px] font-medium tracking-wider text-sidebar-foreground/40 uppercase">
          Portail
        </p>
        <ul className="flex flex-col gap-1">
          {primaryNav.map((item) => {
            const active = isActive(item, pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/75 hover:bg-white/5 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="size-4.5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="px-3 pt-6 pb-2 text-[11px] font-medium tracking-wider text-sidebar-foreground/40 uppercase">
          Navigation
        </p>
        <ul className="flex flex-col gap-1">
          {secondaryNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-white/5 hover:text-sidebar-foreground"
              >
                <item.icon className="size-4.5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            {depositor.initials}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {depositor.name}
            </p>
            <p className="truncate text-[11px] text-sidebar-foreground/55">
              {depositor.role} · {depositor.faculty}
            </p>
          </div>
          <Link
            href="/login"
            onClick={onNavigate}
            aria-label="Se déconnecter"
            className="grid size-8 shrink-0 place-items-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-white/5 hover:text-sidebar-foreground"
          >
            <LogOut className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function DeposantShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-sidebar lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[82%] bg-sidebar animate-in slide-in-from-left duration-200">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Fermer le menu"
              className="absolute top-4 right-3 z-10 grid size-8 place-items-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-white/10 hover:text-sidebar-foreground"
            >
              <X className="size-5" />
            </button>
            <SidebarContent
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            className="grid size-9 place-items-center rounded-lg border border-border text-foreground lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <p className="min-w-0 flex-1 truncate font-heading text-sm font-semibold text-foreground">
            {sectionTitle(pathname)}
          </p>
          <PortalSwitcher />
          <Button asChild size="lg" className="hidden sm:inline-flex">
            <Link href="/deposant/deposer">
              <UploadCloud className="size-4" />
              Déposer
            </Link>
          </Button>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

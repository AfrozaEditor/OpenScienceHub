"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  Boxes,
  Clock,
  FileText,
  ScrollText,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/stats-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useApiResource } from "@/lib/api/hooks";
import { getAdminAudit, getAdminDashboard } from "@/lib/api/resources";
import type { AuditEvent } from "@/lib/api/types";

const fr = new Intl.NumberFormat("fr-FR");
const dateTime = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
});

type ServiceStatus = "operational" | "degraded" | "down";

const statusDot: Record<ServiceStatus, string> = {
  operational: "bg-success",
  degraded: "bg-warning",
  down: "bg-destructive",
};

const statusLabel: Record<ServiceStatus, string> = {
  operational: "Opérationnel",
  degraded: "Maintenance",
  down: "Hors service",
};

const statusText: Record<ServiceStatus, string> = {
  operational: "text-success",
  degraded: "text-[#b45309]",
  down: "text-destructive",
};

const severityDot = {
  info: "bg-primary",
  warning: "bg-warning",
  critical: "bg-destructive",
} as const;

const quickLinks = [
  { label: "Utilisateurs", href: "/admin/utilisateurs", icon: Users },
  { label: "Rôles & permissions", href: "/admin/roles", icon: ShieldCheck },
  { label: "Audit système", href: "/admin/audit", icon: ScrollText },
];

function kpiValue(kpis: Record<string, unknown>, key: string) {
  const value = kpis[key];
  return typeof value === "number" ? value : 0;
}

function parseService(name: string, value: unknown) {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : null;
  const raw = String(row?.status || value || "").toUpperCase();
  const status: ServiceStatus =
    raw.includes("DOWN") || raw.includes("ERROR")
      ? "down"
      : raw.includes("MAINTENANCE") || raw.includes("DEGRADED")
        ? "degraded"
        : "operational";
  const detail = String(row?.detail || raw || "État non renseigné");
  return { name, status, detail };
}

function formatAuditDate(value: unknown) {
  if (!value) return "—";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return dateTime.format(date);
}

export default function AdminDashboardPage() {
  const dashboard = useApiResource(() => getAdminDashboard(), [], null);
  const liveAudit = useApiResource(() => getAdminAudit(), [], null);
  const kpis = (dashboard.data?.kpis || {}) as Record<string, unknown>;
  const serviceRows = Object.entries(dashboard.data?.services || {}).map(([name, value]) =>
    parseService(name, value),
  );
  const operational = serviceRows.filter((s) => s.status === "operational").length;
  const incidents = serviceRows.filter((s) => s.status !== "operational");
  const auditRows = Array.isArray(liveAudit.data)
    ? liveAudit.data
    : liveAudit.data?.results || [];
  const scopeLabel = dashboard.data?.scope?.is_platform_admin
    ? "Administration plateforme"
    : "Administration institutionnelle";

  return (
    <>
      <AdminPageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité, de la validation et de la santé des services."
      >
        <Badge variant="outline">{scopeLabel}</Badge>
        <Button variant="outline" asChild>
          <Link href="/admin/statistiques">
            Statistiques détaillées
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </AdminPageHeader>

      {(dashboard.error || liveAudit.error) && (
        <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {dashboard.error || liveAudit.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          label="Documents déposés"
          value={fr.format(kpiValue(kpis, "total_works"))}
          icon={FileText}
          accent="primary"
          hint="dossiers dans le périmètre"
        />
        <StatsCard
          label="Documents validés"
          value={fr.format(kpiValue(kpis, "validated_works"))}
          icon={BadgeCheck}
          accent="success"
          hint="statuts validés ou publiables"
        />
        <StatsCard
          label="En attente"
          value={fr.format(kpiValue(kpis, "pending_works"))}
          icon={Clock}
          accent="warning"
          hint="soumis ou en instruction"
        />
        <StatsCard
          label="Documents archivés"
          value={fr.format(kpiValue(kpis, "archived_works"))}
          icon={FileText}
          accent="ai"
          hint="archives finalisées"
        />
        <StatsCard
          label="Preuves vérifiables"
          value={fr.format(kpiValue(kpis, "verifiable_documents"))}
          icon={ShieldCheck}
          accent="brand"
          hint="preuves actives après archivage"
        />
        <StatsCard
          label="Requêtes Assistant IA"
          value={fr.format(kpiValue(kpis, "ai_queries"))}
          icon={Bot}
          accent="primary"
          hint="questions journalisées"
        />
        <StatsCard
          label="Utilisateurs actifs"
          value={fr.format(kpiValue(kpis, "active_users_count"))}
          icon={Users}
          accent="brand"
          hint="comptes actifs"
        />
        <StatsCard
          label="Facultés"
          value={fr.format(kpiValue(kpis, "faculties_count"))}
          icon={Boxes}
          accent="primary"
          hint={`${fr.format(kpiValue(kpis, "departments_count"))} départements`}
        />
        <StatsCard
          label="Documents rejetés"
          value={fr.format(kpiValue(kpis, "rejected_works"))}
          icon={XCircle}
          accent="warning"
          hint="décisions de rejet"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="size-4 text-primary" />
              État des services
            </CardTitle>
            <Badge variant={incidents.length === 0 ? "success" : "warning"}>
              {operational}/{Math.max(1, serviceRows.length)} opérationnels
            </Badge>
          </CardHeader>
          <CardContent>
            {dashboard.loading ? (
              <p className="text-sm text-muted-foreground">Chargement de l'état des services…</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {serviceRows.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card px-3.5 py-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="relative flex size-2.5">
                          {s.status !== "operational" && (
                            <span
                              className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 ${statusDot[s.status]}`}
                            />
                          )}
                          <span
                            className={`relative inline-flex size-2.5 rounded-full ${statusDot[s.status]}`}
                          />
                        </span>
                        <p className="truncate text-sm font-medium text-foreground">{s.name}</p>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{s.detail}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={`text-xs font-semibold ${statusText[s.status]}`}>
                        {statusLabel[s.status]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <ScrollText className="size-4 text-primary" />
              Activité récente
            </CardTitle>
            <Link
              href="/admin/audit"
              className="text-xs font-medium text-primary hover:underline"
            >
              Tout voir
            </Link>
          </CardHeader>
          <CardContent>
            {liveAudit.loading ? (
              <p className="text-sm text-muted-foreground">Chargement de l'audit…</p>
            ) : auditRows.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune activité auditée pour le moment.</p>
            ) : (
              <ul className="space-y-3.5">
                {auditRows.slice(0, 6).map((e: AuditEvent) => (
                  <li key={String(e.id)} className="flex gap-3">
                    <span
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${
                        e.severity === "CRITICAL"
                          ? severityDot.critical
                          : e.severity === "WARNING"
                            ? severityDot.warning
                            : severityDot.info
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {String(e.action_type || "Événement audit")}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {String(e.comment || e.module || "Action système")}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                        {String(e.module || "audit")} · {formatAuditDate(e.created_at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {quickLinks.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:border-primary/40 hover:bg-secondary"
          >
            <span className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <q.icon className="size-5" />
              </span>
              <span className="text-sm font-medium text-foreground">{q.label}</span>
            </span>
            <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </>
  );
}

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  Clock,
  Download,
  FileText,
  ScrollText,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/stats-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { adminStats } from "@/lib/mock-data";
import {
  auditLog,
  services,
  type ServiceStatus,
} from "@/lib/admin-data";

const fr = new Intl.NumberFormat("fr-FR");

const statusDot: Record<ServiceStatus, string> = {
  operational: "bg-success",
  degraded: "bg-warning",
  down: "bg-destructive",
};

const statusLabel: Record<ServiceStatus, string> = {
  operational: "Opérationnel",
  degraded: "Dégradé",
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

export default function AdminDashboardPage() {
  const operational = services.filter((s) => s.status === "operational").length;
  const incidents = services.filter((s) => s.status !== "operational");

  return (
    <>
      <AdminPageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité, de la validation et de la santé des services."
      >
        <Badge variant="outline">
          <Activity className="size-3 text-success" />
          Temps réel
        </Badge>
        <Button variant="outline" asChild>
          <Link href="/admin/statistiques">
            Statistiques détaillées
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </AdminPageHeader>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          label="Documents déposés"
          value={fr.format(adminStats.deposited)}
          icon={FileText}
          accent="primary"
          trend={{ value: "+12%" }}
          hint="ce mois"
        />
        <StatsCard
          label="Documents validés"
          value={fr.format(adminStats.validated)}
          icon={BadgeCheck}
          accent="success"
          trend={{ value: "+8%" }}
          hint="ce mois"
        />
        <StatsCard
          label="En attente"
          value={fr.format(adminStats.pending)}
          icon={Clock}
          accent="warning"
          hint="à traiter"
        />
        <StatsCard
          label="Téléchargements"
          value={fr.format(adminStats.downloads)}
          icon={Download}
          accent="ai"
          trend={{ value: "+23%" }}
          hint="ce mois"
        />
        <StatsCard
          label="Auteurs actifs"
          value={fr.format(adminStats.activeAuthors)}
          icon={Users}
          accent="brand"
          trend={{ value: "+5%" }}
          hint="ce trimestre"
        />
        <StatsCard
          label="Départements couverts"
          value={adminStats.departments}
          icon={Boxes}
          accent="primary"
          hint="sur 7 facultés"
        />
      </div>

      {/* Services + activity */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* État des services */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="size-4 text-primary" />
              État des services
            </CardTitle>
            <Badge variant={incidents.length === 0 ? "success" : "warning"}>
              {operational}/{services.length} opérationnels
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
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
                      <p className="truncate text-sm font-medium text-foreground">
                        {s.name}
                      </p>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {s.note ?? s.category}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={`text-xs font-semibold ${statusText[s.status]}`}
                    >
                      {statusLabel[s.status]}
                    </p>
                    <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">
                      {s.uptime} · {s.latency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activité récente */}
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
            <ul className="space-y-3.5">
              {auditLog.slice(0, 6).map((e) => (
                <li key={e.id} className="flex gap-3">
                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${severityDot[e.severity]}`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {e.action}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {e.target}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                      {e.actor} · {e.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Accès rapides */}
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
              <span className="text-sm font-medium text-foreground">
                {q.label}
              </span>
            </span>
            <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </>
  );
}

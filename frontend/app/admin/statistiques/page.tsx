"use client";

import * as React from "react";
import {
  BadgeCheck,
  Boxes,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/stats-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useApiResource } from "@/lib/api/hooks";
import { getAdminDashboard, getAdminStats } from "@/lib/api/resources";

const fr = new Intl.NumberFormat("fr-FR");

const barColors = [
  "bg-primary",
  "bg-ai",
  "bg-success",
  "bg-brand",
  "bg-[#8b5cf6]",
  "bg-warning",
];

function HBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="truncate pr-2 text-foreground">{label}</span>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {fr.format(value)}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.max((value / max) * 100, value > 0 ? 2 : 0)}%` }}
        />
      </div>
    </div>
  );
}

function objectEntries(value: unknown): Array<{ label: string; count: number }> {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value as Record<string, unknown>)
    .map(([label, count]) => ({
      label: label || "—",
      count: typeof count === "number" ? count : Number(count) || 0,
    }))
    .sort((a, b) => b.count - a.count);
}

function kpiValue(source: Record<string, unknown> | undefined, key: string) {
  const value = source?.[key];
  return typeof value === "number" ? value : 0;
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-52 items-center justify-center rounded-lg border border-dashed border-border px-4 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export default function AdminStatsPage() {
  const liveStats = useApiResource(() => getAdminStats(), [], null);
  const dashboard = useApiResource(() => getAdminDashboard(), [], null);
  const kpis = dashboard.data?.kpis as Record<string, unknown> | undefined;

  const byYear = objectEntries(liveStats.data?.by_year);
  const byType = objectEntries(liveStats.data?.by_type);
  const byStatus = objectEntries(liveStats.data?.by_status);
  const byInstitution = objectEntries(liveStats.data?.by_institution);
  const yearMax = Math.max(1, ...byYear.map((d) => d.count));
  const typeMax = Math.max(1, ...byType.map((d) => d.count));
  const statusMax = Math.max(1, ...byStatus.map((d) => d.count));
  const institutionMax = Math.max(1, ...byInstitution.map((d) => d.count));

  return (
    <>
      <AdminPageHeader
        title="Statistiques"
        description="Indicateurs et répartitions calculés à partir des données enregistrées."
      >
        <Badge variant="outline">Données live</Badge>
      </AdminPageHeader>

      {(liveStats.error || dashboard.error) && (
        <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {liveStats.error || dashboard.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Documents déposés"
          value={fr.format(kpiValue(kpis, "total_works"))}
          icon={FileText}
          accent="primary"
          hint="dossiers dans le périmètre"
        />
        <StatsCard
          label="Documents archivés"
          value={fr.format(kpiValue(kpis, "archived_works"))}
          icon={BadgeCheck}
          accent="success"
          hint="archives finalisées"
        />
        <StatsCard
          label="En attente"
          value={fr.format(kpiValue(kpis, "pending_works"))}
          icon={TrendingUp}
          accent="warning"
          hint="soumis ou en instruction"
        />
        <StatsCard
          label="Utilisateurs actifs"
          value={fr.format(kpiValue(kpis, "active_users_count"))}
          icon={Users}
          accent="brand"
          hint="comptes actifs"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 text-primary" />
              Évolution des dépôts par année
            </CardTitle>
          </CardHeader>
          <CardContent>
            {byYear.length === 0 ? (
              <EmptyChart message="Aucun dépôt enregistré avec une année académique." />
            ) : (
              <div className="flex h-52 items-end gap-2 sm:gap-3">
                {byYear.map((d) => (
                  <div key={d.label} className="group flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      {fr.format(d.count)}
                    </span>
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t-md bg-primary/85 transition-colors group-hover:bg-primary"
                        style={{ height: `${(d.count / yearMax) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{d.label}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Boxes className="size-4 text-ai" />
              Répartition par type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {byType.length === 0 ? (
              <EmptyChart message="Aucun dossier enregistré pour l'instant." />
            ) : (
              <div className="flex flex-col gap-3.5 py-1">
                {byType.map((d, i) => (
                  <HBar
                    key={d.label}
                    label={d.label}
                    value={d.count}
                    max={typeMax}
                    color={barColors[i % barColors.length]}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4 text-primary" />
              Répartition par statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            {byStatus.length === 0 ? (
              <EmptyChart message="Aucun statut à afficher." />
            ) : (
              <div className="flex flex-col gap-3.5 py-1">
                {byStatus.map((u, i) => (
                  <HBar
                    key={u.label}
                    label={u.label}
                    value={u.count}
                    max={statusMax}
                    color={barColors[i % barColors.length]}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Boxes className="size-4 text-success" />
              Archives par institution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {byInstitution.length === 0 ? (
              <EmptyChart message="Aucune archive enregistrée." />
            ) : (
              <div className="flex flex-col gap-3.5 py-1">
                {byInstitution.map((f, i) => (
                  <HBar
                    key={f.label}
                    label={f.label}
                    value={f.count}
                    max={institutionMax}
                    color={barColors[i % barColors.length]}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
        <Badge variant="outline">Exports</Badge>
        L'export CSV/PDF n'est pas encore disponible. Les graphiques reflètent uniquement les
        données présentes dans OpenScience Hub.
        <Button variant="outline" size="sm" disabled className="ml-auto">
          <FileSpreadsheet className="size-4" />
          Export CSV
        </Button>
        <Button variant="outline" size="sm" disabled>
          <FileText className="size-4" />
          Export PDF
        </Button>
      </div>
    </>
  );
}

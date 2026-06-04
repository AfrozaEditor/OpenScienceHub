"use client";

import * as React from "react";
import {
  BadgeCheck,
  Boxes,
  Download,
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
import {
  adminStats,
  documentsByDomain,
  documentsByYear,
  facets,
  platformStats,
} from "@/lib/mock-data";
import { roles } from "@/lib/admin-data";
import { getAdminStats, useApiResource } from "@/lib/api";

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
          style={{ width: `${Math.max((value / max) * 100, 2)}%` }}
        />
      </div>
    </div>
  );
}

export default function AdminStatsPage() {
  const liveStats = useApiResource(() => getAdminStats(), [], null);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const metric = (keys: string[], fallback: number) => {
    for (const key of keys) {
      const value = liveStats.data?.[key];
      if (typeof value === "number") return value;
    }
    return fallback;
  };

  React.useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(t);
  }, [feedback]);

  const yearMax = Math.max(...documentsByYear.map((d) => d.count));
  const domainMax = Math.max(...documentsByDomain.map((d) => d.count));
  const usersByRole = roles
    .map((r) => ({ label: r.name, value: r.users }))
    .sort((a, b) => b.value - a.value);
  const roleMax = Math.max(...usersByRole.map((u) => u.value));
  const topFaculties = facets.faculties.slice(0, 5);
  const facultyMax = Math.max(...topFaculties.map((f) => f.count));

  function exportAs(kind: "CSV" | "PDF") {
    setFeedback(`Export ${kind} généré (démonstration).`);
  }

  return (
    <>
      <AdminPageHeader
        title="Statistiques"
        description="Indicateurs clés, tendances et exports pour le pilotage institutionnel."
      >
        <Button variant="outline" onClick={() => exportAs("CSV")}>
          <FileSpreadsheet className="size-4" />
          Export CSV
        </Button>
        <Button variant="outline" onClick={() => exportAs("PDF")}>
          <FileText className="size-4" />
          Export PDF
        </Button>
      </AdminPageHeader>

      {feedback && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-sm text-foreground">
          <BadgeCheck className="size-4 text-success" />
          {feedback}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Documents archivés"
          value={fr.format(metric(["documents_total", "archived_total", "works_total"], platformStats.documents))}
          icon={FileText}
          accent="primary"
          trend={{ value: "+18%" }}
          hint="cette année"
        />
        <StatsCard
          label="Documents validés"
          value={fr.format(metric(["validated", "works_validated"], adminStats.validated))}
          icon={BadgeCheck}
          accent="success"
          trend={{ value: "+8%" }}
          hint="ce mois"
        />
        <StatsCard
          label="Téléchargements"
          value={fr.format(metric(["downloads", "downloads_total"], platformStats.downloads))}
          icon={Download}
          accent="ai"
          trend={{ value: "+23%" }}
          hint="cumul"
        />
        <StatsCard
          label="Auteurs"
          value={fr.format(metric(["authors", "active_authors", "users_total"], platformStats.authors))}
          icon={Users}
          accent="brand"
          trend={{ value: "+5%" }}
          hint="actifs"
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 text-primary" />
              Évolution des dépôts par année
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-52 items-end gap-2 sm:gap-3">
              {documentsByYear.map((d) => (
                <div
                  key={d.year}
                  className="group flex flex-1 flex-col items-center gap-2"
                >
                  <span className="text-xs font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {fr.format(d.count)}
                  </span>
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-primary/85 transition-colors group-hover:bg-primary"
                      style={{ height: `${(d.count / yearMax) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{d.year}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Boxes className="size-4 text-ai" />
              Répartition par domaine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3.5 py-1">
              {documentsByDomain.map((d, i) => (
                <HBar
                  key={d.domain}
                  label={d.domain}
                  value={d.count}
                  max={domainMax}
                  color={barColors[i % barColors.length]}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4 text-primary" />
              Utilisateurs par rôle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3.5 py-1">
              {usersByRole.map((u, i) => (
                <HBar
                  key={u.label}
                  label={u.label}
                  value={u.value}
                  max={roleMax}
                  color={barColors[i % barColors.length]}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Boxes className="size-4 text-success" />
              Top facultés (corpus)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3.5 py-1">
              {topFaculties.map((f, i) => (
                <HBar
                  key={f.label}
                  label={f.label}
                  value={f.count}
                  max={facultyMax}
                  color={barColors[i % barColors.length]}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
        <Badge variant="outline">Exports</Badge>
        Données exportables aux formats CSV (tableur) et PDF (rapport mis en
        page). Les graphiques reflètent les jeux de données de démonstration.
      </div>
    </>
  );
}

import Link from "next/link";
import {
  BadgeCheck,
  Boxes,
  Building2,
  Clock,
  Download,
  FileText,
  FolderTree,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StatsCard } from "@/components/stats-card";
import { DocumentTable } from "@/components/document-table";
import {
  adminStats,
  documents,
  documentsByDomain,
  documentsByYear,
  INSTITUTION,
} from "@/lib/mock-data";

const fr = new Intl.NumberFormat("fr-FR");

const governance = [
  { label: "Facultés", value: 7, icon: Building2 },
  { label: "Départements", value: adminStats.departments, icon: Boxes },
  { label: "Domaines scientifiques", value: 28, icon: FolderTree },
  { label: "Utilisateurs", value: 1248, icon: Users },
];

const domainBarColors = [
  "bg-primary",
  "bg-ai",
  "bg-success",
  "bg-brand",
  "bg-[#8b5cf6]",
  "bg-warning",
];

export default function DashboardPage() {
  const max = Math.max(...documentsByYear.map((d) => d.count));
  const domainMax = Math.max(...documentsByDomain.map((d) => d.count));
  const queue = [...documents].sort((a, b) => {
    const order = { "En attente": 0, Validé: 1, Rejeté: 2 } as const;
    return order[a.status] - order[b.status];
  });

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      <div className="border-b border-border bg-card/40">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="brand">
                <LayoutDashboard className="size-3" />
                Espace administrateur
              </Badge>
              <Badge variant="outline">
                <ShieldCheck className="size-3 text-success" />
                {INSTITUTION}
              </Badge>
            </div>
            <h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
              Tableau de bord institutionnel
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Pilotez les dépôts, la validation et la gouvernance documentaire.
            </p>
          </div>
          <Button variant="outline" size="lg">
            <Settings className="size-4" />
            Configurer les workflows
          </Button>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
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
            label="En attente de validation"
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
                        style={{ height: `${(d.count / max) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {d.year}
                    </span>
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
                  <div key={d.domain}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-foreground">{d.domain}</span>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {fr.format(d.count)}
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${domainBarColors[i % domainBarColors.length]}`}
                        style={{ width: `${(d.count / domainMax) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Validation queue */}
        <Card className="mt-6">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="size-4 text-[#b45309]" />
              File de validation
            </CardTitle>
            <Badge variant="warning">{adminStats.pending} en attente</Badge>
          </CardHeader>
          <CardContent className="px-0">
            <DocumentTable docs={queue} />
          </CardContent>
        </Card>

        {/* Governance */}
        <section className="mt-8">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Gouvernance institutionnelle
          </h2>
          <p className="text-sm text-muted-foreground">
            Gérez la structure académique et les référentiels du répertoire.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {governance.map((g) => (
              <Card key={g.label} className="gap-0 py-5">
                <CardContent className="flex flex-col gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <g.icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-heading text-2xl font-semibold text-foreground">
                      {fr.format(g.value)}
                    </p>
                    <p className="text-sm text-muted-foreground">{g.label}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-fit">
                    Gérer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

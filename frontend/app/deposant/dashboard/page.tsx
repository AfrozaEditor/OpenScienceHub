"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Clock,
  Eye,
  FolderTree,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/stats-card";
import { DossierStatusBadge } from "@/components/dossier-status-badge";
import { depositor, depositorStats, myDossiers } from "@/lib/mock-data";
import { listWorks, useApiResource, workToDossier } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";

const nf = new Intl.NumberFormat("fr-FR");
const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function fmtDate(value: string) {
  if (!value || value === "—") return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : dateFmt.format(d);
}

export default function DeposantDashboardPage() {
  const { user } = useAuth();
  const works = useApiResource(() => listWorks({ ordering: "-updated_at" }), [], null);
  const liveDossiers = React.useMemo(
    () => works.data?.results?.map(workToDossier) || [],
    [works.data],
  );
  const dossierSource = liveDossiers.length > 0 ? liveDossiers : myDossiers;
  const liveStats = {
    total: dossierSource.length,
    validated: dossierSource.filter((d) => d.status === "Validé").length,
    pending: dossierSource.filter((d) => d.status === "En attente").length,
    draft: dossierSource.filter((d) => d.status === "Brouillon").length,
    rejected: dossierSource.filter((d) => d.status === "Rejeté").length,
    views: depositorStats.views,
    downloads: depositorStats.downloads,
  };
  const recent = [...dossierSource]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 5);

  const proofs = dossierSource.filter((d) => d.proof);

  const breakdown = [
    { label: "Validés", value: liveStats.validated, bar: "bg-success" },
    { label: "En attente", value: liveStats.pending, bar: "bg-warning" },
    {
      label: "Brouillons",
      value: liveStats.draft,
      bar: "bg-muted-foreground/40",
    },
    { label: "Rejetés", value: liveStats.rejected, bar: "bg-destructive" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-brand p-6 text-brand-foreground sm:p-8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 80% at 90% 0%, rgba(6,182,212,0.30) 0%, rgba(11,19,43,0) 60%)",
          }}
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/85">
              <Sparkles className="size-3.5" />
              Espace déposant
            </span>
            <h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Bonjour, {user?.full_name?.split(" ")[0] || depositor.firstName}
            </h1>
            <p className="mt-1.5 max-w-md text-sm text-white/70">
              Suivez vos dépôts, leur validation et leurs preuves
              d&apos;authenticité en un coup d&apos;œil.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/deposant/deposer">
                <UploadCloud className="size-4" />
                Déposer un document
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="border border-white/25 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/deposant/mes-dossiers">Mes dossiers</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Dépôts au total"
          value={liveStats.total}
          icon={FolderTree}
          accent="primary"
          hint="tous statuts confondus"
        />
        <StatsCard
          label="Validés"
          value={liveStats.validated}
          icon={BadgeCheck}
          accent="success"
          hint="publiés en accès libre"
        />
        <StatsCard
          label="En attente"
          value={liveStats.pending}
          icon={Clock}
          accent="warning"
          hint="en cours de validation"
        />
        <StatsCard
          label="Vues cumulées"
          value={nf.format(liveStats.views)}
          icon={Eye}
          accent="ai"
          hint={`${nf.format(liveStats.downloads)} téléchargements`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Recent dossiers */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <FolderTree className="size-4 text-primary" />
              Dossiers récents
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/deposant/mes-dossiers">
                Tout voir
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            <ul className="divide-y divide-border border-t border-border">
              {recent.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/deposant/dossier/${d.id}`}
                    className="flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {d.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {d.reference} · {d.type} · {fmtDate(d.updatedAt)}
                      </p>
                    </div>
                    <DossierStatusBadge status={d.status} />
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Validation progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Progression de validation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3.5">
              {breakdown.map((b) => (
                <div key={b.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-foreground">{b.label}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {b.value}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${b.bar}`}
                      style={{
                        width: `${
                          liveStats.total
                            ? (b.value / liveStats.total) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Proofs */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-4 text-success" />
                Preuves d&apos;authenticité
              </CardTitle>
              <span className="text-sm font-semibold text-foreground">
                {proofs.length}
              </span>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {proofs.map((d) => (
                <Link
                  key={d.id}
                  href={`/deposant/preuve/${d.id}`}
                  className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-success/12 text-success">
                    <ShieldCheck className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {d.proof?.reference}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {d.title}
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

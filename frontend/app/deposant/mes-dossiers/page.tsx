"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Search,
  SearchX,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DossierStatusBadge } from "@/components/dossier-status-badge";
import { EmptyState } from "@/components/empty-state";
import {
  depositorStats,
  myDossiers,
  type DossierStatus,
} from "@/lib/mock-data";
import { listWorks, useApiResource, workToDossier } from "@/lib/api";

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

type Filter = "Tous" | DossierStatus;

export default function MesDossiersPage() {
  const [filter, setFilter] = React.useState<Filter>("Tous");
  const [query, setQuery] = React.useState("");
  const works = useApiResource(() => listWorks({ ordering: "-updated_at" }), [], null);
  const liveDossiers = React.useMemo(
    () => works.data?.results?.map(workToDossier) || [],
    [works.data],
  );
  const source = liveDossiers.length > 0 ? liveDossiers : myDossiers;
  const liveFilters = React.useMemo(
    () => [
      { value: "Tous" as Filter, count: source.length },
      { value: "Validé" as Filter, count: source.filter((d) => d.status === "Validé").length },
      {
        value: "En attente" as Filter,
        count: source.filter((d) => d.status === "En attente").length,
      },
      { value: "Brouillon" as Filter, count: source.filter((d) => d.status === "Brouillon").length },
      { value: "Rejeté" as Filter, count: source.filter((d) => d.status === "Rejeté").length },
    ],
    [source],
  );

  const filtered = source.filter((d) => {
    const okStatus = filter === "Tous" || d.status === filter;
    const q = query.trim().toLowerCase();
    const okQuery =
      !q ||
      d.title.toLowerCase().includes(q) ||
      d.reference.toLowerCase().includes(q) ||
      d.domain.toLowerCase().includes(q) ||
      d.keywords.some((k) => k.toLowerCase().includes(q));
    return okStatus && okQuery;
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-brand">
            Mes dossiers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez et suivez l&apos;ensemble de vos dépôts scientifiques.
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/deposant/deposer">
            <UploadCloud className="size-4" />
            Déposer un document
          </Link>
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full gap-1 overflow-x-auto rounded-lg bg-muted p-1 lg:w-fit">
          {liveFilters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                filter === f.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.value}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px] tabular-nums",
                  filter === f.value
                    ? "bg-muted text-muted-foreground"
                    : "bg-background/70 text-muted-foreground"
                )}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un dossier…"
            aria-label="Rechercher un dossier"
            className="pl-9"
          />
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Aucun dossier trouvé"
          description="Aucun dépôt ne correspond à votre recherche ou au filtre sélectionné."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setFilter("Tous");
                setQuery("");
              }}
            >
              Réinitialiser les filtres
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden py-0">
          <ul className="divide-y divide-border">
            {filtered.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
              >
                <Link
                  href={`/deposant/dossier/${d.id}`}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-sm font-medium text-foreground">
                    {d.title}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span className="font-mono text-[11px]">{d.reference}</span>
                    <span aria-hidden>·</span>
                    <span>{d.type}</span>
                    <span aria-hidden>·</span>
                    <span>{d.domain}</span>
                    <span aria-hidden>·</span>
                    <span>Maj {fmtDate(d.updatedAt)}</span>
                  </p>
                </Link>

                <DossierStatusBadge status={d.status} />

                <div className="hidden items-center gap-1.5 sm:flex">
                  {d.proof && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/deposant/preuve/${d.id}`}>
                        <ShieldCheck className="size-3.5 text-success" />
                        Preuve
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon-sm" asChild>
                    <Link
                      href={`/deposant/dossier/${d.id}`}
                      aria-label={`Ouvrir ${d.title}`}
                    >
                      <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        {filtered.length} dossier{filtered.length > 1 ? "s" : ""} affiché
        {filtered.length > 1 ? "s" : ""}
        {filter !== "Tous" ? ` · filtre : ${filter}` : ""}
        <Badge variant="secondary" className="ml-2 font-normal">
        {source.length || depositorStats.total} au total
        </Badge>
      </p>
    </div>
  );
}

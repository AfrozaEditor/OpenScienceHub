"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Atom,
  BadgeCheck,
  Boxes,
  Building2,
  Calendar,
  FileText,
  Filter,
  Languages,
  Lock,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SearchBar } from "@/components/search-bar";
import { FacetFilter } from "@/components/facet-filter";
import { DocumentCard } from "@/components/document-card";
import { DocumentListSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { documents, facets, type ScientificDocument } from "@/lib/mock-data";

const groups = [
  { id: "type", title: "Type de document", icon: FileText, options: facets.types },
  { id: "year", title: "Année", icon: Calendar, options: facets.years },
  { id: "faculty", title: "Faculté", icon: Building2, options: facets.faculties },
  { id: "department", title: "Département", icon: Boxes, options: facets.departments },
  { id: "domain", title: "Domaine scientifique", icon: Atom, options: facets.domains },
  { id: "language", title: "Langue", icon: Languages, options: facets.languages },
  { id: "access", title: "Accès", icon: Lock, options: facets.access },
  { id: "status", title: "Statut", icon: BadgeCheck, options: facets.statuses },
] as const;

const fieldOf: Record<string, (d: ScientificDocument) => string> = {
  type: (d) => d.type,
  year: (d) => String(d.year),
  faculty: (d) => d.faculty,
  department: (d) => d.department,
  domain: (d) => d.domain,
  language: (d) => d.language,
  access: (d) => d.access,
  status: (d) => d.status,
};

type Filters = Record<string, string[]>;

function ExplorerContent() {
  const sp = useSearchParams();
  const [query, setQuery] = React.useState("");
  const [filters, setFilters] = React.useState<Filters>({});
  const [sort, setSort] = React.useState("relevance");
  const [loading, setLoading] = React.useState(true);
  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    setQuery(sp.get("q") ?? "");
    const domain = sp.get("domain");
    if (domain) setFilters((f) => ({ ...f, domain: [domain] }));
  }, [sp]);

  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [query, filters, sort]);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = documents.filter((d) => {
      if (q) {
        const haystack = [
          d.title,
          d.authors.join(" "),
          d.supervisors.join(" "),
          d.keywords.join(" "),
          d.abstract,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      for (const g of groups) {
        const selected = filters[g.id];
        if (selected?.length && !selected.includes(fieldOf[g.id](d))) {
          return false;
        }
      }
      return true;
    });

    const sorted = [...filtered];
    switch (sort) {
      case "recent":
        sorted.sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt));
        break;
      case "downloads":
        sorted.sort((a, b) => b.downloads - a.downloads);
        break;
      case "citations":
        sorted.sort((a, b) => b.citations - a.citations);
        break;
      default:
        sorted.sort((a, b) => b.views - a.views);
    }
    return sorted;
  }, [query, filters, sort]);

  const activeChips = groups.flatMap((g) =>
    (filters[g.id] ?? []).map((value) => ({ groupId: g.id, value }))
  );
  const hasFilters = activeChips.length > 0;

  function toggle(groupId: string, value: string) {
    setFilters((prev) => {
      const cur = prev[groupId] ?? [];
      const next = cur.includes(value)
        ? cur.filter((v) => v !== value)
        : [...cur, value];
      return { ...prev, [groupId]: next };
    });
  }

  const FiltersPanel = (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
          <Filter className="size-4 text-primary" />
          Filtres
        </h2>
        {hasFilters && (
          <button
            type="button"
            onClick={() => setFilters({})}
            className="text-xs font-medium text-primary hover:underline"
          >
            Effacer
          </button>
        )}
      </div>
      {groups.map((g) => (
        <FacetFilter
          key={g.id}
          title={g.title}
          icon={g.icon}
          options={g.options}
          selected={filters[g.id] ?? []}
          onToggle={(v) => toggle(g.id, v)}
          defaultOpen={["type", "domain", "year"].includes(g.id)}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      <div className="border-b border-border bg-card/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
            Explorer le répertoire scientifique
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Recherchez parmi les mémoires, thèses, articles et rapports archivés.
          </p>
          <div className="mt-5 max-w-3xl">
            <SearchBar defaultValue={query} onSearch={setQuery} />
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="lg:w-72 lg:shrink-0">
            <div className="mb-4 lg:hidden">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setShowFilters((v) => !v)}
              >
                <SlidersHorizontal className="size-4" />
                Filtres
                {hasFilters && (
                  <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                    {activeChips.length}
                  </span>
                )}
              </Button>
            </div>
            <div
              className={cn(
                "rounded-xl border border-border bg-card p-5 lg:sticky lg:top-20",
                showFilters ? "block" : "hidden lg:block"
              )}
            >
              {FiltersPanel}
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {loading ? (
                  "Recherche en cours…"
                ) : (
                  <>
                    <span className="font-semibold text-foreground">
                      {results.length}
                    </span>{" "}
                    résultat{results.length > 1 ? "s" : ""}
                    {query && (
                      <>
                        {" "}
                        pour «&nbsp;<span className="text-foreground">{query}</span>
                        &nbsp;»
                      </>
                    )}
                  </>
                )}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Trier par</span>
                <div className="w-44">
                  <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="relevance">Pertinence</option>
                    <option value="recent">Plus récent</option>
                    <option value="downloads">Plus téléchargé</option>
                    <option value="citations">Plus cité</option>
                  </Select>
                </div>
              </div>
            </div>

            {hasFilters && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <button
                    key={`${chip.groupId}-${chip.value}`}
                    type="button"
                    onClick={() => toggle(chip.groupId, chip.value)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    {chip.value}
                    <X className="size-3" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFilters({})}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
                >
                  Effacer les filtres
                </button>
              </div>
            )}

            <div className="mt-6">
              {loading ? (
                <DocumentListSkeleton count={4} />
              ) : results.length === 0 ? (
                <EmptyState
                  icon={SearchX}
                  title="Aucun résultat trouvé"
                  description="Essayez d'élargir votre recherche ou de retirer certains filtres."
                  action={
                    <Button
                      variant="outline"
                      onClick={() => {
                        setQuery("");
                        setFilters({});
                      }}
                    >
                      Réinitialiser la recherche
                    </Button>
                  }
                />
              ) : (
                <div className="flex flex-col gap-5">
                  {results.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function ExplorerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col bg-background">
          <SiteHeader />
          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
            <DocumentListSkeleton count={4} />
          </div>
        </div>
      }
    >
      <ExplorerContent />
    </Suspense>
  );
}

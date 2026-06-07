"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  Gavel,
  MessageSquarePlus,
  Search,
  UserCheck,
  UserPlus,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ValidationPageHeader } from "@/components/validation/validation-page-header";
import { useAuth } from "@/components/auth-provider";
import {
  priorityRank,
  type DossierState,
  type Priority,
} from "@/lib/validation-data";
import { messageForApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/api/hooks";
import { workToScientificDocument } from "@/lib/api/mappers";
import { assignWork, getValidationInbox } from "@/lib/api/resources";

const STATES: DossierState[] = ["À traiter", "En cours", "En correction", "Validé", "Rejeté"];
const PRIORITIES: Priority[] = ["Haute", "Normale", "Basse"];
const DOC_TYPES = ["Mémoire", "Thèse", "Article", "Rapport"];

const priorityVariant: Record<Priority, "destructive" | "default" | "secondary"> = {
  Haute: "destructive",
  Normale: "default",
  Basse: "secondary",
};

const stateVariant: Record<DossierState, "warning" | "default" | "ai" | "success" | "destructive"> = {
  "À traiter": "warning",
  "En cours": "default",
  "En correction": "ai",
  Validé: "success",
  Rejeté: "destructive",
};

function InboxInner() {
  const params = useSearchParams();
  const { user } = useAuth();
  const [localAssignments, setLocalAssignments] = React.useState<Record<string, string>>({});
  const [message, setMessage] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [stateFilter, setStateFilter] = React.useState(params.get("state") ?? "all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState(params.get("type") ?? "all");
  const inbox = useApiResource(() => getValidationInbox({ ordering: "-submitted_at" }), [], null);
  const liveRows = React.useMemo(
    () =>
      inbox.data?.results?.map((work, index) => ({
        d: {
          id: work.id,
          workSlug: work.id,
          priority: index < 2 ? ("Haute" as Priority) : ("Normale" as Priority),
          state: "À traiter" as DossierState,
          assignee: localAssignments[work.id] || null,
          slaDays: 7,
          ageDays: 0,
          versionHash: work.reference_code || work.id.slice(0, 12),
        },
        doc: workToScientificDocument(work),
      })) || [],
    [inbox.data, localAssignments],
  );

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return liveRows
      .filter(({ d, doc }) => {
        const matchesQuery =
          !q ||
          doc!.title.toLowerCase().includes(q) ||
          doc!.authors.join(" ").toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q);
        const matchesState = stateFilter === "all" || d.state === stateFilter;
        const matchesPriority = priorityFilter === "all" || d.priority === priorityFilter;
        const matchesType = typeFilter === "all" || doc!.type === typeFilter;
        return matchesQuery && matchesState && matchesPriority && matchesType;
      })
      .sort(
        (a, b) =>
          priorityRank[a.d.priority] - priorityRank[b.d.priority] ||
          b.d.ageDays - a.d.ageDays
      );
  }, [liveRows, query, stateFilter, priorityFilter, typeFilter]);

  async function assignToMe(id: string) {
    if (!user?.id) return;
    try {
      await assignWork(id, {
        assignment_type: "PEER_REVIEW",
        assignee: user.id,
      });
      setLocalAssignments((prev) => ({ ...prev, [id]: user.full_name || user.email }));
      setMessage("Dossier assigné à votre mission.");
    } catch (err) {
      setMessage(messageForApiError(err));
    }
  }

  function clearFilters() {
    setQuery("");
    setStateFilter("all");
    setPriorityFilter("all");
    setTypeFilter("all");
  }

  const hasFilters =
    query || stateFilter !== "all" || priorityFilter !== "all" || typeFilter !== "all";

  return (
    <>
      <ValidationPageHeader
        title="Dossiers à traiter"
        description="File de validation : recherchez, filtrez, assignez et ouvrez les dossiers."
      >
        <Badge variant="outline">
          {inbox.loading ? "Chargement..." : `${rows.length} dossier(s)`}
        </Badge>
      </ValidationPageHeader>
      {message && (
        <div className="mb-4 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          {message}
        </div>
      )}

      {/* Filtres */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un titre, un auteur, un identifiant…"
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} aria-label="Statut">
            <option value="all">Tous statuts</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} aria-label="Priorité">
            <option value="all">Priorités</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Type">
            <option value="all">Tous types</option>
            {DOC_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} className="shrink-0">
            Effacer
          </Button>
        )}
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 lg:hidden">
        {rows.map(({ d, doc }) => {
          const mine = Boolean(d.assignee && d.assignee === (user?.full_name || user?.email));
          const overdue = d.ageDays > d.slaDays;
          return (
            <Card key={d.id} className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={priorityVariant[d.priority]}>{d.priority}</Badge>
                <Badge variant={stateVariant[d.state]}>{d.state}</Badge>
                <Badge variant="outline">{doc!.type}</Badge>
              </div>
              <Link
                href={`/validation/dossiers/${d.id}`}
                className="mt-3 block font-heading text-base font-semibold text-foreground hover:text-primary"
              >
                {doc!.title}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {doc!.authors[0]} · {doc!.faculty}
              </p>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                <p>
                  Assigné :{" "}
                  <span className="font-medium text-foreground">
                    {d.assignee ? (mine ? "Vous" : d.assignee) : "Non assigné"}
                  </span>
                </p>
                <p>
                  Délai :{" "}
                  <span className={overdue ? "font-medium text-destructive" : "font-medium text-foreground"}>
                    {d.ageDays} j / {d.slaDays} j
                  </span>
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {mine ? (
                  <Button variant="outline" disabled>
                    <UserCheck className="size-4" />
                    Assigné
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => assignToMe(d.id)}>
                    <UserPlus className="size-4" />
                    M&apos;assigner
                  </Button>
                )}
                <Button asChild>
                  <Link href={`/validation/dossiers/${d.id}`}>
                    Ouvrir
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href={`/validation/dossiers/${d.id}?tab=avis`}>
                    <MessageSquarePlus className="size-4" />
                    Avis
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href={`/validation/dossiers/${d.id}?tab=decision`}>
                    <Gavel className="size-4" />
                    Décision
                  </Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Table desktop */}
      <Card className="hidden overflow-hidden py-0 lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Priorité</th>
                <th className="px-4 py-3 font-medium">Document</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Assigné</th>
                <th className="px-4 py-3 font-medium">Âge / SLA</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ d, doc }) => {
                const mine = Boolean(d.assignee && d.assignee === (user?.full_name || user?.email));
                const overdue = d.ageDays > d.slaDays;
                return (
                  <tr
                    key={d.id}
                    className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <Badge variant={priorityVariant[d.priority]}>{d.priority}</Badge>
                    </td>
                    <td className="max-w-[320px] px-4 py-3">
                      <Link
                        href={`/validation/dossiers/${d.id}`}
                        className="line-clamp-1 font-medium text-foreground hover:text-primary"
                      >
                        {doc!.title}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">
                        {doc!.authors[0]} · {doc!.faculty}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{doc!.type}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={stateVariant[d.state]}>{d.state}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {d.assignee ? (
                        <span className={mine ? "text-sm font-medium text-foreground" : "text-sm text-muted-foreground"}>
                          {mine ? "Vous" : d.assignee}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Non assigné</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={overdue ? "text-sm font-medium text-destructive" : "text-sm text-muted-foreground"}>
                        {d.ageDays} j / {d.slaDays} j
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {mine ? (
                          <span
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-success"
                            title="Assigné à vous"
                          >
                            <UserCheck className="size-3.5" />
                          </span>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => assignToMe(d.id)}
                            title="M'assigner"
                          >
                            <UserPlus className="size-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" asChild title="Donner un avis">
                          <Link href={`/validation/dossiers/${d.id}?tab=avis`}>
                            <MessageSquarePlus className="size-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild title="Demander une correction">
                          <Link href={`/validation/dossiers/${d.id}?tab=corrections`}>
                            <Wrench className="size-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild title="Décider">
                          <Link href={`/validation/dossiers/${d.id}?tab=decision`}>
                            <Gavel className="size-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/validation/dossiers/${d.id}`}>
                            Ouvrir
                            <ArrowUpRight className="size-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            Aucun dossier ne correspond aux filtres.
          </div>
        )}
      </Card>

      {rows.length === 0 && (
        <div className="lg:hidden rounded-lg border border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
          Aucun dossier ne correspond aux filtres.
        </div>
      )}
    </>
  );
}

export default function ValidationInboxPage() {
  return (
    <React.Suspense fallback={<div className="py-12 text-center text-sm text-muted-foreground">Chargement…</div>}>
      <InboxInner />
    </React.Suspense>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Clock,
  FileText,
  Inbox,
  Loader,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ValidationPageHeader } from "@/components/validation/validation-page-header";
import {
  dossiers,
  getDossierWork,
  priorityQueue,
  type DossierState,
  type Priority,
} from "@/lib/validation-data";
import { getValidationInbox, useApiResource, workToScientificDocument } from "@/lib/api";

const priorityVariant: Record<Priority, "destructive" | "default" | "secondary"> = {
  Haute: "destructive",
  Normale: "default",
  Basse: "secondary",
};

const DOC_TYPES = ["Mémoire", "Thèse", "Article", "Rapport"] as const;

function countState(state: DossierState) {
  return dossiers.filter((d) => d.state === state).length;
}

const stats = [
  {
    label: "À traiter",
    value: countState("À traiter"),
    icon: Inbox,
    cls: "bg-warning/15 text-[#b45309]",
    href: "/validation/a-traiter?state=" + encodeURIComponent("À traiter"),
  },
  {
    label: "En cours",
    value: countState("En cours"),
    icon: Loader,
    cls: "bg-primary/10 text-primary",
    href: "/validation/a-traiter?state=" + encodeURIComponent("En cours"),
  },
  {
    label: "En correction",
    value: countState("En correction"),
    icon: Wrench,
    cls: "bg-ai/10 text-ai",
    href: "/validation/a-traiter?state=" + encodeURIComponent("En correction"),
  },
  {
    label: "Validés",
    value: countState("Validé"),
    icon: BadgeCheck,
    cls: "bg-success/12 text-success",
    href: "/validation/a-traiter?state=" + encodeURIComponent("Validé"),
  },
];

export default function ValidationDashboardPage() {
  const inbox = useApiResource(() => getValidationInbox({ ordering: "-submitted_at" }), [], null);
  const liveQueue = React.useMemo(
    () =>
      inbox.data?.results?.map((work, index) => ({
        d: {
          id: work.id,
          workSlug: work.id,
          priority: index < 2 ? ("Haute" as Priority) : ("Normale" as Priority),
          state: "À traiter" as DossierState,
          assignee: null,
          slaDays: 7,
          ageDays: 0,
          versionHash: work.reference_code || work.id.slice(0, 12),
        },
        doc: workToScientificDocument(work),
      })) || [],
    [inbox.data],
  );
  const queue = (liveQueue.length > 0
    ? liveQueue
    : priorityQueue()
        .map((d) => ({ d, doc: getDossierWork(d) }))
        .filter((x) => x.doc))
    .filter((x) => x.doc)
    .slice(0, 6);

  const typeSource = queue.map((row) => row.doc!);
  const typeSummary = DOC_TYPES.map((type) => ({
    type,
    count:
      typeSource.length > 0
        ? typeSource.filter((doc) => doc.type === type).length
        : dossiers.filter((d) => getDossierWork(d)?.type === type).length,
  }));
  const maxType = Math.max(1, ...typeSummary.map((t) => t.count));
  const renderedStats = stats.map((stat) =>
    stat.label === "À traiter" && inbox.data
      ? { ...stat, value: inbox.data.count || inbox.data.results.length }
      : stat,
  );

  return (
    <>
      <ValidationPageHeader
        title="Tableau de bord"
        description="Suivez votre file de validation, les priorités et la répartition des dossiers."
      />

      {/* Stats cliquables */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {renderedStats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-secondary"
          >
            <div className="flex items-start justify-between">
              <span className={`flex size-10 items-center justify-center rounded-lg ${s.cls}`}>
                <s.icon className="size-5" />
              </span>
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <p className="mt-3 font-heading text-3xl font-semibold text-foreground">
              {s.value}
            </p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* File prioritaire */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="size-4 text-primary" />
              File prioritaire
            </CardTitle>
            <CardAction>
              <Link
                href="/validation/a-traiter"
                className="text-xs font-medium text-primary hover:underline"
              >
                Voir l'inbox
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <ul>
              {queue.map(({ d, doc }) => (
                <li
                  key={d.id}
                  className="flex items-center gap-3 border-t border-border px-5 py-3"
                >
                  <Badge variant={priorityVariant[d.priority]}>{d.priority}</Badge>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/validation/dossiers/${d.id}`}
                      className="line-clamp-1 text-sm font-medium text-foreground hover:text-primary"
                    >
                      {doc!.title}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {doc!.type} · {doc!.faculty} · déposé il y a {d.ageDays} j
                    </p>
                  </div>
                  <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                    SLA {d.slaDays} j
                  </span>
                  <Link
                    href={`/validation/dossiers/${d.id}`}
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Ouvrir
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Résumé par type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-4 text-ai" />
              Résumé par type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3.5 py-1">
              {typeSummary.map((t) => (
                <Link
                  key={t.type}
                  href={"/validation/a-traiter?type=" + encodeURIComponent(t.type)}
                  className="group block"
                >
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-foreground group-hover:text-primary">
                      {t.type}
                    </span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {t.count}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary/85 transition-colors group-hover:bg-primary"
                      style={{ width: `${(t.count / maxType) * 100}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

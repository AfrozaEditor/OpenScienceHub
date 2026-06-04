"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Download,
  Eye,
  FileText,
  Pencil,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/empty-state";
import { DossierStatusBadge } from "@/components/dossier-status-badge";
import { getDossier, type Dossier, type TimelineState } from "@/lib/mock-data";
import { getWork, listDocuments, useApiResource, workToDossier } from "@/lib/api";

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function fmtDate(value: string) {
  if (!value || value === "—") return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : dateFmt.format(d);
}

const nodeStyle: Record<
  TimelineState,
  { wrap: string; icon: React.ReactNode }
> = {
  done: {
    wrap: "bg-success text-white",
    icon: <Check className="size-3.5" />,
  },
  current: {
    wrap: "bg-primary text-white ring-4 ring-primary/15",
    icon: <span className="size-1.5 rounded-full bg-white" />,
  },
  rejected: {
    wrap: "bg-destructive text-white",
    icon: <X className="size-3.5" />,
  },
  pending: {
    wrap: "border border-border bg-card text-muted-foreground",
    icon: <span className="size-1.5 rounded-full bg-muted-foreground/40" />,
  },
};

export default function DossierDetailPage() {
  const params = useParams<{ id: string }>();
  const liveWork = useApiResource(() => getWork(params.id), [params.id], null);
  const liveDocuments = useApiResource(() => listDocuments(params.id), [params.id], []);
  const mockDossier = getDossier(params.id);
  const latestDocument = React.useMemo(() => {
    const docs = liveDocuments.data || [];
    return [...docs].sort((a, b) => b.version_number - a.version_number)[0];
  }, [liveDocuments.data]);
  const liveDossier = React.useMemo<Dossier | null>(() => {
    if (!liveWork.data) return null;
    const base = workToDossier(liveWork.data);
    return {
      id: base.id,
      reference: base.reference,
      title: base.title,
      type: base.type,
      status: base.status,
      domain: base.domain,
      faculty: "—",
      department: "—",
      level: liveWork.data.type,
      language: liveWork.data.language || "FR",
      abstract: liveWork.data.abstract_text || "Résumé non renseigné.",
      keywords: base.keywords,
      pages: latestDocument?.page_count || 0,
      fileSize: latestDocument?.file_name || latestDocument?.file || "—",
      submittedAt: liveWork.data.submitted_at || "—",
      updatedAt: base.updatedAt,
      views: 0,
      downloads: 0,
      aiConfidence: 0,
      timeline: [
        { label: "Création", date: liveWork.data.created_at || "—", state: "done" },
        {
          label: "Soumission",
          date: liveWork.data.submitted_at || "—",
          state: liveWork.data.submitted_at ? "done" : "pending",
        },
        {
          label: "Validation",
          date: "—",
          state: ["VALIDATED", "ARCHIVED"].includes(liveWork.data.status) ? "done" : "pending",
        },
      ],
      proof: base.proof ? mockDossier?.proof : undefined,
    };
  }, [liveWork.data, latestDocument, mockDossier]);
  const dossier = liveDossier || mockDossier;

  if (!dossier && !liveWork.loading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          icon={FileText}
          title="Dossier introuvable"
          description="Ce dossier n'existe pas ou a été supprimé."
          action={
            <Button variant="outline" asChild>
              <Link href="/deposant/mes-dossiers">
                <ArrowLeft className="size-4" />
                Retour à mes dossiers
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          icon={FileText}
          title="Chargement du dossier"
          description="Récupération des informations depuis le backend."
        />
      </div>
    );
  }

  const meta: [string, string][] = [
    ["Type", dossier.type],
    ["Domaine", dossier.domain],
    ["Département", dossier.department],
    ["Faculté", dossier.faculty],
    ["Niveau", dossier.level],
    ["Langue", dossier.language],
    ["Pages", dossier.pages ? String(dossier.pages) : "—"],
    ["Fichier", dossier.fileSize],
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
        <Link href="/deposant/mes-dossiers">
          <ArrowLeft className="size-4" />
          Mes dossiers
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <DossierStatusBadge status={dossier.status} />
          <Badge variant="secondary">{dossier.type}</Badge>
          <span className="font-mono text-xs text-muted-foreground">
            {dossier.reference}
          </span>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
          {dossier.title}
        </h1>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* Main */}
        <div className="flex flex-col gap-6">
          {dossier.status === "Rejeté" && dossier.rejectionReason && (
            <div className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-md bg-destructive/10 text-destructive">
                <X className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Dépôt renvoyé pour révision
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {dossier.rejectionReason}
                </p>
              </div>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Résumé</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {dossier.abstract}
              </p>

              {dossier.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {dossier.keywords.map((k) => (
                    <Badge key={k} variant="secondary" className="font-normal">
                      {k}
                    </Badge>
                  ))}
                </div>
              )}

              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-5 sm:grid-cols-4">
                {meta.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-foreground">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              {dossier.aiConfidence > 0 && (
                <div className="rounded-lg border border-ai/30 bg-ai/5 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Sparkles className="size-4 text-ai" />
                      Confiance de l&apos;extraction IA
                    </span>
                    <span className="text-sm font-semibold text-ai">
                      {dossier.aiConfidence}%
                    </span>
                  </div>
                  <Progress
                    value={dossier.aiConfidence}
                    indicatorClassName="bg-ai"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Actions */}
          <Card>
            <CardContent className="flex flex-col gap-3 pt-6">
              {dossier.proof ? (
                <Button asChild>
                  <Link href={`/deposant/preuve/${dossier.id}`}>
                    <ShieldCheck className="size-4" />
                    Voir la preuve d&apos;authenticité
                  </Link>
                </Button>
              ) : dossier.status === "Brouillon" ? (
                <Button asChild>
                  <Link href="/deposant/deposer">
                    <Pencil className="size-4" />
                    Continuer le dépôt
                  </Link>
                </Button>
              ) : null}

              {dossier.status !== "Brouillon" && (
                <Button variant="outline">
                  <Download className="size-4" />
                  Télécharger le PDF
                </Button>
              )}

              <div className="mt-1 grid grid-cols-2 gap-3 border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <Eye className="size-4 text-muted-foreground" />
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-foreground">
                      {dossier.views}
                    </p>
                    <p className="text-[11px] text-muted-foreground">vues</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="size-4 text-muted-foreground" />
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-foreground">
                      {dossier.downloads}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      téléchargements
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Suivi de validation</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col">
                {dossier.timeline.map((ev, i) => {
                  const last = i === dossier.timeline.length - 1;
                  const style = nodeStyle[ev.state];
                  return (
                    <li key={ev.label} className="relative flex gap-3 pb-5 last:pb-0">
                      {!last && (
                        <span className="absolute top-7 left-[11px] h-[calc(100%-1.25rem)] w-px bg-border" />
                      )}
                      <span
                        className={cn(
                          "z-10 grid size-6 shrink-0 place-items-center rounded-full",
                          style.wrap
                        )}
                      >
                        {style.icon}
                      </span>
                      <div className="-mt-0.5">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            ev.state === "pending"
                              ? "text-muted-foreground"
                              : "text-foreground"
                          )}
                        >
                          {ev.label}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {fmtDate(ev.date)}
                          {ev.actor ? ` · ${ev.actor}` : ""}
                        </p>
                        {ev.description && (
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {ev.description}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

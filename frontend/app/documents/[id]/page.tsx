"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  Download,
  FileDown,
  FileText,
  History,
  Quote,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  AccessBadge,
  DocumentTypeBadge,
  MetadataBadge,
} from "@/components/metadata-badge";
import { StatusBadge } from "@/components/status-badge";
import { AiMetadataPanel } from "@/components/ai-metadata-panel";
import { CitationBox } from "@/components/citation-box";
import { SimilarDocuments } from "@/components/similar-documents";
import { EmptyState } from "@/components/empty-state";
import { formatNumber } from "@/components/document-card";
import { getDocument, getSimilarDocuments } from "@/lib/mock-data";

export default function DocumentDetailPage() {
  const params = useParams();
  const id = (Array.isArray(params.id) ? params.id[0] : params.id) ?? "";
  const doc = getDocument(id);

  const [copied, setCopied] = React.useState<string | null>(null);

  function flash(label: string) {
    setCopied(label);
    setTimeout(() => setCopied(null), 1800);
  }

  async function copyCitation() {
    if (!doc) return;
    const apa = `${doc.authors.join(", ")} (${doc.year}). ${doc.title}. ${doc.type}, ${doc.institution}.`;
    try {
      await navigator.clipboard.writeText(apa);
    } catch {}
    flash("citation");
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {}
    flash("share");
  }

  function exportBibtex() {
    if (!doc) return;
    const key = `${doc.authors[0]?.split(" ").pop()?.toLowerCase() ?? "ref"}${doc.year}`;
    const bib = `@${doc.type === "Article" ? "article" : "phdthesis"}{${key},
  title  = {${doc.title}},
  author = {${doc.authors.join(" and ")}},
  year   = {${doc.year}},
  school = {${doc.institution}}
}`;
    const blob = new Blob([bib], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${key}.bib`;
    a.click();
    URL.revokeObjectURL(url);
    flash("bibtex");
  }

  if (!doc) {
    return (
      <div className="flex flex-1 flex-col bg-background">
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-20 sm:px-6">
          <EmptyState
            icon={FileText}
            title="Document introuvable"
            description="Ce document n'existe pas ou a été déplacé."
            action={
              <Button asChild>
                <Link href="/explorer">Retour à l&apos;exploration</Link>
              </Button>
            }
          />
        </main>
        <SiteFooter />
      </div>
    );
  }

  const similar = getSimilarDocuments(doc);

  const infoRows = [
    { label: "Auteur(s)", value: doc.authors.join(", ") },
    { label: "Encadreur(s)", value: doc.supervisors.join(", ") },
    { label: "Institution", value: doc.institution },
    { label: "Faculté", value: doc.faculty },
    { label: "Département", value: doc.department },
    { label: "Domaine", value: doc.domain },
    { label: "Année", value: String(doc.year) },
    { label: "Langue", value: doc.language },
    { label: "Niveau", value: doc.level },
    { label: "Pages", value: `${doc.pages} pages` },
    { label: "Licence", value: doc.license },
  ];

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Accueil
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href="/explorer" className="hover:text-foreground">
            Explorer
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="truncate text-foreground">{doc.type}</span>
        </nav>

        {/* Title block */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <DocumentTypeBadge type={doc.type} />
          <StatusBadge status={doc.status} />
          <AccessBadge access={doc.access} />
        </div>
        <h1 className="mt-3 max-w-4xl font-heading text-2xl font-semibold leading-tight tracking-tight text-brand sm:text-3xl lg:text-4xl">
          {doc.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Par <span className="font-medium text-foreground">{doc.authors.join(", ")}</span>
          {" · "}
          {doc.faculty} · {doc.year}
        </p>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Button size="lg" disabled={doc.access === "Restreint"}>
            <Download className="size-4" />
            Télécharger le PDF
          </Button>
          <Button variant="outline" size="lg" onClick={copyCitation}>
            {copied === "citation" ? (
              <Check className="size-4 text-success" />
            ) : (
              <Quote className="size-4" />
            )}
            {copied === "citation" ? "Citation copiée" : "Copier la citation"}
          </Button>
          <Button variant="outline" size="lg" onClick={exportBibtex}>
            {copied === "bibtex" ? (
              <Check className="size-4 text-success" />
            ) : (
              <FileDown className="size-4" />
            )}
            Exporter BibTeX
          </Button>
          <Button variant="outline" size="lg" onClick={share}>
            {copied === "share" ? (
              <Check className="size-4 text-success" />
            ) : (
              <Share2 className="size-4" />
            )}
            {copied === "share" ? "Lien copié" : "Partager"}
          </Button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Main column */}
          <div className="flex min-w-0 flex-col gap-8">
            {/* Abstract */}
            <section>
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                <BookOpen className="size-5 text-primary" />
                Résumé
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {doc.abstract}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {doc.keywords.map((kw) => (
                  <MetadataBadge key={kw}>{kw}</MetadataBadge>
                ))}
              </div>
            </section>

            {/* AI metadata */}
            <AiMetadataPanel
              confidence={doc.aiConfidence}
              fields={[
                { label: "Titre détecté", value: doc.title },
                { label: "Auteurs", value: doc.authors.join(", ") },
                { label: "Année", value: doc.year },
                { label: "Langue", value: doc.language },
                { label: "Type de document", value: doc.type },
                { label: "Domaine scientifique", value: doc.domain },
              ]}
              footer={
                <div className="flex flex-wrap gap-2">
                  {["PDF analysé", "Métadonnées détectées", "Résumé extrait", "Mots-clés suggérés"].map(
                    (b) => (
                      <Badge key={b} variant="ai">
                        <Check className="size-3" />
                        {b}
                      </Badge>
                    )
                  )}
                </div>
              }
            />

            {/* PDF preview */}
            <section>
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                <FileText className="size-5 text-primary" />
                Aperçu du document
              </h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-border bg-muted/40">
                <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2.5 text-sm">
                  <span className="font-medium text-foreground">
                    {doc.slug}.pdf
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {doc.pages} pages
                  </span>
                </div>
                <div className="flex justify-center p-6">
                  <div className="aspect-[1/1.3] w-full max-w-sm rounded-md border border-border bg-white p-6 shadow-sm">
                    <div className="h-2.5 w-1/3 rounded bg-primary/20" />
                    <div className="mt-4 h-3.5 w-5/6 rounded bg-foreground/15" />
                    <div className="mt-1.5 h-3.5 w-2/3 rounded bg-foreground/15" />
                    <div className="mt-5 space-y-2">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-2 rounded bg-foreground/10"
                          style={{ width: `${88 - (i % 3) * 12}%` }}
                        />
                      ))}
                    </div>
                    <div className="mt-5 h-2.5 w-1/4 rounded bg-ai/30" />
                    <div className="mt-3 space-y-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-2 rounded bg-foreground/10"
                          style={{ width: `${82 - (i % 2) * 16}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t border-border bg-card px-4 py-3 text-center">
                  <Button variant="outline" size="sm" disabled={doc.access === "Restreint"}>
                    <FileText className="size-3.5" />
                    Ouvrir le document complet
                  </Button>
                </div>
              </div>
            </section>

            {/* Citation */}
            <section id="citer" className="scroll-mt-20">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                <Quote className="size-5 text-primary" />
                Comment citer ce document
              </h2>
              <div className="mt-3">
                <CitationBox doc={doc} />
              </div>
            </section>

            {/* Versions */}
            <section>
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                <History className="size-5 text-primary" />
                Historique de versions
              </h2>
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Version 1.0{" "}
                      <Badge variant="default" className="ml-1">
                        Actuelle
                      </Badge>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Déposée le {new Date(doc.submittedAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatNumber(doc.downloads)} téléchargements
                  </span>
                </div>
              </div>
            </section>

            {/* Report */}
            <div className="flex flex-col gap-3 rounded-xl border border-warning/40 bg-warning/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#b45309]" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Une erreur dans les métadonnées ?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Aidez-nous à améliorer la qualité du catalogue.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                Signaler une erreur
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            <Card className="lg:sticky lg:top-20">
              <CardHeader>
                <CardTitle className="text-base">Informations</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-0">
                <dl className="flex flex-col">
                  {infoRows.map((row, i) => (
                    <React.Fragment key={row.label}>
                      {i > 0 && <Separator />}
                      <div className="flex items-start justify-between gap-4 py-2.5">
                        <dt className="text-sm text-muted-foreground">{row.label}</dt>
                        <dd className="max-w-[60%] text-right text-sm font-medium text-foreground">
                          {row.value}
                        </dd>
                      </div>
                    </React.Fragment>
                  ))}
                </dl>
                <Separator />
                <div className="grid grid-cols-3 gap-2 pt-4 text-center">
                  <Stat label="Vues" value={formatNumber(doc.views)} />
                  <Stat label="Téléch." value={formatNumber(doc.downloads)} />
                  <Stat label="Citations" value={formatNumber(doc.citations)} />
                </div>
              </CardContent>
            </Card>

            <SimilarDocuments docs={similar} />

            <Button variant="ghost" asChild className="justify-start">
              <Link href="/explorer">
                <ArrowLeft className="size-4" />
                Retour aux résultats
              </Link>
            </Button>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 py-2.5">
      <p className="font-heading text-base font-semibold text-foreground">
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

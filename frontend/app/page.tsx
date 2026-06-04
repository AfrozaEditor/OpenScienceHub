"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Atom,
  BadgeCheck,
  Calculator,
  CheckCircle2,
  Cpu,
  Database,
  FileSearch,
  FlaskConical,
  Globe,
  Leaf,
  Network,
  Search,
  Sparkles,
  Stethoscope,
  Upload,
  UploadCloud,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SearchBar } from "@/components/search-bar";
import { DocumentCard } from "@/components/document-card";
import { AnimatedStats } from "@/components/animated-stats";
import { documents, platformStats, popularDomains } from "@/lib/mock-data";
import { catalogToDocument, listCatalog, useApiResource } from "@/lib/api";

const fr = new Intl.NumberFormat("fr-FR");

const trustBadges = [
  { label: "Science ouverte", icon: Globe },
  { label: "Métadonnées IA", icon: Sparkles },
  { label: "Recherche à facettes", icon: Search },
  { label: "Archivage institutionnel", icon: Database },
];

const suggestions = [
  "Intelligence artificielle",
  "Hydrologie",
  "Cybersécurité",
  "Science ouverte",
];

const stats = [
  { value: platformStats.documents, suffix: "+", label: "Documents archivés" },
  { value: platformStats.authors, label: "Auteurs" },
  { value: platformStats.departments, label: "Départements" },
  { value: platformStats.domains, label: "Domaines scientifiques" },
  { value: platformStats.downloads, label: "Téléchargements" },
];

const steps = [
  {
    icon: UploadCloud,
    title: "Téléverser le PDF",
    description:
      "Déposez votre mémoire, thèse, article ou rapport en quelques secondes par glisser-déposer.",
  },
  {
    icon: Sparkles,
    title: "Extraction IA des métadonnées",
    description:
      "L'IA détecte automatiquement titre, auteurs, résumé, mots-clés, année, filière et domaine.",
    accent: true,
  },
  {
    icon: BadgeCheck,
    title: "Validation institutionnelle",
    description:
      "Le département vérifie et valide les métadonnées pour garantir la qualité documentaire.",
  },
  {
    icon: Globe,
    title: "Consultation publique",
    description:
      "Le travail devient consultable et téléchargeable via une recherche intelligente à facettes.",
  },
];

const domainIcons = {
  ai: Sparkles,
  cpu: Cpu,
  flask: FlaskConical,
  leaf: Leaf,
  stethoscope: Stethoscope,
  atom: Atom,
  calculator: Calculator,
  network: Network,
} as const;

export default function Home() {
  const liveCatalog = useApiResource(() => listCatalog({ page_size: 4 }), [], null);
  const catalogData = liveCatalog.data;
  const liveDocs = React.useMemo(
    () => catalogData?.results?.map(catalogToDocument) || [],
    [catalogData],
  );
  const recentDocs = [...(liveDocs.length > 0 ? liveDocs : documents)]
    .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt))
    .slice(0, 4);
  const liveStats = catalogData
    ? stats.map((stat) =>
        stat.label === "Documents archivés"
          ? { ...stat, value: catalogData.count || recentDocs.length }
          : stat,
      )
    : stats;

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          {/* Layered institutional backdrop */}
          <div className="relative isolate">
            {/* Fond : grille, halos et logo agrandi en filigrane */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(11,19,43,0.045) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                  maskImage:
                    "radial-gradient(ellipse 80% 80% at 50% 42%, black, transparent 78%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 80% 80% at 50% 42%, black, transparent 78%)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(38% 32% at 50% 2%, rgba(6,182,212,0.12) 0%, rgba(248,250,252,0) 72%), radial-gradient(42% 38% at 12% 6%, rgba(29,78,216,0.10) 0%, rgba(248,250,252,0) 72%), radial-gradient(42% 38% at 88% 6%, rgba(6,182,212,0.09) 0%, rgba(248,250,252,0) 72%)",
                }}
              />
              <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
                <Image
                  src="/logo-emblem.png"
                  alt=""
                  aria-hidden="true"
                  width={1000}
                  height={1000}
                  priority
                  className="w-[min(96vw,900px)] max-w-none select-none opacity-[0.05]"
                  style={{
                    maskImage:
                      "radial-gradient(circle at 50% 46%, black 58%, transparent 88%)",
                    WebkitMaskImage:
                      "radial-gradient(circle at 50% 46%, black 58%, transparent 88%)",
                  }}
                />
              </div>
            </div>

            {/* Contenu central façon moteur de recherche */}
            <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 pt-24 pb-16 text-center sm:px-6 lg:pt-32 lg:pb-20">
              {/* <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs backdrop-blur">
                <span className="flex size-5 items-center justify-center rounded-full bg-ai/10 text-ai">
                  <Sparkles className="size-3" />
                </span>
                Recherche intelligente · Métadonnées IA
              </div> */}

              <h1 className="mt-6 font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-brand sm:text-5xl lg:text-6xl">
                Recherchez la{" "}
                <span className="text-primary">science universitaire</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Mémoires, thèses, articles et rapports — un seul moteur de
                recherche à facettes pour toute la production scientifique.
              </p>

              <div className="mt-8 w-full max-w-2xl">
                <SearchBar shape="pill" />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="text-muted-foreground/80">Suggestions :</span>
                {suggestions.map((s) => (
                  <Link
                    key={s}
                    href={`/explorer?q=${encodeURIComponent(s)}`}
                    className="rounded-full border border-border bg-card px-2.5 py-1 transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {s}
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                <Button size="lg" asChild className="px-5">
                  <Link href="/explorer">
                    <Search className="size-4" />
                    Explorer les travaux
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="px-5">
                  <Link href="/deposant/deposer">
                    <Upload className="size-4" />
                    Déposer un document
                  </Link>
                </Button>
              </div>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {trustBadges.map((b) => (
                  <span key={b.label} className="flex items-center gap-1.5">
                    <b.icon className="size-3.5 text-primary" />
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-4 sm:px-6 lg:px-8">
            <AnimatedStats stats={liveStats} />
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border bg-card/40">
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary">Comment ça marche</Badge>
              <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
                Du dépôt à la consultation, en quatre étapes
              </h2>
              <p className="mt-4 text-muted-foreground">
                Un parcours fluide, outillé par l&apos;IA et sécurisé par la
                validation institutionnelle.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <Card
                  key={step.title}
                  className={
                    step.accent
                      ? "relative gap-0 border-ai/30 bg-ai/5 py-6"
                      : "relative gap-0 py-6"
                  }
                >
                  <CardContent className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <span
                        className={
                          step.accent
                            ? "flex size-11 items-center justify-center rounded-lg bg-ai/15 text-ai"
                            : "flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary"
                        }
                      >
                        <step.icon className="size-6" />
                      </span>
                      <span className="font-heading text-3xl font-semibold text-border">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                    {step.accent && (
                      <Badge variant="ai" className="mt-4 w-fit">
                        <Sparkles className="size-3" />
                        Propulsé par l&apos;IA
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Recent documents */}
        <section>
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-xl">
                <Badge variant="secondary">Derniers dépôts</Badge>
                <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
                  Travaux récemment archivés
                </h2>
              </div>
              <Button variant="outline" size="lg" asChild>
                <Link href="/explorer">
                  Voir tout le répertoire
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {recentDocs.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          </div>
        </section>

        {/* Popular domains */}
        <section className="border-t border-border bg-card/40">
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary">Domaines scientifiques</Badge>
              <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
                Explorez par domaine de recherche
              </h2>
              <p className="mt-4 text-muted-foreground">
                Parcourez les travaux regroupés par discipline scientifique.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
              {popularDomains.map((domain) => {
                const Icon = domainIcons[domain.icon];
                return (
                  <Link
                    key={domain.name}
                    href={`/explorer?domain=${encodeURIComponent(domain.name)}`}
                    className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-6" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold leading-snug text-foreground">
                        {domain.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {fr.format(domain.count)} travaux
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-brand px-8 py-14 text-center text-brand-foreground sm:px-16">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(50% 80% at 85% 0%, rgba(6,182,212,0.32) 0%, rgba(11,19,43,0) 60%)",
                }}
              />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                  Valorisez la production scientifique de votre université
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-white/75">
                  Rejoignez les institutions qui centralisent et diffusent leurs
                  travaux de recherche sur OpenScience Hub.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button size="lg" variant="secondary" asChild className="px-5">
                    <Link href="/deposant/deposer">
                      Déposer un document
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    asChild
                    className="border border-white/30 bg-white/10 px-5 text-white hover:bg-white/20"
                  >
                    <Link href="/explorer">
                      <FileSearch className="size-4" />
                      Explorer le répertoire
                    </Link>
                  </Button>
                </div>
                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/70">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-[#6ee7b7]" />
                    Accès libre
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4 text-[#67e8f9]" />
                    Multi-institutions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

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
import { documents, platformStats, popularDomains } from "@/lib/mock-data";

const fr = new Intl.NumberFormat("fr-FR");

const trustBadges = [
  { label: "Science ouverte", icon: Globe },
  { label: "Métadonnées IA", icon: Sparkles },
  { label: "Recherche à facettes", icon: Search },
  { label: "Archivage institutionnel", icon: Database },
];

const stats = [
  { value: `${fr.format(platformStats.documents)}+`, label: "Documents archivés" },
  { value: `${fr.format(platformStats.authors)}`, label: "Auteurs" },
  { value: `${platformStats.departments}`, label: "Départements" },
  { value: `${platformStats.domains}`, label: "Domaines scientifiques" },
  { value: `${fr.format(platformStats.downloads)}`, label: "Téléchargements" },
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
  const recentDocs = [...documents]
    .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt))
    .slice(0, 4);

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          {/* Layered institutional backdrop */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(11,19,43,0.05) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
                maskImage:
                  "radial-gradient(ellipse 75% 70% at 50% 28%, black, transparent 80%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 75% 70% at 50% 28%, black, transparent 80%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(45% 45% at 82% 6%, rgba(6,182,212,0.13) 0%, rgba(248,250,252,0) 70%), radial-gradient(45% 50% at 8% 12%, rgba(29,78,216,0.10) 0%, rgba(248,250,252,0) 70%)",
              }}
            />
          </div>

          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pt-16 pb-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-8 lg:pt-24 lg:pb-20">
            {/* Left: editorial */}
            <div className="flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
                <span className="flex size-5 items-center justify-center rounded-full bg-ai/10 text-ai">
                  <Sparkles className="size-3" />
                </span>
                Métadonnées extraites par IA
                <span className="h-3 w-px bg-border" />
                <span className="text-foreground">Science ouverte</span>
              </div>

              <h1 className="mt-6 font-heading text-4xl font-semibold leading-[1.04] tracking-tight text-brand sm:text-5xl lg:text-[3.4rem]">
                Toute la production{" "}
                <span className="relative whitespace-nowrap text-primary">
                  scientifique
                  <span className="absolute inset-x-0 -bottom-1 h-1 rounded-full bg-ai/30" />
                </span>{" "}
                universitaire, enfin centralisée.
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
                Archivez, classifiez et rendez consultables mémoires, thèses et
                articles. OpenScience Hub allie recherche à facettes et
                extraction automatique des métadonnées par IA.
              </p>

              <div className="mt-8 w-full max-w-xl">
                <SearchBar />
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild className="px-5">
                  <Link href="/explorer">
                    <Search className="size-4" />
                    Explorer les travaux
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="px-5">
                  <Link href="/deposer">
                    <Upload className="size-4" />
                    Déposer un document
                  </Link>
                </Button>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {trustBadges.map((b) => (
                  <span key={b.label} className="flex items-center gap-1.5">
                    <b.icon className="size-3.5 text-primary" />
                    {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: emblem medallion */}
            <div className="relative mx-auto w-full max-w-md lg:mx-0">
              <div className="relative aspect-square w-full">
                <div className="absolute inset-0 rounded-full border border-border/70" />
                <div className="absolute inset-[7%] rounded-full border border-dashed border-primary/25" />
                <div className="absolute inset-[14%] rounded-full border border-border/60" />
                <div
                  className="absolute inset-[10%] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 38%, rgba(6,182,212,0.12), rgba(255,255,255,0) 68%)",
                  }}
                />
                <div className="absolute inset-[15%] flex items-center justify-center">
                  <Image
                    src="/logo-emblem.png"
                    alt="Emblème OpenScience Hub"
                    width={612}
                    height={612}
                    priority
                    className="h-full w-full object-contain drop-shadow-[0_14px_34px_rgba(11,19,43,0.20)]"
                  />
                </div>
              </div>

              {/* floating: AI metadata */}
              <div className="absolute top-4 -left-1 w-52 rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur sm:top-8 sm:-left-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-md bg-ai/10 text-ai">
                    <Sparkles className="size-3.5" />
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    Métadonnées détectées
                  </span>
                </div>
                <div className="mt-2.5 space-y-1.5">
                  <div className="h-1.5 w-4/5 rounded-full bg-muted" />
                  <div className="h-1.5 w-3/5 rounded-full bg-muted" />
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Confiance IA
                  </span>
                  <span className="text-[11px] font-semibold text-ai">96 %</span>
                </div>
              </div>

              {/* floating: validated */}
              <div className="absolute -right-1 bottom-6 flex items-center gap-2 rounded-xl border border-border bg-card/95 px-3 py-2.5 shadow-lg backdrop-blur sm:-right-3 sm:bottom-10">
                <span className="flex size-7 items-center justify-center rounded-md bg-success/12 text-success">
                  <BadgeCheck className="size-4" />
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-foreground">
                    Document validé
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Archivé · Accès public
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3 lg:grid-cols-5">
              {stats.map((s) => (
                <div key={s.label} className="bg-card px-5 py-6 text-center">
                  <div className="font-heading text-2xl font-semibold text-brand lg:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
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
                    <Link href="/deposer">
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

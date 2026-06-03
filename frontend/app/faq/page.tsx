"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Layers,
  type LucideIcon,
  Mail,
  MessageCircleQuestion,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserRound,
  BadgeCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

type FaqCategory =
  | "Dépôt & soumission"
  | "Métadonnées & IA"
  | "Validation"
  | "Preuves & sécurité"
  | "Compte & accès";

interface FaqItem {
  category: FaqCategory;
  question: string;
  answer: string;
  cta?: { label: string; href: string };
}

const categoryMeta: Record<
  FaqCategory,
  { icon: LucideIcon; description: string; accent: string }
> = {
  "Dépôt & soumission": {
    icon: UploadCloud,
    description: "Formats acceptés, étapes de soumission et limites de dépôt.",
    accent: "bg-primary/10 text-primary",
  },
  "Métadonnées & IA": {
    icon: Sparkles,
    description: "Extraction automatique, correction et indice de confiance.",
    accent: "bg-ai/10 text-ai",
  },
  Validation: {
    icon: BadgeCheck,
    description: "Circuit de validation institutionnelle et suivi des statuts.",
    accent: "bg-success/10 text-success",
  },
  "Preuves & sécurité": {
    icon: ShieldCheck,
    description: "Empreintes SHA-256, attestations vérifiables et contrôle.",
    accent: "bg-brand/10 text-brand",
  },
  "Compte & accès": {
    icon: UserRound,
    description: "Création de compte, consultation et droits d'accès.",
    accent: "bg-warning/10 text-warning",
  },
};

const categories = Object.keys(categoryMeta) as FaqCategory[];

const faqs: FaqItem[] = [
  {
    category: "Dépôt & soumission",
    question: "Quels types de documents puis-je déposer ?",
    answer:
      "Mémoires, thèses, articles scientifiques, rapports de recherche et actes de conférence sont acceptés. Le dépôt se fait au format PDF afin de garantir l'intégrité et la lisibilité du document sur le long terme.",
  },
  {
    category: "Dépôt & soumission",
    question: "Comment déposer un document ?",
    answer:
      "Rendez-vous sur l'espace Déposant, glissez-déposez votre PDF, laissez l'IA pré-remplir les métadonnées, vérifiez-les puis validez la soumission. Le suivi de votre dépôt apparaît ensuite dans « Mes dossiers ».",
    cta: { label: "Déposer un document", href: "/deposant/deposer" },
  },
  {
    category: "Dépôt & soumission",
    question: "Quelle est la taille maximale d'un fichier ?",
    answer:
      "Un document peut atteindre 50 Mo. Pour les travaux volumineux (annexes, jeux de données), privilégiez un PDF principal et référencez les ressources complémentaires dans les métadonnées.",
  },
  {
    category: "Métadonnées & IA",
    question: "Comment l'IA extrait-elle les métadonnées ?",
    answer:
      "À l'upload, le PDF est analysé pour détecter automatiquement le titre, les auteurs, le résumé, les mots-clés, l'année, la filière et le domaine scientifique. Vous gardez la main pour corriger chaque champ avant la soumission.",
    cta: { label: "Essayer le dépôt assisté", href: "/deposant/deposer" },
  },
  {
    category: "Métadonnées & IA",
    question: "Puis-je corriger les métadonnées proposées par l'IA ?",
    answer:
      "Oui. Une étape de révision vous permet d'éditer chaque champ. Les corrections que vous apportez améliorent la qualité documentaire et facilitent la recherche à facettes pour les autres utilisateurs.",
  },
  {
    category: "Métadonnées & IA",
    question: "L'indice de confiance de l'IA, qu'est-ce que c'est ?",
    answer:
      "C'est une estimation de la fiabilité de l'extraction automatique. Un indice élevé signifie que les champs proposés sont probablement exacts ; un indice plus faible vous invite à vérifier attentivement avant validation.",
  },
  {
    category: "Validation",
    question: "Combien de temps prend la validation institutionnelle ?",
    answer:
      "Le département vérifie les métadonnées sous quelques jours ouvrés en général. Vous êtes notifié à chaque changement de statut : En attente, Validé ou Rejeté.",
  },
  {
    category: "Validation",
    question: "Que se passe-t-il si mon dépôt est rejeté ?",
    answer:
      "Un motif de rejet vous est communiqué dans le détail du dossier. Vous pouvez corriger les éléments signalés puis resoumettre le document sans repartir de zéro.",
    cta: { label: "Voir mes dossiers", href: "/deposant/mes-dossiers" },
  },
  {
    category: "Preuves & sécurité",
    question: "Qu'est-ce qu'une preuve d'authenticité ?",
    answer:
      "Chaque document validé reçoit une empreinte cryptographique SHA-256 et une attestation vérifiable (Verifiable Credential). Cette preuve garantit l'intégrité du fichier et l'origine du dépôt, et reste vérifiable de façon indépendante.",
    cta: { label: "Voir un exemple de preuve", href: "/deposant/preuve/1" },
  },
  {
    category: "Preuves & sécurité",
    question: "Comment vérifier l'authenticité d'un document ?",
    answer:
      "Depuis la page « Preuve » du dossier, comparez l'empreinte SHA-256, scannez le QR code ou consultez le registre. Toute modification du fichier change l'empreinte, ce qui rend la falsification immédiatement détectable.",
  },
  {
    category: "Compte & accès",
    question: "Dois-je créer un compte pour consulter les travaux ?",
    answer:
      "Non. La consultation et le téléchargement des travaux publiés sont en accès libre. Un compte est requis uniquement pour déposer des documents et suivre vos dossiers.",
  },
  {
    category: "Compte & accès",
    question: "Comment créer un compte déposant ?",
    answer:
      "Cliquez sur « Créer un compte », renseignez votre identité, votre rôle et votre faculté de rattachement, puis activez votre accès. Vous pourrez ensuite déposer et gérer vos travaux depuis votre tableau de bord.",
    cta: { label: "Créer un compte", href: "/signup" },
  },
];

const popularSearches = ["déposer", "métadonnées", "preuve", "validation", "compte"];

export default function FaqPage() {
  const [category, setCategory] = React.useState<FaqCategory | "Toutes">(
    "Toutes",
  );
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState<Set<string>>(new Set());

  const toggle = (question: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(question)) next.delete(question);
      else next.add(question);
      return next;
    });

  const normalizedQuery = query.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const filtered = faqs.filter((faq) => {
    if (isSearching) {
      return (
        faq.question.toLowerCase().includes(normalizedQuery) ||
        faq.answer.toLowerCase().includes(normalizedQuery)
      );
    }
    return category === "Toutes" || faq.category === category;
  });

  const navItems = [
    { value: "Toutes" as const, label: "Toutes les questions", icon: Layers },
    ...categories.map((cat) => ({
      value: cat,
      label: cat,
      icon: categoryMeta[cat].icon,
    })),
  ];

  const countFor = (value: FaqCategory | "Toutes") =>
    value === "Toutes"
      ? faqs.length
      : faqs.filter((faq) => faq.category === value).length;

  const ActiveIcon = category === "Toutes" ? Layers : categoryMeta[category].icon;
  const activeDescription =
    category === "Toutes"
      ? "Parcourez l'ensemble des questions fréquentes de la plateforme."
      : categoryMeta[category].description;

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-brand text-brand-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(48% 80% at 50% -10%, rgba(6,182,212,0.30) 0%, rgba(11,19,43,0) 60%), radial-gradient(40% 70% at 88% 0%, rgba(29,78,216,0.30) 0%, rgba(11,19,43,0) 62%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.6]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 75%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <HelpCircle className="size-3.5 text-[#67e8f9]" />
            Centre d&apos;aide
          </span>

          <h1 className="mt-5 font-heading text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Comment pouvons-nous vous aider&nbsp;?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
            Réponses claires sur le dépôt, l&apos;extraction des métadonnées par
            IA, la validation institutionnelle et les preuves d&apos;authenticité.
          </p>

          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher une question…"
              aria-label="Rechercher dans la FAQ"
              className="h-12 w-full rounded-full border border-white/10 bg-white pl-12 pr-4 text-sm text-foreground shadow-xl outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ai/50"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-white/70">
            <span>Populaire&nbsp;:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 capitalize transition-colors hover:border-white/40 hover:text-white"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Body */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[264px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-2 hidden px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground lg:block">
              Catégories
            </p>
            <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
              {navItems.map((item) => {
                const isActive = !isSearching && category === item.value;
                const Icon = item.icon;
                const accent =
                  item.value === "Toutes"
                    ? "bg-secondary text-primary"
                    : categoryMeta[item.value].accent;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setCategory(item.value);
                      setQuery("");
                    }}
                    className={cn(
                      "group flex shrink-0 items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors lg:w-full lg:shrink",
                      isActive
                        ? "border-primary/30 bg-secondary text-secondary-foreground"
                        : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        accent,
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="flex-1 whitespace-nowrap font-medium lg:whitespace-normal">
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                        isActive
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {countFor(item.value)}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 hidden rounded-xl border border-border bg-card p-4 lg:block">
              <span className="flex size-9 items-center justify-center rounded-lg bg-ai/10 text-ai">
                <MessageCircleQuestion className="size-5" />
              </span>
              <p className="mt-3 text-sm font-semibold text-foreground">
                Besoin d&apos;aide&nbsp;?
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                L&apos;assistant IA répond à vos questions en bas à droite de
                l&apos;écran.
              </p>
            </div>
          </aside>

          {/* Content */}
          <div>
            {/* Active header */}
            <div className="flex items-start gap-3 border-b border-border pb-5">
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl",
                  isSearching
                    ? "bg-primary/10 text-primary"
                    : category === "Toutes"
                      ? "bg-secondary text-primary"
                      : categoryMeta[category].accent,
                )}
              >
                {isSearching ? (
                  <Search className="size-5" />
                ) : (
                  <ActiveIcon className="size-5" />
                )}
              </span>
              <div className="min-w-0">
                <h2 className="font-heading text-xl font-semibold tracking-tight text-brand">
                  {isSearching
                    ? "Résultats de recherche"
                    : category === "Toutes"
                      ? "Toutes les questions"
                      : category}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isSearching ? (
                    <>
                      {filtered.length}{" "}
                      {filtered.length > 1 ? "réponses" : "réponse"} pour «&nbsp;
                      {query.trim()}&nbsp;»
                    </>
                  ) : (
                    activeDescription
                  )}
                </p>
              </div>
            </div>

            {/* Accordion */}
            <div className="mt-5 space-y-3">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
                  <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Search className="size-5" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    Aucune question ne correspond à «&nbsp;{query.trim()}&nbsp;»
                  </p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Essayez d&apos;autres mots-clés, ou posez directement votre
                    question à l&apos;assistant IA en bas à droite.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery("")}
                    className="mt-1"
                  >
                    Réinitialiser la recherche
                  </Button>
                </div>
              ) : (
                filtered.map((faq) => {
                  const isOpen = open.has(faq.question);
                  const Icon = categoryMeta[faq.category].icon;
                  return (
                    <div
                      key={faq.question}
                      className={cn(
                        "overflow-hidden rounded-2xl border bg-card transition-all",
                        isOpen
                          ? "border-primary/40 shadow-sm"
                          : "border-border hover:border-primary/30",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggle(faq.question)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
                      >
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-lg",
                            categoryMeta[faq.category].accent,
                          )}
                        >
                          <Icon className="size-4" />
                        </span>
                        <span className="flex-1 font-heading text-[15px] font-semibold leading-snug text-foreground">
                          {faq.question}
                        </span>
                        <span
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                            isOpen
                              ? "rotate-180 border-primary/40 bg-primary/10 text-primary"
                              : "border-border text-muted-foreground",
                          )}
                        >
                          <ChevronDown className="size-4" />
                        </span>
                      </button>
                      <div
                        className={cn(
                          "grid transition-all duration-300 ease-out",
                          isOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <div className="overflow-hidden">
                          <div className="px-4 pb-5 sm:px-5 sm:pl-[4.25rem]">
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {faq.answer}
                            </p>
                            {faq.cta && (
                              <Link
                                href={faq.cta.href}
                                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                              >
                                {faq.cta.label}
                                <ArrowRight className="size-3.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Still need help */}
            <div className="relative mt-8 overflow-hidden rounded-2xl bg-brand p-6 text-brand-foreground sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60% 120% at 90% 0%, rgba(6,182,212,0.30) 0%, rgba(11,19,43,0) 60%)",
                }}
              />
              <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                    <MessageCircleQuestion className="size-6" />
                  </span>
                  <div>
                    <h2 className="font-heading text-lg font-semibold">
                      Vous ne trouvez pas votre réponse&nbsp;?
                    </h2>
                    <p className="mt-1 max-w-md text-sm text-white/75">
                      Posez votre question à l&apos;assistant IA, ou contactez
                      l&apos;équipe support de votre institution.
                    </p>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Button variant="secondary" asChild>
                    <Link href="mailto:contact@openscience-hub.cm">
                      <Mail className="size-4" />
                      Contacter le support
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="border border-white/30 bg-white/10 text-white hover:bg-white/20"
                  >
                    <Link href="/explorer">
                      <Search className="size-4" />
                      Explorer le répertoire
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

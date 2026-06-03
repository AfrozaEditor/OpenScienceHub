import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  HelpCircle,
  House,
  Search,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const quickLinks = [
  {
    icon: Search,
    title: "Explorer les travaux",
    description: "Parcourez tout le répertoire scientifique.",
    href: "/explorer",
  },
  {
    icon: Upload,
    title: "Déposer un document",
    description: "Soumettez un mémoire, une thèse ou un article.",
    href: "/deposant/deposer",
  },
  {
    icon: HelpCircle,
    title: "Foire aux questions",
    description: "Trouvez de l'aide sur le dépôt et les preuves.",
    href: "/faq",
  },
];

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-20 sm:px-6">
        {/* Institutional backdrop */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(11,19,43,0.045) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              maskImage:
                "radial-gradient(ellipse 70% 70% at 50% 45%, black, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 70% at 50% 45%, black, transparent 78%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(40% 34% at 50% 0%, rgba(6,182,212,0.12) 0%, rgba(248,250,252,0) 72%), radial-gradient(42% 38% at 14% 8%, rgba(29,78,216,0.10) 0%, rgba(248,250,252,0) 72%)",
            }}
          />
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
            <Image
              src="/logo-emblem.png"
              alt=""
              aria-hidden="true"
              width={720}
              height={720}
              className="w-[min(82vw,620px)] max-w-none select-none opacity-[0.05]"
              style={{
                maskImage:
                  "radial-gradient(circle at 50% 46%, black 58%, transparent 86%)",
                WebkitMaskImage:
                  "radial-gradient(circle at 50% 46%, black 58%, transparent 86%)",
              }}
            />
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-xl flex-col items-center text-center">
          <Badge variant="secondary">
            <Compass className="size-3" />
            Erreur 404
          </Badge>

          <p className="mt-6 font-heading text-[5.5rem] font-semibold leading-none tracking-tight text-brand sm:text-[8rem]">
            4
            <span className="text-primary">0</span>
            4
          </p>

          <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
            Cette page est introuvable
          </h1>
          <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
            Le lien est peut-être obsolète ou le document a été déplacé. Pas
            d&apos;inquiétude : la science ouverte reste à portée de recherche.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="px-5">
              <Link href="/">
                <House className="size-4" />
                Retour à l&apos;accueil
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="px-5">
              <Link href="/explorer">
                <Search className="size-4" />
                Explorer les travaux
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid w-full gap-3 sm:grid-cols-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-col gap-2 rounded-xl border border-border bg-card/70 p-4 text-left backdrop-blur transition-all hover:border-primary/40 hover:shadow-md"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <link.icon className="size-4" />
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                  {link.title}
                  <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </span>
                <span className="text-xs text-muted-foreground">
                  {link.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

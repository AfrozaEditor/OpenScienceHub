import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, ShieldCheck } from "lucide-react";

const columns = [
  {
    title: "Plateforme",
    links: ["Explorer les travaux", "Déposer un document", "Communautés", "Statistiques"],
  },
  {
    title: "Ressources",
    links: ["Guide de dépôt", "Métadonnées & IA", "Politique d'accès", "API & exports"],
  },
  {
    title: "Institution",
    links: ["À propos", "Science ouverte", "Gouvernance", "Contact"],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <Image
                src="/logo-emblem.png"
                alt="OpenScience Hub"
                width={40}
                height={40}
                className="size-10 object-contain"
              />
              <span className="flex flex-col leading-none">
                <span className="font-heading text-[15px] font-semibold tracking-tight text-brand">
                  OpenScience Hub
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Répertoire Institutionnel Intelligent
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Centralisez, valorisez et retrouvez toute la production
              scientifique universitaire grâce à une recherche intelligente et
              une extraction automatique des métadonnées par IA.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                Institutions partenaires configurées dans OpenScience Hub
              </span>
              <span className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                contact@openscience-hub.cm
              </span>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <span>© 2026 OpenScience Hub — Science ouverte universitaire.</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-success" />
            Archivage institutionnel certifié
          </span>
        </div>
      </div>
    </footer>
  );
}

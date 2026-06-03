import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Database, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const highlights = [
  { icon: Sparkles, text: "Extraction automatique des métadonnées par IA" },
  { icon: Database, text: "Archivage institutionnel pérenne et structuré" },
  { icon: BadgeCheck, text: "Validation académique et science ouverte" },
];

export default function LoginPage() {
  return (
    <div className="grid min-h-screen flex-1 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand p-12 text-brand-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 100% 0%, rgba(6,182,212,0.30) 0%, rgba(11,19,43,0) 60%)",
          }}
        />
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white p-1 shadow-sm">
            <Image
              src="/logo-emblem.png"
              alt="OpenScience Hub"
              width={36}
              height={36}
              className="size-full object-contain"
            />
          </span>
          <span className="font-heading text-lg font-semibold">
            OpenScience Hub
          </span>
        </Link>

        <div className="relative">
          <h1 className="max-w-md font-heading text-3xl font-semibold leading-tight">
            Le répertoire institutionnel intelligent de la science ouverte
            universitaire.
          </h1>
          <ul className="mt-8 flex flex-col gap-4">
            {highlights.map((h) => (
              <li key={h.text} className="flex items-center gap-3 text-white/85">
                <span className="flex size-9 items-center justify-center rounded-lg bg-white/10">
                  <h.icon className="size-4.5" />
                </span>
                <span className="text-sm">{h.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/60">
          © 2026 OpenScience Hub — Université de Yaoundé I
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 lg:hidden"
          >
            <Image
              src="/logo-emblem.png"
              alt="OpenScience Hub"
              width={36}
              height={36}
              className="size-9 object-contain"
            />
            <span className="font-heading text-base font-semibold text-brand">
              OpenScience Hub
            </span>
          </Link>

          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Connexion
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Accédez à votre espace de dépôt et de gestion documentaire.
          </p>

          <form className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Adresse e-mail institutionnelle</Label>
              <Input
                id="email"
                type="email"
                placeholder="prenom.nom@univ-yaounde1.cm"
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link href="#" className="text-xs font-medium text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <Button size="lg" className="mt-1 w-full" asChild>
              <Link href="/dashboard">
                Se connecter
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">ou</span>
            <Separator className="flex-1" />
          </div>

          <Button variant="outline" size="lg" className="w-full" asChild>
            <Link href="/explorer">Continuer en tant qu&apos;invité</Link>
          </Button>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

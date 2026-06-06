"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Database,
  Eye,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { messageForApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/api/hooks";
import { listInstitutions } from "@/lib/api/resources";
import type { Institution, Paginated } from "@/lib/api/types";

const highlights = [
  { icon: Sparkles, text: "Extraction automatique des métadonnées par IA" },
  { icon: Database, text: "Archivage institutionnel pérenne et structuré" },
  { icon: BadgeCheck, text: "Validation académique et science ouverte" },
];

const roles = [
  "Étudiant(e)",
  "Enseignant(e)-chercheur(se)",
  "Personnel administratif",
  "Bibliothécaire / Documentaliste",
];

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  role: roles[0],
  institution: "",
  password: "",
  confirm: "",
  terms: false,
};

type FormState = typeof emptyForm;
type FieldErrors = Partial<Record<keyof FormState, string>>;

function passwordStrength(pwd: string) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const levels = [
    { label: "Très faible", bar: "bg-destructive", text: "text-destructive" },
    { label: "Faible", bar: "bg-destructive", text: "text-destructive" },
    { label: "Moyen", bar: "bg-warning", text: "text-[#b45309]" },
    { label: "Bon", bar: "bg-ai", text: "text-[var(--ai)]" },
    { label: "Excellent", bar: "bg-success", text: "text-[var(--success)]" },
  ];

  return { score, ...levels[score] };
}

function listFrom<T>(data: Paginated<T> | T[] | null) {
  if (!data) return [];
  return Array.isArray(data) ? data : data.results;
}

export default function SignupPage() {
  const { register } = useAuth();
  const institutions = useApiResource(() => listInstitutions(), [], null);
  const [form, setForm] = React.useState<FormState>(emptyForm);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const institutionOptions = React.useMemo(
    () => listFrom<Institution>(institutions.data).filter((item) => item.status !== "DISABLED"),
    [institutions.data],
  );
  const strength = passwordStrength(form.password);
  const passwordsMatch =
    form.confirm.length > 0 && form.confirm === form.password;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }

  function validate(values: FormState): FieldErrors {
    const next: FieldErrors = {};
    if (!values.firstName.trim()) next.firstName = "Prénom requis.";
    if (!values.lastName.trim()) next.lastName = "Nom requis.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = "Adresse e-mail invalide.";
    if (!values.institution) next.institution = "Sélectionnez votre université.";
    if (values.password.length < 8)
      next.password = "Le mot de passe doit contenir au moins 8 caractères.";
    if (values.confirm !== values.password)
      next.confirm = "Les mots de passe ne correspondent pas.";
    if (!values.terms)
      next.terms = "Vous devez accepter les conditions pour continuer.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setApiError(null);
    if (Object.keys(found).length === 0) {
      setSubmitting(true);
      try {
        await register({
          email: form.email,
          full_name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
          password: form.password,
          institution: form.institution,
          preferred_language: "fr",
        });
        setSubmitted(true);
      } catch (err) {
        setApiError(messageForApiError(err));
      } finally {
        setSubmitting(false);
      }
    }
  }

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
            Rejoignez le répertoire intelligent de la science ouverte
            universitaire.
          </h1>
          <p className="mt-4 max-w-md text-sm text-white/70">
            Créez votre compte pour déposer, valoriser et diffuser vos travaux
            de recherche en accès libre.
          </p>
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

          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="text-sm text-white/70">
              Les universités disponibles sont chargées depuis l'API institutionnelle.
            </p>
          </div>
        </div>

        <p className="relative text-sm text-white/60">
          © 2026 OpenScience Hub
        </p>
      </div>

      {/* Form / success */}
      <div className="flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
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

          {submitted ? (
            <div className="flex flex-col items-center gap-5 py-6 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-success/12 text-success">
                <CheckCircle2 className="size-9" />
              </span>
              <div>
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                  Compte créé avec succès
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  Bienvenue{" "}
                  <span className="font-medium text-foreground">
                    {form.firstName}
                  </span>
                  . Un e-mail de confirmation a été envoyé à{" "}
                  <span className="font-medium text-foreground">
                    {form.email}
                  </span>
                  . Votre accès sera activé après validation institutionnelle.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant="success">
                  <Check className="size-3" />
                  Compte enregistré
                </Badge>
                <Badge variant="warning">En attente de validation</Badge>
              </div>
              <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
                <Button size="lg" asChild>
                  <Link href="/login">
                    Se connecter
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/explorer">Explorer le répertoire</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Badge variant="secondary" className="mb-3">
                <GraduationCap className="size-3.5" />
                Accès institutionnel
              </Badge>
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                Créer un compte
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Rejoignez OpenScience Hub pour déposer et gérer vos travaux
                scientifiques.
              </p>

              <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Prénom" htmlFor="firstName" error={errors.firstName}>
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) => update("firstName", e.target.value)}
                      placeholder="Arnaud"
                      autoComplete="given-name"
                      aria-invalid={!!errors.firstName}
                    />
                  </Field>
                  <Field label="Nom" htmlFor="lastName" error={errors.lastName}>
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) => update("lastName", e.target.value)}
                      placeholder="Nguelé Fotso"
                      autoComplete="family-name"
                      aria-invalid={!!errors.lastName}
                    />
                  </Field>
                </div>

                <Field
                  label="Adresse e-mail institutionnelle"
                  htmlFor="email"
                  error={errors.email}
                >
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="prenom.nom@univ-yaounde1.cm"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Statut" htmlFor="role">
                    <Select
                      id="role"
                      value={form.role}
                      onChange={(e) => update("role", e.target.value)}
                    >
                      {roles.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Université" htmlFor="institution" error={errors.institution}>
                    <Select
                      id="institution"
                      value={form.institution}
                      onChange={(e) => update("institution", e.target.value)}
                      aria-invalid={!!errors.institution}
                      disabled={institutions.loading || institutionOptions.length === 0}
                    >
                      <option value="" disabled>
                        {institutions.loading
                          ? "Chargement des universités..."
                          : "Sélectionnez votre université"}
                      </option>
                      {institutionOptions.map((institution) => (
                        <option key={institution.id} value={institution.id}>
                          {institution.short_name
                            ? `${institution.name} (${institution.short_name})`
                            : institution.name}
                        </option>
                      ))}
                    </Select>
                    {institutions.error && (
                      <p className="text-xs text-destructive">{institutions.error}</p>
                    )}
                  </Field>
                </div>

                <Field
                  label="Mot de passe"
                  htmlFor="password"
                  error={errors.password}
                >
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="pr-10"
                      aria-invalid={!!errors.password}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-pressed={showPassword}
                      title={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                      className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground aria-pressed:text-primary"
                    >
                      <Eye className="size-4" />
                    </button>
                  </div>
                  {form.password.length > 0 && (
                    <div className="mt-1.5">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <span
                            key={i}
                            className={cn(
                              "h-1 flex-1 rounded-full transition-colors",
                              i < strength.score ? strength.bar : "bg-border"
                            )}
                          />
                        ))}
                      </div>
                      <p className={cn("mt-1 text-xs", strength.text)}>
                        Sécurité&nbsp;: {strength.label}
                      </p>
                    </div>
                  )}
                </Field>

                <Field
                  label="Confirmer le mot de passe"
                  htmlFor="confirm"
                  error={errors.confirm}
                >
                  <div className="relative">
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      value={form.confirm}
                      onChange={(e) => update("confirm", e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="pr-10"
                      aria-invalid={!!errors.confirm}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-pressed={showConfirm}
                      title={
                        showConfirm
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                      className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground aria-pressed:text-primary"
                    >
                      <Eye className="size-4" />
                    </button>
                  </div>
                  {passwordsMatch && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-[var(--success)]">
                      <Check className="size-3" />
                      Les mots de passe correspondent
                    </p>
                  )}
                </Field>

                <div className="mt-1">
                  <label className="flex cursor-pointer items-start gap-2.5 select-none">
                    <input
                      type="checkbox"
                      checked={form.terms}
                      onChange={(e) => update("terms", e.target.checked)}
                      className="mt-0.5 size-4 shrink-0 rounded border-input accent-primary"
                      aria-invalid={!!errors.terms}
                    />
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      J&apos;accepte les{" "}
                      <Link href="#" className="font-medium text-primary hover:underline">
                        conditions d&apos;utilisation
                      </Link>{" "}
                      et la{" "}
                      <Link href="#" className="font-medium text-primary hover:underline">
                        charte de science ouverte
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="mt-1 text-xs text-destructive">{errors.terms}</p>
                  )}
                </div>

                {apiError && (
                  <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {apiError}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="mt-1 w-full"
                  disabled={submitting || institutions.loading || institutionOptions.length === 0}
                >
                  {submitting ? (
                    "Création du compte..."
                  ) : (
                    <>
                      Créer mon compte
                      <ArrowRight className="size-4" />
                    </>
                  )}
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
                Vous avez déjà un compte ?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Se connecter
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

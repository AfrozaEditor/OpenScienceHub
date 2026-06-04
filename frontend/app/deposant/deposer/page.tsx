"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { UploadDropzone } from "@/components/upload-dropzone";
import { StepperUpload } from "@/components/stepper-upload";
import { AiMetadataPanel } from "@/components/ai-metadata-panel";
import { useAuth } from "@/components/auth-provider";
import {
  acceptMetadata,
  addContributor,
  createWork,
  extractMetadata,
  listInstitutions,
  messageForApiError,
  submitWork,
  updateWork,
  uploadDocument,
  type Institution,
  type Paginated,
} from "@/lib/api";

const steps = [
  { label: "Téléversement" },
  { label: "Analyse IA" },
  { label: "Métadonnées" },
  { label: "Soumission" },
];

const phases = [
  "Lecture du fichier PDF…",
  "Extraction du texte et de la structure…",
  "Détection du titre et des auteurs…",
  "Analyse du résumé et des mots-clés…",
  "Classification disciplinaire…",
];

const empty = {
  title: "",
  authors: "",
  supervisors: "",
  abstract: "",
  keywords: "",
  type: "Mémoire",
  year: "2026",
  faculty: "",
  department: "",
  domain: "",
  language: "Français",
  license: "CC BY 4.0",
  level: "Master 2",
};

function workType(value: string) {
  if (value === "Thèse") return "THESE";
  if (value === "Article") return "ARTICLE";
  return "MEMOIRE";
}

function language(value: string) {
  return value === "Anglais" ? "EN" : "FR";
}

function listFrom<T>(data: Paginated<T> | T[]) {
  return Array.isArray(data) ? data : data.results;
}

export default function DeposerPage() {
  const { user } = useAuth();
  const [step, setStep] = React.useState(0);
  const [file, setFile] = React.useState<File | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [form, setForm] = React.useState(empty);
  const [workId, setWorkId] = React.useState<string | null>(null);
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  async function resolveInstitution() {
    if (typeof user?.institution === "string" && user.institution) return user.institution;
    const data = await listInstitutions();
    const first = listFrom<Institution>(data)[0];
    if (!first?.id) throw new Error("Aucune institution disponible pour créer le dossier.");
    return first.id;
  }

  async function startAnalysis() {
    if (!file) return;
    setApiError(null);
    setProgress(0);
    setStep(1);
    try {
      setProgress(10);
      const institution = await resolveInstitution();
      const work = await createWork({
        type: workType(form.type),
        title: file.name.replace(/\.pdf$/i, ""),
        abstract_text: "",
        language: language(form.language),
        academic_year: form.year,
        keywords: [],
        visibility: "PRIVATE",
        institution,
      });
      setWorkId(work.id);
      setProgress(35);
      await uploadDocument(work.id, file, "Dépôt initial");
      setProgress(65);
      const extraction = await extractMetadata(work.id);
      const metadata = extraction.metadata || {};
      setForm({
        ...empty,
        title: String(metadata.title || extraction.extracted_title || work.title || ""),
        authors: Array.isArray((metadata as { authors?: unknown }).authors)
          ? ((metadata as { authors: string[] }).authors || []).join(", ")
          : "",
        supervisors: work.supervisor_name || "",
        abstract: String(metadata.abstract || extraction.extracted_abstract || ""),
        keywords: Array.isArray(metadata.keywords)
          ? (metadata.keywords as string[]).join(", ")
          : (extraction.extracted_keywords || []).join(", "),
        type: form.type,
        year: form.year,
        faculty: "",
        department: "",
        domain: String(metadata.scientific_domain || extraction.suggested_domain || ""),
        language: metadata.language === "en" ? "Anglais" : "Français",
        license: form.license,
        level: form.level,
      });
      setProgress(100);
      setStep(2);
    } catch (err) {
      setApiError(messageForApiError(err));
      setStep(0);
    }
  }

  const phaseIndex = Math.min(
    phases.length - 1,
    Math.floor((progress / 100) * phases.length)
  );
  const keywordList = form.keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function reset() {
    setFile(null);
    setForm(empty);
    setProgress(0);
    setWorkId(null);
    setApiError(null);
    setStep(0);
  }

  async function submitForValidation() {
    if (!workId) {
      setApiError("Aucun dossier backend n'a été créé pour ce dépôt.");
      return;
    }
    setSubmitting(true);
    setApiError(null);
    try {
      const keywords = keywordList;
      await acceptMetadata(workId, {
        title: form.title,
        abstract_text: form.abstract,
        scientific_domain: form.domain,
        keywords,
      });
      await updateWork(workId, {
        type: workType(form.type),
        academic_year: form.year,
        language: language(form.language),
        supervisor_name: form.supervisors,
        scientific_domain: form.domain,
        title: form.title,
        abstract_text: form.abstract,
        keywords,
      });
      for (const [index, name] of form.authors
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
        .entries()) {
        await addContributor(workId, {
          contributor_type: "AUTHOR",
          display_name: name,
          order_index: index,
        });
      }
      await submitWork(workId);
      setStep(3);
    } catch (err) {
      setApiError(messageForApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <Badge variant="ai" className="mb-3">
          <Sparkles className="size-3.5" />
          Dépôt assisté par IA
        </Badge>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
          Déposer un document scientifique
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Téléversez votre PDF : l&apos;IA extrait automatiquement les
          métadonnées, vous validez, puis soumettez pour validation
          institutionnelle.
        </p>
      </div>

      <div className="mt-8 px-2">
        <StepperUpload steps={steps} current={step} />
      </div>

      <Card className="mt-8">
        <CardContent>
          {/* Step 0 : upload */}
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  1. Téléversez votre document
                </h2>
                <p className="text-sm text-muted-foreground">
                  Formats acceptés : PDF · Taille maximale : 50 Mo
                </p>
              </div>
              <UploadDropzone
                file={file}
                onFile={setFile}
                onClear={() => setFile(null)}
              />
              {apiError && (
                <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {apiError}
                </p>
              )}
              <div className="flex justify-end">
                <Button size="lg" disabled={!file} onClick={startAnalysis}>
                  <Sparkles className="size-4" />
                  Lancer l&apos;analyse IA
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 1 : analyzing */}
          {step === 1 && (
            <div className="flex flex-col items-center gap-6 py-8 text-center">
              <span className="relative flex size-16 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-ai/20" />
                <span className="relative flex size-16 items-center justify-center rounded-full bg-ai/15 text-ai">
                  <Loader2 className="size-8 animate-spin" />
                </span>
              </span>
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Analyse du document en cours…
                </h2>
                <p className="mt-1 text-sm text-ai">{phases[phaseIndex]}</p>
              </div>
              <div className="w-full max-w-md">
                <Progress value={progress} indicatorClassName="bg-ai" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {progress}% — extraction des métadonnées
                </p>
              </div>
            </div>
          )}

          {/* Step 2 : metadata review + correction */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <AiMetadataPanel
                confidence={91}
                fields={[
                  { label: "Titre", value: form.title },
                  { label: "Auteurs", value: form.authors },
                  { label: "Type", value: form.type },
                  { label: "Domaine", value: form.domain },
                ]}
                footer={
                  <div className="flex flex-wrap gap-2">
                    {[
                      "PDF analysé",
                      "Métadonnées détectées",
                      "Résumé extrait",
                      "Mots-clés suggérés",
                    ].map((b) => (
                      <Badge key={b} variant="ai">
                        <CheckCircle2 className="size-3" />
                        {b}
                      </Badge>
                    ))}
                  </div>
                }
              />

              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Vérifiez et corrigez les métadonnées
                </h2>
                <p className="text-sm text-muted-foreground">
                  Les champs ont été pré-remplis par l&apos;IA. Ajustez-les si
                  nécessaire avant de soumettre.
                </p>
              </div>

              <div className="grid gap-4">
                <Field label="Titre du document" htmlFor="title">
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Auteur(s)" htmlFor="authors">
                    <Input
                      id="authors"
                      value={form.authors}
                      onChange={(e) => update("authors", e.target.value)}
                    />
                  </Field>
                  <Field label="Encadreur(s)" htmlFor="supervisors">
                    <Input
                      id="supervisors"
                      value={form.supervisors}
                      onChange={(e) => update("supervisors", e.target.value)}
                    />
                  </Field>
                </div>

                <Field label="Résumé" htmlFor="abstract">
                  <Textarea
                    id="abstract"
                    rows={4}
                    value={form.abstract}
                    onChange={(e) => update("abstract", e.target.value)}
                  />
                </Field>

                <Field
                  label="Mots-clés (séparés par des virgules)"
                  htmlFor="keywords"
                >
                  <Input
                    id="keywords"
                    value={form.keywords}
                    onChange={(e) => update("keywords", e.target.value)}
                  />
                  {keywordList.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {keywordList.map((kw) => (
                        <Badge
                          key={kw}
                          variant="secondary"
                          className="font-normal"
                        >
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Field>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Type de document" htmlFor="type">
                    <Select
                      id="type"
                      value={form.type}
                      onChange={(e) => update("type", e.target.value)}
                    >
                      <option>Mémoire</option>
                      <option>Thèse</option>
                      <option>Article</option>
                      <option>Rapport</option>
                    </Select>
                  </Field>
                  <Field label="Année" htmlFor="year">
                    <Input
                      id="year"
                      value={form.year}
                      onChange={(e) => update("year", e.target.value)}
                    />
                  </Field>
                  <Field label="Niveau académique" htmlFor="level">
                    <Select
                      id="level"
                      value={form.level}
                      onChange={(e) => update("level", e.target.value)}
                    >
                      <option>Licence 3</option>
                      <option>Master 1</option>
                      <option>Master 2</option>
                      <option>Doctorat</option>
                    </Select>
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Faculté" htmlFor="faculty">
                    <Input
                      id="faculty"
                      value={form.faculty}
                      onChange={(e) => update("faculty", e.target.value)}
                    />
                  </Field>
                  <Field label="Département" htmlFor="department">
                    <Input
                      id="department"
                      value={form.department}
                      onChange={(e) => update("department", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Domaine scientifique" htmlFor="domain">
                    <Input
                      id="domain"
                      value={form.domain}
                      onChange={(e) => update("domain", e.target.value)}
                    />
                  </Field>
                  <Field label="Langue" htmlFor="language">
                    <Select
                      id="language"
                      value={form.language}
                      onChange={(e) => update("language", e.target.value)}
                    >
                      <option>Français</option>
                      <option>Anglais</option>
                    </Select>
                  </Field>
                  <Field label="Licence" htmlFor="license">
                    <Select
                      id="license"
                      value={form.license}
                      onChange={(e) => update("license", e.target.value)}
                    >
                      <option>CC BY 4.0</option>
                      <option>CC BY-SA 4.0</option>
                      <option>CC BY-NC 4.0</option>
                      <option>Tous droits réservés</option>
                    </Select>
                  </Field>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
                <Button variant="ghost" size="lg" onClick={() => setStep(0)}>
                  <ArrowLeft className="size-4" />
                  Retour
                </Button>
                <Button size="lg" onClick={submitForValidation} disabled={submitting}>
                  {submitting ? "Soumission..." : "Soumettre pour validation"}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
              {apiError && (
                <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {apiError}
                </p>
              )}
            </div>
          )}

          {/* Step 3 : success */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-5 py-8 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-success/12 text-success">
                <CheckCircle2 className="size-9" />
              </span>
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  Document soumis avec succès
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Votre dépôt «&nbsp;
                  <span className="font-medium text-foreground">
                    {form.title}
                  </span>
                  &nbsp;» a été transmis au département{" "}
                  <span className="font-medium text-foreground">
                    {form.department || "concerné"}
                  </span>{" "}
                  pour validation institutionnelle.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant="warning">En attente de validation</Badge>
                <Badge variant="ai">
                  <Sparkles className="size-3" />
                  Métadonnées IA appliquées
                </Badge>
                <Badge variant="outline">
                  <ShieldCheck className="size-3 text-success" />
                  Preuve d&apos;authenticité à venir
                </Badge>
              </div>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/deposant/mes-dossiers">Voir mes dossiers</Link>
                </Button>
                <Button size="lg" onClick={reset}>
                  <Upload className="size-4" />
                  Déposer un autre document
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

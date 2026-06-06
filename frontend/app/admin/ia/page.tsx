"use client";

import * as React from "react";
import {
  Activity,
  BadgeCheck,
  Bot,
  FileSearch,
  Gauge,
  Loader2,
  Save,
  ShieldCheck,
  Sparkles,
  TestTube2,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminToggle } from "@/components/admin/admin-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EXTRACTION_FIELD_LABELS,
  PORTAL_LABELS,
  SERVICE_LABELS,
  SIMILARITY_WEIGHT_LABELS,
  TRIGGER_LABELS,
  asBoolean,
  asNumber,
  asRecord,
  patchNested,
  toggleInList,
  type AiConfig,
} from "@/lib/ai-admin-config";
import { messageForApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/api/hooks";
import { getAdminAiSettings, updateAdminAiSettings } from "@/lib/api/resources";

const TABS = [
  { key: "overview", label: "Vue d'ensemble" },
  { key: "extraction", label: "Extraction" },
  { key: "summary", label: "Résumés" },
  { key: "assistant", label: "Assistant IA" },
  { key: "similarity", label: "Similarité" },
  { key: "indexing", label: "Indexation" },
  { key: "security", label: "Sécurité" },
  { key: "quotas", label: "Quotas" },
  { key: "tests", label: "Tests" },
  { key: "logs", label: "Logs" },
] as const;

function modelOptions(data: Record<string, unknown> | null, selected: string) {
  const rows = Array.isArray(data?.models) ? data.models : [];
  const names = rows
    .map((row) => String((row as Record<string, unknown>).model_name || ""))
    .filter(Boolean);
  return Array.from(new Set([selected, ...names].filter(Boolean)));
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {Icon && <Icon className="size-4 text-ai" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function StatTile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default function AdminAiPage() {
  const live = useApiResource(() => getAdminAiSettings(), [], null);
  const [tab, setTab] = React.useState<string>("overview");
  const [config, setConfig] = React.useState<AiConfig>({});
  const [principle, setPrinciple] = React.useState("");
  const [recentLogs, setRecentLogs] = React.useState<Array<Record<string, unknown>>>([]);
  const [monitoring, setMonitoring] = React.useState<Record<string, unknown>>({});
  const [saving, setSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!live.data) return;
    const data = live.data;
    setConfig(asRecord(data.config));
    setPrinciple(String(data.principle || ""));
    setMonitoring(asRecord(data.monitoring));
    setRecentLogs(Array.isArray(data.recent_logs) ? data.recent_logs : []);
  }, [live.data]);

  React.useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(timer);
  }, [feedback]);

  function patch(path: string[], value: unknown) {
    setConfig((prev) => patchNested(prev, path, value));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const response = await updateAdminAiSettings({ config });
      setConfig(asRecord(response.config));
      setMonitoring(asRecord(response.monitoring));
      setFeedback("Paramètres IA enregistrés.");
    } catch (err) {
      setError(messageForApiError(err));
    } finally {
      setSaving(false);
    }
  }

  const services = asRecord(config.services);
  const triggers = asRecord(config.triggers);
  const extraction = asRecord(config.extraction);
  const summary = asRecord(config.summary);
  const keywords = asRecord(config.keywords);
  const assistant = asRecord(config.assistant);
  const assistantPortals = asRecord(assistant.portals);
  const assistantSources = asRecord(assistant.sources);
  const similarity = asRecord(config.similarity);
  const similarityWeights = asRecord(similarity.weights);
  const validationAssistance = asRecord(config.validation_assistance);
  const indexing = asRecord(config.indexing);
  const security = asRecord(config.security);
  const quotas = asRecord(config.quotas);
  const enabledFields = Array.isArray(extraction.enabled_fields)
    ? extraction.enabled_fields.map(String)
    : [];
  const extractionModel = String(extraction.model || "");

  return (
    <>
      <AdminPageHeader
        title="Paramètres IA"
        description="Pilotage institutionnel de l'extraction, de l'Assistant IA, de l'indexation et des garde-fous."
      >
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Mode {String(live.data?.mode || "—")}
          </Badge>
          <Button onClick={handleSave} disabled={saving || live.loading}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Enregistrer
          </Button>
        </div>
      </AdminPageHeader>

      {principle && (
        <div className="mb-5 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          {principle}
        </div>
      )}

      {feedback && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-sm text-foreground">
          <BadgeCheck className="size-4 text-success" />
          {feedback}
        </div>
      )}

      {(error || live.error) && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error || live.error}
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-auto max-w-full flex-wrap justify-start p-1">
          {TABS.map((item) => (
            <TabsTrigger key={item.key} value={item.key} className="h-8">
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatTile
              label="Extractions IA"
              value={monitoring.extractions_total != null ? String(monitoring.extractions_total) : "—"}
            />
            <StatTile
              label="Taux de réussite"
              value={
                monitoring.extractions_success_rate != null
                  ? `${monitoring.extractions_success_rate} %`
                  : "—"
              }
            />
            <StatTile
              label="Requêtes Assistant"
              value={
                monitoring.assistant_queries != null ? String(monitoring.assistant_queries) : "—"
              }
            />
            <StatTile
              label="Réponses signalées"
              value={
                monitoring.assistant_flagged != null ? String(monitoring.assistant_flagged) : "—"
              }
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <SectionCard title="Services activés" icon={Sparkles}>
              <div className="space-y-3">
                {Object.entries(SERVICE_LABELS).map(([key, meta]) => (
                  <AdminToggle
                    key={key}
                    checked={asBoolean(services[key])}
                    onChange={(value) => patch(["services", key], value)}
                    label={meta.label}
                    description={meta.description}
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Activité récente" icon={Activity}>
              <div className="space-y-2 text-sm">
                <p>
                  Dernière extraction :{" "}
                  <span className="font-medium">
                    {String(monitoring.last_extraction_at || "—")}
                  </span>
                </p>
                <p>
                  Dernière requête Assistant :{" "}
                  <span className="font-medium">
                    {String(monitoring.last_assistant_query_at || "—")}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  Échecs d'extraction : {String(monitoring.extractions_failed ?? 0)}
                </p>
              </div>
              <Button variant="outline" className="mt-2" onClick={() => setTab("tests")}>
                <TestTube2 className="size-4" />
                Tester la configuration
              </Button>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="extraction">
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Extraction des métadonnées" icon={Sparkles}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ai-model">Modèle</Label>
                  <Select
                    id="ai-model"
                    value={extractionModel}
                    onChange={(e) => patch(["extraction", "model"], e.target.value)}
                  >
                    {modelOptions(live.data, extractionModel).map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ai-lang">Langue</Label>
                  <Select
                    id="ai-lang"
                    value={String(extraction.language || "fr")}
                    onChange={(e) => patch(["extraction", "language"], e.target.value)}
                  >
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                  </Select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm">
                  <Label htmlFor="ai-threshold">Seuil de confiance global</Label>
                  <span className="font-semibold">
                    {asNumber(extraction.confidence_threshold, 75)} %
                  </span>
                </div>
                <input
                  id="ai-threshold"
                  type="range"
                  min={50}
                  max={99}
                  value={asNumber(extraction.confidence_threshold, 75)}
                  onChange={(e) =>
                    patch(["extraction", "confidence_threshold"], Number(e.target.value))
                  }
                  className="mt-2 w-full accent-[var(--ai)]"
                />
              </div>

              <AdminToggle
                checked={asBoolean(extraction.show_confidence_score, true)}
                onChange={(value) => patch(["extraction", "show_confidence_score"], value)}
                label="Afficher le score de confiance"
              />
              <AdminToggle
                checked={asBoolean(extraction.require_human_if_low, true)}
                onChange={(value) => patch(["extraction", "require_human_if_low"], value)}
                label="Validation humaine si score faible"
              />
              <AdminToggle
                checked={asBoolean(extraction.block_submission_if_critical_missing, true)}
                onChange={(value) =>
                  patch(["extraction", "block_submission_if_critical_missing"], value)
                }
                label="Bloquer la soumission si champs critiques manquants"
              />
            </SectionCard>

            <SectionCard title="Déclencheurs IA">
              <div className="space-y-3">
                {Object.entries(TRIGGER_LABELS).map(([key, label]) => (
                  <AdminToggle
                    key={key}
                    checked={asBoolean(triggers[key])}
                    onChange={(value) => patch(["triggers", key], value)}
                    label={label}
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Champs extraits" icon={FileSearch} >
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(EXTRACTION_FIELD_LABELS).map(([key, label]) => (
                  <AdminToggle
                    key={key}
                    checked={enabledFields.includes(key)}
                    onChange={(value) =>
                      patch(
                        ["extraction", "enabled_fields"],
                        toggleInList(extraction.enabled_fields, key, value),
                      )
                    }
                    label={label}
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Aide à la validation">
              <AdminToggle
                checked={asBoolean(validationAssistance.enabled, true)}
                onChange={(value) => patch(["validation_assistance", "enabled"], value)}
                label="Activer l'aide IA à la validation"
              />
              <AdminToggle
                checked={asBoolean(validationAssistance.reading_sheet, true)}
                onChange={(value) => patch(["validation_assistance", "reading_sheet"], value)}
                label="Fiche de lecture automatique"
              />
              <AdminToggle
                checked={asBoolean(validationAssistance.missing_elements_detection, true)}
                onChange={(value) =>
                  patch(["validation_assistance", "missing_elements_detection"], value)
                }
                label="Détection des éléments manquants"
              />
              <AdminToggle
                checked={asBoolean(validationAssistance.similar_works_comparison, true)}
                onChange={(value) =>
                  patch(["validation_assistance", "similar_works_comparison"], value)
                }
                label="Comparaison avec travaux similaires"
              />
              <p className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                L'IA est une aide à la lecture. Elle ne peut ni valider, ni rejeter, ni autoriser
                une soutenance, ni archiver un dossier.
              </p>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="summary">
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Résumés & fiches de lecture">
              <AdminToggle
                checked={asBoolean(summary.short_enabled, true)}
                onChange={(value) => patch(["summary", "short_enabled"], value)}
                label="Résumé court (5 à 8 lignes)"
              />
              <AdminToggle
                checked={asBoolean(summary.detailed_enabled)}
                onChange={(value) => patch(["summary", "detailed_enabled"], value)}
                label="Résumé détaillé (300 à 500 mots)"
              />
              <AdminToggle
                checked={asBoolean(summary.reading_sheet_enabled, true)}
                onChange={(value) => patch(["summary", "reading_sheet_enabled"], value)}
                label="Fiche de lecture"
              />
              <div className="space-y-1.5">
                <Label htmlFor="summary-max">Longueur maximale (mots)</Label>
                <Input
                  id="summary-max"
                  type="number"
                  min={100}
                  max={2000}
                  value={asNumber(summary.max_words, 500)}
                  onChange={(e) => patch(["summary", "max_words"], Number(e.target.value))}
                />
              </div>
              <AdminToggle
                checked={asBoolean(summary.public_allowed)}
                onChange={(value) => patch(["summary", "public_allowed"], value)}
                label="Autoriser le résumé public"
              />
              <AdminToggle
                checked={asBoolean(summary.require_human_validation, true)}
                onChange={(value) => patch(["summary", "require_human_validation"], value)}
                label="Forcer la validation humaine avant publication"
              />
              <AdminToggle
                checked={asBoolean(summary.show_ai_label, true)}
                onChange={(value) => patch(["summary", "show_ai_label"], value)}
                label="Afficher « Résumé généré par IA »"
              />
            </SectionCard>

            <SectionCard title="Mots-clés & classification">
              <AdminToggle
                checked={asBoolean(keywords.suggest_enabled, true)}
                onChange={(value) => patch(["keywords", "suggest_enabled"], value)}
                label="Suggestion de mots-clés"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="kw-min">Minimum</Label>
                  <Input
                    id="kw-min"
                    type="number"
                    min={1}
                    max={20}
                    value={asNumber(keywords.min_count, 3)}
                    onChange={(e) => patch(["keywords", "min_count"], Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="kw-max">Maximum</Label>
                  <Input
                    id="kw-max"
                    type="number"
                    min={1}
                    max={30}
                    value={asNumber(keywords.max_count, 8)}
                    onChange={(e) => patch(["keywords", "max_count"], Number(e.target.value))}
                  />
                </div>
              </div>
              <AdminToggle
                checked={asBoolean(keywords.classify_domain, true)}
                onChange={(value) => patch(["keywords", "classify_domain"], value)}
                label="Classification par domaine scientifique"
              />
              <AdminToggle
                checked={asBoolean(keywords.allow_new_topics)}
                onChange={(value) => patch(["keywords", "allow_new_topics"], value)}
                label="Autoriser la création automatique de nouvelles thématiques"
              />
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="assistant">
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Assistant IA" icon={Bot}>
              <AdminToggle
                checked={asBoolean(assistant.enabled, true)}
                onChange={(value) => patch(["assistant", "enabled"], value)}
                label="Activer l'Assistant IA"
              />
              <div className="space-y-2">
                <p className="text-sm font-medium">Portails autorisés</p>
                {Object.entries(PORTAL_LABELS).map(([key, label]) => (
                  <AdminToggle
                    key={key}
                    checked={asBoolean(assistantPortals[key], true)}
                    onChange={(value) => patch(["assistant", "portals", key], value)}
                    label={label}
                  />
                ))}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="assistant-scope">Périmètre affiché</Label>
                <Input
                  id="assistant-scope"
                  value={String(assistant.scope_label || "")}
                  onChange={(e) => patch(["assistant", "scope_label"], e.target.value)}
                />
              </div>
            </SectionCard>

            <SectionCard title="Règles de réponse">
              <AdminToggle
                checked={asBoolean(assistant.require_sources, true)}
                onChange={(value) => patch(["assistant", "require_sources"], value)}
                label="Obliger les réponses sourcées"
              />
              <AdminToggle
                checked={asBoolean(assistant.block_answer_without_source, true)}
                onChange={(value) =>
                  patch(["assistant", "block_answer_without_source"], value)
                }
                label="Bloquer les réponses sans source"
              />
              <AdminToggle
                checked={asBoolean(assistant.show_citations, true)}
                onChange={(value) => patch(["assistant", "show_citations"], value)}
                label="Afficher les sources utilisées"
              />
              <AdminToggle
                checked={asBoolean(assistant.show_prudence_notice, true)}
                onChange={(value) => patch(["assistant", "show_prudence_notice"], value)}
                label="Afficher une note de prudence"
              />
              <p className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                L'Assistant IA répond uniquement à partir des documents accessibles dans
                OpenScience Hub. Les réponses doivent être vérifiées avec les sources affichées.
              </p>
            </SectionCard>

            <SectionCard title="Sources autorisées" icon={ShieldCheck}>
              <AdminToggle
                checked={asBoolean(assistantSources.public_archived_only, true)}
                onChange={(value) =>
                  patch(["assistant", "sources", "public_archived_only"], value)
                }
                label="Documents publics archivés uniquement"
              />
              <AdminToggle
                checked={asBoolean(assistantSources.validated_only, true)}
                onChange={(value) => patch(["assistant", "sources", "validated_only"], value)}
                label="Documents validés uniquement"
              />
              <AdminToggle
                checked={asBoolean(assistantSources.exclude_private, true)}
                onChange={(value) => patch(["assistant", "sources", "exclude_private"], value)}
                label="Exclure les documents privés"
              />
              <AdminToggle
                checked={asBoolean(assistantSources.exclude_in_review, true)}
                onChange={(value) =>
                  patch(["assistant", "sources", "exclude_in_review"], value)
                }
                label="Exclure les documents en cours de validation"
              />
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="similarity">
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Travaux similaires">
              <AdminToggle
                checked={asBoolean(similarity.enabled, true)}
                onChange={(value) => patch(["similarity", "enabled"], value)}
                label="Activer les travaux similaires"
              />
              <div>
                <div className="flex items-center justify-between text-sm">
                  <Label htmlFor="sim-threshold">Seuil minimal de similarité</Label>
                  <span className="font-semibold">
                    {Math.round(asNumber(similarity.threshold, 0.65) * 100)} %
                  </span>
                </div>
                <input
                  id="sim-threshold"
                  type="range"
                  min={40}
                  max={95}
                  value={Math.round(asNumber(similarity.threshold, 0.65) * 100)}
                  onChange={(e) =>
                    patch(["similarity", "threshold"], Number(e.target.value) / 100)
                  }
                  className="mt-2 w-full accent-[var(--ai)]"
                />
              </div>
              <AdminToggle
                checked={asBoolean(similarity.on_deposit, true)}
                onChange={(value) => patch(["similarity", "on_deposit"], value)}
                label="Pendant le dépôt"
              />
              <AdminToggle
                checked={asBoolean(similarity.on_validation, true)}
                onChange={(value) => patch(["similarity", "on_validation"], value)}
                label="Pendant la validation"
              />
              <AdminToggle
                checked={asBoolean(similarity.on_public_portal, true)}
                onChange={(value) => patch(["similarity", "on_public_portal"], value)}
                label="Dans le portail public"
              />
            </SectionCard>

            <SectionCard title="Pondérations">
              {Object.entries(SIMILARITY_WEIGHT_LABELS).map(([key, label]) => (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm">
                    <Label htmlFor={`weight-${key}`}>{label}</Label>
                    <span className="font-semibold">
                      {asNumber(similarityWeights[key], 0)} %
                    </span>
                  </div>
                  <input
                    id={`weight-${key}`}
                    type="range"
                    min={0}
                    max={100}
                    value={asNumber(similarityWeights[key], 0)}
                    onChange={(e) =>
                      patch(["similarity", "weights", key], Number(e.target.value))
                    }
                    className="mt-2 w-full accent-[var(--ai)]"
                  />
                </div>
              ))}
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="indexing">
          <SectionCard title="Indexation documentaire">
            <AdminToggle
              checked={asBoolean(indexing.auto_after_upload)}
              onChange={(value) => patch(["indexing", "auto_after_upload"], value)}
              label="Indexation automatique après upload"
            />
            <AdminToggle
              checked={asBoolean(indexing.auto_after_archive, true)}
              onChange={(value) => patch(["indexing", "auto_after_archive"], value)}
              label="Indexation automatique après archivage"
            />
            <p className="text-sm text-muted-foreground">
              Langues supportées :{" "}
              {Array.isArray(indexing.supported_languages)
                ? indexing.supported_languages.join(", ")
                : "fr, en"}
            </p>
            <p className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              La réindexation institutionnelle et le suivi des erreurs d'indexation seront
              disponibles depuis le tableau de bord de supervision IA.
            </p>
          </SectionCard>
        </TabsContent>

        <TabsContent value="security">
          <SectionCard title="Sécurité & confidentialité" icon={ShieldCheck}>
            <AdminToggle
              checked={asBoolean(security.exclude_private_documents, true)}
              onChange={(value) => patch(["security", "exclude_private_documents"], value)}
              label="Exclure les documents privés"
            />
            <AdminToggle
              checked={asBoolean(security.mask_personal_data, true)}
              onChange={(value) => patch(["security", "mask_personal_data"], value)}
              label="Masquer les données personnelles sensibles"
            />
            <AdminToggle
              checked={asBoolean(security.hide_internal_reviews, true)}
              onChange={(value) => patch(["security", "hide_internal_reviews"], value)}
              label="Masquer les avis internes"
            />
            <AdminToggle
              checked={asBoolean(security.log_queries, true)}
              onChange={(value) => patch(["security", "log_queries"], value)}
              label="Journaliser les requêtes IA"
            />
            <AdminToggle
              checked={asBoolean(security.limit_anonymous_queries, true)}
              onChange={(value) => patch(["security", "limit_anonymous_queries"], value)}
              label="Limiter les requêtes anonymes"
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="quotas">
          <SectionCard title="Quotas IA" icon={Gauge}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["anonymous_daily", "Public anonyme / jour"],
                ["user_daily", "Utilisateur connecté / jour"],
                ["validator_daily", "Validateur / jour"],
                ["admin_daily", "Administration / jour"],
              ].map(([key, label]) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`quota-${key}`}>{label}</Label>
                  <Input
                    id={`quota-${key}`}
                    type="number"
                    min={0}
                    value={asNumber(quotas[key], 0)}
                    onChange={(e) => patch(["quotas", key], Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="tests">
          <SectionCard title="Tests IA" icon={TestTube2}>
            <p className="text-sm text-muted-foreground">
              Utilisez cette section pour valider la configuration avant déploiement institutionnel.
              Les tests complets (PDF, résumé, Assistant, similarité) s'exécutent via le service
              Assistant IA lorsque le mode live est actif.
            </p>
            <div className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
              Prochaines actions disponibles : extraction test sur PDF, question test à
              l'Assistant, contrôle des sources et score de confiance.
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="logs">
          <SectionCard title="Logs IA">
            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune action IA journalisée pour le moment.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="py-2 pr-3 font-medium">Date</th>
                      <th className="py-2 pr-3 font-medium">Action</th>
                      <th className="py-2 pr-3 font-medium">Utilisateur</th>
                      <th className="py-2 pr-3 font-medium">Statut</th>
                      <th className="py-2 font-medium">Détail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map((log) => (
                      <tr key={String(log.id)} className="border-b border-border/60">
                        <td className="py-2 pr-3 align-top text-xs text-muted-foreground">
                          {String(log.created_at || "—")}
                        </td>
                        <td className="py-2 pr-3 align-top">{String(log.action || "—")}</td>
                        <td className="py-2 pr-3 align-top">{String(log.user || "—")}</td>
                        <td className="py-2 pr-3 align-top">
                          <Badge variant="outline">{String(log.status || "—")}</Badge>
                        </td>
                        <td className="py-2 align-top text-muted-foreground">
                          {String(log.question || log.model_name || "—")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>
    </>
  );
}

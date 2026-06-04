"use client";

import * as React from "react";
import { BadgeCheck, Bot, Save, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminToggle } from "@/components/admin/admin-toggle";
import { aiDefaults, aiLanguages, aiModels } from "@/lib/admin-data";
import { getAdminAiSettings, useApiResource } from "@/lib/api";

export default function AdminAiPage() {
  const liveSettings = useApiResource(() => getAdminAiSettings(), [], null);
  const [s, setS] = React.useState(aiDefaults);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 3000);
    return () => clearTimeout(t);
  }, [feedback]);

  React.useEffect(() => {
    if (!liveSettings.data) return;
    const data = liveSettings.data;
    setS((prev) => ({
      ...prev,
      model: String(data.model || data.extraction_model || prev.model),
      threshold: Number(data.confidence_threshold || data.threshold || prev.threshold),
      autoExtraction: Boolean(data.auto_extraction ?? prev.autoExtraction),
      assistantEnabled: Boolean(data.assistant_enabled ?? prev.assistantEnabled),
    }));
  }, [liveSettings.data]);

  function toggleField(key: string) {
    setS((prev) => ({
      ...prev,
      fields: prev.fields.map((f) =>
        f.key === key ? { ...f, enabled: !f.enabled } : f
      ),
    }));
  }

  return (
    <>
      <AdminPageHeader
        title="Paramètres IA"
        description="Extraction automatique, Assistant et garde-fous de sécurité."
      >
        <Button
          onClick={() =>
            setFeedback("Lecture backend synchronisée. La modification IA n'a pas encore de PUT backend réel.")
          }
        >
          <Save className="size-4" />
          Enregistrer
        </Button>
      </AdminPageHeader>

      {feedback && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-sm text-foreground">
          <BadgeCheck className="size-4 text-success" />
          {feedback}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Extraction */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-ai" />
              Extraction des métadonnées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <AdminToggle
              checked={s.autoExtraction}
              onChange={(v) => setS((p) => ({ ...p, autoExtraction: v }))}
              label="Extraction automatique au dépôt"
              description="Analyse le PDF dès le téléversement."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ai-model">Modèle</Label>
                <Select
                  id="ai-model"
                  value={s.model}
                  onChange={(e) => setS((p) => ({ ...p, model: e.target.value }))}
                  disabled={!s.autoExtraction}
                >
                  {aiModels.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ai-lang">Langue</Label>
                <Select
                  id="ai-lang"
                  value={s.language}
                  onChange={(e) => setS((p) => ({ ...p, language: e.target.value }))}
                  disabled={!s.autoExtraction}
                >
                  {aiLanguages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm">
                <Label htmlFor="ai-threshold">Seuil de confiance global</Label>
                <span className="font-semibold text-foreground">{s.threshold}%</span>
              </div>
              <input
                id="ai-threshold"
                type="range"
                min={50}
                max={99}
                value={s.threshold}
                onChange={(e) => setS((p) => ({ ...p, threshold: Number(e.target.value) }))}
                disabled={!s.autoExtraction}
                className="mt-2 w-full accent-[var(--ai)] disabled:opacity-50"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">
                Champs extraits
              </p>
              <div className="space-y-2.5 rounded-lg border border-border p-3">
                {s.fields.map((f) => (
                  <AdminToggle
                    key={f.key}
                    checked={f.enabled}
                    onChange={() => toggleField(f.key)}
                    label={f.label}
                    disabled={!s.autoExtraction}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assistant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="size-4 text-primary" />
              Assistant IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <AdminToggle
              checked={s.assistantEnabled}
              onChange={(v) => setS((p) => ({ ...p, assistantEnabled: v }))}
              label="Activer l'Assistant de recherche"
              description="Réponses contextualisées sur le corpus."
            />
            <div className="space-y-1.5">
              <Label htmlFor="ai-scope">Périmètre de l'Assistant</Label>
              <Select
                id="ai-scope"
                value={s.assistantScope}
                onChange={(e) => setS((p) => ({ ...p, assistantScope: e.target.value }))}
                disabled={!s.assistantEnabled}
              >
                <option>Documents publics validés</option>
                <option>Tous les documents validés</option>
                <option>Restreint aux gestionnaires</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="size-4 text-success" />
              Sécurité & confidentialité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AdminToggle
              checked={s.anonymize}
              onChange={(v) => setS((p) => ({ ...p, anonymize: v }))}
              label="Anonymisation des données sensibles"
              description="Masque les données personnelles avant traitement."
            />
            <AdminToggle
              checked={s.piiFilter}
              onChange={(v) => setS((p) => ({ ...p, piiFilter: v }))}
              label="Filtre PII"
              description="Bloque l'extraction d'informations personnelles."
            />
            <AdminToggle
              checked={s.logging}
              onChange={(v) => setS((p) => ({ ...p, logging: v }))}
              label="Journalisation des appels"
              description="Trace les requêtes IA dans l'audit."
            />
            <div className="space-y-1.5">
              <Label htmlFor="ai-retention">Rétention des journaux</Label>
              <Select
                id="ai-retention"
                value={String(s.retentionDays)}
                onChange={(e) =>
                  setS((p) => ({ ...p, retentionDays: Number(e.target.value) }))
                }
              >
                <option value="30">30 jours</option>
                <option value="90">90 jours</option>
                <option value="180">180 jours</option>
                <option value="365">365 jours</option>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

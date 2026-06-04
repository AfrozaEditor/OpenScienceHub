"use client";

import * as React from "react";
import { BadgeCheck, Check, FileCog, Save, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminToggle } from "@/components/admin/admin-toggle";
import {
  availableLicenses,
  documentTypeConfigs,
  metadataFields,
  type DocTypeConfig,
} from "@/lib/admin-data";

export default function AdminDocumentTypesPage() {
  const [configs, setConfigs] = React.useState<DocTypeConfig[]>(documentTypeConfigs);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 3000);
    return () => clearTimeout(t);
  }, [feedback]);

  const config = configs[selectedIndex];

  function patch(p: Partial<DocTypeConfig>) {
    setConfigs((prev) => prev.map((c, i) => (i === selectedIndex ? { ...c, ...p } : c)));
  }

  function toggleField(field: string) {
    const has = config.requiredFields.includes(field);
    patch({
      requiredFields: has
        ? config.requiredFields.filter((f) => f !== field)
        : [...config.requiredFields, field],
    });
  }

  function toggleLicense(license: string) {
    const has = config.licenses.includes(license);
    patch({
      licenses: has
        ? config.licenses.filter((l) => l !== license)
        : [...config.licenses, license],
    });
  }

  return (
    <>
      <AdminPageHeader
        title="Types de documents"
        description="Configuration des métadonnées et règles propres à chaque type."
      >
        <Button onClick={() => setFeedback(`Configuration « ${config.type} » enregistrée.`)}>
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

      <div className="grid gap-6 lg:grid-cols-[0.8fr_2fr]">
        {/* Liste des types */}
        <div className="space-y-2">
          {configs.map((c, i) => {
            const active = i === selectedIndex;
            return (
              <button
                key={c.type}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${active ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/40"}`}
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileCog className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">
                    {c.type}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {c.requiredFields.length} champs requis
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Config */}
        <Card>
          <CardContent className="space-y-6 py-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="t-access">Accès par défaut</Label>
                <Select
                  id="t-access"
                  value={config.defaultAccess}
                  onChange={(e) =>
                    patch({ defaultAccess: e.target.value as DocTypeConfig["defaultAccess"] })
                  }
                >
                  <option value="Public">Public</option>
                  <option value="Restreint">Restreint</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-citation">Modèle de citation</Label>
                <Input
                  id="t-citation"
                  value={config.citation}
                  onChange={(e) => patch({ citation: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-foreground">Champs obligatoires</p>
              <p className="mb-3 text-xs text-muted-foreground">
                Sélectionnez les métadonnées requises pour ce type.
              </p>
              <div className="flex flex-wrap gap-2">
                {metadataFields.map((field) => {
                  const on = config.requiredFields.includes(field);
                  return (
                    <button
                      key={field}
                      type="button"
                      onClick={() => toggleField(field)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${on ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40"}`}
                    >
                      {on && <Check className="size-3" />}
                      {field}
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-foreground">Licences autorisées</p>
              <p className="mb-3 text-xs text-muted-foreground">
                Licences proposées au dépôt pour ce type.
              </p>
              <div className="flex flex-wrap gap-2">
                {availableLicenses.map((license) => {
                  const on = config.licenses.includes(license);
                  return (
                    <button
                      key={license}
                      type="button"
                      onClick={() => toggleLicense(license)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${on ? "border-ai bg-ai/10 text-[var(--ai)]" : "border-border bg-card text-muted-foreground hover:border-ai/40"}`}
                    >
                      {on && <Check className="size-3" />}
                      {license}
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div className="rounded-xl border border-ai/30 bg-ai/5 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-ai" />
                <p className="text-sm font-medium text-foreground">Extraction IA</p>
                <div className="ml-auto">
                  <AdminToggle
                    checked={config.aiExtraction}
                    onChange={(v) => patch({ aiExtraction: v })}
                  />
                </div>
              </div>
              {config.aiExtraction && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <Label htmlFor="t-threshold">Seuil de confiance</Label>
                    <span className="font-semibold text-foreground">
                      {config.aiThreshold}%
                    </span>
                  </div>
                  <input
                    id="t-threshold"
                    type="range"
                    min={50}
                    max={99}
                    value={config.aiThreshold}
                    onChange={(e) => patch({ aiThreshold: Number(e.target.value) })}
                    className="mt-2 w-full accent-[var(--ai)]"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    En dessous du seuil, les métadonnées sont marquées « à vérifier ».
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">Aperçu</Badge>
              <span className="text-xs text-muted-foreground">
                {config.type} · accès {config.defaultAccess.toLowerCase()} ·{" "}
                {config.requiredFields.length} champs requis ·{" "}
                {config.licenses.length} licences
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

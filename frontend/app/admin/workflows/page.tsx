"use client";

import * as React from "react";
import {
  BookOpen,
  Check,
  FileText,
  GraduationCap,
  Loader2,
  Sparkles,
  Trash2,
  Workflow,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { messageForApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/api/hooks";
import { applyWorkflowTemplate, deleteWorkflow, listWorkflows, updateWorkflow } from "@/lib/api/resources";

type WorkflowRow = {
  id: string;
  name: string;
  document_type: string;
  description: string;
  is_active: boolean;
  version: number;
  steps: Array<{
    id?: string;
    name: string;
    description?: string;
    responsible_role?: string;
    order: number;
  }>;
};

const TEMPLATE_BUTTONS = [
  { key: "MEMOIRE", label: "Utiliser modèle Mémoire", icon: GraduationCap },
  { key: "THESE", label: "Utiliser modèle Thèse", icon: BookOpen },
  { key: "ARTICLE", label: "Utiliser modèle Article", icon: FileText },
] as const;

function listFrom<T>(data: { results: T[] } | T[] | null) {
  if (!data) return [];
  return Array.isArray(data) ? data : data.results;
}

function mapWorkflow(row: Record<string, unknown>): WorkflowRow {
  const steps = Array.isArray(row.steps) ? row.steps : [];
  return {
    id: String(row.id),
    name: String(row.name || row.code || "Workflow"),
    document_type: String(row.document_type || "—"),
    description: String(row.description || ""),
    is_active: Boolean(row.is_active),
    version: Number(row.version || 1),
    steps: steps
      .map((step) => {
        const s = step as Record<string, unknown>;
        return {
          id: s.id ? String(s.id) : undefined,
          name: String(s.name || ""),
          description: String(s.description || ""),
          responsible_role: String(s.responsible_role || ""),
          order: Number(s.order || 0),
        };
      })
      .sort((a, b) => a.order - b.order),
  };
}

function isAiStep(step: WorkflowRow["steps"][number]) {
  if (step.responsible_role === "SYSTEM") return true;
  const text = `${step.name} ${step.description}`.toLowerCase();
  return text.includes("ia") || text.includes("extraction") || text.includes("index");
}

function roleLabel(value?: string) {
  switch (value) {
    case "SYSTEM":
      return "OpenScience Hub";
    case "VALIDATOR":
      return "Validateur";
    case "ARCHIVIST":
      return "Archiviste";
    case "INSTITUTION_ADMIN":
      return "Admin institution";
    case "DEPOSANT":
      return "Déposant";
    default:
      return value || "";
  }
}

export default function AdminWorkflowsPage() {
  const live = useApiResource(() => listWorkflows(), [], null);
  const [rows, setRows] = React.useState<WorkflowRow[]>([]);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!live.data) return;
    setRows(listFrom<Record<string, unknown>>(live.data).map(mapWorkflow));
  }, [live.data]);

  React.useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(timer);
  }, [feedback]);

  async function reload() {
    await live.reload();
  }

  async function handleApplyTemplate(template: string) {
    setBusy(`template-${template}`);
    setError(null);
    try {
      await applyWorkflowTemplate(template);
      setFeedback(`Modèle ${template.toLowerCase()} appliqué.`);
      await reload();
    } catch (err) {
      setError(messageForApiError(err));
    } finally {
      setBusy(null);
    }
  }

  async function handleToggleActive(workflow: WorkflowRow) {
    setBusy(`toggle-${workflow.id}`);
    setError(null);
    try {
      await updateWorkflow(workflow.id, { is_active: !workflow.is_active });
    setFeedback(workflow.is_active ? "Parcours désactivé." : "Parcours activé.");
      await reload();
    } catch (err) {
      setError(messageForApiError(err));
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete(workflow: WorkflowRow) {
    if (!window.confirm(`Supprimer le parcours « ${workflow.name} » ?`)) return;
    setBusy(`delete-${workflow.id}`);
    setError(null);
    try {
      await deleteWorkflow(workflow.id);
      setFeedback("Parcours supprimé.");
      await reload();
    } catch (err) {
      setError(messageForApiError(err));
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Parcours de validation"
        description="Processus configurés pour le traitement académique des travaux."
      >
        <Badge variant="outline">
          <Workflow className="size-3" />
          {live.loading ? "Chargement..." : `${rows.length} parcours`}
        </Badge>
      </AdminPageHeader>

      {feedback && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-sm text-foreground">
          <Check className="size-4 text-success" />
          {feedback}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Créer depuis un modèle</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {TEMPLATE_BUTTONS.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant="outline"
              disabled={Boolean(busy)}
              onClick={() => handleApplyTemplate(key)}
            >
              {busy === `template-${key}` ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Icon className="size-4" />
              )}
              {label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {rows.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Aucun parcours configuré pour le moment.
              <br />
              Utilisez un modèle mémoire, thèse ou article pour démarrer.
            </CardContent>
          </Card>
        ) : (
          rows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="text-base">{workflow.name}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Type : {workflow.document_type} · Version {workflow.version}
                  </p>
                  {workflow.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{workflow.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Badge variant={workflow.is_active ? "default" : "outline"}>
                    {workflow.is_active ? "Actif" : "Inactif"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={Boolean(busy)}
                    onClick={() => handleToggleActive(workflow)}
                  >
                    {busy === `toggle-${workflow.id}` && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    {workflow.is_active ? "Désactiver" : "Activer"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={Boolean(busy)}
                    onClick={() => handleDelete(workflow)}
                  >
                    {busy === `delete-${workflow.id}` ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                    Supprimer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm font-medium text-foreground">
                  Étapes du parcours ({workflow.steps.length})
                </p>
                <ol className="space-y-2">
                  {workflow.steps.map((step) => (
                    <li
                      key={`${workflow.id}-${step.order}-${step.name}`}
                      className="flex items-start gap-3 rounded-lg border border-border px-3 py-2"
                    >
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {step.order}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{step.name}</span>
                          {isAiStep(step) && (
                            <Badge variant="outline" className="gap-1 text-ai">
                              <Sparkles className="size-3" />
                              Étape IA
                            </Badge>
                          )}
                          {step.responsible_role && (
                            <Badge variant="outline">{roleLabel(step.responsible_role)}</Badge>
                          )}
                        </div>
                        {step.description && (
                          <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

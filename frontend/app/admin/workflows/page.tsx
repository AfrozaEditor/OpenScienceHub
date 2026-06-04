"use client";

import * as React from "react";
import {
  ArrowDown,
  ChevronDown,
  Cog,
  Flag,
  GitBranch,
  Play,
  Plus,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminToggle } from "@/components/admin/admin-toggle";
import {
  workflows as initialWorkflows,
  type Workflow,
  type WorkflowStep,
  type WorkflowStepType,
} from "@/lib/admin-data";

const ROLE_OPTIONS = [
  "Déposant",
  "Système",
  "Gestionnaire",
  "Validateur",
  "Administrateur",
];

const stepMeta: Record<
  WorkflowStepType,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  start: { label: "Début", icon: Play, color: "text-success bg-success/12" },
  task: { label: "Tâche", icon: Cog, color: "text-primary bg-primary/10" },
  decision: { label: "Décision", icon: GitBranch, color: "text-[#b45309] bg-warning/15" },
  end: { label: "Fin", icon: Flag, color: "text-brand bg-brand/10" },
};

const STEP_TYPES: WorkflowStepType[] = ["start", "task", "decision", "end"];

export default function AdminWorkflowsPage() {
  const [workflows, setWorkflows] = React.useState<Workflow[]>(initialWorkflows);
  const [selectedId, setSelectedId] = React.useState(initialWorkflows[0]?.id);

  const selected = workflows.find((w) => w.id === selectedId);

  function patchSteps(updater: (steps: WorkflowStep[]) => WorkflowStep[]) {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === selectedId ? { ...w, steps: updater(w.steps) } : w
      )
    );
  }

  function updateStep(id: string, patch: Partial<WorkflowStep>) {
    patchSteps((steps) => steps.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function addStep() {
    patchSteps((steps) => [
      ...steps,
      {
        id: `st-${Date.now()}`,
        name: "Nouvelle étape",
        role: "Gestionnaire",
        sla: "—",
        type: "task",
      },
    ]);
  }

  function removeStep(id: string) {
    patchSteps((steps) => steps.filter((s) => s.id !== id));
  }

  function moveStep(index: number, dir: -1 | 1) {
    patchSteps((steps) => {
      const next = [...steps];
      const target = index + dir;
      if (target < 0 || target >= next.length) return steps;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function toggleActive(id: string) {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Workflows"
        description="Concevez les étapes et transitions des processus de validation."
      >
        <Button onClick={addStep} disabled={!selected}>
          <Plus className="size-4" />
          Ajouter une étape
        </Button>
      </AdminPageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        {/* Liste des workflows */}
        <div className="space-y-3">
          {workflows.map((w) => {
            const active = w.id === selectedId;
            return (
              <Card
                key={w.id}
                className={`cursor-pointer gap-0 py-4 transition-colors ${active ? "border-primary ring-1 ring-primary/30" : "hover:border-primary/40"}`}
                onClick={() => setSelectedId(w.id)}
              >
                <CardContent className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {w.name}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {w.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline">{w.steps.length} étapes</Badge>
                      <Badge variant={w.active ? "success" : "secondary"}>
                        {w.active ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <AdminToggle
                      checked={w.active}
                      onChange={() => toggleActive(w.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Builder */}
        <Card>
          <CardContent className="py-6">
            {!selected ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Sélectionnez un workflow.
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-lg font-semibold text-foreground">
                      {selected.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selected.steps.length} étapes · transitions séquentielles
                    </p>
                  </div>
                  <Badge variant={selected.active ? "success" : "secondary"}>
                    {selected.active ? "Actif" : "Inactif"}
                  </Badge>
                </div>

                <div className="mt-5 space-y-0">
                  {selected.steps.map((step, index) => {
                    const meta = stepMeta[step.type];
                    return (
                      <div key={step.id}>
                        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
                          <span
                            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${meta.color}`}
                          >
                            <meta.icon className="size-4" />
                          </span>
                          <div className="grid flex-1 gap-2 sm:grid-cols-[1.4fr_1fr_0.8fr]">
                            <Input
                              value={step.name}
                              onChange={(e) => updateStep(step.id, { name: e.target.value })}
                              aria-label="Nom de l'étape"
                            />
                            <Select
                              value={step.role}
                              onChange={(e) => updateStep(step.id, { role: e.target.value })}
                              aria-label="Rôle responsable"
                            >
                              {ROLE_OPTIONS.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </Select>
                            <div className="flex gap-2">
                              <Input
                                value={step.sla}
                                onChange={(e) => updateStep(step.id, { sla: e.target.value })}
                                aria-label="Délai (SLA)"
                                className="w-full"
                              />
                            </div>
                            <Select
                              value={step.type}
                              onChange={(e) =>
                                updateStep(step.id, {
                                  type: e.target.value as WorkflowStepType,
                                })
                              }
                              aria-label="Type d'étape"
                              className="sm:col-span-3"
                            >
                              {STEP_TYPES.map((t) => (
                                <option key={t} value={t}>
                                  {stepMeta[t].label}
                                </option>
                              ))}
                            </Select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => moveStep(index, -1)}
                              disabled={index === 0}
                              title="Monter"
                            >
                              <ChevronDown className="size-4 rotate-180" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => moveStep(index, 1)}
                              disabled={index === selected.steps.length - 1}
                              title="Descendre"
                            >
                              <ChevronDown className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => removeStep(step.id)}
                              title="Supprimer"
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        {index < selected.steps.length - 1 && (
                          <div className="flex justify-center py-1.5">
                            <ArrowDown className="size-4 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Button variant="outline" className="mt-4 w-full" onClick={addStep}>
                  <Plus className="size-4" />
                  Ajouter une étape
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

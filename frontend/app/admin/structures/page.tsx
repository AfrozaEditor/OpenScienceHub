"use client";

import * as React from "react";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  FileText,
  FolderTree,
  GraduationCap,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  structureTree,
  type StructureDepartment,
  type StructureFaculty,
  type StructureProgram,
} from "@/lib/admin-data";

const fr = new Intl.NumberFormat("fr-FR");

type Selected =
  | { kind: "faculty"; facId: string }
  | { kind: "department"; facId: string; depId: string }
  | { kind: "program"; facId: string; depId: string; progId: string };

export default function AdminStructuresPage() {
  const [tree, setTree] = React.useState<StructureFaculty[]>(structureTree);
  const [expanded, setExpanded] = React.useState<Set<string>>(
    new Set([structureTree[0]?.id])
  );
  const [selected, setSelected] = React.useState<Selected>({
    kind: "faculty",
    facId: structureTree[0]?.id,
  });
  const [query, setQuery] = React.useState("");

  const q = query.trim().toLowerCase();
  const filtered = React.useMemo(() => {
    if (!q) return tree;
    return tree
      .map((f) => {
        const facMatch = f.name.toLowerCase().includes(q);
        const deps = facMatch
          ? f.departments
          : f.departments.filter((d) => d.name.toLowerCase().includes(q));
        return facMatch || deps.length ? { ...f, departments: deps } : null;
      })
      .filter(Boolean) as StructureFaculty[];
  }, [tree, q]);

  const isOpen = (id: string) => Boolean(q) || expanded.has(id);
  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totals = React.useMemo(() => {
    let deps = 0;
    let progs = 0;
    for (const f of tree) {
      deps += f.departments.length;
      for (const d of f.departments) progs += d.programs.length;
    }
    return { faculties: tree.length, deps, progs };
  }, [tree]);

  /* ---- mutations -------------------------------------------------------- */
  function renameSelected() {
    const current = currentName();
    const name = window.prompt("Nouveau nom :", current ?? "");
    if (!name) return;
    setTree((t) =>
      t.map((f) => {
        if (selected.kind === "faculty" && f.id === selected.facId)
          return { ...f, name };
        if (f.id === selected.facId) {
          return {
            ...f,
            departments: f.departments.map((d) => {
              if (selected.kind === "department" && d.id === selected.depId)
                return { ...d, name };
              if (selected.kind === "program" && d.id === selected.depId)
                return {
                  ...d,
                  programs: d.programs.map((p) =>
                    p.id === selected.progId ? { ...p, name } : p
                  ),
                };
              return d;
            }),
          };
        }
        return f;
      })
    );
  }

  function addChild() {
    if (selected.kind === "program") return;
    const name = window.prompt(
      selected.kind === "faculty" ? "Nom du département :" : "Nom de la filière :"
    );
    if (!name) return;
    if (selected.kind === "faculty") {
      const depId = `dep-${Date.now()}`;
      setTree((t) =>
        t.map((f) =>
          f.id === selected.facId
            ? {
                ...f,
                departments: [
                  ...f.departments,
                  { id: depId, name, head: "—", students: 0, documents: 0, programs: [] },
                ],
              }
            : f
        )
      );
      setExpanded((prev) => new Set(prev).add(selected.facId));
    } else {
      const progId = `pr-${Date.now()}`;
      setTree((t) =>
        t.map((f) =>
          f.id === selected.facId
            ? {
                ...f,
                departments: f.departments.map((d) =>
                  d.id === selected.depId
                    ? { ...d, programs: [...d.programs, { id: progId, name, level: "Licence" }] }
                    : d
                ),
              }
            : f
        )
      );
      setExpanded((prev) => new Set(prev).add(selected.depId));
    }
  }

  function removeSelected() {
    if (!window.confirm("Supprimer cet élément et son contenu ?")) return;
    if (selected.kind === "faculty") {
      setTree((t) => t.filter((f) => f.id !== selected.facId));
    } else if (selected.kind === "department") {
      setTree((t) =>
        t.map((f) =>
          f.id === selected.facId
            ? { ...f, departments: f.departments.filter((d) => d.id !== selected.depId) }
            : f
        )
      );
    } else {
      setTree((t) =>
        t.map((f) =>
          f.id === selected.facId
            ? {
                ...f,
                departments: f.departments.map((d) =>
                  d.id === selected.depId
                    ? { ...d, programs: d.programs.filter((p) => p.id !== selected.progId) }
                    : d
                ),
              }
            : f
        )
      );
    }
    setSelected({ kind: "faculty", facId: tree[0]?.id });
  }

  /* ---- lookups ---------------------------------------------------------- */
  const fac = tree.find((f) => f.id === selected.facId);
  const dep =
    selected.kind !== "faculty"
      ? fac?.departments.find((d) => d.id === selected.depId)
      : undefined;
  const prog =
    selected.kind === "program"
      ? dep?.programs.find((p) => p.id === selected.progId)
      : undefined;

  function currentName() {
    if (selected.kind === "faculty") return fac?.name;
    if (selected.kind === "department") return dep?.name;
    return prog?.name;
  }

  return (
    <>
      <AdminPageHeader
        title="Structures académiques"
        description="Arborescence Facultés → Départements → Filières, avec détails par nœud."
      >
        <Badge variant="outline">{totals.faculties} facultés</Badge>
        <Badge variant="outline">{totals.deps} départements</Badge>
        <Badge variant="outline">{totals.progs} filières</Badge>
      </AdminPageHeader>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Arbre */}
        <Card className="py-0">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une structure…"
                className="pl-9"
              />
            </div>
          </div>
          <CardContent className="max-h-[560px] overflow-y-auto py-3">
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucune structure trouvée.
              </p>
            )}
            <ul className="space-y-0.5">
              {filtered.map((f) => {
                const facActive = selected.kind === "faculty" && selected.facId === f.id;
                return (
                  <li key={f.id}>
                    <div
                      className={`flex items-center gap-1 rounded-md pr-2 ${facActive ? "bg-secondary" : "hover:bg-muted/60"}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggle(f.id)}
                        className="flex size-7 items-center justify-center rounded text-muted-foreground"
                        aria-label="Déplier"
                      >
                        {isOpen(f.id) ? (
                          <ChevronDown className="size-4" />
                        ) : (
                          <ChevronRight className="size-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelected({ kind: "faculty", facId: f.id })}
                        className="flex flex-1 items-center gap-2 py-2 text-left text-sm font-medium text-foreground"
                      >
                        <Building2 className="size-4 text-primary" />
                        <span className="truncate">{f.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {f.departments.length}
                        </span>
                      </button>
                    </div>

                    {isOpen(f.id) && (
                      <ul className="ml-7 space-y-0.5 border-l border-border pl-2">
                        {f.departments.map((d) => {
                          const depActive =
                            selected.kind === "department" &&
                            selected.depId === d.id;
                          return (
                            <li key={d.id}>
                              <div
                                className={`flex items-center gap-1 rounded-md pr-2 ${depActive ? "bg-secondary" : "hover:bg-muted/60"}`}
                              >
                                <button
                                  type="button"
                                  onClick={() => toggle(d.id)}
                                  className="flex size-7 items-center justify-center rounded text-muted-foreground"
                                  aria-label="Déplier"
                                >
                                  {d.programs.length > 0 ? (
                                    isOpen(d.id) ? (
                                      <ChevronDown className="size-4" />
                                    ) : (
                                      <ChevronRight className="size-4" />
                                    )
                                  ) : (
                                    <span className="size-1.5 rounded-full bg-border" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelected({ kind: "department", facId: f.id, depId: d.id })
                                  }
                                  className="flex flex-1 items-center gap-2 py-1.5 text-left text-sm text-foreground"
                                >
                                  <FolderTree className="size-4 text-ai" />
                                  <span className="truncate">{d.name}</span>
                                </button>
                              </div>

                              {isOpen(d.id) && (
                                <ul className="ml-7 space-y-0.5 border-l border-border pl-2">
                                  {d.programs.map((p) => {
                                    const progActive =
                                      selected.kind === "program" &&
                                      selected.progId === p.id;
                                    return (
                                      <li key={p.id}>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setSelected({
                                              kind: "program",
                                              facId: f.id,
                                              depId: d.id,
                                              progId: p.id,
                                            })
                                          }
                                          className={`flex w-full items-center gap-2 rounded-md py-1.5 pl-2 pr-2 text-left text-sm ${progActive ? "bg-secondary" : "hover:bg-muted/60"}`}
                                        >
                                          <GraduationCap className="size-4 text-muted-foreground" />
                                          <span className="truncate text-muted-foreground">
                                            {p.name}
                                          </span>
                                          <Badge variant="outline" className="ml-auto">
                                            {p.level}
                                          </Badge>
                                        </button>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        {/* Détails */}
        <Card>
          <CardContent className="py-6">
            <NodeDetails fac={fac} dep={dep} prog={prog} selected={selected} />
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-5">
              <Button variant="outline" size="sm" onClick={renameSelected}>
                <Pencil className="size-3.5" />
                Renommer
              </Button>
              {selected.kind !== "program" && (
                <Button variant="outline" size="sm" onClick={addChild}>
                  <Plus className="size-3.5" />
                  {selected.kind === "faculty" ? "Ajouter un département" : "Ajouter une filière"}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={removeSelected}
                className="ml-auto text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-3.5" />
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2.5">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </p>
      <p className="mt-1 font-heading text-lg font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function NodeDetails({
  fac,
  dep,
  prog,
  selected,
}: {
  fac?: StructureFaculty;
  dep?: StructureDepartment;
  prog?: StructureProgram;
  selected: Selected;
}) {
  if (!fac) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Sélectionnez une structure dans l'arbre.
      </p>
    );
  }

  if (selected.kind === "program" && prog) {
    return (
      <div>
        <Badge variant="outline">Filière</Badge>
        <h2 className="mt-3 font-heading text-xl font-semibold text-foreground">
          {prog.name}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {fac.name} · {dep?.name}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat icon={GraduationCap} label="Niveau" value={prog.level} />
          <Stat icon={FolderTree} label="Département" value={dep?.name ?? "—"} />
        </div>
      </div>
    );
  }

  if (selected.kind === "department" && dep) {
    return (
      <div>
        <Badge variant="ai">Département</Badge>
        <h2 className="mt-3 font-heading text-xl font-semibold text-foreground">
          {dep.name}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{fac.name}</p>
        <p className="mt-3 text-sm text-foreground">
          Responsable : <span className="font-medium">{dep.head}</span>
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat icon={Users} label="Étudiants" value={fr.format(dep.students)} />
          <Stat icon={FileText} label="Documents" value={fr.format(dep.documents)} />
          <Stat icon={GraduationCap} label="Filières" value={String(dep.programs.length)} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Badge variant="brand">Faculté</Badge>
      <h2 className="mt-3 font-heading text-xl font-semibold text-foreground">
        {fac.name}
      </h2>
      <p className="mt-3 text-sm text-foreground">
        Doyen : <span className="font-medium">{fac.head}</span>
      </p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat icon={Users} label="Étudiants" value={fr.format(fac.students)} />
        <Stat icon={FileText} label="Documents" value={fr.format(fac.documents)} />
        <Stat icon={FolderTree} label="Départements" value={String(fac.departments.length)} />
      </div>
    </div>
  );
}

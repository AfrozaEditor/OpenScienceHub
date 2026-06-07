"use client";

import * as React from "react";
import {
  Ban,
  Check,
  Pencil,
  RotateCcw,
  Search,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useAuth } from "@/components/auth-provider";
import { messageForApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/api/hooks";
import { createAdminUser, deleteAdminUser, listAdminUsers, listAdminUsersWithoutInstitution, listInstitutions, updateAdminUser } from "@/lib/api/resources";
import type { CurrentUser, Institution } from "@/lib/api/types";

type UserRole = "Administrateur" | "Gestionnaire" | "Validateur" | "Déposant" | "Lecteur";
type UserStatus = "Actif" | "Suspendu" | "Invité";
type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  structure: string;
  institutionId: string;
  status: UserStatus;
  initials: string;
  lastActive: string;
};

type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "brand"
  | "ai"
  | "success"
  | "warning"
  | "thesis"
  | "destructive";

const ROLES: UserRole[] = [
  "Administrateur",
  "Gestionnaire",
  "Validateur",
  "Déposant",
  "Lecteur",
];

const STATUSES: UserStatus[] = ["Actif", "Suspendu", "Invité"];

const roleCodeByRole: Record<UserRole, string> = {
  Administrateur: "INSTITUTION_ADMIN",
  Gestionnaire: "DEPARTMENT_HEAD",
  Validateur: "VALIDATOR",
  Déposant: "DEPOSANT",
  Lecteur: "PUBLIC",
};

const roleVariant: Record<UserRole, BadgeVariant> = {
  Administrateur: "brand",
  Gestionnaire: "default",
  Validateur: "ai",
  Déposant: "success",
  Lecteur: "secondary",
};

const statusVariant: Record<UserStatus, BadgeVariant> = {
  Actif: "success",
  Suspendu: "destructive",
  Invité: "warning",
};

function initialsOf(name: string) {
  return name
    .replace(/(Dr\.|Pr\.)\s*/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function listFrom<T>(data: { results: T[] } | T[] | null | undefined) {
  if (!data) return [];
  return Array.isArray(data) ? data : data.results;
}

function statusToApi(status: UserStatus) {
  if (status === "Suspendu") return "SUSPENDED";
  if (status === "Invité") return "PENDING";
  return "ACTIVE";
}

function apiUserToAdminUser(user: CurrentUser, institutionNames: Map<string, string>): AdminUser {
  const roleCodes = user.capabilities?.roles || user.roles?.map((role) => role.role_code || role.role_label || "") || [];
  const normalized = roleCodes.join(" ").toLowerCase();
  const institutionId = String(user.institution || "");
  const role: UserRole = user.is_superuser || user.capabilities?.is_platform_admin || user.capabilities?.is_institution_admin || normalized.includes("admin")
    ? "Administrateur"
    : normalized.includes("valid") || normalized.includes("review") || normalized.includes("rapporteur")
      ? "Validateur"
      : normalized.includes("deposant")
        ? "Déposant"
        : "Lecteur";
  return {
    id: user.id,
    name: user.full_name || user.email,
    email: user.email,
    role,
    structure: institutionNames.get(institutionId) || (user.is_superuser ? "OpenScience Hub" : "À rattacher"),
    institutionId,
    status: user.status === "SUSPENDED" ? "Suspendu" : user.status === "PENDING" ? "Invité" : "Actif",
    initials: initialsOf(user.full_name || user.email) || "OS",
    lastActive: "—",
  };
}

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "Déposant" as UserRole,
  institutionId: "",
  status: "Actif" as UserStatus,
};

export default function AdminUsersPage() {
  const { user } = useAuth();
  const liveUsers = useApiResource(() => listAdminUsers(), [], null);
  const liveOrphans = useApiResource(() => listAdminUsersWithoutInstitution(), [], null);
  const liveInstitutions = useApiResource(() => listInstitutions(), [], null);
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [query, setQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const institutions = React.useMemo(
    () => listFrom<Institution>(liveInstitutions.data),
    [liveInstitutions.data],
  );
  const availableInstitutions = React.useMemo(() => {
    if (user?.capabilities?.is_platform_admin) return institutions;
    const ownInstitutionId = String(user?.institution || "");
    return institutions.filter((institution) => institution.id === ownInstitutionId);
  }, [institutions, user?.capabilities?.is_platform_admin, user?.institution]);
  const institutionNames = React.useMemo(
    () => new Map(institutions.map((institution) => [institution.id, institution.name])),
    [institutions],
  );

  React.useEffect(() => {
    if (liveUsers.data) {
      setUsers(listFrom(liveUsers.data).map((user) => apiUserToAdminUser(user, institutionNames)));
    }
  }, [institutionNames, liveUsers.data]);

  const orphanUsers = React.useMemo(
    () => listFrom(liveOrphans.data).map((user) => apiUserToAdminUser(user, institutionNames)),
    [institutionNames, liveOrphans.data],
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.structure.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || u.status === statusFilter;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, query, roleFilter, statusFilter]);

  const activeCount = users.filter((u) => u.status === "Actif").length;
  const suspendedCount = users.filter((u) => u.status === "Suspendu").length;

  function openCreate() {
    setForm({
      ...emptyForm,
      institutionId:
        availableInstitutions.length === 1 ? availableInstitutions[0].id : "",
    });
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(u: AdminUser) {
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      institutionId: u.institutionId,
      status: u.status,
    });
    setEditingId(u.id);
    setShowForm(true);
  }

  function openAttach(u: AdminUser) {
    const defaultInstitutionId =
      availableInstitutions.length === 1 ? availableInstitutions[0].id : "";
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role === "Administrateur" ? "Déposant" : u.role,
      institutionId: defaultInstitutionId,
      status: u.status,
    });
    setEditingId(u.id);
    setShowForm(true);
    setFeedback("Sélectionnez l'institution et le rôle à appliquer pour rattacher ce compte.");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const password = form.password.trim();
    if (!form.name.trim() || !form.email.trim()) return;
    if (!form.institutionId) {
      setFeedback("Sélectionnez une institution pour ce compte.");
      return;
    }
    if (!editingId && password.length < 8) {
      setFeedback("Le mot de passe initial doit contenir au moins 8 caractères.");
      return;
    }

    const payload = {
      full_name: form.name,
      email: form.email,
      status: statusToApi(form.status),
      institution: form.institutionId,
      role_code: roleCodeByRole[form.role],
      scope_type: "INSTITUTION",
      scope_id: form.institutionId,
      ...(password ? { password } : {}),
    };

    if (editingId) {
      try {
        const updated = await updateAdminUser(editingId, payload);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingId
              ? apiUserToAdminUser(updated, institutionNames)
              : u
          )
        );
        void liveUsers.reload();
        void liveOrphans.reload();
      } catch (err) {
        setFeedback(messageForApiError(err));
        return;
      }
    } else {
      try {
        const created = await createAdminUser(payload);
        setUsers((prev) => [apiUserToAdminUser(created, institutionNames), ...prev]);
        void liveUsers.reload();
        void liveOrphans.reload();
      } catch (err) {
        setFeedback(messageForApiError(err));
        return;
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      return;
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function toggleStatus(id: string) {
    const user = users.find((u) => u.id === id);
    const nextStatus = user?.status === "Suspendu" ? "ACTIVE" : "SUSPENDED";
    try {
      await updateAdminUser(id, { status: nextStatus });
    } catch (err) {
      setFeedback(messageForApiError(err));
      return;
    }
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Suspendu" ? "Actif" : "Suspendu" }
          : u
      )
    );
  }

  async function remove(id: string) {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Supprimer définitivement cet utilisateur ?")
    )
      return;
    try {
      await deleteAdminUser(id);
    } catch (err) {
      setFeedback(messageForApiError(err));
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <>
      <AdminPageHeader
        title="Utilisateurs"
        description="Créez, modifiez et gérez les comptes, leurs rôles et leur statut."
      >
        <Button onClick={openCreate}>
          <UserPlus className="size-4" />
          Nouvel utilisateur
        </Button>
      </AdminPageHeader>

      {feedback && (
        <div className="mb-5 rounded-lg border border-warning/30 bg-warning/10 px-4 py-2.5 text-sm text-foreground">
          {feedback}
        </div>
      )}

      {/* Résumé */}
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1">
          <Users className="size-3.5 text-muted-foreground" />
          {users.length} comptes
        </span>
        <Badge variant="success">{activeCount} actifs</Badge>
        <Badge variant="destructive">{suspendedCount} suspendus</Badge>
        {orphanUsers.length ? <Badge variant="warning">{orphanUsers.length} à rattacher</Badge> : null}
      </div>

      {orphanUsers.length > 0 && (
        <Card className="mb-5 border-warning/30 bg-warning/5">
          <CardContent className="space-y-3 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-heading text-sm font-semibold text-foreground">Comptes à rattacher</p>
                <p className="text-sm text-muted-foreground">
                  Ces comptes actifs n'ont pas encore d'institution. Le rattachement reste manuel.
                </p>
              </div>
              <Badge variant="warning">{orphanUsers.length}</Badge>
            </div>
            <div className="grid gap-2">
              {orphanUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => openAttach(user)}>
                    Rattacher
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulaire création / édition */}
      {showForm && (
        <Card className="mb-5 border-primary/30">
          <CardContent className="py-5">
            <form onSubmit={submit} className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-heading text-base font-semibold text-foreground">
                  {editingId ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(false)}
                  aria-label="Fermer"
                >
                  <X className="size-4" />
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="u-name">Nom complet</Label>
                  <Input
                    id="u-name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Ex. Dr. Nom Prénom"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="u-email">Adresse e-mail</Label>
                  <Input
                    id="u-email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="prenom.nom@uy1.cm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="u-password">
                    {editingId ? "Nouveau mot de passe" : "Mot de passe initial"}
                  </Label>
                  <Input
                    id="u-password"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    minLength={8}
                    required={!editingId}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="u-role">Rôle</Label>
                  <Select
                    id="u-role"
                    value={form.role}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        role: e.target.value as UserRole,
                      }))
                    }
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="u-institution">Institution</Label>
                  <Select
                    id="u-institution"
                    value={form.institutionId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, institutionId: e.target.value }))
                    }
                    required
                  >
                    <option value="">Sélectionner une institution</option>
                    {availableInstitutions.map((institution) => (
                      <option key={institution.id} value={institution.id}>
                        {institution.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="u-status">Statut</Label>
                  <Select
                    id="u-status"
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        status: e.target.value as UserStatus,
                      }))
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit">
                  <Check className="size-4" />
                  {editingId ? "Enregistrer" : "Créer le compte"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filtres */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom, e-mail ou structure…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <div className="w-40">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filtrer par rôle"
            >
              <option value="all">Tous les rôles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-36">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filtrer par statut"
            >
              <option value="all">Tous statuts</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Cartes mobile */}
      <div className="grid gap-3 lg:hidden">
        {filtered.map((u) => (
          <Card key={u.id} className="p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {u.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{u.name}</p>
                <p className="truncate text-sm text-muted-foreground">{u.email}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant={roleVariant[u.role]}>{u.role}</Badge>
                  <Badge variant={statusVariant[u.status]}>{u.status}</Badge>
                </div>
              </div>
            </div>
            <dl className="mt-4 grid gap-2 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Institution</dt>
                <dd className="font-medium text-foreground">{u.structure}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Dernière activité</dt>
                <dd className="font-medium text-foreground">{u.lastActive}</dd>
              </div>
            </dl>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <Button variant="outline" size="sm" onClick={() => openEdit(u)}>
                <Pencil className="size-4" />
                Modifier
              </Button>
              <Button variant="outline" size="sm" onClick={() => toggleStatus(u.id)}>
                {u.status === "Suspendu" ? (
                  <RotateCcw className="size-4 text-success" />
                ) : (
                  <Ban className="size-4 text-[#b45309]" />
                )}
                {u.status === "Suspendu" ? "Réactiver" : "Suspendre"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => remove(u.id)}>
                <Trash2 className="size-4 text-destructive" />
                Supprimer
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Tableau desktop */}
      <Card className="hidden overflow-hidden py-0 lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Utilisateur</th>
                <th className="px-4 py-3 font-medium">Rôle</th>
                <th className="px-4 py-3 font-medium">Structure</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Dernière activité</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {u.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {u.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={roleVariant[u.role]}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.structure}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[u.status]}>{u.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.lastActive}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(u)}
                        title="Modifier"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleStatus(u.id)}
                        title={u.status === "Suspendu" ? "Réactiver" : "Suspendre"}
                      >
                        {u.status === "Suspendu" ? (
                          <RotateCcw className="size-4 text-success" />
                        ) : (
                          <Ban className="size-4 text-[#b45309]" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(u.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            Aucun utilisateur ne correspond aux filtres.
          </div>
        )}
      </Card>

      {filtered.length === 0 && (
        <div className="lg:hidden rounded-lg border border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
          Aucun utilisateur ne correspond aux filtres.
        </div>
      )}
    </>
  );
}

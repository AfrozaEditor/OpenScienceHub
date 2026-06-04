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
import {
  adminUsers,
  type AdminUser,
  type UserRole,
  type UserStatus,
} from "@/lib/admin-data";
import {
  createAdminUser,
  deleteAdminUser,
  listAdminUsers,
  messageForApiError,
  updateAdminUser,
  useApiResource,
  type CurrentUser,
} from "@/lib/api";

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

function listFrom<T>(data: { results: T[] } | T[]) {
  return Array.isArray(data) ? data : data.results;
}

function apiUserToAdminUser(user: CurrentUser): AdminUser {
  const role = user.is_superuser || user.is_staff ? "Administrateur" : "Déposant";
  return {
    id: user.id,
    name: user.full_name || user.email,
    email: user.email,
    role,
    structure: String(user.institution || "OpenScience Hub"),
    status: user.status === "SUSPENDED" ? "Suspendu" : "Actif",
    initials: initialsOf(user.full_name || user.email) || "OS",
    lastActive: "—",
  };
}

const emptyForm = {
  name: "",
  email: "",
  role: "Déposant" as UserRole,
  structure: "",
  status: "Actif" as UserStatus,
};

export default function AdminUsersPage() {
  const liveUsers = useApiResource(() => listAdminUsers(), [], null);
  const [users, setUsers] = React.useState<AdminUser[]>(adminUsers);
  const [query, setQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (liveUsers.data) setUsers(listFrom(liveUsers.data).map(apiUserToAdminUser));
  }, [liveUsers.data]);

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
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(u: AdminUser) {
    setForm({
      name: u.name,
      email: u.email,
      role: u.role,
      structure: u.structure,
      status: u.status,
    });
    setEditingId(u.id);
    setShowForm(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    if (editingId) {
      try {
        await updateAdminUser(editingId, {
          full_name: form.name,
          email: form.email,
          status: form.status === "Suspendu" ? "SUSPENDED" : "ACTIVE",
        });
      } catch (err) {
        setFeedback(messageForApiError(err));
        return;
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingId
            ? { ...u, ...form, initials: initialsOf(form.name) }
            : u
        )
      );
    } else {
      try {
        const created = await createAdminUser({
          full_name: form.name,
          email: form.email,
          password: crypto.randomUUID(),
          status: form.status === "Suspendu" ? "SUSPENDED" : "ACTIVE",
        });
        setUsers((prev) => [apiUserToAdminUser(created), ...prev]);
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
      </div>

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
                  <Label htmlFor="u-structure">Structure</Label>
                  <Input
                    id="u-structure"
                    value={form.structure}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, structure: e.target.value }))
                    }
                    placeholder="Ex. Faculté des Sciences"
                  />
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

      {/* Tableau */}
      <Card className="overflow-hidden py-0">
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
    </>
  );
}

"use client";

import * as React from "react";
import {
  Building2,
  Check,
  FileText,
  MapPin,
  Pencil,
  Plus,
  Power,
  Trash2,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { messageForApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/api/hooks";
import { createInstitution, deleteInstitution, listInstitutions, updateInstitution } from "@/lib/api/resources";
import type { Institution as ApiInstitution } from "@/lib/api/types";

const fr = new Intl.NumberFormat("fr-FR");
type Institution = {
  id: string;
  name: string;
  acronym: string;
  type: "Université" | "Grande École" | "Institut";
  city: string;
  emailDomain: string;
  license: string;
  status: "Active" | "Inactive";
  documents: number | null;
};
const TYPES: Institution["type"][] = ["Université", "Grande École", "Institut"];

const emptyForm = {
  name: "",
  acronym: "",
  type: "Université" as Institution["type"],
  city: "",
  emailDomain: "",
  license: "Standard",
  status: "Active" as Institution["status"],
};

export default function AdminInstitutionsPage() {
  const liveInstitutions = useApiResource(() => listInstitutions(), [], null);
  const [items, setItems] = React.useState<Institution[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!liveInstitutions.data) return;
    const rows = Array.isArray(liveInstitutions.data)
      ? liveInstitutions.data
      : liveInstitutions.data.results;
    setItems(rows.map(apiInstitutionToAdmin));
  }, [liveInstitutions.data]);

  React.useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(timer);
  }, [feedback]);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(i: Institution) {
    setForm({
      name: i.name,
      acronym: i.acronym,
      type: i.type,
      city: i.city,
      emailDomain: i.emailDomain,
      license: i.license,
      status: i.status,
    });
    setEditingId(i.id);
    setShowForm(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.acronym.trim()) return;
    setBusyId(editingId || "create");
    setFeedback(null);
    try {
      if (editingId) {
        const updated = await updateInstitution(editingId, formToApiInstitution(form));
        setItems((prev) =>
          prev.map((i) => (i.id === editingId ? apiInstitutionToAdmin(updated) : i))
        );
        setFeedback("Institution mise à jour.");
      } else {
        const created = await createInstitution(formToApiInstitution(form));
        setItems((prev) => [apiInstitutionToAdmin(created), ...prev]);
        setFeedback("Institution créée.");
      }
    } catch (err) {
      setFeedback(messageForApiError(err));
      return;
    } finally {
      setBusyId(null);
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function toggleStatus(item: Institution) {
    const nextStatus = item.status === "Active" ? "INACTIVE" : "ACTIVE";
    setBusyId(item.id);
    setFeedback(null);
    try {
      const updated = await updateInstitution(item.id, { status: nextStatus });
      setItems((prev) => prev.map((i) => (i.id === item.id ? apiInstitutionToAdmin(updated) : i)));
      setFeedback(nextStatus === "ACTIVE" ? "Institution activée." : "Institution désactivée.");
    } catch (err) {
      setFeedback(messageForApiError(err));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (typeof window !== "undefined" && !window.confirm("Supprimer cette institution ?"))
      return;
    setBusyId(id);
    setFeedback(null);
    try {
      await deleteInstitution(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setFeedback("Institution supprimée.");
    } catch (err) {
      setFeedback(messageForApiError(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Institutions"
        description="Gérez les établissements partenaires et leur configuration."
      >
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Nouvelle institution
        </Button>
      </AdminPageHeader>

      {feedback && (
        <div className="mb-5 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground">
          {feedback}
        </div>
      )}

      {showForm && (
        <Card className="mb-5 border-primary/30">
          <CardContent className="py-5">
            <form onSubmit={submit} className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-heading text-base font-semibold text-foreground">
                  {editingId ? "Modifier l'institution" : "Nouvelle institution"}
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
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="i-name">Nom de l'établissement</Label>
                  <Input
                    id="i-name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Ex. Nom officiel de l'établissement"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="i-acronym">Sigle</Label>
                  <Input
                    id="i-acronym"
                    value={form.acronym}
                    onChange={(e) => setForm((f) => ({ ...f, acronym: e.target.value }))}
                    placeholder="Ex. UY1"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="i-type">Type</Label>
                  <Select
                    id="i-type"
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, type: e.target.value as Institution["type"] }))
                    }
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="i-city">Ville</Label>
                  <Input
                    id="i-city"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    placeholder="Ex. Yaoundé"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="i-domain">Domaine e-mail</Label>
                  <Input
                    id="i-domain"
                    value={form.emailDomain}
                    onChange={(e) => setForm((f) => ({ ...f, emailDomain: e.target.value }))}
                    placeholder="Ex. uy1.cm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="i-license">Licence</Label>
                  <Input
                    id="i-license"
                    value={form.license}
                    onChange={(e) => setForm((f) => ({ ...f, license: e.target.value }))}
                    placeholder="Ex. Établissement (illimité)"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="i-status">Statut</Label>
                  <Select
                    id="i-status"
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, status: e.target.value as Institution["status"] }))
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={busyId !== null}>
                  <Check className="size-4" />
                  {busyId ? "Enregistrement..." : editingId ? "Enregistrer" : "Créer"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((i) => (
          <Card key={i.id} className="gap-0 py-5">
            <CardContent className="flex h-full flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 font-heading text-sm font-semibold text-brand">
                  {i.acronym.slice(0, 3)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{i.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline">{i.type}</Badge>
                    <Badge variant={i.status === "Active" ? "success" : "secondary"}>
                      {i.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <dl className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {i.city || "—"}
                  <span className="text-muted-foreground/50">·</span>
                  <span className="font-mono text-xs">@{i.emailDomain || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="size-3.5" />
                  {i.documents === null ? "Documents associés : —" : `${fr.format(i.documents)} documents`}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="size-3.5" />
                  {i.license}
                </div>
              </dl>

              <div className="mt-auto flex items-center gap-1 border-t border-border pt-3">
                <Button variant="outline" size="sm" onClick={() => openEdit(i)} disabled={busyId !== null}>
                  <Pencil className="size-3.5" />
                  Configurer
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleStatus(i)}
                  disabled={busyId !== null}
                  title={i.status === "Active" ? "Désactiver" : "Activer"}
                >
                  <Power
                    className={i.status === "Active" ? "size-4 text-success" : "size-4 text-muted-foreground"}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(i.id)}
                  disabled={busyId !== null}
                  title="Supprimer"
                  className="ml-auto"
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

function apiInstitutionToAdmin(item: ApiInstitution): Institution {
  return {
    id: item.id,
    name: item.name,
    acronym: item.short_name || item.name.slice(0, 6).toUpperCase(),
    type:
      item.type === "SCHOOL"
        ? "Grande École"
        : item.type === "INSTITUTE"
          ? "Institut"
          : "Université",
    city: item.city || "—",
    emailDomain: item.official_email?.split("@")[1] || "—",
    license: "Standard",
    status: item.status === "INACTIVE" ? "Inactive" : "Active",
    documents: null,
  };
}

function formToApiInstitution(form: typeof emptyForm): Partial<ApiInstitution> {
  const officialEmail = form.emailDomain.includes("@")
    ? form.emailDomain
    : form.emailDomain
      ? `contact@${form.emailDomain.replace(/^@/, "")}`
      : "";

  return {
    name: form.name.trim(),
    short_name: form.acronym.trim(),
    type:
      form.type === "Grande École"
        ? "SCHOOL"
        : form.type === "Institut"
          ? "INSTITUTE"
          : "UNIVERSITY",
    city: form.city.trim(),
    official_email: officialEmail,
    status: form.status === "Inactive" ? "INACTIVE" : "ACTIVE",
  };
}

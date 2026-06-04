"use client";

import * as React from "react";
import {
  BadgeCheck,
  Clock,
  FileBadge2,
  RefreshCw,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { proofs as initialProofs, proofsSummary, type Proof } from "@/lib/admin-data";

const fr = new Intl.NumberFormat("fr-FR");

type BadgeVariant = "success" | "warning" | "destructive";
const statusVariant: Record<Proof["status"], BadgeVariant> = {
  Vérifiée: "success",
  "En attente": "warning",
  Échec: "destructive",
};

const kpis = [
  { label: "Preuves émises", value: proofsSummary.emitted, icon: FileBadge2, cls: "bg-primary/10 text-primary" },
  { label: "Vérifiées", value: proofsSummary.verified, icon: ShieldCheck, cls: "bg-success/12 text-success" },
  { label: "En attente", value: proofsSummary.pending, icon: Clock, cls: "bg-warning/15 text-[#b45309]" },
  { label: "Échecs", value: proofsSummary.failed, icon: XCircle, cls: "bg-destructive/10 text-destructive" },
];

export default function AdminProofsPage() {
  const [items, setItems] = React.useState<Proof[]>(initialProofs);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 3000);
    return () => clearTimeout(t);
  }, [feedback]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((p) => {
      const matchesQuery =
        !q ||
        p.document.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.hash.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [items, query, statusFilter]);

  function reverify(id: string) {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Vérifiée" } : p))
    );
    setFeedback("Preuve re-vérifiée : intégrité confirmée.");
  }

  return (
    <>
      <AdminPageHeader
        title="Preuves & vérifications"
        description="Suivi des preuves d'authenticité et journal de vérification."
      >
        <Badge variant="outline">
          <ShieldCheck className="size-3 text-success" />
          Intégrité e-IDStack
        </Badge>
      </AdminPageHeader>

      {feedback && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-sm text-foreground">
          <BadgeCheck className="size-4 text-success" />
          {feedback}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="gap-0 py-5">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{k.label}</p>
                <p className="mt-1 font-heading text-2xl font-semibold text-foreground">
                  {fr.format(k.value)}
                </p>
              </div>
              <span className={`flex size-11 items-center justify-center rounded-lg ${k.cls}`}>
                <k.icon className="size-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtres */}
      <div className="mt-6 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par document, identifiant ou empreinte…"
            className="pl-9"
          />
        </div>
        <div className="w-44">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filtrer par statut"
          >
            <option value="all">Tous statuts</option>
            <option value="Vérifiée">Vérifiée</option>
            <option value="En attente">En attente</option>
            <option value="Échec">Échec</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden py-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Preuve</th>
                <th className="px-4 py-3 font-medium">Document</th>
                <th className="px-4 py-3 font-medium">Empreinte</th>
                <th className="px-4 py-3 font-medium">Émise le</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                    {p.id}
                  </td>
                  <td className="px-4 py-3 text-foreground">{p.document}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                    {p.hash}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {p.emittedAt}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.status === "Vérifiée" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-success">
                        <BadgeCheck className="size-3.5" />
                        Intègre
                      </span>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => reverify(p.id)}>
                        <RefreshCw className="size-3.5" />
                        Re-vérifier
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            Aucune preuve ne correspond aux filtres.
          </div>
        )}
      </Card>
    </>
  );
}

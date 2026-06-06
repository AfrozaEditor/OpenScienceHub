"use client";

import * as React from "react";
import { Lock, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useApiResource } from "@/lib/api/hooks";
import { getAdminAudit } from "@/lib/api/resources";

type AuditSeverity = "info" | "warning" | "critical";
type UserRole = "Administrateur";

type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "brand"
  | "ai"
  | "success"
  | "warning"
  | "destructive";

const severityVariant: Record<AuditSeverity, BadgeVariant> = {
  info: "secondary",
  warning: "warning",
  critical: "destructive",
};

const severityLabel: Record<AuditSeverity, string> = {
  info: "Info",
  warning: "Avertissement",
  critical: "Critique",
};

const roleVariant: Record<UserRole, BadgeVariant> = {
  Administrateur: "brand",
};

export default function AdminAuditPage() {
  const [query, setQuery] = React.useState("");
  const [severity, setSeverity] = React.useState<string>("all");
  const audit = useApiResource(() => getAdminAudit(), [], null);
  const liveRows = React.useMemo(
    () =>
      (Array.isArray(audit.data) ? audit.data : audit.data?.results || []).map((event) => ({
        id: String(event.id),
        time: String(event.created_at || ""),
        actor: String(event.actor || "Système"),
        role: "Administrateur" as UserRole,
        action: String(event.action_type || event.module || "Événement"),
        target: String(event.comment || event.object_status || "OpenScience Hub"),
        ip: String(event.ip_address || "—"),
        severity:
          String(event.severity || "").toLowerCase() === "critical"
            ? ("critical" as AuditSeverity)
            : String(event.severity || "").toLowerCase() === "warning"
              ? ("warning" as AuditSeverity)
              : ("info" as AuditSeverity),
      })) || [],
    [audit.data],
  );
  const source = liveRows;

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return source.filter((e) => {
      const matchesQuery =
        !q ||
        e.actor.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        e.target.toLowerCase().includes(q) ||
        e.ip.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q);
      const matchesSeverity = severity === "all" || e.severity === severity;
      return matchesQuery && matchesSeverity;
    });
  }, [query, severity, source]);

  const criticalCount = source.filter((e) => e.severity === "critical").length;
  const warningCount = source.filter((e) => e.severity === "warning").length;

  return (
    <>
      <AdminPageHeader
        title="Audit système"
        description="Journal horodaté des actions et événements. Consultation en lecture seule."
      >
        <Badge variant="outline">
          <Lock className="size-3" />
          Lecture seule
        </Badge>
      </AdminPageHeader>

      {/* Résumé */}
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-muted-foreground">
          {audit.loading ? "Chargement..." : `${source.length} événements`}
        </span>
        <Badge variant="destructive">{criticalCount} critiques</Badge>
        <Badge variant="warning">{warningCount} avertissements</Badge>
      </div>

      {/* Filtres */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par acteur, action, cible ou IP…"
            className="pl-9"
          />
        </div>
        <div className="w-44">
          <Select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            aria-label="Filtrer par sévérité"
          >
            <option value="all">Toutes sévérités</option>
            <option value="info">Info</option>
            <option value="warning">Avertissement</option>
            <option value="critical">Critique</option>
          </Select>
        </div>
      </div>

      {/* Journal */}
      <Card className="overflow-hidden py-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Horodatage</th>
                <th className="px-4 py-3 font-medium">Acteur</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Cible</th>
                <th className="px-4 py-3 font-medium">IP</th>
                <th className="px-4 py-3 font-medium">Sévérité</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                    {e.time}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{e.actor}</p>
                    <Badge
                      variant={roleVariant[e.role]}
                      className="mt-1"
                    >
                      {e.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-foreground">{e.action}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.target}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                    {e.ip}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={severityVariant[e.severity]}>
                      {severityLabel[e.severity]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            Aucun événement ne correspond aux filtres.
          </div>
        )}
      </Card>
    </>
  );
}

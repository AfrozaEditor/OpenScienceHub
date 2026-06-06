"use client";

import * as React from "react";
import { AlertTriangle, Clock, ExternalLink, FileBadge2, ShieldCheck, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useApiResource } from "@/lib/api/hooks";
import { getAdminDashboard, getAdminProofs } from "@/lib/api/resources";
import type { AdminProof } from "@/lib/api/types";

const fr = new Intl.NumberFormat("fr-FR");
const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

function shortHash(value?: string) {
  if (!value) return "—";
  return value.length > 18 ? `${value.slice(0, 12)}…${value.slice(-6)}` : value;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateTime.format(date);
}

function proofStatusLabel(value?: string | null) {
  switch (value) {
    case "ACTIVE":
      return "Active";
    case "REVOKED":
      return "Révoquée";
    case "PENDING":
      return "En attente";
    case "ERROR":
      return "Erreur";
    default:
      return value || "—";
  }
}

function verificationHref(proof: AdminProof) {
  if (proof.proof_code) return `/verify/${encodeURIComponent(proof.proof_code)}`;
  if (!proof.verification_url) return "";
  try {
    const url = new URL(proof.verification_url);
    const match = url.pathname.match(/\/verify\/([^/]+)$/);
    if (match?.[1]) return `/verify/${encodeURIComponent(match[1])}`;
  } catch {
    if (proof.verification_url.startsWith("/verify/")) return proof.verification_url;
  }
  return proof.verification_url;
}

export default function AdminProofsPage() {
  const dashboard = useApiResource(() => getAdminDashboard(), [], null);
  const proofs = useApiResource(() => getAdminProofs({ limit: 100 }), [], null);
  const kpis = dashboard.data?.kpis || {};
  const emitted = Number(kpis.proofs_total || kpis.issued_proofs || 0);
  const verified = Number(kpis.verification_valid_checks || kpis.verified_proofs || 0);
  const pending = Number(kpis.proofs_pending || kpis.pending_proofs || 0);
  const failed = Number(kpis.verification_failed_checks || kpis.failed_proofs || 0);
  const mismatches = Number(kpis.proof_hash_mismatches || 0);
  const rows = proofs.data?.results || [];

  return (
    <>
      <AdminPageHeader
        title="Preuves et vérifications"
        description="Suivi des preuves d'authenticité liées aux archives finales."
      >
        <Badge variant="outline">
          <ShieldCheck className="size-3 text-success" />
          Registre de confiance
        </Badge>
      </AdminPageHeader>
      {(dashboard.error || proofs.error) && (
        <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {dashboard.error || proofs.error}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Preuves émises" value={emitted} icon={FileBadge2} cls="bg-primary/10 text-primary" />
        <Kpi label="Vérifiées" value={verified} icon={ShieldCheck} cls="bg-success/12 text-success" />
        <Kpi label="En attente" value={pending} icon={Clock} cls="bg-warning/15 text-[#b45309]" />
        <Kpi label={mismatches ? "Hash incohérents" : "Échecs"} value={mismatches || failed} icon={mismatches ? AlertTriangle : XCircle} cls="bg-destructive/10 text-destructive" />
      </div>
      <div className="mt-6 grid gap-3">
        {proofs.loading ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">Chargement des preuves...</CardContent>
          </Card>
        ) : rows.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">Aucune preuve disponible dans ce périmètre.</CardContent>
          </Card>
        ) : (
          rows.map((proof) => <ProofRow key={proof.id || proof.proof_code} proof={proof} />)
        )}
      </div>
    </>
  );
}

function Kpi({
  label,
  value,
  icon: Icon,
  cls,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  cls: string;
}) {
  return (
    <Card className="gap-0 py-5">
      <CardContent className="flex items-center gap-3">
        <span className={`flex size-11 items-center justify-center rounded-lg ${cls}`}>
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-heading text-2xl font-semibold text-foreground">{fr.format(value)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ProofRow({ proof }: { proof: AdminProof }) {
  const hashOk = proof.hashes_match !== false;
  const active = proof.status === "ACTIVE";
  const href = verificationHref(proof);
  return (
    <Card className="gap-0">
      <CardContent className="grid gap-4 py-4 lg:grid-cols-[1.4fr_1fr_auto] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={active ? "default" : "secondary"}>{proofStatusLabel(proof.status)}</Badge>
            <Badge variant={hashOk ? "outline" : "destructive"}>
              {hashOk ? "Empreinte cohérente" : "Empreinte incohérente"}
            </Badge>
            {proof.is_mock ? <Badge variant="secondary">À réémettre</Badge> : null}
          </div>
          <h3 className="mt-2 truncate font-heading text-base font-semibold text-foreground">
            {proof.work?.title || proof.proof_code || "Preuve"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {proof.work?.reference_code || "Sans référence"} · {proof.work?.institution || "Institution non renseignée"}
          </p>
        </div>
        <div className="grid gap-1 text-sm text-muted-foreground">
          <Meta label="Preuve" value={proof.proof_code} />
          <Meta label="Identifiant" value={proof.credential_id || "—"} />
          <Meta label="Émetteur" value={proof.issuer_did || "—"} />
          <Meta label="Hash" value={shortHash(proof.document_hash)} />
          <Meta label="Émise" value={formatDate(proof.issued_at)} />
        </div>
        <div className="flex justify-start lg:justify-end">
          {href ? (
            <Button variant="outline" size="sm" asChild>
              <a href={href} target="_blank" rel="noreferrer">
                Vérifier
                <ExternalLink className="size-4" />
              </a>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function Meta({ label, value }: { label: string; value?: string | null }) {
  return (
    <p className="grid grid-cols-[88px_1fr] gap-2">
      <span className="text-muted-foreground/75">{label}</span>
      <span className="truncate font-medium text-foreground">{value || "—"}</span>
    </p>
  );
}

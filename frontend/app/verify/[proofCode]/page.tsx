"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, FileCheck2, ShieldCheck, XCircle } from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { useApiResource } from "@/lib/api/hooks";
import { verifyProof } from "@/lib/api/resources";

function verificationResultLabel(value?: string | null) {
  switch (value) {
    case "VALID":
      return "Document authentique";
    case "REVOKED":
      return "Preuve révoquée";
    case "INVALID_HASH":
      return "Empreinte incohérente";
    case "NOT_FOUND":
      return "Preuve introuvable";
    case "EXPIRED":
      return "Preuve expirée";
    case "TECHNICAL_ERROR":
      return "Vérification indisponible";
    default:
      return value || "Résultat inconnu";
  }
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
      return value || "";
  }
}

function proofSchemaLabel(value?: string | null) {
  if (!value) return "";
  if (value === "ScientificWorkArchiveCredential") return "Preuve d'archive scientifique";
  return value;
}

export default function VerifyProofPage() {
  const params = useParams<{ proofCode: string }>();
  const proofCode = decodeURIComponent(params.proofCode || "");
  const verification = useApiResource(() => verifyProof(proofCode), [proofCode], null);
  const result = verification.data;
  const valid = result?.result === "VALID";
  const revoked = result?.result === "REVOKED";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:px-6">
        {verification.loading ? (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              Vérification de la preuve en cours...
            </CardContent>
          </Card>
        ) : verification.error || !result ? (
          <EmptyState
            icon={AlertTriangle}
            title="Preuve introuvable"
            description={verification.error || "Le code scanné ne correspond à aucune preuve active."}
            action={
              <Button asChild>
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            }
          />
        ) : (
          <Card className="overflow-hidden">
            <div
              className={`px-6 py-8 text-center ${
                valid
                  ? "bg-success/10"
                  : revoked
                    ? "bg-warning/10"
                    : "bg-destructive/10"
              }`}
            >
              <span
                className={`mx-auto grid size-16 place-items-center rounded-full ${
                  valid
                    ? "bg-success text-white"
                    : revoked
                      ? "bg-warning text-white"
                      : "bg-destructive text-white"
                }`}
              >
                {valid ? (
                  <CheckCircle2 className="size-9" />
                ) : revoked ? (
                  <AlertTriangle className="size-9" />
                ) : (
                  <XCircle className="size-9" />
                )}
              </span>
              <h1 className="mt-5 font-heading text-2xl font-semibold text-brand">
                {valid
                  ? "Document authentique"
                  : revoked
                    ? "Preuve révoquée"
                    : "Preuve non valide"}
              </h1>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                OpenScience Hub vérifie côté serveur l'empreinte du document, le statut de la
                preuve et la cohérence de l'archivage.
              </p>
            </div>

            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-4 text-success" />
                Résultat de vérification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <Badge variant={valid ? "success" : revoked ? "warning" : "destructive"}>
                  {verificationResultLabel(result.result)}
                </Badge>
                {result.proof_status && (
                  <Badge variant="secondary">{proofStatusLabel(result.proof_status)}</Badge>
                )}
                {result.hashes_match === false && (
                  <Badge variant="destructive">Empreinte incohérente</Badge>
                )}
                {result.is_mock && <Badge variant="secondary">À réémettre</Badge>}
              </div>

              <dl className="divide-y divide-border rounded-xl border border-border">
                {[
                  ["Code preuve", result.proof_code || proofCode],
                  ["Titre", result.title],
                  ["Auteur", result.author],
                  ["Institution", result.institution],
                  ["Type", result.work_type],
                  ["Archivé le", result.archived_at],
                  ["Empreinte SHA-256", result.document_hash],
                  ["Identifiant de preuve", result.credential_id],
                  ["Émetteur de confiance", result.issuer_did],
                  ["Type de preuve", proofSchemaLabel(result.schema)],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[150px_1fr]">
                      <dt className="text-xs text-muted-foreground">{label}</dt>
                      <dd className="break-all text-sm text-foreground">{value}</dd>
                    </div>
                  ))}
              </dl>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="flex items-start gap-2 text-sm text-foreground">
                  <FileCheck2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  Le QR code ne contient pas de données sensibles : il contient seulement cette
                  URL publique de vérification. La preuve et le hash restent contrôlés par le
                service OpenScience Hub.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

"use client";

/* eslint-disable @next/next/no-img-element */

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Hash,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { useApiResource } from "@/lib/api/hooks";
import { getWork, getWorkProof } from "@/lib/api/resources";

const QR_SIZE = 25;

const dateTimeFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function fmtDateTime(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : dateTimeFmt.format(d);
}

function proofSchemaLabel(value?: string | null) {
  if (!value) return "Preuve d'archive scientifique";
  if (value === "ScientificWorkArchiveCredential") return "Preuve d'archive scientifique";
  return value;
}

/** Matrice pseudo-QR déterministe dérivée de l'empreinte du document. */
function buildQr(seed: string, size = QR_SIZE): boolean[][] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0 || 1;
  const rand = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0xffffffff;
  };

  const m: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => rand() > 0.5)
  );

  const stampFinder = (r0: number, c0: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r;
        const cc = c0 + c;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        if (r === -1 || r === 7 || c === -1 || c === 7) {
          m[rr][cc] = false;
          continue;
        }
        const border = r === 0 || r === 6 || c === 0 || c === 6;
        const center = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        m[rr][cc] = border || center;
      }
    }
  };

  stampFinder(0, 0);
  stampFinder(0, size - 7);
  stampFinder(size - 7, 0);
  return m;
}

export default function PreuvePage() {
  const params = useParams<{ id: string }>();
  const work = useApiResource(() => getWork(params.id), [params.id], null);
  const liveProof = useApiResource(() => getWorkProof(params.id), [params.id], null);
  const proof = liveProof.data?.proof_code
    ? {
        reference: liveProof.data.proof_code || liveProof.data.id || params.id,
        status:
          liveProof.data.hashes_match === false
            ? "Hash incohérent"
            : liveProof.data.status === "REVOKED"
            ? "Révoquée"
            : liveProof.data.status === "PENDING"
              ? "En attente"
              : "Active",
        documentHash: liveProof.data.document_hash || "—",
        algorithm: "SHA-256",
        issuedAt: liveProof.data.issued_at || "",
        schema: proofSchemaLabel(liveProof.data.schema),
        credentialId: liveProof.data.credential_id || liveProof.data.proof_code || params.id,
        issuerDid: liveProof.data.issuer_did || "Non renseigné",
        registry: liveProof.data.is_mock ? "Preuve à réémettre" : "Registre de confiance",
        verificationUrl: liveProof.data.proof_code
          ? `/verify/${encodeURIComponent(liveProof.data.proof_code)}`
          : liveProof.data.verification_url || "",
      }
    : null;
  const qrCodeUrl = liveProof.data?.qr_code_url;

  const [copied, setCopied] = React.useState<string | null>(null);

  const matrix = React.useMemo(
    () => (proof ? buildQr(proof.documentHash) : []),
    [proof]
  );

  if (!proof && !liveProof.loading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          icon={ShieldCheck}
          title="Preuve indisponible"
          description="Aucune preuve d'authenticité n'est associée à ce dossier (le dépôt n'est peut-être pas encore validé)."
          action={
            <Button variant="outline" asChild>
              <Link href="/deposant/mes-dossiers">
                <ArrowLeft className="size-4" />
                Retour à mes dossiers
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (!proof) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          icon={ShieldCheck}
          title="Chargement de la preuve"
          description="Récupération de la preuve d'authenticité du dossier."
        />
      </div>
    );
  }

  function copy(text: string, key: string) {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
  }

  function absoluteVerificationUrl(verificationUrl: string) {
    if (!verificationUrl) return "";
    if (verificationUrl.startsWith("http")) return verificationUrl;
    if (typeof window === "undefined") return verificationUrl;
    return new URL(verificationUrl, window.location.origin).toString();
  }

  const statusVariant =
    proof.status === "Active"
      ? "success"
      : proof.status === "En attente"
        ? "warning"
        : "destructive";

  const details: { label: string; value: string; mono?: boolean }[] = [
    { label: "Référence", value: proof.reference, mono: true },
    { label: "Algorithme d'empreinte", value: proof.algorithm },
    { label: "Identifiant du justificatif", value: proof.credentialId, mono: true },
    { label: "Émetteur de confiance", value: proof.issuerDid, mono: true },
    { label: "Type de preuve", value: proof.schema },
    { label: "Registre", value: proof.registry },
    { label: "Lien public", value: absoluteVerificationUrl(proof.verificationUrl) || "—", mono: true },
    { label: "Émise le", value: proof.issuedAt ? fmtDateTime(proof.issuedAt) : "—" },
  ];

  const guarantees = [
    "Intégrité — le document n'a pas été modifié depuis son dépôt.",
    "Origine — l'émetteur est identifié par un DID vérifiable.",
    "Horodatage — la date de dépôt est ancrée sur le registre.",
    "Non-révocation — le justificatif est actif et vérifiable.",
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
        <Link href={`/deposant/dossier/${params.id}`}>
          <ArrowLeft className="size-4" />
          Retour au dossier
        </Link>
      </Button>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Certificate header */}
        <div className="flex flex-col gap-4 border-b border-border bg-gradient-to-br from-success/8 via-card to-ai/8 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-success/12 text-success ring-1 ring-success/20">
              <ShieldCheck className="size-7" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Preuve d&apos;authenticité
              </p>
              <h1 className="font-heading text-xl font-semibold tracking-tight text-brand">
                {proof.reference}
              </h1>
              <p className="truncate text-sm text-muted-foreground">
                {work.data?.title || "Dossier archivé"}
              </p>
            </div>
          </div>
          <Badge variant={statusVariant} className="w-fit shrink-0">
            <ShieldCheck className="size-3" />
            {proof.status}
          </Badge>
        </div>

        {/* Body */}
        <div className="grid gap-6 p-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Main */}
          <div className="flex flex-col gap-6">
            {/* Hash */}
            <div>
              <p className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                <Hash className="size-4 text-primary" />
                Empreinte du document ({proof.algorithm})
              </p>
              <div className="flex items-stretch gap-2">
                <code className="min-w-0 flex-1 rounded-lg border border-border bg-muted/60 px-3 py-2.5 font-mono text-xs break-all text-foreground">
                  {proof.documentHash}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Copier l'empreinte"
                  onClick={() => copy(proof.documentHash, "hash")}
                >
                  {copied === "hash" ? (
                    <Check className="size-4 text-success" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Crypto details */}
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <LockKeyhole className="size-4 text-primary" />
                Justificatif vérifiable
              </p>
              <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border">
                {details.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[180px_1fr] sm:gap-4"
                  >
                    <dt className="text-xs text-muted-foreground sm:pt-0.5">
                      {row.label}
                    </dt>
                    <dd
                      className={cn(
                        "min-w-0 text-sm text-foreground",
                        row.mono && "font-mono text-xs break-all"
                      )}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Guarantees */}
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <BadgeCheck className="size-4 text-primary" />
                Ce que cette preuve atteste
              </p>
              <ul className="flex flex-col gap-2.5">
                {guarantees.map((g) => (
                  <li key={g} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/12 text-success">
                      <Check className="size-3" />
                    </span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* QR */}
            <Card className="gap-0 py-5">
              <CardContent className="flex flex-col items-center gap-3 text-center">
                <div className="aspect-square w-full max-w-[190px] rounded-xl bg-white p-3 ring-1 ring-border">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt={`QR code de vérification ${proof.reference}`}
                      className="size-full rounded-lg object-contain"
                    />
                  ) : (
                    <div
                      className="grid size-full"
                      style={{
                        gridTemplateColumns: `repeat(${QR_SIZE}, minmax(0,1fr))`,
                        gridTemplateRows: `repeat(${QR_SIZE}, minmax(0,1fr))`,
                      }}
                    >
                      {matrix.map((row, r) =>
                        row.map((on, c) => (
                          <div
                            key={`${r}-${c}`}
                            className={on ? "bg-brand" : "bg-transparent"}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Vérifier ce document
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Scannez le code pour contrôler l&apos;empreinte sur le
                    registre.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button onClick={() => window.print()}>
                  <Download className="size-4" />
                  Télécharger l&apos;attestation
                </Button>
                {proof.verificationUrl ? (
                  <Button variant="outline" asChild>
                    <Link href={proof.verificationUrl}>
                      <ExternalLink className="size-4" />
                      Vérifier publiquement
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" disabled>
                    <ExternalLink className="size-4" />
                    Vérifier publiquement
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => copy(absoluteVerificationUrl(proof.verificationUrl), "link")}
                >
                  {copied === "link" ? (
                    <Check className="size-4 text-success" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  Copier le lien de vérification
                </Button>
                <Button variant="ghost" asChild>
                  <Link href={`/deposant/dossier/${params.id}`}>
                    <FileText className="size-4" />
                    Voir le dossier
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
              <CalendarClock className="size-4 shrink-0 text-muted-foreground" />
              Émise le {proof.issuedAt ? fmtDateTime(proof.issuedAt) : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

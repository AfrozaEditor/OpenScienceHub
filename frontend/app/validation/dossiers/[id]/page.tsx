"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  BadgeCheck,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  FileText,
  Gavel,
  Hash,
  History,
  Info,
  MessageSquarePlus,
  QrCode,
  Sparkles,
  UserCheck,
  UserPlus,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PortalModal } from "@/components/validation/portal-modal";
import {
  archiveChecklist,
  buildAiAnalysis,
  buildMetadataRows,
  buildWorkflowEvents,
  decisionChecklist,
  fieldOptions,
  type Correction,
  type Dossier,
  type DossierState,
  type EventType,
  type FieldStatus,
  type Priority,
  type Recommendation,
  type Review,
  type WorkflowEvent,
} from "@/lib/validation-data";
import { useAuth } from "@/components/auth-provider";
import { messageForApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/api/hooks";
import { workToScientificDocument } from "@/lib/api/mappers";
import { addCorrection as apiAddCorrection, addReview as apiAddReview, archiveWork, assignWork, decideWork, getWork, getWorkProof, listCorrections, listDocuments, listReviews, validateWorkMetadata } from "@/lib/api/resources";

/* ------------------------------ variant maps ----------------------------- */

const priorityVariant: Record<Priority, "destructive" | "default" | "secondary"> = {
  Haute: "destructive",
  Normale: "default",
  Basse: "secondary",
};

const stateVariant: Record<DossierState, "warning" | "default" | "ai" | "success" | "destructive"> = {
  "À traiter": "warning",
  "En cours": "default",
  "En correction": "ai",
  Validé: "success",
  Rejeté: "destructive",
};

const typeVariant: Record<string, "default" | "thesis" | "ai" | "secondary"> = {
  Mémoire: "default",
  Thèse: "thesis",
  Article: "ai",
  Rapport: "secondary",
};

const fieldStatusVariant: Record<FieldStatus, "success" | "warning" | "ai"> = {
  Conforme: "success",
  "À vérifier": "warning",
  Corrigé: "ai",
};

const recommendationVariant: Record<Recommendation, "success" | "warning" | "destructive"> = {
  Accepter: "success",
  "Accepter avec corrections": "warning",
  Rejeter: "destructive",
};

const TABS = [
  { key: "document", label: "Document", icon: FileText },
  { key: "metadonnees", label: "Métadonnées", icon: Hash },
  { key: "analyse", label: "Analyse IA", icon: Sparkles },
  { key: "avis", label: "Avis", icon: MessageSquarePlus },
  { key: "corrections", label: "Corrections", icon: Wrench },
  { key: "decision", label: "Décision", icon: Gavel },
  { key: "archivage", label: "Archivage", icon: Archive },
  { key: "historique", label: "Historique", icon: History },
] as const;

const TAB_KEYS = TABS.map((t) => t.key) as string[];

const STAGES = ["Soumis", "Examen", "Décision", "Archivage"];

const eventDot: Record<EventType, string> = {
  submit: "bg-primary",
  ai: "bg-ai",
  assign: "bg-muted-foreground",
  review: "bg-success",
  correction: "bg-warning",
  decision: "bg-brand",
  archive: "bg-success",
};

/* -------------------------------------------------------------------------- */

function DetailInner() {
  const params = useParams();
  const search = useSearchParams();
  const id = String(params.id ?? "");
  const { user } = useAuth();
  const liveWork = useApiResource(() => getWork(id), [id], null);
  const liveDocuments = useApiResource(() => listDocuments(id), [id], []);
  const liveReviews = useApiResource(() => listReviews(id), [id], []);
  const liveCorrections = useApiResource(() => listCorrections(id), [id], []);
  const liveDoc = liveWork.data ? workToScientificDocument(liveWork.data) : undefined;
  const liveDossier = React.useMemo<Dossier | undefined>(() => {
    if (!liveWork.data) return undefined;
    const submitted = liveWork.data.submitted_at ? new Date(liveWork.data.submitted_at) : null;
    const ageDays = submitted
      ? Math.max(0, Math.floor((Date.now() - submitted.getTime()) / 86_400_000))
      : 0;
    const state: DossierState =
      liveWork.data.status === "REJETE"
        ? "Rejeté"
        : ["VALIDE", "VALIDE_APRES_SOUTENANCE", "ACCEPTED", "PUBLISHED", "ARCHIVABLE", "ARCHIVE"].includes(liveWork.data.status)
          ? "Validé"
          : ["CORRECTION_DEMANDEE", "REVISION_REQUESTED", "CORRECTION_POST_SOUTENANCE"].includes(liveWork.data.status)
            ? "En correction"
            : "À traiter";
    return {
      id: liveWork.data.id,
      workSlug: liveWork.data.id,
      priority: ageDays > 3 ? "Haute" : "Normale",
      state,
      assignee: null,
      slaDays: 7,
      ageDays,
      versionHash: liveWork.data.reference_code || liveWork.data.id.slice(0, 12),
    };
  }, [liveWork.data]);
  const dossier = liveDossier;
  const doc = liveDoc;
  const reviewerName = user?.full_name || user?.email || "Validateur";

  const initialTab =
    TAB_KEYS.includes(search.get("tab") ?? "") ? (search.get("tab") as string) : "document";

  const [tab, setTab] = React.useState(initialTab);
  const [state, setState] = React.useState<DossierState>(dossier?.state ?? "À traiter");
  const [assignee, setAssignee] = React.useState<string | null>(dossier?.assignee ?? null);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [corrections, setCorrections] = React.useState<Correction[]>([]);
  const [events, setEvents] = React.useState<WorkflowEvent[]>(() =>
    dossier && doc ? buildWorkflowEvents(dossier, doc) : []
  );

  const [metaValidated, setMetaValidated] = React.useState(false);
  const [revRecommendation, setRevRecommendation] =
    React.useState<Recommendation>("Accepter");
  const [revComment, setRevComment] = React.useState("");
  const [corrField, setCorrField] = React.useState(fieldOptions[0]);
  const [corrRequest, setCorrRequest] = React.useState("");

  const [decisionOpen, setDecisionOpen] = React.useState(false);
  const [decisionChoice, setDecisionChoice] = React.useState<"Valider" | "Rejeter" | null>(null);
  const [decisionComment, setDecisionComment] = React.useState("");
  const [decisionChecks, setDecisionChecks] = React.useState<boolean[]>(
    () => decisionChecklist.map(() => false)
  );

  const [archiveOpen, setArchiveOpen] = React.useState(false);
  const [archiveChecks, setArchiveChecks] = React.useState<boolean[]>(
    () => archiveChecklist.map(() => false)
  );
  const [archiveOptions, setArchiveOptions] = React.useState({
    preuve: true,
    qr: true,
    publication: true,
  });
  const [proof, setProof] = React.useState<{ hash: string; at: string } | null>(null);
  const documentVersions = React.useMemo(
    () => (Array.isArray(liveDocuments.data) ? liveDocuments.data : []),
    [liveDocuments.data],
  );
  const examinedVersion = React.useMemo(() => {
    const sorted = [...documentVersions].sort((a, b) => b.version_number - a.version_number);
    return (
      sorted.find((version) => version.is_final) ||
      sorted.find((version) => version.status === "ARCHIVED" || version.status === "FINAL") ||
      sorted[0] ||
      null
    );
  }, [documentVersions]);
  const examinedHash = examinedVersion?.sha256_hash || dossier?.versionHash || "";
  const examinedPageCount = examinedVersion?.page_count ?? doc?.pages ?? 0;
  const examinedFileName = examinedVersion?.file_name || (doc ? `${doc.title}.pdf` : "document.pdf");
  const examinedFileUrl = React.useMemo(() => {
    const file = examinedVersion?.file;
    if (!file) return "";
    if (file.startsWith("http://") || file.startsWith("https://")) return file;
    return file.startsWith("/") ? file : `/${file}`;
  }, [examinedVersion?.file]);

  const [flash, setFlash] = React.useState<string | null>(null);
  const flashTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const notify = React.useCallback((msg: string) => {
    setFlash(msg);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 3200);
  }, []);
  React.useEffect(() => () => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
  }, []);

  React.useEffect(() => {
    if (!dossier) return;
    setState(dossier.state);
    setAssignee(dossier.assignee);
  }, [dossier]);

  React.useEffect(() => {
    const rows = Array.isArray(liveReviews.data) ? liveReviews.data : [];
    setReviews(
      rows.map((row) => {
        const recommendation = String(row.recommendation || "");
        return {
          id: String(row.id || crypto.randomUUID()),
          reviewer: String(row.author || row.reviewer || "Validateur"),
          date: String(row.created_at || "—"),
          recommendation: recommendation.includes("REJECT")
            ? "Rejeter"
            : recommendation.includes("CORRECTION") || recommendation.includes("REVISION")
              ? "Accepter avec corrections"
              : "Accepter",
          comment: String(row.comment || row.public_comment || ""),
        };
      }),
    );
  }, [liveReviews.data]);

  React.useEffect(() => {
    const rows = Array.isArray(liveCorrections.data) ? liveCorrections.data : [];
    setCorrections(
      rows.map((row) => {
        const message = String(row.message || "");
        const [field, ...rest] = message.split(":");
        return {
          id: String(row.id || crypto.randomUUID()),
          field: rest.length ? field : String(row.type || "Correction"),
          request: rest.length ? rest.join(":").trim() : message,
          status: row.status === "VALIDATED" || row.status === "ANSWERED" ? "Résolue" : "Ouverte",
        };
      }),
    );
  }, [liveCorrections.data]);

  React.useEffect(() => {
    if (dossier && doc) setEvents(buildWorkflowEvents(dossier, doc));
  }, [dossier, doc]);

  if (!dossier && liveWork.loading) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <CardContent className="py-10">
          <p className="text-sm text-muted-foreground">Chargement du dossier...</p>
        </CardContent>
      </Card>
    );
  }

  if (!dossier || !doc) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <CardContent className="py-10">
          <p className="font-heading text-lg font-semibold text-foreground">
            Dossier introuvable
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ce dossier n&apos;existe pas ou a été archivé.
          </p>
          <Button variant="outline" asChild className="mt-5">
            <Link href="/validation/a-traiter">
              <ArrowLeft className="size-4" />
              Retour à l&apos;inbox
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const metaRows = buildMetadataRows(doc);
  const ai = buildAiAnalysis(doc);
  const docFileSize = "fileSize" in doc ? String(doc.fileSize) : "3,2 Mo";
  const mine = assignee === reviewerName;
  const stageIndex =
    state === "À traiter"
      ? 0
      : state === "En cours" || state === "En correction"
        ? 1
        : state === "Rejeté"
          ? 2
          : 3;
  const decided = state === "Validé" || state === "Rejeté";

  function pushEvent(label: string, type: EventType) {
    setEvents((prev) => [
      ...prev,
      { date: "À l'instant", label, actor: reviewerName, type },
    ]);
  }

  async function assignToMe() {
    if (liveWork.data && user?.id) {
      try {
        await assignWork(liveWork.data.id, {
          assignment_type: "PEER_REVIEW",
          assignee: user.id,
          status: "IN_PROGRESS",
        });
      } catch (err) {
        notify(messageForApiError(err));
        return;
      }
    }
    setAssignee(reviewerName);
    setState((s) => (s === "À traiter" ? "En cours" : s));
    pushEvent(`Dossier affecté à ${reviewerName}`, "assign");
    notify("Dossier assigné. Vous en êtes le validateur.");
  }

  async function validateMetadata() {
    if (liveWork.data) {
      try {
        await validateWorkMetadata(liveWork.data.id);
      } catch (err) {
        notify(messageForApiError(err));
        return;
      }
    }
    setMetaValidated(true);
    pushEvent("Métadonnées validées par l'institution", "review");
    notify("Métadonnées validées et figées.");
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!revComment.trim()) return;
    if (liveWork.data) {
      try {
        await apiAddReview(liveWork.data.id, {
          comment: revComment.trim(),
          recommendation:
            revRecommendation === "Rejeter"
              ? "REJECT"
              : revRecommendation === "Accepter avec corrections"
                ? "MINOR_CORRECTION"
                : "ACCEPT",
          conformity_score: 90,
        });
      } catch (err) {
        notify(messageForApiError(err));
        return;
      }
    }
    const review: Review = {
      id: `rev-${Date.now()}`,
      reviewer: reviewerName,
      date: "À l'instant",
      recommendation: revRecommendation,
      comment: revComment.trim(),
    };
    setReviews((prev) => [review, ...prev]);
    setRevComment("");
    pushEvent(`Avis déposé : ${revRecommendation.toLowerCase()}`, "review");
    notify("Avis enregistré.");
  }

  async function addCorrection(e: React.FormEvent) {
    e.preventDefault();
    if (!corrRequest.trim()) return;
    if (liveWork.data) {
      try {
        await apiAddCorrection(liveWork.data.id, {
          type: "METADATA",
          message: `${corrField}: ${corrRequest.trim()}`,
          priority: "NORMAL",
        });
      } catch (err) {
        notify(messageForApiError(err));
        return;
      }
    }
    const correction: Correction = {
      id: `cor-${Date.now()}`,
      field: corrField,
      request: corrRequest.trim(),
      status: "Ouverte",
    };
    setCorrections((prev) => [correction, ...prev]);
    setCorrRequest("");
    setState((s) => (s === "Validé" || s === "Rejeté" ? s : "En correction"));
    pushEvent(`Correction demandée — ${corrField}`, "correction");
    notify("Demande de correction créée.");
  }

  function toggleCorrection(cid: string) {
    setCorrections((prev) =>
      prev.map((c) =>
        c.id === cid
          ? { ...c, status: c.status === "Ouverte" ? "Résolue" : "Ouverte" }
          : c
      )
    );
  }

  async function confirmDecision() {
    if (!decisionChoice || !decisionChecks.every(Boolean)) return;
    const next: DossierState = decisionChoice === "Valider" ? "Validé" : "Rejeté";
    if (liveWork.data) {
      try {
        await decideWork(liveWork.data.id, {
          decision_type: decisionChoice === "Valider" ? "VALIDATE_AFTER_DEFENSE" : "REJECT",
          comment: decisionComment,
        });
      } catch (err) {
        notify(messageForApiError(err));
        return;
      }
    }
    setState(next);
    pushEvent(
      `Décision : ${next === "Validé" ? "validé" : "rejeté"}`,
      "decision"
    );
    setDecisionOpen(false);
    notify(`Décision enregistrée : ${next}.`);
    if (next === "Validé") setTab("archivage");
  }

  async function confirmArchive() {
    if (!archiveChecks.every(Boolean)) return;
    let issuedProof: { document_hash?: string; issued_at?: string; proof_code?: string } | null = null;
    if (liveWork.data) {
      try {
        await archiveWork(liveWork.data.id);
        issuedProof = await getWorkProof(liveWork.data.id);
      } catch (err) {
        notify(messageForApiError(err));
        return;
      }
    }
    if (issuedProof) {
      setProof({
        hash: issuedProof.document_hash || issuedProof.proof_code || "—",
        at: issuedProof.issued_at
          ? new Date(issuedProof.issued_at).toLocaleString("fr-FR")
          : "—",
      });
    }
    pushEvent("Preuve d'intégrité émise et document publié", "archive");
    setArchiveOpen(false);
    notify("Preuve générée. Document archivé et publié.");
  }

  return (
    <>
      {flash && (
        <div className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-sm font-medium text-success shadow-md">
          <CheckCircle2 className="size-4" />
          {flash}
        </div>
      )}

      {/* Header */}
      <Link
        href="/validation/a-traiter"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Retour à l&apos;inbox
      </Link>

      <div className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={typeVariant[doc.type] ?? "outline"}>{doc.type}</Badge>
            <Badge variant={priorityVariant[dossier.priority]}>
              Priorité {dossier.priority.toLowerCase()}
            </Badge>
            <Badge variant={stateVariant[state]}>{state}</Badge>
            <span className="font-mono text-xs text-muted-foreground">#{dossier.id}</span>
          </div>
          <h1 className="font-heading text-2xl font-semibold leading-tight tracking-tight text-foreground">
            {doc.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {doc.authors.join(", ")} · {doc.faculty} — {doc.department} · {doc.year}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              Déposé le {doc.submittedAt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Hash className="size-3.5" />
              Version examinée {dossier.versionHash}
            </span>
            <span className="inline-flex items-center gap-1.5">
              {assignee ? (
                <>
                  <UserCheck className="size-3.5" />
                  {mine ? "Assigné à vous" : `Assigné à ${assignee}`}
                </>
              ) : (
                <>
                  <UserPlus className="size-3.5" />
                  Non assigné
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {!mine && (
            <Button variant="outline" onClick={assignToMe}>
              <UserPlus className="size-4" />
              M&apos;assigner
            </Button>
          )}
          {!decided ? (
            <Button onClick={() => setTab("decision")}>
              <Gavel className="size-4" />
              Décider
            </Button>
          ) : state === "Validé" && !proof ? (
            <Button onClick={() => setTab("archivage")}>
              <Archive className="size-4" />
              Archiver
            </Button>
          ) : null}
        </div>
      </div>

      {/* Timeline (stepper) */}
      <div className="my-6 flex items-center">
        {STAGES.map((label, i) => {
          const done = i < stageIndex;
          const current = i === stageIndex;
          return (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <span
                  className={
                    "flex size-7 items-center justify-center rounded-full border text-xs font-semibold " +
                    (done
                      ? "border-transparent bg-success text-success-foreground"
                      : current
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted text-muted-foreground")
                  }
                >
                  {done ? <Check className="size-3.5" /> : i + 1}
                </span>
                <span
                  className={
                    "text-sm " +
                    (done || current
                      ? "font-medium text-foreground"
                      : "text-muted-foreground")
                  }
                >
                  {label}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <span
                  className={
                    "mx-3 h-px flex-1 " + (i < stageIndex ? "bg-success" : "bg-border")
                  }
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-auto flex-nowrap p-1">
            {TABS.map((t) => (
              <TabsTrigger key={t.key} value={t.key} className="h-8">
                <t.icon className="size-3.5" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* 1 — Document */}
        <TabsContent value="document">
          <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
            <Card className="overflow-hidden py-0">
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5 text-sm">
                <span className="min-w-0 flex items-center gap-2 font-medium text-foreground">
                  <FileText className="size-4 text-primary" />
                  <span className="truncate">{examinedFileName}</span>
                </span>
                {examinedFileUrl ? (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={examinedFileUrl} download={examinedFileName}>
                      <Download className="size-4" />
                      Télécharger
                    </a>
                  </Button>
                ) : null}
              </div>
              {examinedFileUrl ? (
                <iframe
                  src={examinedFileUrl}
                  title={`Aperçu PDF - ${examinedFileName}`}
                  className="h-[min(72vh,860px)] min-h-[520px] w-full border-0 bg-muted"
                />
              ) : (
                <div className="flex aspect-[1/1.3] items-center justify-center bg-muted/30">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileText className="size-10" />
                    <p className="text-sm">Aucun PDF disponible pour ce dossier</p>
                    <p className="text-xs">Chargez une version documentaire avant la validation.</p>
                  </div>
                </div>
              )}
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Version examinée</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Empreinte (SHA-256, tronquée)</p>
                    <p className="mt-1 break-all font-mono text-xs text-foreground">
                      {examinedHash ? `${examinedHash.slice(0, 24)}…` : "Non calculée"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Pages</span>
                    <span className="font-medium text-foreground">{examinedPageCount || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Taille</span>
                    <span className="font-medium text-foreground">{docFileSize}</span>
                  </div>
                  {examinedFileUrl ? (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={examinedFileUrl} download={examinedFileName}>
                        <Download className="size-4" />
                        Télécharger le PDF
                      </a>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 2 — Métadonnées */}
        <TabsContent value="metadonnees">
          <Card className="overflow-hidden py-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <p className="font-heading font-semibold text-foreground">
                  Tableau comparatif des métadonnées
                </p>
                <p className="text-sm text-muted-foreground">
                  Déposant · extraction IA · valeur retenue par l&apos;institution
                </p>
              </div>
              {metaValidated ? (
                <Badge variant="success">
                  <BadgeCheck className="size-3" />
                  Validées
                </Badge>
              ) : (
                <Button onClick={validateMetadata}>
                  <Check className="size-4" />
                  Valider les métadonnées
                </Button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Champ</th>
                    <th className="px-4 py-3 font-medium">Déposant</th>
                    <th className="px-4 py-3 font-medium">
                      <span className="inline-flex items-center gap-1 text-ai">
                        <Sparkles className="size-3" /> IA
                      </span>
                    </th>
                    <th className="px-4 py-3 font-medium">Institution</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {metaRows.map((row) => (
                    <tr key={row.field} className="border-b border-border last:border-0 align-top">
                      <td className="px-5 py-3 font-medium text-foreground">{row.field}</td>
                      <td className="max-w-[220px] px-4 py-3 text-muted-foreground">{row.depositor}</td>
                      <td className="max-w-[220px] px-4 py-3 text-muted-foreground">{row.ai}</td>
                      <td className="max-w-[220px] px-4 py-3 text-foreground">{row.institution}</td>
                      <td className="px-4 py-3">
                        <Badge variant={fieldStatusVariant[row.status]}>{row.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* 3 — Analyse IA */}
        <TabsContent value="analyse">
          <div className="space-y-5">
            <div className="flex items-start gap-2.5 rounded-lg border border-ai/30 bg-ai/5 px-4 py-3 text-sm text-foreground">
              <Info className="mt-0.5 size-4 shrink-0 text-ai" />
              <p>
                <span className="font-medium">Aide à la lecture, décision humaine.</span>{" "}
                Les éléments ci-dessous sont générés automatiquement pour faciliter
                l&apos;examen et ne remplacent pas l&apos;appréciation du validateur.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="size-4 text-ai" />
                    Résumé généré
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">{ai.summary}</p>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">Confiance de l&apos;extraction</span>
                      <span className="tabular-nums text-muted-foreground">{ai.confidence} %</span>
                    </div>
                    <Progress
                      value={ai.confidence}
                      indicatorClassName={ai.confidence >= 80 ? "bg-success" : "bg-warning"}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="size-4 text-warning" />
                    Points à vérifier
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {ai.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Circle className="mt-1.5 size-1.5 shrink-0 fill-warning text-warning" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Travaux similaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {ai.similar.map((s) => (
                  <Link
                    key={s.id}
                    href={`/documents/${s.slug}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-2.5 transition-colors hover:border-primary/40 hover:bg-secondary"
                  >
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-medium text-foreground">{s.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {s.authors[0]} · {s.year} · {s.domain}
                      </p>
                    </div>
                    <Badge variant="outline">{s.type}</Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 4 — Avis */}
        <TabsContent value="avis">
          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Avis déposés ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reviews.length === 0 && (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    Aucun avis pour le moment.
                  </p>
                )}
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-lg border border-border p-4">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-foreground">{r.reviewer}</span>
                      <Badge variant={recommendationVariant[r.recommendation]}>
                        {r.recommendation}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{r.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base">Rédiger un avis</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={submitReview} className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Recommandation
                    </label>
                    <Select
                      value={revRecommendation}
                      onChange={(e) => setRevRecommendation(e.target.value as Recommendation)}
                    >
                      <option value="Accepter">Accepter</option>
                      <option value="Accepter avec corrections">Accepter avec corrections</option>
                      <option value="Rejeter">Rejeter</option>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Commentaire
                    </label>
                    <Textarea
                      value={revComment}
                      onChange={(e) => setRevComment(e.target.value)}
                      placeholder="Argumentez votre recommandation…"
                      rows={5}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={!revComment.trim()}>
                    <MessageSquarePlus className="size-4" />
                    Enregistrer l&apos;avis
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 5 — Corrections */}
        <TabsContent value="corrections">
          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Demandes de correction ({corrections.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {corrections.length === 0 && (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    Aucune correction demandée.
                  </p>
                )}
                {corrections.map((c) => (
                  <div key={c.id} className="rounded-lg border border-border p-4">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <Badge variant="outline">{c.field}</Badge>
                      <Badge variant={c.status === "Ouverte" ? "warning" : "success"}>
                        {c.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{c.request}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => toggleCorrection(c.id)}
                    >
                      {c.status === "Ouverte" ? (
                        <>
                          <Check className="size-3.5" />
                          Marquer résolue
                        </>
                      ) : (
                        "Rouvrir"
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base">Nouvelle correction</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={addCorrection} className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Champ concerné
                    </label>
                    <Select value={corrField} onChange={(e) => setCorrField(e.target.value)}>
                      {fieldOptions.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Demande
                    </label>
                    <Textarea
                      value={corrRequest}
                      onChange={(e) => setCorrRequest(e.target.value)}
                      placeholder="Décrivez la correction attendue du déposant…"
                      rows={5}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={!corrRequest.trim()}>
                    <Wrench className="size-4" />
                    Créer la demande
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 6 — Décision */}
        <TabsContent value="decision">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Gavel className="size-4 text-brand" />
                Décision de validation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {decided ? (
                <div
                  className={
                    "flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium " +
                    (state === "Validé"
                      ? "border-success/30 bg-success/10 text-success"
                      : "border-destructive/30 bg-destructive/10 text-destructive")
                  }
                >
                  {state === "Validé" ? (
                    <BadgeCheck className="size-4" />
                  ) : (
                    <AlertTriangle className="size-4" />
                  )}
                  Dossier {state === "Validé" ? "validé" : "rejeté"}.
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Cochez l&apos;intégralité des points de contrôle pour débloquer la décision.
                  </p>
                  <ul className="space-y-2.5">
                    {decisionChecklist.map((item, i) => (
                      <li key={item}>
                        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-muted/40">
                          <input
                            type="checkbox"
                            checked={decisionChecks[i]}
                            onChange={(e) =>
                              setDecisionChecks((prev) =>
                                prev.map((v, j) => (j === i ? e.target.checked : v))
                              )
                            }
                            className="mt-0.5 size-4 shrink-0 accent-primary"
                          />
                          <span className="text-foreground">{item}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    disabled={!decisionChecks.every(Boolean)}
                    onClick={() => setDecisionOpen(true)}
                  >
                    <Gavel className="size-4" />
                    Rendre la décision
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 7 — Archivage */}
        <TabsContent value="archivage">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Archive className="size-4 text-success" />
                Archivage & publication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {proof ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success">
                    <BadgeCheck className="size-4" />
                    Preuve d&apos;intégrité générée. Document archivé et publié.
                  </div>
                  <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 p-5 sm:flex-row">
                    <div className="flex size-28 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
                      <QrCode className="size-16 text-foreground" />
                    </div>
                    <div className="min-w-0 space-y-1.5 text-sm">
                      <p className="font-medium text-foreground">Certificat d&apos;authenticité</p>
                      <p className="break-all font-mono text-xs text-muted-foreground">
                        {proof.hash}
                      </p>
                      <p className="text-xs text-muted-foreground">Émis le {proof.at}</p>
                      <Badge variant="success">Publié</Badge>
                    </div>
                  </div>
                </div>
              ) : state !== "Validé" ? (
                <div className="flex items-center gap-2.5 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-[#b45309]">
                  <AlertTriangle className="size-4 shrink-0" />
                  Le dossier doit être validé avant de pouvoir être archivé.
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Vérifiez les conditions puis émettez la preuve et publiez le document.
                  </p>
                  <ul className="space-y-2">
                    {archiveChecklist.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" onClick={() => setArchiveOpen(true)}>
                    <Archive className="size-4" />
                    Archiver et publier
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 8 — Historique */}
        <TabsContent value="historique">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Historique du workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-5 border-l border-border pl-6">
                {events.map((ev, i) => (
                  <li key={i} className="relative">
                    <span
                      className={
                        "absolute -left-[1.65rem] top-1 size-3 rounded-full ring-4 ring-card " +
                        eventDot[ev.type]
                      }
                    />
                    <p className="text-sm font-medium text-foreground">{ev.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {ev.actor} · {ev.date}
                    </p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modale décision */}
      <PortalModal
        open={decisionOpen}
        onClose={() => setDecisionOpen(false)}
        title="Confirmer la décision"
        description="Cette action met à jour le statut du dossier et l'historique."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDecisionOpen(false)}>
              Annuler
            </Button>
            <Button
              variant={decisionChoice === "Rejeter" ? "destructive" : "default"}
              onClick={confirmDecision}
              disabled={!decisionChoice}
            >
              Confirmer
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {(["Valider", "Rejeter"] as const).map((choice) => {
              const active = decisionChoice === choice;
              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setDecisionChoice(choice)}
                  className={
                    "flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-colors " +
                    (active
                      ? choice === "Valider"
                        ? "border-success bg-success/10 text-success"
                        : "border-destructive bg-destructive/10 text-destructive"
                      : "border-border text-foreground hover:bg-muted/50")
                  }
                >
                  {choice === "Valider" ? (
                    <BadgeCheck className="size-4" />
                  ) : (
                    <AlertTriangle className="size-4" />
                  )}
                  {choice}
                </button>
              );
            })}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Motivation (consignée à l&apos;historique)
            </label>
            <Textarea
              value={decisionComment}
              onChange={(e) => setDecisionComment(e.target.value)}
              placeholder="Justifiez la décision…"
              rows={4}
            />
          </div>
        </div>
      </PortalModal>

      {/* Modale archivage */}
      <PortalModal
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        title="Archiver et publier"
        description="Une preuve d'intégrité sera générée pour la version examinée."
        footer={
          <>
            <Button variant="ghost" onClick={() => setArchiveOpen(false)}>
              Annuler
            </Button>
            <Button onClick={confirmArchive} disabled={!archiveChecks.every(Boolean)}>
              <Archive className="size-4" />
              Générer la preuve & publier
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <ul className="space-y-2">
            {archiveChecklist.map((item, i) => (
              <li key={item}>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-muted/40">
                  <input
                    type="checkbox"
                    checked={archiveChecks[i]}
                    onChange={(e) =>
                      setArchiveChecks((prev) =>
                        prev.map((v, j) => (j === i ? e.target.checked : v))
                      )
                    }
                    className="mt-0.5 size-4 shrink-0 accent-primary"
                  />
                  <span className="text-foreground">{item}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="mb-2 text-sm font-medium text-foreground">Options</p>
            <div className="space-y-2">
              {(
                [
                  ["preuve", "Générer la preuve d'intégrité"],
                  ["qr", "Inclure un QR de vérification"],
                  ["publication", "Publier sur le portail public"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2.5 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={archiveOptions[key]}
                    onChange={(e) =>
                      setArchiveOptions((prev) => ({ ...prev, [key]: e.target.checked }))
                    }
                    className="size-4 accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </PortalModal>
    </>
  );
}

export default function DossierDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="py-12 text-center text-sm text-muted-foreground">Chargement…</div>
      }
    >
      <DetailInner />
    </React.Suspense>
  );
}

import type { LucideIcon } from "lucide-react";
import { Inbox, LayoutDashboard } from "lucide-react";

import type { ScientificDocument } from "@/lib/domain-types";

/* -------------------------------------------------------------------------- */
/* Navigation & compte                                                        */
/* -------------------------------------------------------------------------- */

export interface ValidationNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface ValidationNavGroup {
  title: string;
  items: ValidationNavItem[];
}

/* -------------------------------------------------------------------------- */
/* Dossiers de validation                                                     */
/* -------------------------------------------------------------------------- */

export type Priority = "Haute" | "Normale" | "Basse";
export type DossierState =
  | "À traiter"
  | "En cours"
  | "En correction"
  | "Validé"
  | "Rejeté";

export interface Dossier {
  id: string;
  workSlug: string;
  priority: Priority;
  state: DossierState;
  assignee: string | null;
  slaDays: number;
  ageDays: number;
  versionHash: string;
}

export const dossiers: Dossier[] = [];

export const priorityRank: Record<Priority, number> = {
  Haute: 0,
  Normale: 1,
  Basse: 2,
};

export function getDossier(id: string): Dossier | undefined {
  return dossiers.find((d) => d.id === id);
}

export function getDossierWork(d: Dossier): ScientificDocument | undefined {
  void d;
  return undefined;
}

export function priorityQueue(): Dossier[] {
  return [...dossiers]
    .filter((d) => d.state === "À traiter" || d.state === "En cours")
    .sort(
      (a, b) =>
        priorityRank[a.priority] - priorityRank[b.priority] ||
        b.ageDays - a.ageDays
    );
}

export const openDossiersCount = dossiers.filter(
  (d) => d.state === "À traiter"
).length;

export const validationNav: ValidationNavGroup[] = [
  {
    title: "Validation",
    items: [
      { label: "Tableau de bord", href: "/validation/dashboard", icon: LayoutDashboard },
      { label: "Dossiers à traiter", href: "/validation/a-traiter", icon: Inbox },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Détail : métadonnées comparatives                                          */
/* -------------------------------------------------------------------------- */

export type FieldStatus = "Conforme" | "À vérifier" | "Corrigé";

export interface MetadataRow {
  field: string;
  depositor: string;
  ai: string;
  institution: string;
  status: FieldStatus;
}

export function buildMetadataRows(doc: ScientificDocument): MetadataRow[] {
  const abstractShort = doc.abstract.slice(0, 90) + "…";
  return [
    { field: "Titre", depositor: doc.title, ai: doc.title, institution: doc.title, status: "Conforme" },
    { field: "Auteurs", depositor: doc.authors.join(", "), ai: doc.authors.join(", "), institution: doc.authors.join(", "), status: "Conforme" },
    { field: "Encadreurs", depositor: doc.supervisors.join(", "), ai: doc.supervisors.join(", "), institution: doc.supervisors.join(", "), status: "Conforme" },
    { field: "Résumé", depositor: abstractShort, ai: abstractShort, institution: abstractShort, status: "À vérifier" },
    { field: "Mots-clés", depositor: doc.keywords.slice(0, 2).join(", "), ai: doc.keywords.join(", "), institution: doc.keywords.join(", "), status: "Corrigé" },
    { field: "Année", depositor: String(doc.year), ai: String(doc.year), institution: String(doc.year), status: "Conforme" },
    { field: "Domaine", depositor: doc.domain, ai: doc.domain, institution: doc.domain, status: "Conforme" },
    { field: "Faculté", depositor: doc.faculty, ai: "—", institution: doc.faculty, status: "Conforme" },
    { field: "Département", depositor: doc.department, ai: doc.department, institution: doc.department, status: "Conforme" },
    { field: "Langue", depositor: doc.language, ai: doc.language, institution: doc.language, status: "Conforme" },
    { field: "Type", depositor: doc.type, ai: doc.type, institution: doc.type, status: "Conforme" },
    { field: "Licence", depositor: doc.license, ai: "—", institution: doc.license, status: "À vérifier" },
  ];
}

/* -------------------------------------------------------------------------- */
/* Détail : analyse IA                                                        */
/* -------------------------------------------------------------------------- */

export interface AiAnalysis {
  summary: string;
  confidence: number;
  points: string[];
  similar: ScientificDocument[];
}

export function buildAiAnalysis(doc: ScientificDocument): AiAnalysis {
  return {
    summary: doc.abstract,
    confidence: doc.aiConfidence,
    points: [
      "Vérifier l'orthographe des noms d'auteurs et leur affiliation.",
      "Confirmer l'année de soutenance avec la page de garde.",
      "Contrôler la cohérence entre le domaine détecté et le département.",
      "Valider la licence sélectionnée par le déposant.",
    ],
    similar: [],
  };
}

/* -------------------------------------------------------------------------- */
/* Détail : avis & corrections                                                */
/* -------------------------------------------------------------------------- */

export type Recommendation = "Accepter" | "Accepter avec corrections" | "Rejeter";

export interface Review {
  id: string;
  reviewer: string;
  date: string;
  recommendation: Recommendation;
  comment: string;
}

export interface Correction {
  id: string;
  field: string;
  request: string;
  status: "Ouverte" | "Résolue";
}

/* -------------------------------------------------------------------------- */
/* Détail : événements de workflow                                            */
/* -------------------------------------------------------------------------- */

export type EventType = "submit" | "ai" | "assign" | "review" | "correction" | "decision" | "archive";

export interface WorkflowEvent {
  date: string;
  label: string;
  actor: string;
  type: EventType;
}

export function buildWorkflowEvents(
  d: Dossier,
  doc: ScientificDocument
): WorkflowEvent[] {
  const events: WorkflowEvent[] = [
    { date: doc.submittedAt, label: "Dépôt soumis", actor: doc.authors[0], type: "submit" },
    { date: doc.submittedAt, label: `Extraction IA terminée (confiance ${doc.aiConfidence} %)`, actor: "Système", type: "ai" },
  ];
  if (d.assignee) {
    events.push({ date: "—", label: `Dossier affecté à ${d.assignee}`, actor: "Gestionnaire", type: "assign" });
  }
  if (d.state === "En correction") {
    events.push({ date: "—", label: "Correction demandée au déposant", actor: d.assignee ?? "Validateur", type: "correction" });
  }
  if (d.state === "Validé") {
    events.push({ date: "—", label: "Avis favorable déposé", actor: d.assignee ?? "Validateur", type: "review" });
    events.push({ date: "—", label: "Décision : validé", actor: d.assignee ?? "Validateur", type: "decision" });
    events.push({ date: "—", label: "Preuve d'intégrité émise", actor: "Système", type: "archive" });
  }
  return events;
}

/* -------------------------------------------------------------------------- */
/* Listes de référence (formulaires)                                          */
/* -------------------------------------------------------------------------- */

export const decisionChecklist = [
  "Le document correspond aux métadonnées déclarées.",
  "Les auteurs et encadreurs sont vérifiés.",
  "Le contenu respecte les règles d'intégrité scientifique.",
  "La licence et le niveau d'accès sont cohérents.",
];

export const archiveChecklist = [
  "Métadonnées validées et figées.",
  "Version examinée confirmée (empreinte vérifiée).",
  "Licence et conditions de diffusion approuvées.",
];

export const fieldOptions = [
  "Titre",
  "Auteurs",
  "Encadreurs",
  "Résumé",
  "Mots-clés",
  "Année",
  "Domaine",
  "Faculté",
  "Département",
  "Langue",
  "Licence",
];

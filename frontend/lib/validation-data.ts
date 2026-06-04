import type { LucideIcon } from "lucide-react";
import { Inbox, LayoutDashboard } from "lucide-react";

import {
  getDocument,
  getSimilarDocuments,
  type ScientificDocument,
} from "@/lib/mock-data";

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

export const validationAccount = {
  name: "Dr. Owona Essomba Paul",
  role: "Validateur",
  email: "p.owona@uy1.cm",
  initials: "OP",
};

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

export const dossiers: Dossier[] = [
  { id: "val-001", workSlug: "extraction-automatique-metadonnees-pdf-academiques", priority: "Haute", state: "À traiter", assignee: null, slaDays: 3, ageDays: 2, versionHash: "9f2c8a7b1d4e" },
  { id: "val-002", workSlug: "modelisation-hydrologique-bassins-versants", priority: "Normale", state: "À traiter", assignee: null, slaDays: 7, ageDays: 1, versionHash: "77de10b3a9c2" },
  { id: "val-003", workSlug: "energie-solaire-zones-rurales-cameroun", priority: "Basse", state: "À traiter", assignee: null, slaDays: 14, ageDays: 4, versionHash: "2b9d7f1a4c6e" },
  { id: "val-004", workSlug: "classification-automatique-documents-scientifiques", priority: "Haute", state: "En cours", assignee: "Dr. Owona Essomba Paul", slaDays: 3, ageDays: 1, versionHash: "a1b2c3d4e5f6" },
  { id: "val-005", workSlug: "detection-anomalies-reseau-apprentissage-profond", priority: "Haute", state: "En correction", assignee: "Dr. Owona Essomba Paul", slaDays: 3, ageDays: 6, versionHash: "c4f8e2a6b0d1" },
  { id: "val-006", workSlug: "indexation-semantique-corpus-francophones", priority: "Normale", state: "En cours", assignee: "Dr. Njoya Hamadou", slaDays: 7, ageDays: 3, versionHash: "5e3a1b8c2f7d" },
  { id: "val-007", workSlug: "diagnostic-precoce-paludisme-vision-par-ordinateur", priority: "Normale", state: "À traiter", assignee: null, slaDays: 7, ageDays: 5, versionHash: "0fa1cc93b27d" },
  { id: "val-008", workSlug: "systeme-intelligent-archivage-memoires", priority: "Normale", state: "Validé", assignee: "Dr. Owona Essomba Paul", slaDays: 7, ageDays: 9, versionHash: "8d2049e7a1b3" },
  { id: "val-009", workSlug: "optimisation-recherche-facettes-bibliotheques-numeriques", priority: "Basse", state: "Validé", assignee: "Dr. Njoya Hamadou", slaDays: 14, ageDays: 12, versionHash: "6c1e9f0a7b54" },
];

export const priorityRank: Record<Priority, number> = {
  Haute: 0,
  Normale: 1,
  Basse: 2,
};

export function getDossier(id: string): Dossier | undefined {
  return dossiers.find((d) => d.id === id);
}

export function getDossierWork(d: Dossier): ScientificDocument | undefined {
  return getDocument(d.workSlug);
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
    similar: getSimilarDocuments(doc, 3),
  };
}

/* -------------------------------------------------------------------------- */
/* Détail : avis & corrections (graines)                                      */
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

export function seedReviews(d: Dossier): Review[] {
  if (d.state === "À traiter") return [];
  return [
    {
      id: "rev-1",
      reviewer: "Dr. Njoya Hamadou",
      date: "01/06/2026",
      recommendation:
        d.state === "En correction" ? "Accepter avec corrections" : "Accepter",
      comment:
        d.state === "En correction"
          ? "Travail solide mais quelques métadonnées à corriger avant publication."
          : "Document conforme aux exigences scientifiques et documentaires.",
    },
  ];
}

export function seedCorrections(d: Dossier): Correction[] {
  if (d.state !== "En correction") return [];
  return [
    { id: "cor-1", field: "Mots-clés", request: "Ajouter les mots-clés manquants suggérés par l'IA.", status: "Ouverte" },
    { id: "cor-2", field: "Licence", request: "Confirmer la licence CC BY 4.0 (champ vide à l'extraction).", status: "Ouverte" },
  ];
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

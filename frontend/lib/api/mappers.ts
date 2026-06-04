import type { CatalogItem, SimilarWork, Work } from "./types";
import type { DossierStatus, ScientificDocument } from "@/lib/mock-data";

function firstContributorName(work?: Work | CatalogItem) {
  const contributors = "contributors" in (work || {}) ? (work as Work).contributors : undefined;
  return contributors?.[0]?.display_name || "Auteur non renseigné";
}

function coerceYear(value?: string | number | null) {
  if (typeof value === "number") return value;
  const match = String(value || "").match(/\d{4}/);
  return match ? Number(match[0]) : new Date().getFullYear();
}

function coerceType(value?: string): ScientificDocument["type"] {
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("th")) return "Thèse";
  if (normalized.includes("article")) return "Article";
  if (normalized.includes("rapport")) return "Rapport";
  return "Mémoire";
}

export function catalogToDocument(item: CatalogItem): ScientificDocument {
  return {
    id: item.work_id || item.public_slug,
    slug: item.public_slug || item.work_id,
    title: item.title,
    type: coerceType(item.type),
    status: "Validé",
    access: item.access_level === "RESTRICTED" ? "Restreint" : "Public",
    authors: [firstContributorName(item)],
    supervisors: ["Non renseigné"],
    abstract: item.abstract || "Résumé non disponible.",
    keywords: item.keywords || [],
    year: coerceYear(item.academic_year),
    institution: item.institution || "OpenScience Hub",
    faculty: "Institution",
    department: item.scientific_domain || "Non renseigné",
    domain: item.scientific_domain || "Non renseigné",
    language: "Français",
    license: item.access_level === "OPEN_ACCESS" ? "Accès ouvert" : "Accès restreint",
    level: item.type || "Document scientifique",
    pages: 0,
    views: 0,
    downloads: 0,
    citations: 0,
    submittedAt: item.archived_at || new Date().toISOString(),
    aiExtracted: true,
    aiConfidence: 0,
  };
}

export function workToDossier(work: Work) {
  const statusMap: Record<string, DossierStatus> = {
    DRAFT: "Brouillon",
    SUBMITTED: "En attente",
    UNDER_REVIEW: "En attente",
    APPROVED: "Validé",
    ARCHIVED: "Validé",
    REJECTED: "Rejeté",
  };
  return {
    id: work.id,
    reference: work.reference_code || work.id,
    title: work.title,
    type: coerceType(work.type),
    status: statusMap[work.status] || "En attente",
    domain: work.scientific_domain || "Non renseigné",
    updatedAt: work.updated_at || work.created_at || "",
    keywords: work.keywords || [],
    proof: undefined,
  };
}

export function workToScientificDocument(work: Work): ScientificDocument {
  return {
    id: work.id,
    slug: work.id,
    title: work.title,
    type: coerceType(work.type),
    status: ["VALIDATED", "ARCHIVED"].includes(work.status) ? "Validé" : "En attente",
    access: work.visibility === "RESTRICTED" ? "Restreint" : "Public",
    authors: work.contributors?.filter((c) => c.contributor_type === "AUTHOR").map((c) => c.display_name) || [
      "Auteur non renseigné",
    ],
    supervisors: work.supervisor_name ? [work.supervisor_name] : ["Non renseigné"],
    abstract: work.abstract_text || "Résumé non renseigné.",
    keywords: work.keywords || [],
    year: coerceYear(work.academic_year),
    institution: String(work.institution || "OpenScience Hub"),
    faculty: String(work.faculty || "—"),
    department: String(work.department || "—"),
    domain: work.scientific_domain || "Non renseigné",
    language: work.language || "FR",
    license: work.visibility === "PUBLIC" ? "Accès public" : "Accès privé",
    level: work.type,
    pages: 0,
    views: 0,
    downloads: 0,
    citations: 0,
    submittedAt: work.submitted_at || work.updated_at || work.created_at || new Date().toISOString(),
    aiExtracted: true,
    aiConfidence: 0,
  };
}

export function similarToDocument(item: SimilarWork): ScientificDocument {
  return {
    id: item.work_id || item.title || crypto.randomUUID(),
    slug: item.work_id || item.title || "document-similaire",
    title: item.title || "Document similaire",
    type: coerceType(item.type),
    status: "Validé",
    access: "Public",
    authors: ["Auteur non renseigné"],
    supervisors: [],
    abstract: item.motifs?.join(" ") || "Document proche détecté par similarité.",
    keywords: item.motifs || [],
    year: coerceYear(item.year),
    institution: "OpenScience Hub",
    faculty: "Institution",
    department: "Non renseigné",
    domain: "Similarité",
    language: "Français",
    license: "Accès ouvert",
    level: "Document scientifique",
    pages: 0,
    views: 0,
    downloads: 0,
    citations: 0,
    submittedAt: new Date().toISOString(),
    aiExtracted: true,
    aiConfidence: Math.round((item.score || 0) * 100),
  };
}

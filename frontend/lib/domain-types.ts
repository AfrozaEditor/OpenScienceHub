export type DocumentType = "Mémoire" | "Thèse" | "Article" | "Rapport";
export type DocumentStatus = "Validé" | "En attente" | "Rejeté";
export type AccessLevel = "Public" | "Restreint";

export interface ScientificDocument {
  id: string;
  slug: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  access: AccessLevel;
  authors: string[];
  supervisors: string[];
  abstract: string;
  keywords: string[];
  year: number;
  institution: string;
  faculty: string;
  department: string;
  domain: string;
  language: string;
  license: string;
  level: string;
  pages: number;
  views: number;
  downloads: number;
  citations: number;
  submittedAt: string;
  aiExtracted: boolean;
  aiConfidence: number;
  downloadUrl?: string;
  fileName?: string;
  documentHash?: string;
}

export interface FacetOption {
  label: string;
  count: number;
}

export type DossierStatus = "Brouillon" | "En attente" | "Validé" | "Rejeté";
export type TimelineState = "done" | "current" | "pending" | "rejected";

export interface DossierEvent {
  label: string;
  date: string;
  state: TimelineState;
  description?: string;
  actor?: string;
}

export interface ProofRecord {
  reference: string;
  status: "Vérifiée" | "En attente" | "Révoquée";
  documentHash: string;
  algorithm: string;
  issuedAt: string;
  schema: string;
  credentialId: string;
  issuerDid: string;
  holderDid: string;
  registry: string;
  anchor: string;
}

export interface Dossier {
  id: string;
  reference: string;
  title: string;
  type: DocumentType;
  status: DossierStatus;
  domain: string;
  faculty: string;
  department: string;
  level: string;
  language: string;
  abstract: string;
  keywords: string[];
  pages: number;
  fileSize: string;
  submittedAt: string;
  updatedAt: string;
  views: number;
  downloads: number;
  aiConfidence: number;
  reviewer?: string;
  rejectionReason?: string;
  timeline: DossierEvent[];
  proof?: ProofRecord;
}

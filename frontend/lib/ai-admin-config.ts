export type AiConfig = Record<string, unknown>;

export const EXTRACTION_FIELD_LABELS: Record<string, string> = {
  title: "Titre",
  authors: "Auteur principal / Co-auteurs",
  supervisors: "Encadreur / Directeur de thèse",
  corresponding_author: "Auteur correspondant",
  journal: "Revue / conférence",
  abstract: "Résumé",
  keywords: "Mots-clés",
  domain: "Domaine scientifique",
  sub_domain: "Sous-domaine",
  problem: "Problématique",
  objectives: "Objectifs",
  methodology: "Méthodologie",
  results: "Résultats principaux",
  limits: "Limites",
  language: "Langue",
  academic_year: "Année académique",
  institution: "Institution détectée",
  department: "Département détecté",
  topics: "Thématiques associées",
  doctoral_school: "École doctorale",
  contributions: "Contributions",
  doi: "DOI",
  references: "Références détectées",
  document_type: "Type de document",
};

export const SERVICE_LABELS: Record<string, { label: string; description: string }> = {
  metadata_extraction: {
    label: "Extraction IA des métadonnées",
    description: "Analyse automatique des PDF au dépôt.",
  },
  public_assistant: {
    label: "Assistant IA public",
    description: "Disponible sur le portail public après archivage.",
  },
  internal_assistant: {
    label: "Assistant IA interne",
    description: "Pour déposants, validateurs et administration.",
  },
  summary: {
    label: "Génération de résumé",
    description: "Résumés courts, détaillés et fiches de lecture.",
  },
  keywords: {
    label: "Suggestion de mots-clés",
    description: "Propositions et classification thématique.",
  },
  similar_works: {
    label: "Travaux similaires",
    description: "Détection de proximité documentaire.",
  },
  validation_assistance: {
    label: "Aide à la validation académique",
    description: "Signaux de lecture pour les validateurs.",
  },
  auto_analyze_on_upload: {
    label: "Analyse automatique après ajout du PDF",
    description: "Lance l'extraction dès le téléversement.",
  },
};

export const TRIGGER_LABELS: Record<string, string> = {
  after_upload: "Après ajout du PDF",
  before_submission: "Avant soumission officielle",
  after_submission: "Après soumission",
  during_validation: "Pendant la validation académique",
  after_new_version: "Après dépôt d'une nouvelle version",
  before_final_archive: "Avant archivage final",
  after_archive_public_index: "Après archivage pour indexation publique",
};

export const PORTAL_LABELS: Record<string, string> = {
  public: "Portail public",
  deposant: "Portail déposant",
  validation: "Portail validation",
  admin: "Portail administration",
};

export const SIMILARITY_WEIGHT_LABELS: Record<string, string> = {
  content: "Contenu complet",
  abstract: "Résumé",
  keywords: "Mots-clés",
  domain: "Domaine scientifique",
  methodology: "Méthodologie",
};

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function patchNested(
  config: AiConfig,
  path: string[],
  value: unknown,
): AiConfig {
  if (path.length === 0) return config;
  const [head, ...rest] = path;
  if (rest.length === 0) {
    return { ...config, [head]: value };
  }
  return {
    ...config,
    [head]: patchNested(asRecord(config[head]), rest, value),
  };
}

export function toggleInList(list: unknown, key: string, enabled: boolean): string[] {
  const current = Array.isArray(list) ? list.map(String) : [];
  if (enabled) return Array.from(new Set([...current, key]));
  return current.filter((item) => item !== key);
}

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
}

export const INSTITUTION = "Université de Yaoundé I";

export const documents: ScientificDocument[] = [
  {
    id: "doc-001",
    slug: "systeme-intelligent-archivage-memoires",
    title:
      "Conception d'un système intelligent d'archivage des mémoires universitaires",
    type: "Mémoire",
    status: "Validé",
    access: "Public",
    authors: ["Nguelé Fotso Arnaud"],
    supervisors: ["Pr. Atangana Messi Bernard"],
    abstract:
      "Ce mémoire propose une architecture logicielle pour l'archivage automatisé des mémoires universitaires. En combinant extraction de métadonnées par IA et indexation à facettes, le système réduit de 70 % le temps de catalogage manuel tout en améliorant la précision des recherches documentaires.",
    keywords: [
      "Archivage numérique",
      "Extraction de métadonnées",
      "Recherche à facettes",
      "IA documentaire",
    ],
    year: 2025,
    institution: INSTITUTION,
    faculty: "Faculté des Sciences",
    department: "Informatique",
    domain: "Informatique",
    language: "Français",
    license: "CC BY 4.0",
    level: "Master 2",
    pages: 112,
    views: 2847,
    downloads: 934,
    citations: 12,
    submittedAt: "2025-09-14",
    aiExtracted: true,
    aiConfidence: 96,
  },
  {
    id: "doc-002",
    slug: "classification-automatique-documents-scientifiques",
    title:
      "Analyse comparative des modèles de classification automatique de documents scientifiques",
    type: "Article",
    status: "Validé",
    access: "Public",
    authors: ["Mballa Ngono Carole", "Tchoumi Kamga Yves"],
    supervisors: ["Dr. Owona Essomba Paul"],
    abstract:
      "Cet article évalue les performances de plusieurs approches de classification automatique (SVM, forêts aléatoires, transformeurs) appliquées à un corpus de documents académiques francophones. Les modèles de type BERT multilingue obtiennent les meilleurs scores de F1 sur la catégorisation disciplinaire.",
    keywords: [
      "Classification de texte",
      "Apprentissage automatique",
      "Transformeurs",
      "TAL",
    ],
    year: 2024,
    institution: INSTITUTION,
    faculty: "École Nationale Supérieure Polytechnique",
    department: "Génie Informatique",
    domain: "Intelligence Artificielle",
    language: "Français",
    license: "CC BY-SA 4.0",
    level: "Doctorat",
    pages: 18,
    views: 4120,
    downloads: 1502,
    citations: 37,
    submittedAt: "2024-11-02",
    aiExtracted: true,
    aiConfidence: 92,
  },
  {
    id: "doc-003",
    slug: "optimisation-recherche-facettes-bibliotheques-numeriques",
    title:
      "Optimisation de la recherche à facettes dans les bibliothèques numériques",
    type: "Thèse",
    status: "Validé",
    access: "Public",
    authors: ["Abena Ekani Sandrine"],
    supervisors: ["Pr. Fokou Tagne Michel", "Dr. Njoya Hamadou"],
    abstract:
      "Cette thèse formalise un modèle d'indexation hybride combinant facettes hiérarchiques et plongements sémantiques. L'approche améliore la pertinence des résultats et le temps de réponse sur de grands corpus documentaires, validée sur plus de 200 000 notices.",
    keywords: [
      "Recherche d'information",
      "Indexation sémantique",
      "Facettes",
      "Bibliothèque numérique",
    ],
    year: 2025,
    institution: INSTITUTION,
    faculty: "Faculté des Sciences",
    department: "Informatique",
    domain: "Informatique",
    language: "Français",
    license: "CC BY-NC 4.0",
    level: "Doctorat",
    pages: 187,
    views: 1985,
    downloads: 712,
    citations: 21,
    submittedAt: "2025-06-21",
    aiExtracted: true,
    aiConfidence: 94,
  },
  {
    id: "doc-004",
    slug: "extraction-automatique-metadonnees-pdf-academiques",
    title:
      "Extraction automatique de métadonnées à partir de documents PDF académiques",
    type: "Mémoire",
    status: "En attente",
    access: "Public",
    authors: ["Kamdem Tiotsop Brice"],
    supervisors: ["Dr. Ondoa Mvondo Alice"],
    abstract:
      "Ce travail développe un pipeline d'extraction de métadonnées (titre, auteurs, résumé, mots-clés) à partir de fichiers PDF hétérogènes. La méthode s'appuie sur l'analyse de mise en page et un modèle de langage affiné pour atteindre une précision moyenne de 91 %.",
    keywords: [
      "Extraction d'information",
      "Analyse de PDF",
      "Métadonnées",
      "Modèle de langage",
    ],
    year: 2025,
    institution: INSTITUTION,
    faculty: "École Nationale Supérieure Polytechnique",
    department: "Génie Informatique",
    domain: "Intelligence Artificielle",
    language: "Français",
    license: "CC BY 4.0",
    level: "Master 2",
    pages: 96,
    views: 1043,
    downloads: 287,
    citations: 4,
    submittedAt: "2026-05-28",
    aiExtracted: true,
    aiConfidence: 88,
  },
  {
    id: "doc-005",
    slug: "valorisation-science-ouverte-universites-africaines",
    title:
      "Contribution à la valorisation de la science ouverte dans les universités africaines",
    type: "Article",
    status: "Validé",
    access: "Public",
    authors: ["Eyenga Bilo'o Florence", "Mbarga Onana Désiré"],
    supervisors: ["Pr. Tabi Manga Joseph"],
    abstract:
      "Cet article analyse les freins et leviers de la science ouverte dans l'enseignement supérieur africain. Il propose un cadre de gouvernance institutionnel et un modèle de dépôt mutualisé favorisant l'accès libre aux travaux de recherche.",
    keywords: [
      "Science ouverte",
      "Dépôt institutionnel",
      "Politique de recherche",
      "Accès libre",
    ],
    year: 2024,
    institution: INSTITUTION,
    faculty: "Faculté des Sciences Économiques et de Gestion",
    department: "Sciences de l'Information",
    domain: "Sciences Sociales",
    language: "Français",
    license: "CC BY 4.0",
    level: "Doctorat",
    pages: 22,
    views: 3306,
    downloads: 1188,
    citations: 29,
    submittedAt: "2024-12-09",
    aiExtracted: true,
    aiConfidence: 90,
  },
  {
    id: "doc-006",
    slug: "detection-anomalies-reseau-apprentissage-profond",
    title:
      "Détection d'anomalies réseau par apprentissage profond sur trafic chiffré",
    type: "Thèse",
    status: "Validé",
    access: "Restreint",
    authors: ["Ngassa Wandji Hervé"],
    supervisors: ["Pr. Atangana Messi Bernard", "Dr. Souop Kenfack Liliane"],
    abstract:
      "Cette thèse propose un détecteur d'intrusions fondé sur des réseaux de neurones récurrents capables d'analyser le trafic chiffré sans déchiffrement. Le système atteint un taux de détection de 98,4 % avec un faible taux de faux positifs sur des jeux de données réalistes.",
    keywords: [
      "Cybersécurité",
      "Détection d'intrusion",
      "Apprentissage profond",
      "Trafic chiffré",
    ],
    year: 2025,
    institution: INSTITUTION,
    faculty: "École Nationale Supérieure Polytechnique",
    department: "Télécommunications",
    domain: "Télécommunications",
    language: "Français",
    license: "Tous droits réservés",
    level: "Doctorat",
    pages: 203,
    views: 1561,
    downloads: 0,
    citations: 15,
    submittedAt: "2025-03-30",
    aiExtracted: true,
    aiConfidence: 93,
  },
  {
    id: "doc-007",
    slug: "modelisation-hydrologique-bassins-versants",
    title:
      "Modélisation hydrologique des bassins versants en contexte de changement climatique",
    type: "Thèse",
    status: "En attente",
    access: "Public",
    authors: ["Okenve Mintsa Patrick"],
    supervisors: ["Pr. Bekolo Ewondo Marthe"],
    abstract:
      "Ce travail développe un modèle hydrologique distribué pour anticiper la réponse des bassins versants camerounais aux scénarios climatiques. Les simulations mettent en évidence une vulnérabilité accrue des zones soudano-sahéliennes.",
    keywords: [
      "Hydrologie",
      "Changement climatique",
      "Modélisation",
      "Bassins versants",
    ],
    year: 2026,
    institution: INSTITUTION,
    faculty: "Faculté des Sciences",
    department: "Sciences de la Terre",
    domain: "Sciences de l'Environnement",
    language: "Français",
    license: "CC BY 4.0",
    level: "Doctorat",
    pages: 168,
    views: 742,
    downloads: 203,
    citations: 6,
    submittedAt: "2026-04-11",
    aiExtracted: true,
    aiConfidence: 85,
  },
  {
    id: "doc-008",
    slug: "indexation-semantique-corpus-francophones",
    title:
      "Indexation sémantique de corpus scientifiques francophones à grande échelle",
    type: "Article",
    status: "Validé",
    access: "Public",
    authors: ["Sahou Mengue Régine", "Mensah Kouadio Franck"],
    supervisors: ["Dr. Owona Essomba Paul"],
    abstract:
      "Les auteurs présentent une méthode d'indexation sémantique fondée sur des plongements contextuels adaptés au français scientifique. L'approche surpasse les méthodes lexicales classiques sur les tâches de recherche et de regroupement thématique.",
    keywords: [
      "Indexation sémantique",
      "Plongements lexicaux",
      "Recherche d'information",
      "Corpus francophone",
    ],
    year: 2025,
    institution: INSTITUTION,
    faculty: "Faculté des Sciences",
    department: "Informatique",
    domain: "Intelligence Artificielle",
    language: "Français",
    license: "CC BY-SA 4.0",
    level: "Doctorat",
    pages: 16,
    views: 2210,
    downloads: 805,
    citations: 18,
    submittedAt: "2025-08-19",
    aiExtracted: true,
    aiConfidence: 95,
  },
  {
    id: "doc-009",
    slug: "diagnostic-precoce-paludisme-vision-par-ordinateur",
    title:
      "Diagnostic précoce du paludisme par vision par ordinateur sur frottis sanguins",
    type: "Rapport",
    status: "Validé",
    access: "Public",
    authors: ["Ateba Zogo Christelle"],
    supervisors: ["Pr. Mefo'o Nyanga Olivier"],
    abstract:
      "Ce rapport de recherche présente un système de détection automatique du Plasmodium sur images de frottis sanguins. Le modèle de vision par ordinateur atteint une sensibilité de 97 %, ouvrant la voie à un dépistage assisté dans les zones rurales.",
    keywords: [
      "Vision par ordinateur",
      "Santé numérique",
      "Paludisme",
      "Aide au diagnostic",
    ],
    year: 2024,
    institution: INSTITUTION,
    faculty: "Faculté de Médecine et des Sciences Biomédicales",
    department: "Sciences Biomédicales",
    domain: "Médecine",
    language: "Français",
    license: "CC BY 4.0",
    level: "Master 2",
    pages: 41,
    views: 1899,
    downloads: 640,
    citations: 9,
    submittedAt: "2024-10-15",
    aiExtracted: true,
    aiConfidence: 91,
  },
  {
    id: "doc-010",
    slug: "energie-solaire-zones-rurales-cameroun",
    title:
      "Dimensionnement optimal de mini-réseaux solaires pour les zones rurales du Cameroun",
    type: "Mémoire",
    status: "En attente",
    access: "Public",
    authors: ["Fouda Belinga Yann"],
    supervisors: ["Dr. Ngo Bisseck Pauline"],
    abstract:
      "Ce mémoire propose une méthode d'optimisation du dimensionnement de mini-réseaux photovoltaïques. L'outil développé permet de réduire les coûts d'installation tout en garantissant la continuité de service pour les localités isolées.",
    keywords: [
      "Énergie solaire",
      "Mini-réseaux",
      "Optimisation",
      "Électrification rurale",
    ],
    year: 2026,
    institution: INSTITUTION,
    faculty: "École Nationale Supérieure Polytechnique",
    department: "Génie Électrique",
    domain: "Sciences de l'Ingénieur",
    language: "Français",
    license: "CC BY 4.0",
    level: "Master 2",
    pages: 88,
    views: 612,
    downloads: 178,
    citations: 2,
    submittedAt: "2026-05-05",
    aiExtracted: true,
    aiConfidence: 87,
  },
];

export function getDocument(slugOrId: string): ScientificDocument | undefined {
  return documents.find((d) => d.slug === slugOrId || d.id === slugOrId);
}

export function getSimilarDocuments(
  doc: ScientificDocument,
  limit = 3
): ScientificDocument[] {
  return documents
    .filter((d) => d.id !== doc.id)
    .map((d) => {
      const sharedKeywords = d.keywords.filter((k) =>
        doc.keywords.includes(k)
      ).length;
      const sameDomain = d.domain === doc.domain ? 2 : 0;
      const sameDept = d.department === doc.department ? 1 : 0;
      return { doc: d, score: sharedKeywords * 3 + sameDomain + sameDept };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.doc);
}

export interface FacetOption {
  label: string;
  count: number;
}

function aggregate(
  selector: (d: ScientificDocument) => string | string[]
): FacetOption[] {
  const counts = new Map<string, number>();
  for (const doc of documents) {
    const value = selector(doc);
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export const facets = {
  types: aggregate((d) => d.type),
  years: aggregate((d) => String(d.year)),
  faculties: aggregate((d) => d.faculty),
  departments: aggregate((d) => d.department),
  domains: aggregate((d) => d.domain),
  languages: aggregate((d) => d.language),
  access: aggregate((d) => d.access),
  statuses: aggregate((d) => d.status),
};

export const platformStats = {
  documents: documents.length * 1240,
  authors: 4820,
  departments: 64,
  domains: 28,
  downloads: 187_400,
  institutions: 42,
};

export interface ScientificDomain {
  name: string;
  count: number;
  icon: "ai" | "cpu" | "flask" | "leaf" | "stethoscope" | "atom" | "calculator" | "network";
}

export const popularDomains: ScientificDomain[] = [
  { name: "Intelligence Artificielle", count: 1284, icon: "ai" },
  { name: "Informatique", count: 2156, icon: "cpu" },
  { name: "Sciences de l'Ingénieur", count: 1742, icon: "flask" },
  { name: "Sciences de l'Environnement", count: 968, icon: "leaf" },
  { name: "Médecine", count: 1431, icon: "stethoscope" },
  { name: "Physique", count: 824, icon: "atom" },
  { name: "Mathématiques Appliquées", count: 1097, icon: "calculator" },
  { name: "Télécommunications", count: 736, icon: "network" },
];

export interface Collection {
  id: string;
  name: string;
  description: string;
  kind: "Faculté" | "Département" | "Laboratoire" | "Domaine";
  documents: number;
  lastAddition: string;
}

export const collections: Collection[] = [
  {
    id: "col-001",
    name: "École Nationale Supérieure Polytechnique",
    description:
      "Travaux d'ingénierie, génie informatique, électrique et télécommunications.",
    kind: "Faculté",
    documents: 3142,
    lastAddition: "Il y a 2 jours",
  },
  {
    id: "col-002",
    name: "Faculté des Sciences",
    description:
      "Mémoires et thèses en informatique, mathématiques, physique et sciences de la Terre.",
    kind: "Faculté",
    documents: 4870,
    lastAddition: "Il y a 5 heures",
  },
  {
    id: "col-003",
    name: "Département d'Informatique",
    description:
      "Recherche en IA, systèmes, bases de données et génie logiciel.",
    kind: "Département",
    documents: 1986,
    lastAddition: "Il y a 1 jour",
  },
  {
    id: "col-004",
    name: "Laboratoire d'Informatique Documentaire (LID)",
    description:
      "Indexation sémantique, recherche d'information et science ouverte.",
    kind: "Laboratoire",
    documents: 412,
    lastAddition: "Il y a 3 jours",
  },
  {
    id: "col-005",
    name: "Intelligence Artificielle",
    description:
      "Apprentissage automatique, TAL, vision par ordinateur et applications.",
    kind: "Domaine",
    documents: 1284,
    lastAddition: "Il y a 8 heures",
  },
  {
    id: "col-006",
    name: "Faculté de Médecine et des Sciences Biomédicales",
    description:
      "Santé numérique, biomédical et recherche clinique appliquée.",
    kind: "Faculté",
    documents: 2031,
    lastAddition: "Il y a 4 jours",
  },
  {
    id: "col-007",
    name: "Laboratoire d'Énergie et Systèmes Électriques",
    description:
      "Énergies renouvelables, réseaux électriques et électrification rurale.",
    kind: "Laboratoire",
    documents: 327,
    lastAddition: "Il y a 6 jours",
  },
  {
    id: "col-008",
    name: "Sciences de l'Environnement",
    description:
      "Hydrologie, climat, biodiversité et gestion des ressources naturelles.",
    kind: "Domaine",
    documents: 968,
    lastAddition: "Il y a 1 jour",
  },
];

export const documentsByYear = [
  { year: "2020", count: 412 },
  { year: "2021", count: 638 },
  { year: "2022", count: 821 },
  { year: "2023", count: 1124 },
  { year: "2024", count: 1502 },
  { year: "2025", count: 1893 },
  { year: "2026", count: 742 },
];

export const documentsByDomain = [
  { domain: "Informatique", count: 2156 },
  { domain: "Sciences de l'Ingénieur", count: 1742 },
  { domain: "Médecine", count: 1431 },
  { domain: "Intelligence Artificielle", count: 1284 },
  { domain: "Math. Appliquées", count: 1097 },
  { domain: "Environnement", count: 968 },
];

export const adminStats = {
  deposited: 1342,
  validated: 1086,
  pending: 184,
  rejected: 72,
  downloads: 48720,
  activeAuthors: 612,
  departments: 64,
};

// ---------------------------------------------------------------------------
// Portail Déposant
// ---------------------------------------------------------------------------

export type DossierStatus = "Brouillon" | "En attente" | "Validé" | "Rejeté";

export type TimelineState = "done" | "current" | "pending" | "rejected";

export interface DossierEvent {
  label: string;
  date: string;
  state: TimelineState;
  description?: string;
  actor?: string;
}

/**
 * Preuve d'authenticité adossée à l'infrastructure de justificatifs
 * vérifiables (Verifiable Credentials / AnonCreds / DIDComm).
 */
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

export const depositor = {
  name: "Kamdem Tiotsop Brice",
  firstName: "Brice",
  initials: "KB",
  email: "brice.kamdem@univ-yaounde1.cm",
  role: "Déposant",
  institution: INSTITUTION,
  faculty: "École Nationale Supérieure Polytechnique",
  department: "Génie Informatique",
  level: "Master 2",
  memberSince: "2024",
};

export const myDossiers: Dossier[] = [
  {
    id: "extraction-metadonnees-pdf",
    reference: "OSH-2026-0042",
    title:
      "Extraction automatique de métadonnées à partir de documents PDF académiques",
    type: "Mémoire",
    status: "Validé",
    domain: "Intelligence Artificielle",
    faculty: "École Nationale Supérieure Polytechnique",
    department: "Génie Informatique",
    level: "Master 2",
    language: "Français",
    abstract:
      "Ce travail développe un pipeline d'extraction de métadonnées (titre, auteurs, résumé, mots-clés) à partir de fichiers PDF hétérogènes. La méthode s'appuie sur l'analyse de mise en page et un modèle de langage affiné pour atteindre une précision moyenne de 91 %.",
    keywords: [
      "Extraction d'information",
      "Analyse de PDF",
      "Métadonnées",
      "Modèle de langage",
    ],
    pages: 96,
    fileSize: "4,2 Mo",
    submittedAt: "2026-05-24",
    updatedAt: "2026-05-30",
    views: 1043,
    downloads: 287,
    aiConfidence: 91,
    reviewer: "Dr. Ondoa Mvondo Alice",
    timeline: [
      {
        label: "Dépôt soumis",
        date: "2026-05-24",
        state: "done",
        description: "Document téléversé et soumis pour validation.",
        actor: "Vous",
      },
      {
        label: "Extraction IA des métadonnées",
        date: "2026-05-24",
        state: "done",
        description: "Métadonnées détectées avec une confiance de 91 %.",
        actor: "OpenScience IA",
      },
      {
        label: "Validation départementale",
        date: "2026-05-29",
        state: "done",
        description: "Métadonnées vérifiées et approuvées par le département.",
        actor: "Dr. Ondoa Mvondo Alice",
      },
      {
        label: "Preuve d'authenticité émise",
        date: "2026-05-30",
        state: "done",
        description: "Justificatif vérifiable ancré sur le registre.",
        actor: "Autorité de certification OSH",
      },
      {
        label: "Publication en accès libre",
        date: "2026-05-30",
        state: "current",
        description: "Le travail est consultable et téléchargeable.",
      },
    ],
    proof: {
      reference: "OSH-AUTH-2026-0042",
      status: "Vérifiée",
      documentHash:
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      algorithm: "SHA-256",
      issuedAt: "2026-05-30T14:22:00",
      schema: "anoncreds:OSH/depot-scientifique/1.2",
      credentialId: "urn:uuid:6f9b2c14-3a7d-4e21-9c8b-1f0a2d5e7c93",
      issuerDid: "did:indy:bcovrin:test:7Zr2k9Qd4mN1pVbAOSHiss",
      holderDid: "did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH",
      registry: "Hyperledger Indy — BCovrin (testnet)",
      anchor: "txn #1284503 · 2026-05-30",
    },
  },
  {
    id: "classification-disciplinaire-bert",
    reference: "OSH-2026-0039",
    title:
      "Classification disciplinaire de documents scientifiques par transformeurs multilingues",
    type: "Article",
    status: "Validé",
    domain: "Intelligence Artificielle",
    faculty: "École Nationale Supérieure Polytechnique",
    department: "Génie Informatique",
    level: "Master 2",
    language: "Français",
    abstract:
      "Cet article compare plusieurs approches de classification automatique appliquées à un corpus académique francophone. Les modèles de type BERT multilingue obtiennent les meilleurs scores de F1 sur la catégorisation disciplinaire.",
    keywords: ["Classification de texte", "Transformeurs", "TAL", "F1-score"],
    pages: 18,
    fileSize: "1,8 Mo",
    submittedAt: "2026-04-12",
    updatedAt: "2026-04-21",
    views: 642,
    downloads: 154,
    aiConfidence: 94,
    reviewer: "Dr. Owona Essomba Paul",
    timeline: [
      { label: "Dépôt soumis", date: "2026-04-12", state: "done", actor: "Vous" },
      {
        label: "Extraction IA des métadonnées",
        date: "2026-04-12",
        state: "done",
        actor: "OpenScience IA",
      },
      {
        label: "Validation départementale",
        date: "2026-04-20",
        state: "done",
        actor: "Dr. Owona Essomba Paul",
      },
      { label: "Preuve d'authenticité émise", date: "2026-04-21", state: "done" },
      { label: "Publication en accès libre", date: "2026-04-21", state: "current" },
    ],
    proof: {
      reference: "OSH-AUTH-2026-0039",
      status: "Vérifiée",
      documentHash:
        "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
      algorithm: "SHA-256",
      issuedAt: "2026-04-21T09:48:00",
      schema: "anoncreds:OSH/depot-scientifique/1.2",
      credentialId: "urn:uuid:b1d8f0a2-77c4-4e63-9a10-2f5c8e1d4b06",
      issuerDid: "did:indy:bcovrin:test:7Zr2k9Qd4mN1pVbAOSHiss",
      holderDid: "did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH",
      registry: "Hyperledger Indy — BCovrin (testnet)",
      anchor: "txn #1271980 · 2026-04-21",
    },
  },
  {
    id: "resume-automatique-theses",
    reference: "OSH-2026-0051",
    title: "Résumé automatique extractif de thèses universitaires longues",
    type: "Thèse",
    status: "En attente",
    domain: "Intelligence Artificielle",
    faculty: "École Nationale Supérieure Polytechnique",
    department: "Génie Informatique",
    level: "Doctorat",
    language: "Français",
    abstract:
      "Cette thèse propose une méthode de résumé extractif adaptée aux documents académiques longs, combinant segmentation thématique et pondération sémantique des passages.",
    keywords: ["Résumé automatique", "TAL", "Documents longs", "Sémantique"],
    pages: 164,
    fileSize: "6,7 Mo",
    submittedAt: "2026-05-28",
    updatedAt: "2026-05-28",
    views: 0,
    downloads: 0,
    aiConfidence: 87,
    reviewer: "Dr. Ondoa Mvondo Alice",
    timeline: [
      { label: "Dépôt soumis", date: "2026-05-28", state: "done", actor: "Vous" },
      {
        label: "Extraction IA des métadonnées",
        date: "2026-05-28",
        state: "done",
        description: "Métadonnées détectées avec une confiance de 87 %.",
        actor: "OpenScience IA",
      },
      {
        label: "Validation départementale",
        date: "—",
        state: "current",
        description: "En cours d'examen par le département.",
        actor: "Dr. Ondoa Mvondo Alice",
      },
      { label: "Preuve d'authenticité", date: "—", state: "pending" },
      { label: "Publication en accès libre", date: "—", state: "pending" },
    ],
  },
  {
    id: "indexation-semantique-corpus",
    reference: "OSH-2026-0048",
    title: "Indexation sémantique d'un corpus scientifique francophone",
    type: "Article",
    status: "En attente",
    domain: "Informatique",
    faculty: "École Nationale Supérieure Polytechnique",
    department: "Génie Informatique",
    level: "Master 2",
    language: "Français",
    abstract:
      "Présentation d'une méthode d'indexation sémantique fondée sur des plongements contextuels adaptés au français scientifique, surpassant les méthodes lexicales classiques.",
    keywords: ["Indexation sémantique", "Plongements", "Recherche d'information"],
    pages: 16,
    fileSize: "1,5 Mo",
    submittedAt: "2026-05-19",
    updatedAt: "2026-05-22",
    views: 0,
    downloads: 0,
    aiConfidence: 89,
    reviewer: "Pr. Fokou Tagne Michel",
    timeline: [
      { label: "Dépôt soumis", date: "2026-05-19", state: "done", actor: "Vous" },
      {
        label: "Extraction IA des métadonnées",
        date: "2026-05-19",
        state: "done",
        actor: "OpenScience IA",
      },
      {
        label: "Validation départementale",
        date: "—",
        state: "current",
        description: "Compléments demandés : préciser le protocole d'évaluation.",
        actor: "Pr. Fokou Tagne Michel",
      },
      { label: "Preuve d'authenticité", date: "—", state: "pending" },
      { label: "Publication en accès libre", date: "—", state: "pending" },
    ],
  },
  {
    id: "detection-plagiat-embeddings",
    reference: "OSH-2026-0055",
    title: "Détection de plagiat translingue par plongements de phrases",
    type: "Mémoire",
    status: "Brouillon",
    domain: "Intelligence Artificielle",
    faculty: "École Nationale Supérieure Polytechnique",
    department: "Génie Informatique",
    level: "Master 2",
    language: "Français",
    abstract:
      "Brouillon de travail portant sur la détection de similarités translingues entre documents à l'aide de plongements de phrases multilingues.",
    keywords: ["Plagiat", "Plongements multilingues", "Similarité"],
    pages: 0,
    fileSize: "—",
    submittedAt: "—",
    updatedAt: "2026-06-01",
    views: 0,
    downloads: 0,
    aiConfidence: 0,
    timeline: [
      {
        label: "Brouillon créé",
        date: "2026-06-01",
        state: "current",
        description: "Document non encore soumis pour validation.",
        actor: "Vous",
      },
      { label: "Extraction IA des métadonnées", date: "—", state: "pending" },
      { label: "Validation départementale", date: "—", state: "pending" },
      { label: "Preuve d'authenticité", date: "—", state: "pending" },
      { label: "Publication en accès libre", date: "—", state: "pending" },
    ],
  },
  {
    id: "ontologie-science-ouverte",
    reference: "OSH-2026-0031",
    title: "Vers une ontologie partagée pour la science ouverte universitaire",
    type: "Rapport",
    status: "Rejeté",
    domain: "Sciences de l'Information",
    faculty: "Faculté des Sciences",
    department: "Sciences de l'Information",
    level: "Master 2",
    language: "Français",
    abstract:
      "Proposition d'une ontologie commune pour décrire les travaux scientifiques. Le rapport doit être complété pour préciser l'alignement avec les standards existants.",
    keywords: ["Ontologie", "Science ouverte", "Métadonnées"],
    pages: 24,
    fileSize: "2,1 Mo",
    submittedAt: "2026-03-05",
    updatedAt: "2026-03-14",
    views: 0,
    downloads: 0,
    aiConfidence: 78,
    reviewer: "Pr. Tabi Manga Joseph",
    rejectionReason:
      "Le document doit aligner l'ontologie proposée sur les standards existants (Dublin Core, schema.org) et fournir des exemples d'instanciation avant une nouvelle soumission.",
    timeline: [
      { label: "Dépôt soumis", date: "2026-03-05", state: "done", actor: "Vous" },
      {
        label: "Extraction IA des métadonnées",
        date: "2026-03-05",
        state: "done",
        actor: "OpenScience IA",
      },
      {
        label: "Validation départementale",
        date: "2026-03-14",
        state: "rejected",
        description: "Dépôt renvoyé pour révision.",
        actor: "Pr. Tabi Manga Joseph",
      },
    ],
  },
];

export function getDossier(id: string): Dossier | undefined {
  return myDossiers.find((d) => d.id === id);
}

export function getProofDossier(id: string): Dossier | undefined {
  return myDossiers.find((d) => d.id === id && d.proof);
}

const countByStatus = (s: DossierStatus) =>
  myDossiers.filter((d) => d.status === s).length;

export const depositorStats = {
  total: myDossiers.length,
  validated: countByStatus("Validé"),
  pending: countByStatus("En attente"),
  draft: countByStatus("Brouillon"),
  rejected: countByStatus("Rejeté"),
  views: myDossiers.reduce((sum, d) => sum + d.views, 0),
  downloads: myDossiers.reduce((sum, d) => sum + d.downloads, 0),
};

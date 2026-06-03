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

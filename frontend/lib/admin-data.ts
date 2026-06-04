import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  FileBadge2,
  FileCog,
  FolderTree,
  KeyRound,
  LayoutDashboard,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  title: string;
  items: AdminNavItem[];
}

export const adminNav: AdminNavGroup[] = [
  {
    title: "Pilotage",
    items: [
      { label: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Statistiques", href: "/admin/statistiques", icon: BarChart3 },
      { label: "Audit système", href: "/admin/audit", icon: ScrollText },
    ],
  },
  {
    title: "Accès & rôles",
    items: [
      { label: "Utilisateurs", href: "/admin/utilisateurs", icon: Users },
      { label: "Rôles & permissions", href: "/admin/roles", icon: ShieldCheck },
    ],
  },
  {
    title: "Référentiels",
    items: [
      { label: "Institutions", href: "/admin/institutions", icon: Building2 },
      { label: "Structures", href: "/admin/structures", icon: FolderTree },
      { label: "Types de documents", href: "/admin/types-documents", icon: FileCog },
    ],
  },
  {
    title: "Processus & IA",
    items: [
      { label: "Workflows", href: "/admin/workflows", icon: Workflow },
      { label: "Paramètres IA", href: "/admin/ia", icon: Sparkles },
      { label: "SSI / e-IDStack", href: "/admin/ssi", icon: KeyRound },
      { label: "Preuves & vérifications", href: "/admin/preuves", icon: FileBadge2 },
    ],
  },
];

export const adminAccount = {
  name: "Dr. Aïcha Ndongo",
  role: "Administrateur",
  email: "a.ndongo@uy1.cm",
  initials: "AN",
};

export type ServiceStatus = "operational" | "degraded" | "down";

export interface ServiceHealth {
  name: string;
  category: string;
  status: ServiceStatus;
  uptime: string;
  latency: string;
  note?: string;
}

export const services: ServiceHealth[] = [
  { name: "API REST", category: "Cœur applicatif", status: "operational", uptime: "99,98 %", latency: "82 ms" },
  { name: "Moteur de recherche", category: "Indexation", status: "operational", uptime: "99,95 %", latency: "120 ms" },
  { name: "Base de données", category: "Cœur applicatif", status: "operational", uptime: "99,99 %", latency: "12 ms" },
  { name: "Stockage objets (PDF)", category: "Stockage", status: "operational", uptime: "99,97 %", latency: "45 ms" },
  { name: "Service d'extraction IA", category: "Intelligence", status: "degraded", uptime: "99,21 %", latency: "1,8 s", note: "Charge élevée — file d'attente +14" },
  { name: "Assistant IA", category: "Intelligence", status: "operational", uptime: "99,90 %", latency: "640 ms" },
  { name: "e-IDStack (SSI)", category: "Sécurité", status: "operational", uptime: "99,99 %", latency: "210 ms" },
  { name: "File de traitement", category: "Asynchrone", status: "down", uptime: "97,40 %", latency: "—", note: "Redémarrage planifié en cours" },
];

export type UserRole =
  | "Administrateur"
  | "Gestionnaire"
  | "Validateur"
  | "Déposant"
  | "Lecteur";

export type UserStatus = "Actif" | "Suspendu" | "Invité";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  structure: string;
  status: UserStatus;
  lastActive: string;
  initials: string;
}

export const adminUsers: AdminUser[] = [
  { id: "u-001", name: "Dr. Aïcha Ndongo", email: "a.ndongo@uy1.cm", role: "Administrateur", structure: "Rectorat", status: "Actif", lastActive: "Il y a 5 min", initials: "AN" },
  { id: "u-002", name: "Pr. Atangana Messi Bernard", email: "b.atangana@uy1.cm", role: "Gestionnaire", structure: "Faculté des Sciences", status: "Actif", lastActive: "Il y a 2 h", initials: "AB" },
  { id: "u-003", name: "Dr. Owona Essomba Paul", email: "p.owona@uy1.cm", role: "Validateur", structure: "Génie Informatique", status: "Actif", lastActive: "Hier", initials: "OP" },
  { id: "u-004", name: "Mballa Ngono Carole", email: "c.mballa@uy1.cm", role: "Déposant", structure: "Informatique", status: "Actif", lastActive: "Il y a 3 j", initials: "MC" },
  { id: "u-005", name: "Kamdem Tiotsop Brice", email: "b.kamdem@uy1.cm", role: "Déposant", structure: "Génie Informatique", status: "Suspendu", lastActive: "Il y a 18 j", initials: "KB" },
  { id: "u-006", name: "Dr. Njoya Hamadou", email: "h.njoya@uy1.cm", role: "Validateur", structure: "Mathématiques", status: "Actif", lastActive: "Il y a 6 h", initials: "NH" },
  { id: "u-007", name: "Abena Ekani Sandrine", email: "s.abena@uy1.cm", role: "Gestionnaire", structure: "Bibliothèque centrale", status: "Actif", lastActive: "Il y a 1 j", initials: "AE" },
  { id: "u-008", name: "Fouda Belinga Yann", email: "y.fouda@uy1.cm", role: "Lecteur", structure: "Génie Électrique", status: "Invité", lastActive: "Jamais connecté", initials: "FY" },
  { id: "u-009", name: "Sahou Mengue Régine", email: "r.sahou@uy1.cm", role: "Déposant", structure: "Informatique", status: "Actif", lastActive: "Il y a 4 h", initials: "SR" },
  { id: "u-010", name: "Mefo'o Nyanga Olivier", email: "o.mefoo@uy1.cm", role: "Validateur", structure: "Sciences Biomédicales", status: "Suspendu", lastActive: "Il y a 30 j", initials: "MO" },
];

export interface RoleDefinition {
  key: string;
  name: UserRole;
  description: string;
  scope: string;
  users: number;
  tone: "brand" | "primary" | "ai" | "success" | "secondary";
}

export const roles: RoleDefinition[] = [
  { key: "admin", name: "Administrateur", description: "Accès complet à la configuration, la sécurité et la gouvernance.", scope: "Global", users: 4, tone: "brand" },
  { key: "manager", name: "Gestionnaire", description: "Gère les référentiels, structures, collections et métadonnées.", scope: "Institution", users: 12, tone: "primary" },
  { key: "validator", name: "Validateur", description: "Valide ou rejette les dépôts soumis dans son périmètre.", scope: "Faculté", users: 28, tone: "ai" },
  { key: "depositor", name: "Déposant", description: "Dépose des documents et suit le statut de ses dépôts.", scope: "Personnel", users: 612, tone: "success" },
  { key: "reader", name: "Lecteur", description: "Consulte et télécharge les documents publics.", scope: "Public", users: 1192, tone: "secondary" },
];

export interface PermissionCategory {
  category: string;
  permissions: { key: string; label: string }[];
}

export const permissionCategories: PermissionCategory[] = [
  {
    category: "Documents",
    permissions: [
      { key: "doc.view", label: "Consulter" },
      { key: "doc.deposit", label: "Déposer" },
      { key: "doc.validate", label: "Valider / rejeter" },
      { key: "doc.edit", label: "Éditer les métadonnées" },
      { key: "doc.delete", label: "Supprimer" },
    ],
  },
  {
    category: "Référentiels",
    permissions: [
      { key: "ref.structures", label: "Gérer les structures" },
      { key: "ref.types", label: "Gérer les types de documents" },
      { key: "ref.institutions", label: "Gérer les institutions" },
    ],
  },
  {
    category: "Administration",
    permissions: [
      { key: "adm.users", label: "Gérer les utilisateurs" },
      { key: "adm.roles", label: "Gérer les rôles" },
      { key: "adm.workflows", label: "Configurer les workflows" },
      { key: "adm.ia", label: "Paramètres IA" },
      { key: "adm.ssi", label: "Paramètres SSI" },
      { key: "adm.audit", label: "Consulter l'audit" },
    ],
  },
];

const allPermissionKeys = permissionCategories.flatMap((c) =>
  c.permissions.map((p) => p.key)
);

export const roleGrants: Record<string, string[]> = {
  admin: allPermissionKeys,
  manager: [
    "doc.view",
    "doc.deposit",
    "doc.edit",
    "ref.structures",
    "ref.types",
    "ref.institutions",
  ],
  validator: ["doc.view", "doc.validate", "doc.edit"],
  depositor: ["doc.view", "doc.deposit"],
  reader: ["doc.view"],
};

export type AuditSeverity = "info" | "warning" | "critical";

export interface AuditEntry {
  id: string;
  time: string;
  actor: string;
  role: UserRole;
  action: string;
  target: string;
  ip: string;
  severity: AuditSeverity;
}

export const auditLog: AuditEntry[] = [
  { id: "a-2048", time: "03/06/2026 17:42", actor: "Dr. Aïcha Ndongo", role: "Administrateur", action: "Modification d'un rôle", target: "Rôle « Validateur »", ip: "10.12.4.18", severity: "warning" },
  { id: "a-2047", time: "03/06/2026 17:15", actor: "Système", role: "Administrateur", action: "Alerte service", target: "File de traitement (down)", ip: "—", severity: "critical" },
  { id: "a-2046", time: "03/06/2026 16:58", actor: "Pr. Atangana Messi Bernard", role: "Gestionnaire", action: "Création de structure", target: "Département « Sciences de la Terre »", ip: "10.12.7.9", severity: "info" },
  { id: "a-2045", time: "03/06/2026 16:30", actor: "Dr. Owona Essomba Paul", role: "Validateur", action: "Validation de dépôt", target: "doc-008 — Indexation sémantique…", ip: "10.12.5.41", severity: "info" },
  { id: "a-2044", time: "03/06/2026 15:12", actor: "Dr. Aïcha Ndongo", role: "Administrateur", action: "Émission d'une preuve e-IDStack", target: "doc-003 — Optimisation recherche…", ip: "10.12.4.18", severity: "info" },
  { id: "a-2043", time: "03/06/2026 14:05", actor: "Kamdem Tiotsop Brice", role: "Déposant", action: "Tentative d'accès refusée", target: "/admin/utilisateurs", ip: "41.202.219.7", severity: "warning" },
  { id: "a-2042", time: "03/06/2026 11:48", actor: "Abena Ekani Sandrine", role: "Gestionnaire", action: "Mise à jour des paramètres IA", target: "Seuil de confiance → 0,85", ip: "10.12.7.22", severity: "info" },
  { id: "a-2041", time: "03/06/2026 10:21", actor: "Dr. Aïcha Ndongo", role: "Administrateur", action: "Suspension d'un utilisateur", target: "Mefo'o Nyanga Olivier", ip: "10.12.4.18", severity: "warning" },
  { id: "a-2040", time: "02/06/2026 18:03", actor: "Système", role: "Administrateur", action: "Sauvegarde planifiée", target: "Base de données + stockage", ip: "—", severity: "info" },
  { id: "a-2039", time: "02/06/2026 16:37", actor: "Dr. Njoya Hamadou", role: "Validateur", action: "Rejet de dépôt", target: "doc-014 — métadonnées incomplètes", ip: "10.12.5.60", severity: "info" },
  { id: "a-2038", time: "02/06/2026 09:14", actor: "Système", role: "Administrateur", action: "Échec d'authentification (x5)", target: "compte b.kamdem", ip: "197.234.18.3", severity: "critical" },
  { id: "a-2037", time: "01/06/2026 22:50", actor: "Pr. Atangana Messi Bernard", role: "Gestionnaire", action: "Import de référentiel", target: "Filières — Faculté des Sciences", ip: "10.12.7.9", severity: "info" },
];

export const proofsSummary = {
  emitted: 1086,
  verified: 1042,
  pending: 38,
  failed: 6,
};

/* -------------------------------------------------------------------------- */
/* Institutions                                                               */
/* -------------------------------------------------------------------------- */

export interface Institution {
  id: string;
  name: string;
  acronym: string;
  type: "Université" | "Grande École" | "Institut";
  city: string;
  emailDomain: string;
  documents: number;
  status: "Active" | "Inactive";
  license: string;
}

export const institutions: Institution[] = [
  { id: "inst-001", name: "Université de Yaoundé I", acronym: "UY1", type: "Université", city: "Yaoundé", emailDomain: "uy1.cm", documents: 9842, status: "Active", license: "Établissement (illimité)" },
  { id: "inst-002", name: "École Nationale Supérieure Polytechnique", acronym: "ENSP", type: "Grande École", city: "Yaoundé", emailDomain: "polytechnique.cm", documents: 3142, status: "Active", license: "Établissement (illimité)" },
  { id: "inst-003", name: "Université de Douala", acronym: "UD", type: "Université", city: "Douala", emailDomain: "univ-douala.cm", documents: 5217, status: "Active", license: "Standard" },
  { id: "inst-004", name: "Université de Dschang", acronym: "UDs", type: "Université", city: "Dschang", emailDomain: "univ-dschang.cm", documents: 4103, status: "Active", license: "Standard" },
  { id: "inst-005", name: "Institut Universitaire de Technologie", acronym: "IUT", type: "Institut", city: "Bandjoun", emailDomain: "iut-fv.cm", documents: 1186, status: "Inactive", license: "Évaluation" },
];

/* -------------------------------------------------------------------------- */
/* Structures académiques (arbre)                                             */
/* -------------------------------------------------------------------------- */

export interface StructureProgram {
  id: string;
  name: string;
  level: string;
}

export interface StructureDepartment {
  id: string;
  name: string;
  head: string;
  students: number;
  documents: number;
  programs: StructureProgram[];
}

export interface StructureFaculty {
  id: string;
  name: string;
  head: string;
  students: number;
  documents: number;
  departments: StructureDepartment[];
}

export const structureTree: StructureFaculty[] = [
  {
    id: "fac-sci",
    name: "Faculté des Sciences",
    head: "Pr. Tabi Manga Joseph",
    students: 8420,
    documents: 4870,
    departments: [
      {
        id: "dep-info",
        name: "Informatique",
        head: "Pr. Atangana Messi Bernard",
        students: 1840,
        documents: 1986,
        programs: [
          { id: "pr-info-l", name: "Licence Informatique", level: "Licence" },
          { id: "pr-info-m", name: "Master Génie Logiciel", level: "Master" },
          { id: "pr-info-d", name: "Doctorat Informatique", level: "Doctorat" },
        ],
      },
      {
        id: "dep-math",
        name: "Mathématiques",
        head: "Dr. Njoya Hamadou",
        students: 1120,
        documents: 842,
        programs: [
          { id: "pr-math-l", name: "Licence Mathématiques", level: "Licence" },
          { id: "pr-math-m", name: "Master Math. Appliquées", level: "Master" },
        ],
      },
      {
        id: "dep-terre",
        name: "Sciences de la Terre",
        head: "Pr. Bekolo Ewondo Marthe",
        students: 760,
        documents: 514,
        programs: [
          { id: "pr-terre-m", name: "Master Géosciences", level: "Master" },
          { id: "pr-terre-d", name: "Doctorat Hydrologie", level: "Doctorat" },
        ],
      },
    ],
  },
  {
    id: "fac-ensp",
    name: "École Nationale Supérieure Polytechnique",
    head: "Pr. Mbarga Onana Désiré",
    students: 3960,
    documents: 3142,
    departments: [
      {
        id: "dep-gi",
        name: "Génie Informatique",
        head: "Dr. Owona Essomba Paul",
        students: 980,
        documents: 1204,
        programs: [
          { id: "pr-gi-i", name: "Cycle Ingénieur GI", level: "Ingénieur" },
          { id: "pr-gi-d", name: "Doctorat IA", level: "Doctorat" },
        ],
      },
      {
        id: "dep-ge",
        name: "Génie Électrique",
        head: "Dr. Ngo Bisseck Pauline",
        students: 870,
        documents: 738,
        programs: [
          { id: "pr-ge-i", name: "Cycle Ingénieur GE", level: "Ingénieur" },
        ],
      },
      {
        id: "dep-tel",
        name: "Télécommunications",
        head: "Pr. Souop Kenfack Liliane",
        students: 640,
        documents: 596,
        programs: [
          { id: "pr-tel-i", name: "Cycle Ingénieur Télécoms", level: "Ingénieur" },
          { id: "pr-tel-d", name: "Doctorat Réseaux", level: "Doctorat" },
        ],
      },
    ],
  },
  {
    id: "fac-med",
    name: "Faculté de Médecine et des Sciences Biomédicales",
    head: "Pr. Mefo'o Nyanga Olivier",
    students: 2140,
    documents: 2031,
    departments: [
      {
        id: "dep-bio",
        name: "Sciences Biomédicales",
        head: "Pr. Mefo'o Nyanga Olivier",
        students: 1180,
        documents: 1342,
        programs: [
          { id: "pr-bio-m", name: "Master Sciences Biomédicales", level: "Master" },
          { id: "pr-bio-d", name: "Doctorat Santé Numérique", level: "Doctorat" },
        ],
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Workflows                                                                  */
/* -------------------------------------------------------------------------- */

export type WorkflowStepType = "start" | "task" | "decision" | "end";

export interface WorkflowStep {
  id: string;
  name: string;
  role: string;
  sla: string;
  type: WorkflowStepType;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  active: boolean;
  steps: WorkflowStep[];
}

export const workflows: Workflow[] = [
  {
    id: "wf-standard",
    name: "Validation standard d'un dépôt",
    description: "Circuit par défaut pour mémoires, articles et rapports.",
    active: true,
    steps: [
      { id: "s1", name: "Dépôt soumis", role: "Déposant", sla: "—", type: "start" },
      { id: "s2", name: "Extraction IA", role: "Système", sla: "< 2 min", type: "task" },
      { id: "s3", name: "Contrôle métadonnées", role: "Gestionnaire", sla: "2 jours", type: "task" },
      { id: "s4", name: "Validation scientifique", role: "Validateur", sla: "5 jours", type: "decision" },
      { id: "s5", name: "Émission de preuve", role: "Système", sla: "< 1 min", type: "task" },
      { id: "s6", name: "Publication", role: "Système", sla: "immédiat", type: "end" },
    ],
  },
  {
    id: "wf-these",
    name: "Validation d'une thèse",
    description: "Circuit renforcé avec double validation et embargo possible.",
    active: true,
    steps: [
      { id: "t1", name: "Dépôt soumis", role: "Déposant", sla: "—", type: "start" },
      { id: "t2", name: "Extraction IA", role: "Système", sla: "< 2 min", type: "task" },
      { id: "t3", name: "Vérification anti-plagiat", role: "Système", sla: "1 jour", type: "task" },
      { id: "t4", name: "Validation département", role: "Validateur", sla: "7 jours", type: "decision" },
      { id: "t5", name: "Validation bibliothèque", role: "Gestionnaire", sla: "3 jours", type: "decision" },
      { id: "t6", name: "Publication / embargo", role: "Système", sla: "selon licence", type: "end" },
    ],
  },
  {
    id: "wf-correction",
    name: "Demande de correction",
    description: "Renvoi au déposant en cas de métadonnées incomplètes.",
    active: false,
    steps: [
      { id: "c1", name: "Anomalie détectée", role: "Validateur", sla: "—", type: "start" },
      { id: "c2", name: "Notification au déposant", role: "Système", sla: "immédiat", type: "task" },
      { id: "c3", name: "Correction", role: "Déposant", sla: "10 jours", type: "task" },
      { id: "c4", name: "Re-soumission", role: "Déposant", sla: "—", type: "end" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Types de documents                                                         */
/* -------------------------------------------------------------------------- */

export const metadataFields = [
  "Titre",
  "Auteurs",
  "Encadreurs",
  "Résumé",
  "Mots-clés",
  "Année",
  "Faculté",
  "Département",
  "Domaine",
  "Langue",
  "Licence",
  "Niveau académique",
];

export const availableLicenses = [
  "CC BY 4.0",
  "CC BY-SA 4.0",
  "CC BY-NC 4.0",
  "Tous droits réservés",
];

export interface DocTypeConfig {
  type: string;
  defaultAccess: "Public" | "Restreint";
  requiredFields: string[];
  licenses: string[];
  citation: string;
  aiExtraction: boolean;
  aiThreshold: number;
}

export const documentTypeConfigs: DocTypeConfig[] = [
  {
    type: "Mémoire",
    defaultAccess: "Public",
    requiredFields: ["Titre", "Auteurs", "Encadreurs", "Résumé", "Année", "Département", "Niveau académique"],
    licenses: ["CC BY 4.0", "CC BY-NC 4.0"],
    citation: "{auteurs} ({année}). {titre}. {niveau}, {institution}.",
    aiExtraction: true,
    aiThreshold: 85,
  },
  {
    type: "Thèse",
    defaultAccess: "Public",
    requiredFields: ["Titre", "Auteurs", "Encadreurs", "Résumé", "Mots-clés", "Année", "Département", "Domaine", "Niveau académique"],
    licenses: ["CC BY 4.0", "CC BY-NC 4.0", "Tous droits réservés"],
    citation: "{auteurs} ({année}). {titre} [Thèse de doctorat]. {institution}.",
    aiExtraction: true,
    aiThreshold: 90,
  },
  {
    type: "Article",
    defaultAccess: "Public",
    requiredFields: ["Titre", "Auteurs", "Résumé", "Mots-clés", "Année", "Domaine"],
    licenses: ["CC BY 4.0", "CC BY-SA 4.0"],
    citation: "{auteurs} ({année}). {titre}. {revue}.",
    aiExtraction: true,
    aiThreshold: 80,
  },
  {
    type: "Rapport",
    defaultAccess: "Restreint",
    requiredFields: ["Titre", "Auteurs", "Année", "Département"],
    licenses: ["CC BY 4.0", "Tous droits réservés"],
    citation: "{auteurs} ({année}). {titre} [Rapport de recherche]. {institution}.",
    aiExtraction: true,
    aiThreshold: 75,
  },
];

/* -------------------------------------------------------------------------- */
/* Paramètres IA                                                              */
/* -------------------------------------------------------------------------- */

export interface AiField {
  key: string;
  label: string;
  enabled: boolean;
}

export const aiDefaults = {
  autoExtraction: true,
  threshold: 85,
  model: "OSH-Extract v2 (multilingue)",
  language: "Détection automatique",
  assistantEnabled: true,
  assistantScope: "Documents publics validés",
  anonymize: true,
  piiFilter: true,
  logging: true,
  retentionDays: 90,
  fields: [
    { key: "title", label: "Titre", enabled: true },
    { key: "authors", label: "Auteurs", enabled: true },
    { key: "supervisors", label: "Encadreurs", enabled: true },
    { key: "abstract", label: "Résumé", enabled: true },
    { key: "keywords", label: "Mots-clés", enabled: true },
    { key: "year", label: "Année", enabled: true },
    { key: "domain", label: "Domaine", enabled: true },
    { key: "language", label: "Langue", enabled: false },
  ] as AiField[],
};

export const aiModels = [
  "OSH-Extract v2 (multilingue)",
  "OSH-Extract v1 (français)",
  "BERT-FR fine-tuned",
];

export const aiLanguages = [
  "Détection automatique",
  "Français",
  "Anglais",
  "Bilingue FR/EN",
];

/* -------------------------------------------------------------------------- */
/* SSI / e-IDStack                                                            */
/* -------------------------------------------------------------------------- */

export interface SsiEmission {
  id: string;
  document: string;
  date: string;
  status: "Émise" | "En cours" | "Échec";
}

export const ssiConfig = {
  endpoint: "https://eidstack.gov.cm/api/v2",
  clientId: "osh-uy1-prod",
  secret: "sk_live_9f2c8a7b1d4e6f3a2c5b8d1e",
  connected: true,
  algorithm: "SHA-256 + ECDSA (P-256)",
  timestampAuthority: "TSA Nationale (Cameroun)",
  autoEmit: true,
  lastSync: "03/06/2026 16:40",
  emissions: [
    { id: "em-1042", document: "doc-003 — Optimisation recherche à facettes", date: "03/06/2026 14:05", status: "Émise" },
    { id: "em-1041", document: "doc-008 — Indexation sémantique francophone", date: "03/06/2026 11:22", status: "Émise" },
    { id: "em-1040", document: "doc-009 — Diagnostic précoce du paludisme", date: "02/06/2026 18:48", status: "Émise" },
    { id: "em-1039", document: "doc-007 — Modélisation hydrologique", date: "02/06/2026 09:15", status: "En cours" },
    { id: "em-1038", document: "doc-014 — Sécurité des réseaux IoT", date: "01/06/2026 22:50", status: "Échec" },
  ] as SsiEmission[],
};

/* -------------------------------------------------------------------------- */
/* Preuves & vérifications                                                    */
/* -------------------------------------------------------------------------- */

export interface Proof {
  id: string;
  document: string;
  hash: string;
  emittedAt: string;
  status: "Vérifiée" | "En attente" | "Échec";
  method: string;
}

export const proofs: Proof[] = [
  { id: "pf-3042", document: "Optimisation de la recherche à facettes", hash: "9f2c8a7b1d4e…6f3a", emittedAt: "03/06/2026 14:05", status: "Vérifiée", method: "SHA-256 + ECDSA" },
  { id: "pf-3041", document: "Indexation sémantique de corpus francophones", hash: "a1b2c3d4e5f6…7a8b", emittedAt: "03/06/2026 11:22", status: "Vérifiée", method: "SHA-256 + ECDSA" },
  { id: "pf-3040", document: "Diagnostic précoce du paludisme", hash: "0fa1cc93b27d…4e91", emittedAt: "02/06/2026 18:48", status: "Vérifiée", method: "SHA-256 + ECDSA" },
  { id: "pf-3039", document: "Modélisation hydrologique des bassins versants", hash: "77de10b3a9c2…1f06", emittedAt: "02/06/2026 09:15", status: "En attente", method: "SHA-256 + ECDSA" },
  { id: "pf-3038", document: "Détection d'anomalies réseau", hash: "c4f8e2a6b0d1…9c33", emittedAt: "01/06/2026 22:50", status: "Échec", method: "SHA-256 + ECDSA" },
  { id: "pf-3037", document: "Conception d'un système d'archivage", hash: "2b9d7f1a4c6e…8d20", emittedAt: "01/06/2026 16:30", status: "Vérifiée", method: "SHA-256 + ECDSA" },
  { id: "pf-3036", document: "Classification automatique de documents", hash: "5e3a1b8c2f7d…0a4f", emittedAt: "31/05/2026 10:12", status: "Vérifiée", method: "SHA-256 + ECDSA" },
];

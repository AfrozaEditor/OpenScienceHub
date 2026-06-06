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

import type { LucideIcon } from "lucide-react";
import { ClipboardCheck, Cog, Globe, UploadCloud } from "lucide-react";

export interface PortalDef {
  id: string;
  label: string;
  description: string;
  href: string;
  match: string;
  icon: LucideIcon;
  accent: string;
}

export const portals: PortalDef[] = [
  {
    id: "public",
    label: "Site public",
    description: "Explorer et consulter les travaux",
    href: "/",
    match: "/",
    icon: Globe,
    accent: "bg-primary/10 text-primary",
  },
  {
    id: "deposant",
    label: "Espace déposant",
    description: "Déposer et suivre vos dossiers",
    href: "/deposant/dashboard",
    match: "/deposant",
    icon: UploadCloud,
    accent: "bg-ai/10 text-ai",
  },
  {
    id: "validation",
    label: "Validation académique",
    description: "Examiner, donner un avis et décider",
    href: "/validation/dashboard",
    match: "/validation",
    icon: ClipboardCheck,
    accent: "bg-success/12 text-success",
  },
  {
    id: "admin",
    label: "Administration",
    description: "Gouvernance et configuration",
    href: "/admin/dashboard",
    match: "/admin",
    icon: Cog,
    accent: "bg-brand/10 text-brand",
  },
];

export function currentPortalId(pathname: string): string {
  const nonRoot = portals.filter(
    (p) =>
      p.match !== "/" &&
      (pathname === p.match || pathname.startsWith(p.match + "/"))
  );
  if (nonRoot.length) {
    return nonRoot.sort((a, b) => b.match.length - a.match.length)[0].id;
  }
  return "public";
}

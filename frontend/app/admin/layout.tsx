import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Administration — OpenScience Hub",
  description:
    "Portail d'administration : utilisateurs, rôles, référentiels, workflows, IA, sécurité, preuves et audit.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}

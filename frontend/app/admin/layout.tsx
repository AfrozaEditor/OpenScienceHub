import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AuthGuard } from "@/components/auth-guard";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Administration — OpenScience Hub",
  description:
    "Portail d'administration : utilisateurs, rôles, référentiels, parcours de validation, IA, sécurité, preuves et audit.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard roles={["admin"]}>
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}

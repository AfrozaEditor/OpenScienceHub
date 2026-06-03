import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ValidationShell } from "@/components/validation/validation-shell";

export const metadata: Metadata = {
  title: "Validation académique — OpenScience Hub",
  description:
    "Portail de validation : file de dossiers à traiter, examen des métadonnées, avis, corrections, décision et archivage.",
};

export default function ValidationLayout({ children }: { children: ReactNode }) {
  return <ValidationShell>{children}</ValidationShell>;
}

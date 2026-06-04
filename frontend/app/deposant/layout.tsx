import type { ReactNode } from "react";

import { DeposantShell } from "@/components/layout/deposant-shell";

export default function DeposantLayout({ children }: { children: ReactNode }) {
  return <DeposantShell>{children}</DeposantShell>;
}

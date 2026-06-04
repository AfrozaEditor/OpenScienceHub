import type { ReactNode } from "react";

import { AuthGuard } from "@/components/auth-guard";
import { DeposantShell } from "@/components/layout/deposant-shell";

export default function DeposantLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard roles={["deposant", "admin"]}>
      <DeposantShell>{children}</DeposantShell>
    </AuthGuard>
  );
}

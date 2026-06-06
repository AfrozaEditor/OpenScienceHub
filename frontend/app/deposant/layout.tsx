import type { ReactNode } from "react";

import { AuthGuard } from "@/components/auth-guard";
import { DeposantShell } from "@/components/layout/deposant-shell";

export default function DeposantLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard roles={["deposant"]}>
      <DeposantShell>{children}</DeposantShell>
    </AuthGuard>
  );
}

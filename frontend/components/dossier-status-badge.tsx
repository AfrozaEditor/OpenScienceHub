import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { DossierStatus } from "@/lib/domain-types";

const config: Record<
  DossierStatus,
  {
    variant: "success" | "warning" | "destructive" | "secondary";
    icon: typeof CheckCircle2;
  }
> = {
  Validé: { variant: "success", icon: CheckCircle2 },
  "En attente": { variant: "warning", icon: Clock },
  Rejeté: { variant: "destructive", icon: XCircle },
  Brouillon: { variant: "secondary", icon: FileText },
};

export function DossierStatusBadge({ status }: { status: DossierStatus }) {
  const { variant, icon: Icon } = config[status];
  return (
    <Badge variant={variant}>
      <Icon className="size-3" />
      {status}
    </Badge>
  );
}

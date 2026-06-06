import { CheckCircle2, Clock, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { DocumentStatus } from "@/lib/domain-types";

const config: Record<
  DocumentStatus,
  { variant: "success" | "warning" | "destructive"; icon: typeof CheckCircle2 }
> = {
  Validé: { variant: "success", icon: CheckCircle2 },
  "En attente": { variant: "warning", icon: Clock },
  Rejeté: { variant: "destructive", icon: XCircle },
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const { variant, icon: Icon } = config[status];
  return (
    <Badge variant={variant}>
      <Icon className="size-3" />
      {status}
    </Badge>
  );
}

import * as React from "react";
import {
  FileBarChart,
  FileText,
  GraduationCap,
  Globe,
  Lock,
  Newspaper,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AccessLevel, DocumentType } from "@/lib/domain-types";

const typeConfig: Record<
  DocumentType,
  { variant: "default" | "thesis" | "ai" | "brand"; icon: typeof FileText }
> = {
  Mémoire: { variant: "default", icon: FileText },
  Thèse: { variant: "thesis", icon: GraduationCap },
  Article: { variant: "ai", icon: Newspaper },
  Rapport: { variant: "brand", icon: FileBarChart },
};

export function DocumentTypeBadge({
  type,
  withIcon = true,
}: {
  type: DocumentType;
  withIcon?: boolean;
}) {
  const { variant, icon: Icon } = typeConfig[type];
  return (
    <Badge variant={variant}>
      {withIcon && <Icon className="size-3" />}
      {type}
    </Badge>
  );
}

export function AccessBadge({ access }: { access: AccessLevel }) {
  return access === "Public" ? (
    <Badge variant="outline" className="text-success">
      <Globe className="size-3" />
      Public
    </Badge>
  ) : (
    <Badge variant="outline" className="text-[#b45309]">
      <Lock className="size-3" />
      Restreint
    </Badge>
  );
}

export function MetadataBadge({
  children,
  icon: Icon,
  className,
}: {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <Badge variant="secondary" className={cn("font-normal", className)}>
      {Icon && <Icon className="size-3" />}
      {children}
    </Badge>
  );
}

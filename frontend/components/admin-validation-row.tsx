"use client";

import * as React from "react";
import { Check, Eye, Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentTypeBadge } from "@/components/metadata-badge";
import { StatusBadge } from "@/components/status-badge";
import type { ScientificDocument } from "@/lib/domain-types";

export function AdminValidationRow({ doc }: { doc: ScientificDocument }) {
  const [resolution, setResolution] = React.useState<
    "Validé" | "Rejeté" | null
  >(null);

  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-muted/40">
      <td className="max-w-sm px-4 py-3 align-top">
        <p className="line-clamp-2 text-sm font-medium text-foreground">
          {doc.title}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <DocumentTypeBadge type={doc.type} withIcon={false} />
          <span className="text-xs text-muted-foreground">{doc.year}</span>
        </div>
      </td>
      <td className="px-4 py-3 align-top text-sm text-muted-foreground">
        {doc.authors[0]}
      </td>
      <td className="hidden px-4 py-3 align-top text-sm text-muted-foreground md:table-cell">
        {doc.department}
      </td>
      <td className="hidden px-4 py-3 align-top text-sm text-muted-foreground lg:table-cell">
        {new Date(doc.submittedAt).toLocaleDateString("fr-FR")}
      </td>
      <td className="px-4 py-3 align-top">
        {resolution ? (
          <StatusBadge status={resolution} />
        ) : (
          <StatusBadge status={doc.status} />
        )}
      </td>
      <td className="px-4 py-3 align-top">
        {resolution ? (
          <Badge variant="secondary" className="font-normal">
            Traité
          </Badge>
        ) : (
          <div className="flex items-center justify-end gap-1">
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-success hover:bg-success/10"
              aria-label="Valider"
              onClick={() => setResolution("Validé")}
            >
              <Check className="size-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-destructive hover:bg-destructive/10"
              aria-label="Rejeter"
              onClick={() => setResolution("Rejeté")}
            >
              <X className="size-4" />
            </Button>
            <Button size="icon-sm" variant="ghost" aria-label="Modifier les métadonnées">
              <Pencil className="size-4" />
            </Button>
            <Button size="icon-sm" variant="ghost" aria-label="Voir le PDF">
              <Eye className="size-4" />
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
}

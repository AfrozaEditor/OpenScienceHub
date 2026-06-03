import { Layers } from "lucide-react";

import { DocumentCardCompact } from "@/components/document-card";
import type { ScientificDocument } from "@/lib/mock-data";

export function SimilarDocuments({ docs }: { docs: ScientificDocument[] }) {
  if (docs.length === 0) return null;
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Layers className="size-4 text-primary" />
        <h2 className="font-heading text-base font-semibold text-foreground">
          Documents similaires
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
        {docs.map((doc) => (
          <DocumentCardCompact key={doc.id} doc={doc} />
        ))}
      </div>
    </section>
  );
}

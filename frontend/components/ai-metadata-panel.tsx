import * as React from "react";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AiField {
  label: string;
  value: React.ReactNode;
}

export function AiMetadataPanel({
  confidence,
  fields,
  footer,
  className,
}: {
  confidence?: number;
  fields: AiField[];
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-ai/30 bg-ai/5 p-5",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 60% at 100% 0%, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0) 60%)",
        }}
      />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-ai/15 text-ai">
            <Sparkles className="size-4" />
          </span>
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground">
              Métadonnées extraites par IA
            </h3>
            <p className="text-xs text-muted-foreground">
              Détectées automatiquement à partir du PDF
            </p>
          </div>
        </div>
        {typeof confidence === "number" && (
          <span className="flex items-center gap-1.5 rounded-full bg-ai/10 px-2.5 py-1 text-xs font-medium text-ai">
            <span className="size-1.5 rounded-full bg-ai" />
            Confiance {confidence}%
          </span>
        )}
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.label} className="flex flex-col gap-0.5">
            <dt className="text-xs font-medium text-ai">{f.label}</dt>
            <dd className="text-sm text-foreground">{f.value}</dd>
          </div>
        ))}
      </dl>

      {footer && (
        <div className="mt-4 border-t border-ai/20 pt-3">{footer}</div>
      )}
    </div>
  );
}

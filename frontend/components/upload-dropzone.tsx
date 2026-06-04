"use client";

import * as React from "react";
import { FileText, FileUp, UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function UploadDropzone({
  file,
  onFile,
  onClear,
}: {
  file: File | null;
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function validateAndSet(f: File | undefined) {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Format invalide. Seuls les fichiers PDF sont acceptés.");
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setError("Le fichier dépasse la taille maximale de 50 Mo.");
      return;
    }
    setError(null);
    onFile(f);
  }

  if (file) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-success/40 bg-success/5 p-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-success/12 text-success">
          <FileText className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatSize(file.size)} · Prêt pour l&apos;analyse IA
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClear} aria-label="Retirer le fichier">
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          validateAndSet(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : error
              ? "border-destructive/50 bg-destructive/5"
              : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <span
          className={cn(
            "flex size-14 items-center justify-center rounded-full transition-colors",
            dragging ? "bg-primary/15 text-primary" : "bg-primary/10 text-primary"
          )}
        >
          <UploadCloud className="size-7" />
        </span>
        <p className="mt-4 text-base font-semibold text-foreground">
          Glissez-déposez votre document PDF ici
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          ou cliquez pour parcourir vos fichiers · PDF jusqu&apos;à 50 Mo
        </p>
        <Button type="button" variant="outline" size="lg" className="mt-5 pointer-events-none">
          <FileUp className="size-4" />
          Sélectionner un fichier
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => validateAndSet(e.target.files?.[0] ?? undefined)}
        />
      </div>
      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-destructive">
          <X className="size-4" />
          {error}
        </p>
      )}
    </div>
  );
}

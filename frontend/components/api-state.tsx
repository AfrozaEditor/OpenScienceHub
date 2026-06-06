"use client";

import { AlertTriangle, Ban, FileQuestion, Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type ApiStateProps = {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
  children: React.ReactNode;
};

export function ApiState({
  loading,
  error,
  empty,
  emptyTitle = "Aucune donnée",
  emptyDescription = "Aucun élément ne correspond à ce contexte.",
  onRetry,
  children,
}: ApiStateProps) {
  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin text-primary" />
        Chargement des données...
      </div>
    );
  }

  if (error) {
    const forbidden = /403|droits|accès refusé/i.test(error);
    const unavailable = /502|indisponible|externe/i.test(error);
    const Icon = forbidden ? Ban : AlertTriangle;
    return (
      <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-6 text-center">
        <Icon className="mx-auto size-8 text-destructive" />
        <p className="mt-3 font-heading text-base font-semibold text-foreground">
          {forbidden
            ? "Accès refusé"
            : unavailable
              ? "Service temporairement indisponible"
              : "Impossible de charger les données"}
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{error}</p>
        {onRetry && (
          <Button variant="outline" className="mt-4" onClick={onRetry}>
            <RefreshCw className="size-4" />
            Réessayer
          </Button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <FileQuestion className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-3 font-heading text-base font-semibold text-foreground">{emptyTitle}</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

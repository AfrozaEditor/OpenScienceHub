"use client";

import { FileCog } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useApiResource } from "@/lib/api/hooks";
import { listDocumentTypes } from "@/lib/api/resources";

function listFrom<T>(data: { results: T[] } | T[] | null) {
  if (!data) return [];
  return Array.isArray(data) ? data : data.results;
}

export default function AdminDocumentTypesPage() {
  const types = useApiResource(() => listDocumentTypes(), [], null);
  const rows = listFrom<Record<string, unknown>>(types.data);

  return (
    <>
      <AdminPageHeader
        title="Types de documents"
        description="Types de travaux disponibles dans le référentiel documentaire."
      >
        <Badge variant="outline">
          <FileCog className="size-3" />
          {types.loading ? "Chargement..." : `${rows.length} type(s)`}
        </Badge>
      </AdminPageHeader>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.length === 0 ? (
          <Card className="sm:col-span-2 lg:col-span-3">
            <CardContent className="py-8 text-sm text-muted-foreground">
              Aucun type de document n'est configuré pour le moment.
            </CardContent>
          </Card>
        ) : (
          rows.map((row) => (
            <Card key={String(row.id || row.code)}>
              <CardContent>
                <p className="font-medium text-foreground">{String(row.label || row.name || row.code)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Code : {String(row.code || "—")}</p>
                <p className="mt-3 text-sm text-muted-foreground">{String(row.description || "")}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

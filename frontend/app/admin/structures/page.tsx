"use client";

import { Boxes, Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useApiResource } from "@/lib/api/hooks";
import { listDepartments, listFaculties } from "@/lib/api/resources";

function listFrom<T>(data: { results: T[] } | T[] | null) {
  if (!data) return [];
  return Array.isArray(data) ? data : data.results;
}

export default function AdminStructuresPage() {
  const faculties = useApiResource(() => listFaculties(), [], null);
  const departments = useApiResource(() => listDepartments(), [], null);
  const facultyRows = listFrom<Record<string, unknown>>(faculties.data);
  const departmentRows = listFrom<Record<string, unknown>>(departments.data);

  return (
    <>
      <AdminPageHeader
        title="Structures"
        description="Facultés et départements enregistrés pour les institutions partenaires."
      >
        <Badge variant="outline">
          <Building2 className="size-3" />
          {facultyRows.length} faculté(s)
        </Badge>
        <Badge variant="outline">
          <Boxes className="size-3" />
          {departmentRows.length} département(s)
        </Badge>
      </AdminPageHeader>
      <div className="grid gap-6 lg:grid-cols-2">
        <StructureList title="Facultés" rows={facultyRows} />
        <StructureList title="Départements" rows={departmentRows} />
      </div>
    </>
  );
}

function StructureList({ title, rows }: { title: string; rows: Record<string, unknown>[] }) {
  return (
    <Card>
      <CardContent>
        <h2 className="font-heading text-base font-semibold text-foreground">{title}</h2>
        <div className="mt-4 space-y-2">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune structure enregistrée pour le moment.</p>
          ) : (
            rows.map((row) => (
              <div key={String(row.id)} className="rounded-lg border border-border px-3 py-2">
                <p className="text-sm font-medium text-foreground">{String(row.name || "Structure")}</p>
                <p className="text-xs text-muted-foreground">Code : {String(row.code || "—")}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

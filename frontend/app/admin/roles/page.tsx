"use client";

import Link from "next/link";
import { KeyRound, ShieldCheck, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useApiResource } from "@/lib/api/hooks";
import { listPermissions, listRoles } from "@/lib/api/resources";

function listFrom<T>(data: { results: T[] } | T[] | null) {
  if (!data) return [];
  return Array.isArray(data) ? data : data.results;
}

export default function AdminRolesPage() {
  const roles = useApiResource(() => listRoles(), [], null);
  const permissions = useApiResource(() => listPermissions(), [], null);
  const roleRows = listFrom<Record<string, unknown>>(roles.data);
  const permissionRows = listFrom<Record<string, unknown>>(permissions.data);

  return (
    <>
      <AdminPageHeader
        title="Rôles & permissions"
        description="Définissez les rôles, leurs périmètres et la matrice d'autorisations."
      >
        <Button variant="outline" asChild>
          <Link href="/admin/utilisateurs">
            <Users className="size-4" />
            Voir les utilisateurs
          </Link>
        </Button>
      </AdminPageHeader>

      {/* Cartes de rôles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {roleRows.map((role) => (
          <Card key={String(role.id || role.code)} className="gap-0 py-5">
            <CardContent className="flex h-full flex-col gap-3">
              <Badge variant="brand">
                <ShieldCheck className="size-3" />
                {String(role.label || role.code)}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Code : <span className="font-mono">{String(role.code || "—")}</span>
              </p>
              <div className="border-t border-border pt-3 text-xs text-muted-foreground">
                Périmètre : <span className="font-medium text-foreground">{String(role.scope || "—")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardContent>
          <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-foreground">
            <KeyRound className="size-4 text-primary" />
            Permissions disponibles
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {permissionRows.map((permission) => (
              <div key={String(permission.id || permission.code)} className="rounded-lg border border-border px-3 py-2 text-sm">
                <p className="font-mono text-xs text-foreground">{String(permission.code || "—")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{String(permission.description || "")}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

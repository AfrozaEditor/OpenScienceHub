import Link from "next/link";
import { Check, Minus, ShieldCheck, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { permissionCategories, roleGrants, roles } from "@/lib/admin-data";

type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "brand"
  | "ai"
  | "success";

const toneVariant: Record<string, BadgeVariant> = {
  brand: "brand",
  primary: "default",
  ai: "ai",
  success: "success",
  secondary: "secondary",
};

const fr = new Intl.NumberFormat("fr-FR");

const totalPermissions = permissionCategories.reduce(
  (n, c) => n + c.permissions.length,
  0
);

export default function AdminRolesPage() {
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
        {roles.map((role) => {
          const granted = roleGrants[role.key]?.length ?? 0;
          return (
            <Card key={role.key} className="gap-0 py-5">
              <CardContent className="flex h-full flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Badge variant={toneVariant[role.tone] ?? "secondary"}>
                    <ShieldCheck className="size-3" />
                    {role.name}
                  </Badge>
                </div>
                <p className="flex-1 text-sm text-muted-foreground">
                  {role.description}
                </p>
                <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="text-muted-foreground">
                    Périmètre
                    <span className="ml-1.5 rounded-full bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
                      {role.scope}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3.5" />
                    {fr.format(role.users)} comptes
                  </span>
                  <span className="font-medium text-foreground">
                    {granted}/{totalPermissions} droits
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Matrice de permissions */}
      <Card className="mt-6 overflow-hidden py-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Permission
                </th>
                {roles.map((r) => (
                  <th
                    key={r.key}
                    className="px-3 py-3 text-center text-xs font-medium text-foreground"
                  >
                    {r.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissionCategories.map((cat) => (
                <CategoryRows key={cat.category} category={cat} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Check className="size-3.5 text-success" />
        Autorisé
        <Minus className="ml-3 size-3.5 text-muted-foreground/60" />
        Non autorisé
      </p>
    </>
  );
}

function CategoryRows({
  category,
}: {
  category: (typeof permissionCategories)[number];
}) {
  return (
    <>
      <tr className="bg-secondary/40">
        <td
          colSpan={roles.length + 1}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand"
        >
          {category.category}
        </td>
      </tr>
      {category.permissions.map((perm) => (
        <tr
          key={perm.key}
          className="border-b border-border last:border-0 hover:bg-muted/30"
        >
          <td className="px-4 py-2.5 text-foreground">{perm.label}</td>
          {roles.map((r) => {
            const granted = roleGrants[r.key]?.includes(perm.key);
            return (
              <td key={r.key} className="px-3 py-2.5 text-center">
                {granted ? (
                  <Check className="mx-auto size-4 text-success" />
                ) : (
                  <Minus className="mx-auto size-4 text-muted-foreground/40" />
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

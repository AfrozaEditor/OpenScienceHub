"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

import { roleRedirect, useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";

export function AuthGuard({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: string[];
}) {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, pathname, router, user]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
        <p className="text-sm text-muted-foreground">Chargement de votre session...</p>
      </div>
    );
  }

  if (!hasRole(roles) && !(roles.includes("deposant") && roleRedirect(user).startsWith("/deposant"))) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
        <div className="max-w-sm">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="size-6" />
          </span>
          <h1 className="mt-4 font-heading text-xl font-semibold text-foreground">
            Accès refusé
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Votre profil ne permet pas d'accéder à cet espace.
          </p>
          <Button className="mt-5" asChild>
            <Link href={roleRedirect(user)}>Retour à mon espace</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

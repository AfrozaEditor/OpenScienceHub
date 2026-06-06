"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { roleRedirect, useAuth } from "@/components/auth-provider";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) router.replace(roleRedirect(user));
  }, [loading, router, user]);

  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <p className="text-sm text-muted-foreground">Redirection vers votre portail...</p>
    </div>
  );
}

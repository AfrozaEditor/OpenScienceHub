"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Boxes, Building2, Library } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { useApiResource } from "@/lib/api/hooks";
import { listDepartments, listFaculties, listInstitutions } from "@/lib/api/resources";

type Community = {
  id: string;
  name: string;
  description: string;
  kind: "Institution" | "Faculté" | "Département";
};

function listFrom<T>(data: { results: T[] } | T[] | null) {
  if (!data) return [];
  return Array.isArray(data) ? data : data.results;
}

export default function CommunautesPage() {
  const [kind, setKind] = React.useState("Toutes");
  const institutions = useApiResource(() => listInstitutions(), [], null);
  const faculties = useApiResource(() => listFaculties(), [], null);
  const departments = useApiResource(() => listDepartments(), [], null);

  const communities = React.useMemo<Community[]>(() => {
    const inst = listFrom<Record<string, unknown>>(institutions.data).map((item) => ({
      id: String(item.id),
      name: String(item.name || "Institution"),
      description: String(item.city || item.country || "Institution partenaire"),
      kind: "Institution" as const,
    }));
    const facs = listFrom<Record<string, unknown>>(faculties.data).map((item) => ({
      id: String(item.id),
      name: String(item.name || "Faculté"),
      description: String(item.code || "Structure académique"),
      kind: "Faculté" as const,
    }));
    const deps = listFrom<Record<string, unknown>>(departments.data).map((item) => ({
      id: String(item.id),
      name: String(item.name || "Département"),
      description: String(item.code || "Département académique"),
      kind: "Département" as const,
    }));
    return [...inst, ...facs, ...deps];
  }, [departments.data, faculties.data, institutions.data]);

  const filtered = kind === "Toutes" ? communities : communities.filter((item) => item.kind === kind);
  const loading = institutions.loading || faculties.loading || departments.loading;

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />
      <div className="border-b border-border bg-card/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Badge variant="secondary">
            <Library className="size-3" />
            Communautés & structures
          </Badge>
          <h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
            Explorez les structures institutionnelles
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Institutions, facultés et départements sont chargés depuis l'API.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={kind} onValueChange={setKind}>
          <TabsList className="flex-wrap">
            {["Toutes", "Institution", "Faculté", "Département"].map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-full rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Chargement des structures...
            </p>
          ) : filtered.length === 0 ? (
            <p className="col-span-full rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Aucune structure disponible.
            </p>
          ) : (
            filtered.map((community) => <CommunityCard key={`${community.kind}-${community.id}`} community={community} />)
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function CommunityCard({ community }: { community: Community }) {
  const Icon = community.kind === "Institution" ? Building2 : Boxes;
  return (
    <Card className="group gap-0 transition-all hover:border-primary/40 hover:shadow-md">
      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between">
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="size-6" />
          </span>
          <Badge variant="secondary" className="font-normal">
            {community.kind}
          </Badge>
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {community.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{community.description}</p>
        </div>
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href={`/explorer?${community.kind === "Département" ? "department" : "institution"}=${encodeURIComponent(community.name)}`}>
            Explorer
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Atom,
  Boxes,
  Building2,
  Clock,
  FlaskConical,
  Library,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { collections, type Collection } from "@/lib/mock-data";

const fr = new Intl.NumberFormat("fr-FR");

const kindIcon = {
  Faculté: Building2,
  Département: Boxes,
  Laboratoire: FlaskConical,
  Domaine: Atom,
} as const;

const tabs = ["Toutes", "Faculté", "Département", "Laboratoire", "Domaine"] as const;

export default function CommunautesPage() {
  const [kind, setKind] = React.useState<string>("Toutes");

  const filtered =
    kind === "Toutes"
      ? collections
      : collections.filter((c) => c.kind === kind);

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <SiteHeader />

      <div className="border-b border-border bg-card/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Badge variant="secondary">
            <Library className="size-3" />
            Communautés & collections
          </Badge>
          <h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
            Explorez les collections institutionnelles
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Parcourez les travaux scientifiques regroupés par faculté,
            département, laboratoire et domaine de recherche.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={kind} onValueChange={setKind}>
          <TabsList className="flex-wrap">
            {tabs.map((t) => (
              <TabsTrigger key={t} value={t}>
                {t === "Toutes" ? "Toutes" : `${t}s`}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function CollectionCard({ collection }: { collection: Collection }) {
  const Icon = kindIcon[collection.kind];
  return (
    <Card className="group gap-0 transition-all hover:border-primary/40 hover:shadow-md">
      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between">
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="size-6" />
          </span>
          <Badge variant="secondary" className="font-normal">
            {collection.kind}
          </Badge>
        </div>

        <div className="flex-1">
          <h3 className="font-heading text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {collection.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {collection.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            {fr.format(collection.documents)} documents
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {collection.lastAddition}
          </span>
        </div>

        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href="/explorer">
            Explorer la collection
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

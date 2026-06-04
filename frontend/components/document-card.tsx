import Link from "next/link";
import { ArrowUpRight, Download, Eye, Quote, UserRound, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AccessBadge,
  DocumentTypeBadge,
  MetadataBadge,
} from "@/components/metadata-badge";
import { StatusBadge } from "@/components/status-badge";
import type { ScientificDocument } from "@/lib/mock-data";

function formatNumber(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n);
}

export function DocumentCard({
  doc,
  className,
}: {
  doc: ScientificDocument;
  className?: string;
}) {
  const href = `/documents/${doc.slug}`;

  return (
    <Card className={cn("group gap-0 transition-all hover:border-primary/40 hover:shadow-md", className)}>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <DocumentTypeBadge type={doc.type} />
          <StatusBadge status={doc.status} />
          <AccessBadge access={doc.access} />
          <span className="ml-auto text-sm font-medium text-muted-foreground">
            {doc.year}
          </span>
        </div>

        <Link href={href} className="block">
          <h3 className="font-heading text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {doc.title}
          </h3>
        </Link>

        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5 shrink-0" />
            <span className="text-foreground">{doc.authors.join(", ")}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <UserRound className="size-3.5 shrink-0" />
            Encadrement&nbsp;: {doc.supervisors.join(", ")}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {doc.abstract}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {doc.keywords.slice(0, 4).map((kw) => (
            <MetadataBadge key={kw}>{kw}</MetadataBadge>
          ))}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>{doc.faculty}</span>
          <span className="hidden sm:inline">·</span>
          <span>{doc.department}</span>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {formatNumber(doc.views)}
            </span>
            <span className="flex items-center gap-1">
              <Download className="size-3.5" />
              {formatNumber(doc.downloads)}
            </span>
            <span className="flex items-center gap-1">
              <Quote className="size-3.5" />
              {formatNumber(doc.citations)} citations
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`${href}#citer`}>
                <Quote className="size-3.5" />
                Citer
              </Link>
            </Button>
            <Button variant="outline" size="sm" disabled={doc.access === "Restreint"}>
              <Download className="size-3.5" />
              Télécharger
            </Button>
            <Button size="sm" asChild>
              <Link href={href}>
                Voir détails
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DocumentCardMini({
  doc,
  className,
}: {
  doc: ScientificDocument;
  className?: string;
}) {
  const href = `/documents/${doc.slug}`;

  return (
    <Card
      className={cn(
        "group gap-0 py-0 transition-all hover:border-primary/40 hover:shadow-md",
        className
      )}
    >
      <CardContent className="flex h-full flex-col gap-2.5 p-5">
        <div className="flex items-center gap-2">
          <DocumentTypeBadge type={doc.type} />
          <StatusBadge status={doc.status} />
          <span className="ml-auto text-xs font-medium text-muted-foreground">
            {doc.year}
          </span>
        </div>

        <Link href={href} className="block">
          <h3 className="line-clamp-2 font-heading text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {doc.title}
          </h3>
        </Link>

        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="size-3.5 shrink-0" />
          <span className="line-clamp-1 text-foreground">
            {doc.authors.join(", ")}
          </span>
        </span>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {doc.abstract}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {formatNumber(doc.views)}
            </span>
            <span className="flex items-center gap-1">
              <Download className="size-3.5" />
              {formatNumber(doc.downloads)}
            </span>
          </span>
          <Link
            href={href}
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            Voir détails
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function DocumentCardCompact({ doc }: { doc: ScientificDocument }) {
  return (
    <Link
      href={`/documents/${doc.slug}`}
      className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
    >
      <div className="flex items-center gap-2">
        <DocumentTypeBadge type={doc.type} withIcon={false} />
        <span className="ml-auto text-xs text-muted-foreground">{doc.year}</span>
      </div>
      <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
        {doc.title}
      </h4>
      <p className="line-clamp-1 text-xs text-muted-foreground">
        {doc.authors.join(", ")}
      </p>
      <Badge variant="secondary" className="w-fit font-normal">
        {doc.domain}
      </Badge>
    </Link>
  );
}

export { formatNumber };

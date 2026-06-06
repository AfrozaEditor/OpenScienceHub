"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { ScientificDocument } from "@/lib/domain-types";

function bibtexKey(doc: ScientificDocument) {
  const first = doc.authors[0]?.split(" ").pop() ?? "auteur";
  return `${first.toLowerCase()}${doc.year}`;
}

function buildCitations(doc: ScientificDocument) {
  const authors = doc.authors.join(", ");
  const apa = `${authors} (${doc.year}). ${doc.title}. ${doc.type}, ${doc.institution}, ${doc.faculty}.`;
  const iso = `${authors}. ${doc.title}. ${doc.type}. ${doc.institution}, ${doc.year}, ${doc.pages} p.`;
  const bibtex = `@${doc.type === "Article" ? "article" : "phdthesis"}{${bibtexKey(doc)},
  title   = {${doc.title}},
  author  = {${doc.authors.join(" and ")}},
  year    = {${doc.year}},
  school  = {${doc.institution}},
  type    = {${doc.type}},
  note    = {${doc.faculty}, ${doc.department}}
}`;
  return { apa, iso, bibtex };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore clipboard errors
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Button
      variant={copied ? "secondary" : "outline"}
      size="sm"
      onClick={copy}
      className={cn(copied && "text-success")}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copié !" : "Copier"}
    </Button>
  );
}

export function CitationBox({ doc }: { doc: ScientificDocument }) {
  const citations = buildCitations(doc);

  return (
    <Tabs defaultValue="apa">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList>
          <TabsTrigger value="apa">APA</TabsTrigger>
          <TabsTrigger value="iso">ISO 690</TabsTrigger>
          <TabsTrigger value="bibtex">BibTeX</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="apa">
        <CitationContent text={citations.apa} />
      </TabsContent>
      <TabsContent value="iso">
        <CitationContent text={citations.iso} />
      </TabsContent>
      <TabsContent value="bibtex">
        <CitationContent text={citations.bibtex} mono />
      </TabsContent>
    </Tabs>
  );
}

function CitationContent({ text, mono }: { text: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-4">
      <pre
        className={cn(
          "mb-3 whitespace-pre-wrap break-words text-sm text-foreground",
          mono ? "font-mono text-xs leading-relaxed" : "leading-relaxed"
        )}
      >
        {text}
      </pre>
      <CopyButton text={text} />
    </div>
  );
}

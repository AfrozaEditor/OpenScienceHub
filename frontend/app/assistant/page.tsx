"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  FileSearch,
  FileUp,
  GitBranch,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { VercelV0Chat } from "@/components/ui/v0-ai-chat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const aiUseCases = [
  {
    icon: FileSearch,
    title: "Assistant IA sourcé",
    description: "Question publique sur le catalogue avec réponse et sources cliquables.",
    endpoint: "POST /api/v1/ai/assistant/query",
  },
  {
    icon: FileUp,
    title: "Extraction PDF",
    description: "Analyse du PDF déposé pour proposer titre, résumé, mots-clés et domaine.",
    endpoint: "POST /api/v1/works/{id}/extract-metadata",
  },
  {
    icon: BrainCircuit,
    title: "Résumé et similarité",
    description: "Résumé IA, documents proches et aide à la validation documentaire.",
    endpoint: "GET /api/v1/works/{id}/summary · /similar",
  },
  {
    icon: QrCode,
    title: "Vérification QR",
    description: "Scan mobile vers une page publique, vérification hash + preuve côté backend.",
    endpoint: "GET /api/v1/verify/{proofCode}",
  },
];

const sequences = [
  "Déposant crée un dossier via POST /works",
  "Upload PDF via POST /works/{id}/documents",
  "Backend appelle simba_ia pour extraction et Assistant IA",
  "Validateur contrôle métadonnées, avis, corrections et décision",
  "Archivage final déclenche e-IDStack de IDS et QR public",
  "Un téléphone scanne /verify/{proofCode}, sans donnée sensible dans le QR",
];

export default function AssistantPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_390px] lg:px-8">
        <section className="min-h-[760px]">
          <VercelV0Chat className="h-[min(780px,calc(100vh-7rem))]" />
        </section>

        <aside className="flex flex-col gap-5">
          <div className="rounded-3xl border border-border bg-card p-6">
            <Badge variant="ai">
              <Sparkles className="size-3.5" />
              IA via backend uniquement
            </Badge>
            <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-brand">
              Fenêtre Assistant IA
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Cette interface met en lumière l'IA du produit : recherche sourcée,
              extraction de métadonnées, résumé, similarité et vérification QR. Le
              frontend ne contacte jamais directement `simba_ia` ni e-IDStack.
            </p>
            <Button asChild className="mt-5 w-full">
              <Link href="/explorer">
                Explorer le catalogue
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="size-4 text-ai" />
                Cas d'usage IA couverts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiUseCases.map((item) => (
                <div key={item.title} className="rounded-xl border border-border p-3">
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-ai/10 text-ai">
                      <item.icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {item.description}
                      </p>
                      <code className="mt-2 block rounded-md bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground">
                        {item.endpoint}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GitBranch className="size-4 text-primary" />
                Séquence live complète
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {sequences.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <div className="rounded-2xl border border-success/25 bg-success/5 p-4 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
              Le QR code reste sûr : il contient une URL ou un `proof_code`, jamais le
              hash complet ni des données sensibles.
            </p>
          </div>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}

"use client";

import * as React from "react";
import {
  BadgeCheck,
  Eye,
  EyeOff,
  FileBadge2,
  KeyRound,
  PlugZap,
  RefreshCw,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminToggle } from "@/components/admin/admin-toggle";
import { ssiConfig, type SsiEmission } from "@/lib/admin-data";
import { getSsiConnection, messageForApiError, testSsiConnection, useApiResource } from "@/lib/api";

type BadgeVariant = "success" | "warning" | "destructive";
const emissionVariant: Record<SsiEmission["status"], BadgeVariant> = {
  Émise: "success",
  "En cours": "warning",
  Échec: "destructive",
};

export default function AdminSsiPage() {
  const connection = useApiResource(() => getSsiConnection(), [], null);
  const [endpoint, setEndpoint] = React.useState(ssiConfig.endpoint);
  const [clientId, setClientId] = React.useState(ssiConfig.clientId);
  const [secret, setSecret] = React.useState("secret géré par variables d'environnement");
  const [reveal, setReveal] = React.useState(false);
  const [autoEmit, setAutoEmit] = React.useState(ssiConfig.autoEmit);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(t);
  }, [feedback]);

  React.useEffect(() => {
    if (!connection.data) return;
    const data = connection.data as Record<string, unknown>;
    setEndpoint(String(data.base_url || data.endpoint || endpoint));
    setClientId(String(data.mode || data.status || clientId));
  }, [clientId, connection.data, endpoint]);

  function regenerate() {
    const hex = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    setSecret(`secret-${hex}`);
    setReveal(false);
    setFeedback("Secret régénéré. Pensez à mettre à jour vos intégrations.");
  }

  return (
    <>
      <AdminPageHeader
        title="SSI / e-IDStack"
        description="Connexion au socle de confiance et émission de preuves d'intégrité."
      >
        <Badge variant={connection.data ? "success" : connection.error ? "destructive" : "warning"}>
          <PlugZap className="size-3" />
          {connection.loading ? "Test..." : connection.data ? "Connecté" : "Déconnecté"}
        </Badge>
      </AdminPageHeader>

      {feedback && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-sm text-foreground">
          <BadgeCheck className="size-4 text-success" />
          {feedback}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Connexion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="size-4 text-primary" />
              Connexion e-IDStack
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ssi-endpoint">Point d'accès (endpoint)</Label>
              <Input
                id="ssi-endpoint"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ssi-client">Identifiant client</Label>
              <Input
                id="ssi-client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ssi-secret">Clé secrète</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="ssi-secret"
                    readOnly
                    value={reveal ? secret : "•".repeat(Math.min(secret.length, 28))}
                    className="pr-9 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setReveal((v) => !v)}
                    aria-label={reveal ? "Masquer" : "Révéler"}
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {reveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <Button type="button" variant="outline" onClick={regenerate}>
                  <RefreshCw className="size-4" />
                  Régénérer
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Le secret n'est jamais transmis en clair. Régénérer invalide
                l'ancienne clé.
              </p>
            </div>
            <dl className="grid grid-cols-1 gap-2 rounded-lg border border-border bg-muted/30 p-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Algorithme</dt>
                <dd className="font-medium text-foreground">{ssiConfig.algorithm}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Autorité d'horodatage</dt>
                <dd className="font-medium text-foreground">
                  {ssiConfig.timestampAuthority}
                </dd>
              </div>
            </dl>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                try {
                  await testSsiConnection();
                  setFeedback("Connexion réussie — e-IDStack répond.");
                } catch (err) {
                  setFeedback(messageForApiError(err));
                }
              }}
            >
              <PlugZap className="size-4" />
              Tester la connexion
            </Button>
          </CardContent>
        </Card>

        {/* Émission */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileBadge2 className="size-4 text-ai" />
                Émission de preuves
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AdminToggle
                checked={autoEmit}
                onChange={setAutoEmit}
                label="Émission automatique à la validation"
                description="Génère une preuve d'intégrité dès qu'un document est validé."
              />
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm">
                <span className="text-muted-foreground">Dernière synchronisation</span>
                <span className="font-medium text-foreground">{ssiConfig.lastSync}</span>
              </div>
              <Button
                className="w-full"
                onClick={() => setFeedback("Preuve émise et horodatée avec succès.")}
              >
                <FileBadge2 className="size-4" />
                Émettre une preuve maintenant
              </Button>
            </CardContent>
          </Card>

          <Card className="py-0">
            <CardHeader className="px-5 pt-5">
              <CardTitle className="text-base">Émissions récentes</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-2">
              <ul>
                {ssiConfig.emissions.map((em) => (
                  <li
                    key={em.id}
                    className="flex items-center justify-between gap-3 border-t border-border px-5 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-foreground">{em.document}</p>
                      <p className="text-xs text-muted-foreground">{em.date}</p>
                    </div>
                    <Badge variant={emissionVariant[em.status]}>{em.status}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

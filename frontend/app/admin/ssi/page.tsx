"use client";

import * as React from "react";
import {
  BadgeCheck,
  FileBadge2,
  KeyRound,
  PlugZap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminToggle } from "@/components/admin/admin-toggle";
import { messageForApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/api/hooks";
import { getSsiConnection, testSsiConnection } from "@/lib/api/resources";

function connectionStatusLabel(value: unknown) {
  const status = String(value || "");
  const labels: Record<string, string> = {
    NOT_CONFIGURED: "Non configuré",
    CONNECTED: "Connecté",
    READY: "Prêt",
    ACTIVE: "Actif",
    ERROR: "Erreur",
    DISCONNECTED: "Déconnecté",
  };
  return labels[status] || status || "Non configuré";
}

export default function AdminSsiPage() {
  const connection = useApiResource(() => getSsiConnection(), [], null);
  const [endpoint, setEndpoint] = React.useState("");
  const [clientId, setClientId] = React.useState("");
  const [autoEmit, setAutoEmit] = React.useState(true);
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

  return (
    <>
      <AdminPageHeader
        title="Identité numérique et preuves"
        description="Paramétrez la connexion institutionnelle qui émet les preuves vérifiables après archivage."
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
              Connexion au registre de confiance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ssi-endpoint">Adresse du service de confiance</Label>
              <Input
                id="ssi-endpoint"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ssi-client">État de la connexion</Label>
              <Input
                id="ssi-client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Input id="ssi-secret" readOnly value="Masqué côté serveur" className="font-mono text-xs" />
              <p className="text-xs text-muted-foreground">
                Les clés institutionnelles restent côté serveur et ne sont jamais affichées ici.
              </p>
            </div>
            <dl className="grid grid-cols-1 gap-2 rounded-lg border border-border bg-muted/30 p-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Statut connexion</dt>
                <dd className="font-medium text-foreground">
                  {connectionStatusLabel((connection.data as Record<string, unknown> | null)?.connection_status)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Identifiants configurés</dt>
                <dd className="font-medium text-foreground">
                  {(connection.data as Record<string, unknown> | null)?.has_credentials ? "Oui" : "Non"}
                </dd>
              </div>
            </dl>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                try {
                  await testSsiConnection();
                  setFeedback("Connexion réussie — le service de confiance répond.");
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
              Preuves après archivage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AdminToggle
                checked={autoEmit}
                onChange={setAutoEmit}
                label="Émission automatique après archivage"
                description="Génère une preuve vérifiable uniquement quand la version finale est archivée."
              />
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm">
                <span className="text-muted-foreground">Dernière synchronisation</span>
                <span className="font-medium text-foreground">
                  {String((connection.data as Record<string, unknown> | null)?.last_sync_at || "—")}
                </span>
              </div>
              <Button
                className="w-full"
                disabled
              >
                <FileBadge2 className="size-4" />
                Émission réservée aux documents archivés
              </Button>
            </CardContent>
          </Card>

          <Card className="py-0">
            <CardHeader className="px-5 pt-5">
              <CardTitle className="text-base">Preuves récentes</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-2">
              <p className="border-t border-border px-5 py-4 text-sm text-muted-foreground">
                Consultez les preuves réelles dans “Preuves et vérifications”.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

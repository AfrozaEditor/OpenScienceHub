import { Construction } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export function AdminPlaceholder({
  title,
  description,
  capabilities,
}: {
  title: string;
  description: string;
  capabilities: string[];
}) {
  return (
    <>
      <AdminPageHeader title={title} description={description}>
        <Badge variant="warning">À implémenter</Badge>
      </AdminPageHeader>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-5 py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Construction className="size-6" />
          </span>
          <div>
            <p className="font-heading text-lg font-semibold text-foreground">
              Écran en préparation
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              La navigation et la place de cet écran sont posées. Fonctionnalités
              cibles prévues&nbsp;:
            </p>
          </div>
          <ul className="mx-auto grid w-full max-w-lg gap-2 text-left sm:grid-cols-2">
            {capabilities.map((c) => (
              <li
                key={c}
                className="flex items-start gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {c}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}

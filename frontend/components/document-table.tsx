import { AdminValidationRow } from "@/components/admin-validation-row";
import type { ScientificDocument } from "@/lib/domain-types";

export function DocumentTable({ docs }: { docs: ScientificDocument[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 font-semibold">Document</th>
            <th className="px-4 py-3 font-semibold">Auteur</th>
            <th className="hidden px-4 py-3 font-semibold md:table-cell">
              Département
            </th>
            <th className="hidden px-4 py-3 font-semibold lg:table-cell">
              Déposé le
            </th>
            <th className="px-4 py-3 font-semibold">Statut</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => (
            <AdminValidationRow key={doc.id} doc={doc} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

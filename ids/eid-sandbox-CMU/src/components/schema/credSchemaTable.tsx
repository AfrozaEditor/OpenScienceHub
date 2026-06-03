"use client";

import { CredentialDefinition } from "@/types/cred-def";

type Props = {
  schemas: CredentialDefinition[];
};

// Define colors for each status
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  DRAFT: "bg-orange-100 text-orange-800",
  REVOKED: "bg-red-100 text-red-800",
};

export const CredSchemaTable = ({ schemas }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-gray-500">
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">NAME</th>
            <th className="px-6 py-3">CREDENTIAL DEF ID</th>
            <th className="px-6 py-3">SCHEMA</th>
            <th className="px-6 py-3">SCHEMA ID</th>
            <th className="px-6 py-3">VERSION</th>
          </tr>
        </thead>

        <tbody>
          {schemas.map((item) => {
            // Use ACTIVE as default if status is missing
            const status = item.status ?? "ACTIVE";
            const schemaBgClass = STATUS_COLORS[status];

            return (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                {/* ID */}
                <td className="px-6 py-4 font-medium">{item.name}</td>

                {/* Credential Def ID */}
                <td className="px-6 py-4 text-xs break-all max-w-[260px]">
                  {item.cred_def_id}
                </td>

                {/* SCHEMA with colored background */}
                <td
                  className={`px-6 py-4 rounded-md font-medium ${
                    schemaBgClass.split(" ")[0] // only apply bg color
                  }`}
                >
                  {item.schema?.name ?? "-"}
                </td>

                {/* SCHEMA ID */}
                <td className="px-6 py-4 break-all max-w-[200px]">
                  {item.schema?.schema_id ?? "-"}
                </td>

                {/* VERSION */}
                <td className="px-6 py-4">{item.schema?.version ?? "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

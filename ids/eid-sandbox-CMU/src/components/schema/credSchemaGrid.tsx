"use client";

import { CredentialDefinition } from "@/types/cred-def";

type Props = {
  schemas: CredentialDefinition[];
};

export const SchemaGrid = ({ schemas }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {schemas.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
        >
          {/* HEADER */}
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            {item.name}
          </h3>

          {/* META */}
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span className="font-medium">Credential Def ID</span>
              <span className="break-all max-w-[120px]">{item.cred_def_id}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Schema</span>
              <span>{item.schema?.name ?? "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Schema ID</span>
              <span className="break-all max-w-[120px]">{item.schema?.schema_id ?? "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Version</span>
              <span>{item.schema?.version ?? "-"}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

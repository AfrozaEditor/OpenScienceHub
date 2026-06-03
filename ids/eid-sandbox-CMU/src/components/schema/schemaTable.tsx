"use client";

import {
  MoreVertical,
  Calendar,
  Shield,
  FileText,
} from "lucide-react";
import { SchemaAttributes } from "./schemaAttributes";
import { Schema } from "@/types/schema";

interface Props {
  schemas: Schema[];
  onIssue: (schemaId: string) => void;
}

export function SchemaTable({ schemas, onIssue }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50/50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-6 py-4 font-semibold">Schema Name & Date</th>
            <th className="px-4 py-4 font-semibold">Version</th>
            <th className="px-4 py-4 font-semibold">
              Decentralized Identifiers
            </th>
            <th className="px-4 py-4 font-semibold">Attributes</th>

            {/* ✅ NEW ACTIONS COLUMN */}
            <th className="px-4 py-4 font-semibold text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {schemas.map((schema) => (
            <tr
              key={schema.id}
              className="group hover:bg-slate-50/5 transition-colors"
            >
              {/* Name and Create Date */}
              <td className="px-6 py-4">
                <div className="font-semibold text-slate-900 capitalize">
                  {schema.name}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                  <Calendar size={12} />
                  {new Date(schema.create_date).toLocaleDateString()}
                </div>
              </td>

              {/* Version */}
              <td className="px-4 py-4">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  v{schema.version}
                </span>
              </td>

              {/* Identifiers */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-slate-400" />
                  <span
                    title={schema.issuerId}
                    className="text-[10px] text-blue-600 hover:underline cursor-help truncate max-w-[180px]"
                  >
                    {schema.issuerId}
                  </span>
                </div>
              </td>

              {/* Attributes */}
              <td className="px-4 py-4">
                <SchemaAttributes attributes={schema.attributes} />
              </td>

              {/* ✅ ACTIONS */}
              <td className="px-4 py-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => onIssue(String(schema.id))}
                    className="
                      inline-flex items-center gap-1.5
                      px-3 py-1.5
                      text-xs font-semibold
                      rounded-md
                      bg-indigo-600 text-white
                      hover:bg-indigo-700
                      transition
                      active:scale-95
                    "
                  >
                    <FileText size={14} />
                    Issue
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import {
  MoreHorizontal,
  ShieldCheck,
  Fingerprint,
  Calendar,
  FileText,
} from "lucide-react";
import { SchemaAttributes } from "./schemaAttributes";
import { Schema } from "@/types/schema";

interface Props {
  schemas: Schema[];
  onIssue: (schemaId: string) => void;
}

export function SchemaGrid({ schemas, onIssue }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {schemas.map((schema) => (
        <div
          key={schema.id}
          className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <ShieldCheck size={20} />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors capitalize">
              {schema.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar size={12} className="text-slate-400" />
              <p className="text-[11px] text-slate-500">
                Created {new Date(schema.create_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-50">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Fingerprint size={12} /> ID
              </span>
              <span
                title={schema.schema_id}
                className="font-mono text-slate-600 truncate max-w-45 bg-slate-50 px-1.5 py-0.5 rounded"
              >
                {schema.schema_id}
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Version</span>
              <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 rounded">
                v{schema.version}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-tight">
                Schema Attributes
              </p>
              {/* Fixed: Passing the SchemaAttribute[] objects correctly */}
              <SchemaAttributes attributes={schema.attributes} />
            </div>
          </div>
          <button
            onClick={() => onIssue(String(schema.id))}
            className="
    absolute top-4 right-4
    inline-flex items-center gap-1.5
    px-3 py-1.5
    text-xs font-bold tracking-wide
    text-white
    rounded-full
    bg-gradient-to-r from-purple-600  to-purple-800
    shadow-[0_8px_20px_-6px_rgba(124,58,237,0.6)]
    ring-1 ring-white/20
    backdrop-blur-md
    transition-all duration-200
    hover:scale-105 hover:shadow-[0_12px_28px_-6px_rgba(124,58,237,0.75)]
    active:scale-95
  "
          >
            Issue
          </button>
        </div>
      ))}
    </div>
  );
}

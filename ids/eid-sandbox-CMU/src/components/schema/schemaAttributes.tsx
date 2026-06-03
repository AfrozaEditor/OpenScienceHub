// src/components/schema/schemaAttributes.tsx
import { SchemaAttribute } from "@/types/schema";

interface Props {
  attributes: SchemaAttribute[]; // Changed from string[] to SchemaAttribute[]
}

export function SchemaAttributes({ attributes }: Props) {
  return (
    <div className="flex flex-wrap gap-1">
      {attributes.map((attr) => (
        <span 
          key={attr.id} 
          className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200"
        >
          {attr.displayName || attr.name} {/* Accessing the object property */}
        </span>
      ))}
    </div>
  );
}
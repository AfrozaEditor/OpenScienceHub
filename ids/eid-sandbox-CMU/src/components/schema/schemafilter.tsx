"use client";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
}

export function SchemaFilters({ search, onSearchChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name, ID, or issuer..."
        className="h-10 w-80 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

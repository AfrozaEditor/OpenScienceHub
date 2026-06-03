"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  List,
  LayoutGrid,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SchemaTable } from "@/components/schema/schemaTable";
import { SchemaGrid } from "@/components/schema/schemaGrid";
import { Schema } from "@/types/schema";
import { CustomSelect } from "@/components/ui/customSelect";
import { useSchemas } from "@/hooks/useschema";
import { useRouter } from "next/navigation";
const ITEMS_PER_PAGE = 10;

export default function SchemaRegistry() {
  // --- State Management ---
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  // --- Constants ---
  const STATUS_OPTIONS = [
    { label: "All Status", value: "ALL" },
    { label: "Active", value: "ACTIVE", color: "bg-green-500" },
    { label: "Draft", value: "DRAFT", color: "bg-orange-500" },
    { label: "Revoked", value: "REVOKED", color: "bg-red-500" },
  ];

  // --- DATA: PAGINATED SCHEMAS ---
  const { data, isLoading } = useSchemas({
    search: search || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const schemas: Schema[] = useMemo(() => {
    return data?.data.items ?? [];
  }, [data]);

  const totalItems = data?.data.total ?? 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-[1400px]  mx-auto p-8 space-y-6 animate-in fade-in duration-500 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* 1. Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Schema Registry
          </h1>
          <p className="text-slate-500 text-sm">
            Manage and version your credential schemas.
          </p>
        </div>
        <Link href="/dashboard/issuer/issueCredential/create-schema">
          <button className="bg-[#6f1ce3] hover:bg-[#5B18B8] text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95">
            <Plus size={18} /> Create Schema
          </button>
        </Link>
      </div>

      {/* 2. Filter Bar Section */}
      <div className="flex items-center justify-between gap-4 bg-slate-50 p-4 rounded-lg">
        <div className="flex items-center flex-1 gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-slate-900"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          {/* <CustomSelect
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value as string | "ALL");
              setCurrentPage(1);
            }}
            placeholder="Status"
          /> */}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === "list"
                ? "bg-white shadow-sm text-purple-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === "grid"
                ? "bg-white shadow-sm text-purple-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="min-h-[400px]">
        {!isLoading && schemas.length > 0 ? (
          <div className="space-y-4">
            {viewMode === "list" ? (
              <SchemaTable
                schemas={schemas}
                onIssue={(schemaId) =>
                  router.push(
                    `/dashboard/issueCredential/createOffer?schemaId=${schemaId}`
                  )
                }
              />
            ) : (
              <SchemaGrid schemas={schemas}   onIssue={(schemaId) =>
                  router.push(
                    `/dashboard/issuer/issueCredential/createOffer?schemaId=${schemaId}`
                  )
                } />
            )}

            {/* Pagination Controls */}
            <div className="flex items-center text-black/80 justify-between px-2 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-900">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-slate-900">
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-900">{totalItems}</span>{" "}
                results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-slate-300 disabled:opacity-30 hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-8 h-8 rounded-md text-xs font-semibold transition-all ${
                        currentPage === i + 1
                          ? "bg-purple-600 text-white shadow-md"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-slate-300 disabled:opacity-30 hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          /* 🤖 ROBOTIC / MACHINE LOADER */
          <div className="h-64 flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-linear-to-b from-slate-50 to-white">
            <div className="relative">
              {/* rotating outer ring */}
              <div className="w-14 h-14 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />

              {/* pulsing core */}
              <div className="absolute inset-3 rounded-full bg-purple-500/20 animate-pulse" />

              {/* center dot */}
              <div className="absolute inset-5 rounded-full bg-purple-600" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-600 tracking-wide">
              Initializing schema registry…
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Syncing decentralized definitions
            </p>
          </div>
        ) : (
          /* 🧹 EMPTY STATE */
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
            <Search className="mb-2 opacity-20" size={40} />
            <p className="text-sm">No schemas found matching your filters.</p>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
              className="mt-2 text-purple-600 text-xs font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

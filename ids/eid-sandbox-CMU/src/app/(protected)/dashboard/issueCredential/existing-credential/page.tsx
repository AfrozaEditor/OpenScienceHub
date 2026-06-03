"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Search, List, LayoutGrid, ChevronLeft, ChevronRight,
  Fingerprint, Shield, Calendar, MoreVertical, Copy, ExternalLink, Tag
} from "lucide-react";
import { useCredentialDefinitions } from "@/hooks/usecred-def";

const DEFAULT_ROWS_PER_PAGE = 10;

export default function CredentialDefinitionsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  const { data, isLoading, isError } = useCredentialDefinitions({
    search: search || undefined,
    page: currentPage,
    limit: rowsPerPage,
  });

  const credentialDefinitions = data?.data.items ?? [];
  const totalItems = data?.data.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  // Fix: Defined handlePageChange to resolve TS2304 errors
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen text-black/80 bg-[#F8FAFC] px-6 py-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          
          {/* HEADER */}
          <div className="px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="text-indigo-600" size={24} />
                Credential Definitions
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage definitions and public keys for verifiable issuance.</p>
            </div>
            <button onClick={() => router.push('/dashboard/issuer/issueCredential/create-credential')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100">
              <Plus size={18} /> Create Definition
            </button>
          </div>

          {/* SEARCH + VIEW TOGGLE */}
          <div className="px-8 py-4 bg-slate-50/50 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, tag, or ID..."
                className="w-full h-11 pl-11 pr-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setView("table")}
                className={`p-2 rounded-lg transition-all ${view === "table" ? "bg-indigo-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-50"}`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-indigo-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-50"}`}
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="p-8">
            {isLoading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-slate-500">Fetching definitions...</p>
              </div>
            ) : credentialDefinitions.length === 0 ? (
              <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-slate-50/30">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <Search size={32} className="text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No results matching your search.</p>
                <button onClick={handleClearFilters} className="mt-3 text-indigo-600 text-sm font-bold hover:underline">
                  Clear search
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {view === "table" ? (
                  <div className="overflow-hidden border border-gray-100 rounded-xl shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-widest text-slate-500 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4">Definition Name</th>
                          <th className="px-6 py-4">Linked Schema</th>
                          <th className="px-6 py-4">Identifier</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {credentialDefinitions.map((item) => (
                          <tr key={item.id} className="group hover:bg-indigo-50/30 transition-colors">
                            <td className="px-6 py-5">
                              <div className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{item.name}</div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-tighter">
                                <Calendar size={12} className="text-indigo-400" /> {new Date(item.create_date).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <div className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-indigo-200">
                                  {item.schema.name}
                                </div>
                                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                  v{item.schema.version}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <button 
                                onClick={() => copyToClipboard(item.cred_def_id)}
                                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors group/id"
                              >
                                <Fingerprint size={14} className="text-indigo-500" />
                                <code className="text-[10px] text-slate-600 font-mono truncate max-w-[180px]">{item.cred_def_id}</code>
                                <Copy size={12} className="text-slate-400 group-hover/id:text-indigo-600" />
                              </button>
                            </td>
                            
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {credentialDefinitions.map((item) => (
                      <div key={item.id} className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                        <div className="flex justify-between items-start mb-6">
                          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <Tag size={20} />
                          </div>
                          <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase">Active</span>
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg">{item.name}</h3>
                        <div className="space-y-4 mt-6 pt-6 border-t border-slate-50">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Schema</span>
                            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{item.schema.name}</span>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Definition ID</span>
                            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-gray-100">
                              <code className="text-[10px] text-slate-600 font-mono truncate flex-1">{item.cred_def_id}</code>
                              <button onClick={() => copyToClipboard(item.cred_def_id)} className="text-slate-400 hover:text-indigo-600"><Copy size={14} /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* PAGINATION */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100">
                  <p className="text-sm text-slate-500">
                    Showing <span className="font-bold text-slate-900">{(currentPage - 1) * rowsPerPage + 1}</span> to{" "}
                    <span className="font-bold text-slate-900">{Math.min(currentPage * rowsPerPage, totalItems)}</span> of{" "}
                    <span className="font-bold text-slate-900">{totalItems}</span> definitions
                  </p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2.5 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-slate-50 transition-all">
                      <ChevronLeft size={18} />
                    </button>
                    <div className="flex gap-1.5">
                      {[...Array(totalPages)].map((_, i) => (
                        <button key={i} onClick={() => handlePageChange(i + 1)} className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-600 hover:bg-slate-100"}`}>
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2.5 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-slate-50 transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
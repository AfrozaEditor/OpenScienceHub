"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  LayoutGrid,
  Briefcase,
  Hash,
} from "lucide-react";
import { useCreateSchema } from "@/hooks/useschema";
import { showToast } from "@/utils/toast";

/* ---------------- TYPES ---------------- */

type Attribute = {
  name: string;
  type: string;
  label: string;
};

export default function CreateNewSchema() {
  /* ---------------- STATE ---------------- */

  const [schemaName, setSchemaName] = useState("");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");

  const [attributes, setAttributes] = useState<Attribute[]>([
    { name: "", type: "String", label: "" },
    { name: "", type: "String", label: "" },
    { name: "", type: "String", label: "" },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ---------------- API INTEGRATION ---------------- */

  const {
    mutate: createSchema,
    isPending,
    error: apiError,
  } = useCreateSchema();

  // Replace with actual auth data if available
  const issuerId = "did:indy:bcovrin:test:8gwubPQE73Rpcxh7tkBFR9";
  const orgId = "ORG_ID_FROM_AUTH";

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const err: Record<string, string> = {};

    if (!schemaName.trim()) err.schemaName = "Schema Name is required";
    if (!version.trim()) err.version = "Version is required";

    attributes.forEach((attr, i) => {
      if (!attr.name.trim() || !attr.label.trim()) {
        err[`attr-${i}`] = "Both name and label are required";
      }
    });

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ---------------- HANDLERS ---------------- */

  const addAttribute = () => {
    setAttributes((prev) => [...prev, { name: "", type: "String", label: "" }]);
  };

  const updateAttribute = (
    index: number,
    field: keyof Attribute,
    value: string
  ) => {
    setAttributes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeAttribute = (index: number) => {
    if (attributes.length === 1) return;
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setSchemaName("");
    setVersion("");
    setDescription("");
    setErrors({});
    setAttributes([
      { name: "", type: "String", label: "" },
      { name: "", type: "String", label: "" },
      { name: "", type: "String", label: "" },
    ]);
  };

 const handleSubmit = () => {
  if (!validate()) return;

  createSchema(
    {
      name: schemaName.trim(),
      version: version.trim(),
      issuerId,
      orgId,
      attributes: attributes.map((attr) => ({
        attributeName: attr.name.trim(),
        schemaDataType: attr.type.toLowerCase(),
        displayName: attr.label.trim(),
      })),
    },
    {
      onSuccess: () => {
        resetForm();

        showToast(
          "Schema created successfully",
          "success"
        );
      },
      onError: (error: any) => {
        showToast(
          error?.message || "Failed to create schema",
          "error"
        );
      },
    }
  );
};

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex justify-center text-black/80  px-4 bg-gray-50/50">
      <div className="w-full max-w-[920px] rounded-2xl px-6 sm:px-10">
        {/* PAGE HEADER */}
        <h1 className="text-2xl font-semibold text-[#111827]">
          Create New Schema
        </h1>
        <p className="text-sm text-[#6B7280] mt-2 max-w-2xl">
          Define the structure and data types for your new digital credential.
        </p>

        <hr className="border border-[#E5E7EB] my-6" />

        {/* SCHEMA DETAILS SECTION */}
        <div className="border border-[#E5E7EB] rounded-xl mb-6 overflow-hidden bg-white shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-[#F8FAFC]">
            <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] flex items-center border border-[#E5E7EB] justify-center">
              <FileText size={18} className="text-[#5B18B8]" />
            </div>
            <div>
              <p className="font-bold text-[#111827]">Schema Details</p>
              <p className="text-sm text-[#6B7280]">
                Provide the core details for identifying this schema.
              </p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 border-t border-[#E5E7EB]">
            <div className="sm:col-span-8">
              <label className="text-sm font-bold text-[#374151]">
                Schema Name *
              </label>
              <div
                className={`mt-1 flex items-center h-10 rounded-lg border bg-white px-3 gap-2 ${errors.schemaName ? "border-red-500" : "border-[#D1D5DB]"}`}
              >
                <Briefcase size={16} className="text-[#9CA3AF]" />
                <input
                  value={schemaName}
                  onChange={(e) => setSchemaName(e.target.value)}
                  placeholder="e.g. Employee ID Credential"
                  className="flex-1 h-full text-sm outline-none bg-transparent"
                />
              </div>
              {errors.schemaName && (
                <p className="text-xs text-red-500 mt-1">{errors.schemaName}</p>
              )}
            </div>

            <div className="sm:col-span-4">
              <label className="text-sm font-bold text-[#374151]">
                Version *
              </label>
              <div
                className={`mt-1 flex items-center h-10 rounded-lg border bg-white px-3 gap-2 ${errors.version ? "border-red-500" : "border-[#D1D5DB]"}`}
              >
                <Hash size={16} className="text-[#9CA3AF]" />
                <input
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="1.0"
                  className="flex-1 h-full text-sm outline-none bg-transparent"
                />
              </div>
              {errors.version && (
                <p className="text-xs text-red-500 mt-1">{errors.version}</p>
              )}
            </div>
          </div>
        </div>

        {/* ATTRIBUTES SECTION */}
        <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="flex items-center bg-[#F8FAFC] justify-between px-6 py-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] border border-[#E5E7EB] flex items-center justify-center">
                <LayoutGrid size={18} className="text-[#5B18B8]" />
              </div>
              <p className="font-bold text-[#111827]">Attributes</p>
            </div>
            <button
              onClick={addAttribute}
              className="flex items-center gap-2 bg-[#6f1ce3] hover:bg-[#5B18B8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Add Attribute
            </button>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-[#6B7280] bg-gray-50 border-b border-[#E5E7EB]">
            <div className="col-span-4">ATTRIBUTE NAME</div>
            <div className="col-span-3">DATA TYPE</div>
            <div className="col-span-4">DISPLAY LABEL</div>
            <div className="col-span-1"></div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#E5E7EB]">
            {attributes.map((attr, i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-12 gap-4 px-6 py-4 items-center bg-white"
              >
                <input
                  value={attr.name}
                  placeholder="e.g. full_name"
                  onChange={(e) => updateAttribute(i, "name", e.target.value)}
                  className="sm:col-span-4 h-10 rounded-lg border border-[#D1D5DB] px-3 text-sm text-black outline-none focus:ring-1 focus:ring-indigo-500"
                />

                <select
                  value={attr.type}
                  onChange={(e) => updateAttribute(i, "type", e.target.value)}
                  className="sm:col-span-3 h-10 rounded-lg border border-[#D1D5DB] px-3 text-sm bg-white outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option>String</option>
                  <option>Date</option>
                  <option>Number</option>
                  <option>Boolean</option>
                </select>

                <input
                  value={attr.label}
                  placeholder="e.g. Full Name"
                  onChange={(e) => updateAttribute(i, "label", e.target.value)}
                  className="sm:col-span-4 h-10 rounded-lg border border-[#D1D5DB] px-3 text-sm text-black outline-none focus:ring-1 focus:ring-indigo-500"
                />

                <button
                  onClick={() => removeAttribute(i)}
                  disabled={attributes.length === 1}
                  className="sm:col-span-1 text-gray-400 hover:text-red-500 disabled:opacity-30 flex justify-center"
                >
                  <Trash2 size={18} />
                </button>

                {errors[`attr-${i}`] && (
                  <p className="text-xs text-red-500 sm:col-span-12 mt-1">
                    {errors[`attr-${i}`]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* API ERROR */}
        {apiError && (
          <p className="text-sm text-red-600 mt-4">
            {(apiError as Error).message}
          </p>
        )}

        {/* FOOTER ACTIONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={resetForm}
            className="px-6 py-2 rounded-lg border border-[#D1D5DB] bg-white text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-6 py-2 rounded-lg bg-[#6f1ce3] text-white text-sm font-medium disabled:opacity-60 hover:bg-[#5B18B8] transition-colors"
          >
            {isPending ? "Creating..." : "Create Schema"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Tag, ShieldCheck, ChevronDown, Info } from "lucide-react";
import clsx from "clsx";
import Select, { StylesConfig } from "react-select";

/* ✅ REAL HOOKS */
import { useAllSchemas } from "@/hooks/useschema";
import { useCreateCredentialDefinition } from "@/hooks/usecred-def";
import { showToast } from "@/utils/toast";

/* ---------------- TYPES ---------------- */

interface Schema {
  schema_id: string;
  id: number;
  name: string;
}

/* ---------------- FORM SCHEMA ---------------- */

const formSchema = z.object({
  schemaId: z.string().min(1, "Please select a source schema"),
  versionTag: z
    .string()
    .min(2, "Version tag is required")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Only alphanumeric, hyphens, and underscores allowed"
    ),
  enableRevocation: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

/* ---------------- MODERN DROPDOWN STYLES ---------------- */

const selectStyles: StylesConfig<any, false> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#f8fafc", // bg-slate-50
    borderColor: state.isFocused ? "#5B18B8" : "#e2e8f0",
    borderRadius: "1rem", // rounded-2xl
    paddingLeft: "2.5rem",
    paddingTop: "2px",
    paddingBottom: "2px",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(91, 24, 184, 0.1)" : "none",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#5B18B8",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#94a3b8",
    fontSize: "15px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#0f172a",
    fontWeight: "500",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "1rem",
    marginTop: "8px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #f1f5f9",
    overflow: "hidden",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#5B18B8" : state.isFocused ? "#f5f3ff" : "white",
    color: state.isSelected ? "white" : "#475569",
    cursor: "pointer",
  }),
  indicatorSeparator: () => ({ display: "none" }),
};

export default function CreateCredentialDefinitionForm() {
  /* ---------------- DATA ---------------- */

  const { data, isLoading: loadingSchemas } = useAllSchemas();
  const schemas: Schema[] = data?.data ?? [];

  const {
    mutate: createCredDef,
    isPending,
    error,
  } = useCreateCredentialDefinition();

  /* ---------------- FORM ---------------- */

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schemaId: "",
      versionTag: "",
      enableRevocation: false,
    },
  });

  const revocationEnabled = watch("enableRevocation");

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = (values: FormValues) => {
    createCredDef(
      {
        schemaId: values.schemaId,
        tag: values.versionTag,
        supportRevocation: values.enableRevocation,
      },
      {
        onSuccess: () => {
          reset();
          showToast("Credential Definition created successfully", "success");
        },
        onError: (error: any) => {
          showToast(error?.message || "Failed to create credential definition", "error");
        },
      }
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in text-black/80 fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
           Credential Definition
        </h1>
        <p className="text-slate-600 mt-3 text-sm max-w-2xl leading-relaxed">
          Configure how your credential will be issued. Select a schema and
          define revocation rules to generate a new definition ID.
        </p>
      </div>

      {/* Main Form Card */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border border-slate-200 rounded-4xl p-8 shadow-2xl shadow-slate-200/50 space-y-6"
      >
        {/* SOURCE SCHEMA - UPDATED DROPDOWN */}
        <div className="space-y-3">
          <label className="text-[12px] font-bold text-slate-800 uppercase tracking-[0.1em] ml-1">
            Source Schema
          </label>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10">
              <FileText size={20} className="text-[#5B18B8] mt-0.5 shrink-0"/>
            </div>

            <Controller
              name="schemaId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  styles={selectStyles}
                  options={schemas.map((s) => ({
                    value: String(s.schema_id),
                    label: s.name,
                  }))}
                  isLoading={loadingSchemas}
                  placeholder="Select a schema to proceed..."
                  value={schemas
                    .map((s) => ({ value: String(s.schema_id), label: s.name }))
                    .find((opt) => opt.value === field.value)}
                  onChange={(val: any) => field.onChange(val?.value)}
                />
              )}
            />
          </div>

          <div className="flex items-start gap-2.5 px-1">
            <Info size={15} className="text-[#5B18B8] mt-0.5 shrink-0" />
            <p className="text-[13px] text-slate-500 leading-tight">
              Defines the attribute structure for the credentials you’ll issue.
            </p>
          </div>

          {errors.schemaId && (
            <p className="text-sm font-semibold text-red-500 ml-1">
              {errors.schemaId.message}
            </p>
          )}
        </div>

        {/* VERSION TAG */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-slate-800 uppercase tracking-[0.1em] ml-1">
            Version Tag
          </label>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Tag size={20} className="text-[#5B18B8] mt-0.5 shrink-0"/>
            </div>

            <input
              {...register("versionTag")}
              placeholder="e.g. production-v1"
              className={clsx(
                "w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-2xl text-[15px] font-medium transition-all focus:outline-none focus:ring-4 focus:ring-[#5B18B8]/10",
                errors.versionTag
                  ? "border-red-300 bg-red-50/30"
                  : "border-slate-200 focus:border-[#5B18B8] hover:border-slate-300"
              )}
            />
          </div>

          <div className="flex items-start gap-2.5 px-1">
            <Info size={15} className="text-[#5B18B8] mt-0.5 shrink-0" />
            <p className="text-[13px] text-slate-500 leading-tight">
              Unique identifier for this definition version.
            </p>
          </div>

          {errors.versionTag && (
            <p className="text-sm font-semibold text-red-500 ml-1">
              {errors.versionTag.message}
            </p>
          )}
        </div>

        {/* REVOCATION TOGGLE */}
        <div className="flex items-center justify-between p-6 border border-slate-100 bg-purple-50 rounded-[1.5rem]">
          <div className="flex items-start gap-5">
            <div className="p-4 bg-white rounded-2xl shadow-sm text-[#5B18B8]">
              <ShieldCheck size={26} />
            </div>
            <div>
              <p className="text-md font-bold text-slate-900">
                Enable Revocation Registry
              </p>
              <p className="text-[13px] text-slate-500">
                Allows you to invalidate credentials after issuance.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setValue("enableRevocation", !revocationEnabled)}
            className={clsx(
              "relative inline-flex h-7 w-12 py-0.5 px-0.5 rounded-full transition-colors",
              revocationEnabled ? "bg-[#5B18B8]" : "bg-slate-300"
            )}
          >
            <span
              className={clsx(
                "inline-block h-6 w-6   bg-white rounded-full transition-transform",
                revocationEnabled ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-8 pt-8 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSubmitting || isPending}
            className="px-8 py-2.5 bg-[#5B18B8] hover:bg-[#4a1396] text-white rounded-2xl text-base font-bold shadow-xl disabled:opacity-50"
          >
            {isSubmitting || isPending ? "Creating..." : "Create Definition"}
          </button>
        </div>

        {/* API ERROR */}
        {error && (
          <p className="text-sm text-red-600 mt-2">
            {(error as Error).message}
          </p>
        )}
      </form>
    </div>
  );
}
"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form"; // Added for validation
import Select, { StylesConfig } from "react-select";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Toaster, toast } from "sonner"; // Use Toaster for feedback
import {
  LucideLayers,
  LucideCheck,
  Smartphone,
  Mail,
  X,
  CheckCircle2,
  XCircle,
  LucideListChecks,
} from "lucide-react";
import clsx from "clsx";

/* UI Components */
import { FlowCard } from "@/components/ui/FlowCard";
import { WizardTabs, WizardTab } from "@/components/ui/WizardTabs";
import { QRCodeDisplay } from "@/components/ui/QRCodeDisplay";
import SendInviteEmailDialog from "@/components/ui/sendMail";

/* Hooks & API */
import { useProofRequestSelective } from "@/hooks/useproof";
import { useAllSchemas } from "@/hooks/useschema";

/* --- TYPES --- */
interface ProofFormData {
  schemaId: string;
  credDefId: string;
  comment: string;
  selectedAttributes: string[];
}

const selectStyles: StylesConfig<any, false> = {
  control: (base, state) => ({
    ...base,
    borderRadius: "0.75rem",
    padding: "4px",
    borderColor: state.isFocused ? "#9333ea" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(147, 51, 234, 0.1)" : "none",
    "&:hover": { borderColor: "#9333ea" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#9333ea"
      : state.isFocused
        ? "#f5f3ff"
        : "transparent",
    color: state.isSelected ? "white" : "#1e293b",
    cursor: "pointer",
    borderRadius: "0.5rem",
    margin: "4px",
  }),
};

export default function ProofRequestSelective() {
  const [activeTab, setActiveTab] = useState("config");
  const [issueOpen, setIssueOpen] = useState(false);
  const [proofData, setProofData] = useState<any>(null);
  const [ackStatus, setAckStatus] = useState<"pending" | "done" | "rejected">(
    "pending",
  );
  const [sendMailOpen, setSendMailOpen] = useState(false);

  const mutation = useProofRequestSelective();
  const { data: schemaData, isLoading: schemasLoading } = useAllSchemas();
  const schemas = schemaData?.data ?? [];

  /* --- FORM HANDLING & VALIDATION --- */
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    trigger,
    reset,
    formState: { errors },
  } = useForm<ProofFormData>({
    mode: "onChange",
    defaultValues: {
      schemaId: "",
      credDefId: "",
      comment: "",
      selectedAttributes: [],
    },
  });

  const watchedSchemaId = watch("schemaId");
  const watchedAttributes = watch("selectedAttributes");

  const selectedSchema = useMemo(
    () => schemas.find((s: any) => String(s.id) === watchedSchemaId) || null,
    [schemas, watchedSchemaId],
  );

  const availableAttributes = useMemo(
    () =>
      selectedSchema?.attributes?.map((attr: any) => ({
        id: attr.name,
        label: attr.name
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l: any) => l.toUpperCase()),
      })) || [],
    [selectedSchema],
  );

  /* --- TAB VALIDATION LOGIC --- */
  const handleNextStep = async (nextTab: string) => {
    if (activeTab === "config") {
      const isValid = await trigger(["schemaId", "credDefId"]);
      if (!isValid) {
        toast.error("Required Fields Missing", {
          description: "Please select a Schema and Credential Definition.",
        });
        return;
      }
    }
    setActiveTab(nextTab);
  };

  /* --- POLLING --- */
  const isPolling =
    issueOpen && !!proofData?.proofRecordId && ackStatus === "pending";
  const { data: pollData } = useQuery({
    queryKey: ["proofStatus", proofData?.proofRecordId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REST_URL}/verification/proofStatus?proofRecordId=${proofData.proofRecordId}`,
      );
      if (!res.ok) throw new Error("Status check failed");
      return res.json();
    },
    refetchInterval: 3000,
    enabled: isPolling,
  });

  useEffect(() => {
    if (pollData?.state) {
      const status = pollData.state;
      if (status === "done" || status === "verified") setAckStatus("done");
      else if (status === "rejected" || status === "failed")
        setAckStatus("rejected");
    }
  }, [pollData]);

  const onSubmit = (data: ProofFormData) => {
    if (data.selectedAttributes.length === 0) {
      toast.error("Selection Error", {
        description: "Please select at least one attribute to request.",
      });
      return;
    }

    const toastId = toast.loading("Generating Verification Request...");
    mutation.mutate(
      {
        credDefId: data.credDefId,
        attributes: data.selectedAttributes.map((attr) => ({ name: attr })),
        comment: data.comment || undefined,
      },
      {
        onSuccess: (res) => {
          toast.dismiss(toastId);
          setProofData(res);
          setAckStatus("pending");
          setIssueOpen(true);
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error("Request Failed", {
            description: "Could not generate QR code.",
          });
        },
      },
    );
  };

  const handleClose = () => {
    setIssueOpen(false);
    setTimeout(() => {
      setProofData(null);
      setAckStatus("pending");
      setActiveTab("config");
      reset();
    }, 300);
  };

  return (
    <div className="max-w-5xl mx-auto text-black/80">
      <Toaster position="top-center" richColors />
      <FlowCard
        loading={mutation.isPending}
        title={
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-2xl text-purple-600 shadow-sm">
              <LucideLayers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 leading-tight">
                Selective Disclosure
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Verify Specific Identity Attributes
              </p>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <WizardTabs
            activeTab={activeTab}
            onTabChange={handleNextStep}
            onComplete={handleSubmit(onSubmit)}
            completeButtonLabel="Generate QR Request"
          >
            <WizardTab id="config" label="Identity Schema">
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                      Target Schema
                    </label>
                    <Controller
                      name="schemaId"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          options={schemas.map((s: any) => ({
                            value: String(s.id),
                            label: `${s.name} (v${s.version})`,
                          }))}
                          isLoading={schemasLoading}
                          onChange={(o: any) => field.onChange(o?.value || "")}
                          styles={selectStyles}
                          placeholder="Select Identity Schema..."
                        />
                      )}
                    />
                    {errors.schemaId && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">
                        Required
                      </p>
                    )}
                  </div>
                  <div>
                    
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                          Credential Definition
                        </label>
                        <Controller
                          name="credDefId"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select
                              options={selectedSchema?.credentialDefinitions?.map(
                                (cd: any) => ({
                                  value: cd.cred_def_id,
                                  label: cd.name || cd.cred_def_id,
                                }),
                              )}
                              onChange={(o: any) =>
                                field.onChange(o?.value || "")
                              }
                              styles={selectStyles}
                              placeholder="Select definition..."
                            />
                          )}
                        />
                        {errors.credDefId && (
                          <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">
                            Required
                          </p>
                        )}
                      </div>
                  
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Request Note
                  </label>
                  <textarea
                    {...register("comment")}
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm focus:ring-4 focus:ring-purple-50 focus:border-purple-600 outline-none transition-all resize-none"
                    rows={3}
                    placeholder="Why are you requesting this data?"
                  />
                </div>
              </div>
            </WizardTab>

            <WizardTab id="attributes" label="Attributes" completeStep>
              <div className="py-4">
                <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 mb-6">
                  <LucideListChecks className="w-4 h-4 text-purple-600" />
                  Requested Fields
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {availableAttributes.map((attr: any) => (
                    <label
                      key={attr.id}
                      className={clsx(
                        "flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                        watchedAttributes.includes(attr.id)
                          ? "border-purple-600 bg-purple-50 ring-4 ring-purple-100/50"
                          : "border-gray-50 bg-white hover:border-purple-200",
                      )}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        value={attr.id}
                        checked={watchedAttributes.includes(attr.id)}
                        onChange={(e) => {
                          const val = e.target.value;
                          const current = watchedAttributes;
                          const next = current.includes(val)
                            ? current.filter((v) => v !== val)
                            : [...current, val];
                          setValue("selectedAttributes", next, {
                            shouldValidate: true,
                          });
                        }}
                      />
                      <div
                        className={clsx(
                          "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors",
                          watchedAttributes.includes(attr.id)
                            ? "bg-purple-600 border-purple-600"
                            : "border-gray-200",
                        )}
                      >
                        {watchedAttributes.includes(attr.id) && (
                          <LucideCheck className="w-4 h-4 text-white stroke-[3px]" />
                        )}
                      </div>
                      <span className="text-sm font-bold text-gray-700">
                        {attr.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </WizardTab>
          </WizardTabs>
        </form>
      </FlowCard>

      {/* --- MODAL (Same as before but with reset) --- */}
      <Transition appear show={issueOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
                <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center shrink-0 pr-16">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Verification Pipeline
                    </h3>
                  </div>
                  <div
                    className={clsx(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                      ackStatus === "done"
                        ? "bg-emerald-100 text-emerald-700"
                        : ackStatus === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-purple-100 text-purple-700 animate-pulse",
                    )}
                  >
                    {ackStatus === "pending" ? "Awaiting Scan" : ackStatus}
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-purple-600 shadow-sm transition-all z-20"
                >
                  <X size={18} />
                </button>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                  <div className="flex flex-col items-center text-center space-y-6">
                    {ackStatus === "pending" && (
                      <div className="w-full flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                        <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-inner">
                          <QRCodeDisplay
                            qrData={proofData?.verificationQr}
                            url={proofData?.invitationUrl}
                          />
                        </div>
                        <div className="flex items-center justify-center gap-2 text-purple-600 bg-purple-50 px-4 py-2 rounded-full mx-auto w-fit">
                          <Smartphone size={14} className="animate-bounce" />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Scan with Wallet
                          </span>
                        </div>
                      </div>
                    )}
                    {ackStatus === "done" && (
                      <div className="py-10">
                        <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-100/50">
                          <CheckCircle2 className="text-emerald-500 w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                          Proof Verified
                        </h2>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-8 pt-4 border-t border-slate-50 shrink-0 bg-white">
                  <div className="w-full space-y-3">
                    <button
                      onClick={() => setSendMailOpen(true)}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 shadow-xl shadow-purple-100 transition-all active:scale-[0.98]"
                    >
                      <Mail size={18} />
                      <span className="text-sm">Send via Email</span>
                    </button>
                    <button
                      onClick={handleClose}
                      className="w-full py-2 text-slate-400 hover:text-purple-600 text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                      Cancel Request
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <SendInviteEmailDialog
        open={sendMailOpen}
        onClose={() => setSendMailOpen(false)}
        inviteUrl={proofData?.shortUrl ?? proofData?.invitationUrl}
        type="proof"
      />
    </div>
  );
}

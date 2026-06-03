"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select, { StylesConfig } from "react-select";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  Loader2,
  Mail,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ChevronRight,
  Smartphone,
  X,
} from "lucide-react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

/* UI Components */
import { FlowCard } from "@/components/ui/FlowCard";
import { WizardTabs, WizardTab } from "@/components/ui/WizardTabs";
import { QRCodeDisplay } from "@/components/ui/QRCodeDisplay";
import SendInviteEmailDialog from "@/components/ui/sendMail";

/* API & Hooks */
import { getAllSchemas } from "@/api/schema";
import { useCreateOffer } from "@/hooks/useCredentialOffer";

/* --- TYPES --- */
interface FormData {
  schemaId: string;
  credentialDefinitionId: string;
  attributes: Record<string, string>;
  comment?: string;
}

interface OfferResponseData {
  invitationUrl: string;
  shortUrl?: string;
  invitationQr: string;
  credentialExchangeId: string;
  state: string;
}

/* --- CUSTOM REACT SELECT STYLES --- */
const selectStyles: StylesConfig<any, false> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "white",
    borderColor: state.isFocused ? "#6366f1" : "#e2e8f0",
    borderRadius: "0.75rem",
    padding: "4px",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(99, 102, 241, 0.1)" : "none",
    transition: "all 0.2s ease",
    "&:hover": { borderColor: "#6366f1" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#6366f1"
      : state.isFocused
        ? "#e0e7ff"
        : "transparent",
    color: state.isSelected ? "white" : "#1e293b",
    cursor: "pointer",
    borderRadius: "0.5rem",
    margin: "4px",
    width: "auto",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.75rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  }),
  singleValue: (base) => ({ ...base, color: "#0f172a", fontWeight: 500 }),
  input: (base) => ({ ...base, color: "#0f172a" }),
};

export default function CredentialOffer() {
  const mutation = useCreateOffer();
  const searchParams = useSearchParams();
  const querySchemaId = searchParams.get("schemaId");

  /* --- STATE --- */
  const [activeTab, setActiveTab] = useState("config");
  const [issueOpen, setIssueOpen] = useState(false);
  const [issueData, setIssueData] = useState<OfferResponseData | null>(null);
  const [sendMailOpen, setSendMailOpen] = useState(false);

  // Status state derived from polling
  const [ackStatus, setAckStatus] = useState<
    "offer-sent" | "done" | "rejected"
  >("offer-sent");

  /* --- DATA FETCHING --- */
  const { data } = useQuery({
    queryKey: ["schemas"],
    queryFn: getAllSchemas,
  });
  const schemas = data?.data ?? [];

  /* --- FORM HANDLING --- */
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    trigger,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      schemaId: querySchemaId || "",
      credentialDefinitionId: "",
      attributes: {},
      comment: "",
    },
  });

  const watchedSchemaId = watch("schemaId");

  // Memoize schema selection
  const selectedSchema = useMemo(
    () => schemas.find((s) => String(s.id) === String(watchedSchemaId)) || null,
    [schemas, watchedSchemaId],
  );

  // Auto-select first credential definition
  useEffect(() => {
    if (selectedSchema?.credentialDefinitions?.length) {
      setValue(
        "credentialDefinitionId",
        selectedSchema.credentialDefinitions[0].cred_def_id,
      );
    }
  }, [selectedSchema, setValue]);

  /* --- ACTIONS --- */

  // 1. Reset Logic
  const handleClose = () => {
    setIssueOpen(false);

    // Slight delay to allow modal close animation before resetting state
    setTimeout(() => {
      setIssueData(null);
      setAckStatus("offer-sent");
      setActiveTab("config");
      reset({
        schemaId: "",
        credentialDefinitionId: "",
        attributes: {},
        comment: "",
      });
    }, 300);
  };

  // 2. Tab Navigation
  const handleNextStep = async () => {
    const isValid = await trigger(["schemaId", "credentialDefinitionId"]);
    if (!isValid) {
      toast.error("Validation Error", {
        description: "Please select a Schema and Definition.",
      });
    }
    return isValid;
  };

  // 3. Form Submission
  const onSubmit = (formData: FormData) => {
    const toastId = toast.loading("Generating Offer...");
    mutation.mutate(
      {
        credentialDefinitionId: formData.credentialDefinitionId,
        attributes: Object.entries(formData.attributes).map(
          ([name, value]) => ({
            name,
            value,
          }),
        ),
        comment: formData.comment,
        connectionId: "",
      },
      {
        onSuccess: (res) => {
          toast.dismiss(toastId);
          if (!res.success) {
            toast.error("Issuance Failed", {
              description: String(res),
            });
            return;
          }
          toast.success("Offer Generated", {
            description: "Waiting for holder to scan...",
          });

          // Set Data and Open Modal
          setIssueData(res.data);
          setAckStatus("offer-sent");
          setIssueOpen(true);
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error("System Error", {
            description: "Could not communicate with agent.",
          });
        },
      },
    );
  };

  const isPollingEnabled =
    issueOpen &&
    !!issueData?.credentialExchangeId &&
    ackStatus === "offer-sent";

  const { data: pollStatus } = useQuery({
    queryKey: ["offerStatus", issueData?.credentialExchangeId],
    queryFn: async () => {
      if (!issueData?.credentialExchangeId) return null;

      // Updated to use Query Parameter as seen in your screenshot
      const res = await fetch(`${process.env.NEXT_PUBLIC_REST_URL}/issuance/offerStatus?credentialExchangeId=${issueData.credentialExchangeId}`,
      );

      if (!res.ok) throw new Error("Network response was not ok");

      // Use .text() because the response is a raw string "offer-sent"
      return res.text();
    },
    refetchInterval: 3000,
    enabled: isPollingEnabled,
    refetchOnWindowFocus: false,
  });

  // React to Polling Changes
  useEffect(() => {
    if (pollStatus) {
      // Trim and remove quotes if the API returns them as part of the string
      const status = pollStatus.replace(/"/g, "").trim();

      if (status === "done" || status === "credential_issued") {
        setAckStatus("done");
        toast.success("Credential Issued!", {
          description: "Holder has accepted the credential.",
        });
      } else if (status === "rejected") {
        setAckStatus("rejected");
        toast.error("Credential Rejected", {
          description: "Holder declined the offer.",
        });
      }
      // "offer-sent" state is handled by the initial state, so no action needed here
    }
  }, [pollStatus]);
  return (
    <div className="min-h-screen bg-[#F8FAFC]  font-sans text-slate-900">
      <Toaster position="top-center" richColors />

      <div className="max-w-5xl mx-auto">
        <FlowCard
          loading={mutation.isPending}
          title={
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-indigo-200">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  Issue Credential
                </h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Secure Issuer Protocol
                </p>
              </div>
            </div>
          }
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <WizardTabs
              activeTab={activeTab}
              onTabChange={async (tab) => {
                const ok = await handleNextStep();
                if (ok) setActiveTab(tab);
              }}
              onComplete={handleSubmit(onSubmit)}
              completeButtonLabel={
                mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Signing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Issue Credential <ChevronRight size={16} />
                  </span>
                )
              }
            >
              {/* STEP 1: CONFIGURATION */}
              <WizardTab id="config" label="1. Configuration">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Schema Selection */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                        Source Schema <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="schemaId"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            styles={selectStyles}
                            options={schemas.map((s) => ({
                              value: String(s.id),
                              label: `${s.name} (v${s.version})`,
                            }))}
                            value={schemas
                              .map((s) => ({
                                value: String(s.id),
                                label: `${s.name} (v${s.version})`,
                              }))
                              .find((o) => o.value === field.value)}
                            onChange={(opt) => field.onChange(opt?.value)}
                            placeholder="Search schemas..."
                          />
                        )}
                      />
                      {errors.schemaId && (
                        <p className="text-xs text-red-500 font-medium pl-1">
                          Schema is required
                        </p>
                      )}
                    </div>

                    {/* Cred Def Selection */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                        Credential Definition{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="credentialDefinitionId"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            styles={selectStyles}
                            isDisabled={!selectedSchema}
                            options={selectedSchema?.credentialDefinitions?.map(
                              (cd) => ({
                                value: cd.cred_def_id,
                                label: cd.name,
                              }),
                            )}
                            value={selectedSchema?.credentialDefinitions
                              ?.map((cd) => ({
                                value: cd.cred_def_id,
                                label: cd.name,
                              }))
                              .find((o) => o.value === field.value)}
                            onChange={(opt) => field.onChange(opt?.value)}
                            placeholder={
                              selectedSchema
                                ? "Select Definition"
                                : "Select a schema first"
                            }
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Comment Area */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                      Internal Reference Note
                    </label>
                    <textarea
                      {...register("comment")}
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none bg-slate-50 focus:bg-white"
                      placeholder="Add context for this issuance..."
                    />
                  </div>
                </motion.div>
              </WizardTab>

              {/* STEP 2: ATTRIBUTES */}
              <WizardTab id="attributes" label="2. Attributes" completeStep>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-8"
                >
                  {!selectedSchema ? (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                      <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                        <ShieldCheck className="text-slate-300 w-8 h-8" />
                      </div>
                      <p className="text-slate-400 font-medium">
                        Please select a schema in Step 1
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      {selectedSchema?.attributes?.map((attr) => (
                        <div key={attr.name} className="group space-y-2">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1 group-focus-within:text-indigo-600 transition-colors">
                            {attr.displayName}
                          </label>
                          <input
                            {...register(`attributes.${attr.name}`, {
                              required: true,
                            })}
                            className={clsx(
                              "w-full border rounded-xl p-3.5 text-sm font-medium transition-all outline-none",
                              "bg-slate-50 focus:bg-white focus:shadow-lg focus:shadow-indigo-100",
                              errors.attributes?.[attr.name]
                                ? "border-red-300 focus:border-red-500 bg-red-50"
                                : "border-slate-200 focus:border-indigo-500",
                            )}
                            placeholder={`Enter ${attr.displayName}...`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </WizardTab>
            </WizardTabs>
          </form>
        </FlowCard>
      </div>

     {/* --- RESPONSIVE ISSUANCE MODAL --- */}
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

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* Responsive container matching Proof Request UI */}
              <Dialog.Panel className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
                
                {/* Modal Header */}
                <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center shrink-0 pr-16">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Issuance Pipeline
                    </h3>
                    <p className="text-[9px] font-medium text-slate-400 mt-0.5">Secure Credential Offer</p>
                  </div>
                  <div
                    className={clsx(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                      ackStatus === "done"
                        ? "bg-emerald-100 text-emerald-700"
                        : ackStatus === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-purple-100 text-purple-700 animate-pulse"
                    )}
                  >
                    {ackStatus === "offer-sent" ? "Awaiting Scan" : ackStatus}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-purple-600 shadow-sm transition-all z-20"
                >
                  <X size={18} />
                </button>

                {/* Scrollable Content Body */}
                <div className="flex-1 overflow-y-auto p-8">
                  <div className="flex flex-col items-center text-center space-y-6">
                    {/* QR STATE */}
                    {ackStatus === "offer-sent" && (
                      <div className="w-full flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                        <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-inner">
                          {issueData && (
                            <QRCodeDisplay
                              qrData={issueData.invitationQr}
                              url={issueData.invitationUrl}
                            />
                          )}
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2 text-purple-600 bg-purple-50 px-4 py-2 rounded-full mx-auto w-fit">
                            <Smartphone size={14} className="animate-bounce" />
                            <span className="text-[9px] font-black uppercase tracking-widest">
                              Scan with Wallet
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium max-w-[220px]">
                            Ask the recipient to scan this code to accept their credential.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* SUCCESS STATE */}
                    {ackStatus === "done" && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="py-10"
                      >
                        <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-100/50">
                          <CheckCircle2 className="text-emerald-500 w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                          Verified & Issued
                        </h2>
                        <p className="text-slate-500 font-medium mt-2">
                          The holder has successfully received the credential.
                        </p>
                      </motion.div>
                    )}

                    {/* REJECTED STATE */}
                    {ackStatus === "rejected" && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="py-10"
                      >
                        <div className="w-24 h-24 bg-red-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-100/50">
                          <XCircle className="text-red-500 w-12 h-12" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">
                          Offer Rejected
                        </h2>
                        <p className="text-slate-500 mt-2">
                          The holder declined the credential offer.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Footer Actions (Fixed at bottom) */}
                <div className="p-8 pt-4 border-t border-slate-50 shrink-0 bg-white">
                  <div className="w-full space-y-3">
                    <button
                      onClick={() => setSendMailOpen(true)}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 shadow-xl shadow-purple-100 transition-all active:scale-[0.98]"
                    >
                      <Mail size={18} />
                      <span className="text-sm">Send Invitation via Email</span>
                    </button>

                    <button
                      onClick={handleClose}
                      className="w-full py-2 text-slate-400 hover:text-purple-600 text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                      {ackStatus === "done" ? "Close & Reset" : "Cancel & Close"}
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
        inviteUrl={issueData?.shortUrl ?? ""}
        type="offer"
      />
    </div>
  );
}

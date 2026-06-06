"use client";

import * as React from "react";
import {
  ArrowUpIcon,
  BookOpenCheck,
  FileSearch,
  FileUp,
  Landmark,
  Layers3,
  Paperclip,
  PlusIcon,
  QrCode,
  ShieldCheck,
} from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { messageForApiError } from "@/lib/api/errors";
import { askAssistant } from "@/lib/api/resources";
import type { AssistantSource } from "@/lib/api/types";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
  status?: string;
  sources?: AssistantSource[];
};

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const adjustHeight = React.useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY),
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight],
  );

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) textarea.style.height = `${minHeight}px`;
  }, [minHeight]);

  React.useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

export function OpenScienceAiMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("size-6", className)}
      fill="none"
    >
      <defs>
        <linearGradient id="osh-ai-mark" x1="10" x2="54" y1="8" y2="58">
          <stop stopColor="#06B6D4" />
          <stop offset="0.48" stopColor="#1D4ED8" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <path
        d="M17 18.5c8.5-7.3 22.5-7.3 30.3.5 7.9 7.9 7.4 21.3-.7 28.9-8.2 7.7-22.1 7.1-29.6-1.1-7.3-8-7.1-20.9 0-28.3Z"
        stroke="url(#osh-ai-mark)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M8.5 34.5c9.7-9.8 28.2-14.1 41-9.6 6 2.1 8.1 5.6 5.5 8.8-4.8 5.8-22.2 9-35 6.2-7.6-1.7-12.8-4.1-11.5-5.4Z"
        stroke="currentColor"
        strokeWidth="2"
        className="text-white/70"
      />
      <path
        d="M36.3 7.8c5.2 11.3 4.2 29.3-2.2 40.3-3.4 5.8-7.5 8.4-10.1 6.2-5.5-4.7-4.2-23.2 2.2-35.3 3.7-7.1 8.8-13.9 10.1-11.2Z"
        stroke="currentColor"
        strokeWidth="2"
        className="text-white/70"
      />
      <rect x="24" y="22" width="17" height="20" rx="4" fill="#F8FAFC" />
      <path d="M29 28h7M29 33h8M29 38h5" stroke="#0B132B" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="20" r="4" fill="#06B6D4" />
      <circle cx="49" cy="25" r="3.5" fill="#10B981" />
      <circle cx="28" cy="53" r="3.5" fill="#1D4ED8" />
    </svg>
  );
}

export function VercelV0Chat({ className }: { className?: string }) {
  const [value, setValue] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 0,
      role: "assistant",
      status: "READY",
      text:
        "Bonjour. Je suis l'Assistant IA d'OpenScienceHub. J'interroge uniquement les sources autorisées du backend et je cite les documents utilisés.",
    },
  ]);
  const [loading, setLoading] = React.useState(false);
  const idRef = React.useRef(1);
  const bottomRef = React.useRef<HTMLDivElement | null>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 64,
    maxHeight: 220,
  });

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;

    setMessages((items) => [
      ...items,
      { id: idRef.current++, role: "user", text: question },
    ]);
    setValue("");
    adjustHeight(true);
    setLoading(true);

    try {
      const response = await askAssistant(question);
      setMessages((items) => [
        ...items,
        {
          id: idRef.current++,
          role: "assistant",
          status: response.answer_status,
          text:
            response.answer_status === "NO_CONTEXT_FOUND"
              ? "Je n'ai pas trouvé de contexte suffisant dans le corpus public pour répondre de façon fiable."
              : response.answer || "L'Assistant IA n'a pas retourné de réponse exploitable.",
          sources: response.sources || [],
        },
      ]);
    } catch (error) {
      setMessages((items) => [
        ...items,
        {
          id: idRef.current++,
          role: "assistant",
          status: "TECHNICAL_ERROR",
          text: messageForApiError(error),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send(value);
    }
  };

  return (
    <div className={cn("flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#060B16] text-white shadow-2xl", className)}>
      <div className="relative border-b border-white/10 p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(6,182,212,0.22),transparent_36%),radial-gradient(circle_at_92%_18%,rgba(16,185,129,0.16),transparent_32%)]" />
        <div className="relative flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <OpenScienceAiMark className="size-9" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-base font-semibold">Assistant IA OpenScienceHub</p>
            <p className="text-xs text-slate-300">
              Réponses sourcées · Catalogue public · IA via backend uniquement
            </p>
          </div>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200">
            Live
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,rgba(11,19,43,0.72),rgba(6,11,22,1))] p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                message.role === "user"
                  ? "bg-white text-slate-950"
                  : "border border-white/10 bg-white/[0.07] text-slate-100",
              )}
            >
              {message.role === "assistant" && (
                <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wide text-cyan-200">
                  <OpenScienceAiMark className="size-4" />
                  {message.status || "ANSWERED"}
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.text}</p>
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
                  {message.sources.slice(0, 4).map((source, index) => (
                    <a
                      key={`${source.work_id || source.title || index}`}
                      href={source.url || (source.work_id ? `/documents/${source.work_id}` : "#")}
                      className="block rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 hover:border-cyan-300/40 hover:text-white"
                    >
                      <span className="font-medium text-cyan-100">
                        Source {index + 1}
                      </span>{" "}
                      {source.title || source.work_id || "Document source"}
                      {source.excerpt && (
                        <span className="mt-1 line-clamp-2 block text-slate-400">
                          {source.excerpt}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-slate-300">
              <OpenScienceAiMark className="size-5 animate-pulse" />
              Analyse du corpus et préparation des sources...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="relative rounded-2xl border border-white/10 bg-neutral-950">
          <div className="overflow-y-auto">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Pose une question sur un document, une preuve, un dépôt, un endpoint..."
              className={cn(
                "min-h-16 w-full resize-none border-none bg-transparent px-4 py-3 text-sm text-white shadow-none",
                "placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0",
              )}
              style={{ overflow: "hidden" }}
            />
          </div>

          <div className="flex items-center justify-between p-3">
            <button
              type="button"
              className="group flex items-center gap-1 rounded-lg p-2 transition-colors hover:bg-white/10"
              title="Les pièces jointes resteront traitées via le flux dépôt PDF."
            >
              <Paperclip className="size-4 text-white" />
              <span className="hidden text-xs text-slate-400 transition-opacity group-hover:inline">
                Joindre
              </span>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center justify-between gap-1 rounded-lg border border-dashed border-slate-700 px-2 py-1 text-sm text-slate-400 transition-colors hover:border-slate-600 hover:bg-slate-800"
              >
                <PlusIcon className="size-4" />
                Corpus
              </button>
              <button
                type="button"
                onClick={() => void send(value)}
                disabled={!value.trim() || loading}
                className={cn(
                  "flex items-center justify-between gap-1 rounded-lg border border-slate-700 px-1.5 py-1.5 text-sm transition-colors hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50",
                  value.trim() ? "bg-white text-black" : "text-slate-400",
                )}
              >
                <ArrowUpIcon className={cn("size-4", value.trim() ? "text-black" : "text-slate-400")} />
                <span className="sr-only">Envoyer</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <ActionButton icon={<FileSearch className="size-4" />} label="Explorer un sujet" onClick={() => void send("Quels documents publics sont les plus pertinents sur l'intelligence artificielle ?")} />
          <ActionButton icon={<QrCode className="size-4" />} label="Vérifier un QR" onClick={() => void send("Explique comment vérifier une preuve QR OpenScienceHub.")} />
          <ActionButton icon={<FileUp className="size-4" />} label="Dépôt PDF" onClick={() => void send("Décris le flux complet de dépôt PDF avec extraction IA.")} />
          <ActionButton icon={<ShieldCheck className="size-4" />} label="Preuve SSI" onClick={() => void send("Comment la preuve SSI est-elle générée après archivage ?")} />
          <ActionButton icon={<Landmark className="size-4" />} label="Validation" onClick={() => void send("Quels sont les rôles du validateur dans le workflow ?")} />
          <ActionButton icon={<BookOpenCheck className="size-4" />} label="Sources" onClick={() => void send("Réponds uniquement avec les sources disponibles et cite-les.")} />
          <ActionButton icon={<Layers3 className="size-4" />} label="Séquences" onClick={() => void send("Donne la séquence backend IA SSI complète pour un dossier.")} />
        </div>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900 px-3 py-2 text-xs text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

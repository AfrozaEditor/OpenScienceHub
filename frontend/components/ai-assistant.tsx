"use client";

import * as React from "react";
import { X } from "lucide-react";

import { OpenScienceAiMark, VercelV0Chat } from "@/components/ui/v0-ai-chat";

export function AiAssistant() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed right-4 bottom-4 z-[70] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6 print:hidden">
      {open && (
        <div
          role="dialog"
          aria-label="Assistant IA"
          className="relative h-[min(760px,calc(100vh-6rem))] w-[min(920px,calc(100vw-2rem))] animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <VercelV0Chat className="h-full" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer l'assistant"
            className="absolute right-4 top-4 grid size-8 place-items-center rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Floating action button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Fermer l'assistant IA" : "Ouvrir l'assistant IA"}
        className="group relative grid size-16 place-items-center rounded-2xl text-white shadow-lg shadow-brand/30 transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ai/40"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--brand) 0%, var(--primary) 55%, var(--ai) 100%)",
        }}
      >
        {!open && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-ai/30" />
        )}
        {open ? <X className="size-6" /> : <OpenScienceAiMark className="size-10" />}
      </button>
    </div>
  );
}

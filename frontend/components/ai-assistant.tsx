"use client";

import * as React from "react";
import { Send, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const SUGGESTIONS = [
  "Comment déposer un document ?",
  "Qu'est-ce qu'une preuve d'authenticité ?",
  "Comment l'IA extrait les métadonnées ?",
  "Comment suivre l'état de mes dossiers ?",
];

const GREETING =
  "Bonjour 👋 Je suis l'assistant IA d'OpenScience Hub. Comment puis-je vous aider — dépôt, métadonnées, suivi de dossiers ou preuves d'authenticité ?";

function answerFor(question: string): string {
  const t = question.toLowerCase();
  if (/(déposer|deposer|dépôt|depot|soumett|télévers|televers|pdf)/.test(t)) {
    return "Pour déposer un document, ouvrez « Déposer un document » : téléversez votre PDF, l'IA extrait automatiquement les métadonnées, vous les vérifiez, puis vous soumettez le dossier pour validation institutionnelle.";
  }
  if (/(preuve|authenticit|certificat|hash|empreinte|signature|vérif|verif|did)/.test(t)) {
    return "Une preuve d'authenticité est un justificatif vérifiable : elle ancre l'empreinte SHA-256 de votre document, l'identifiant décentralisé (DID) de l'émetteur et une référence de vérification sur un registre. Elle prouve l'intégrité et l'origine de votre dépôt à tout vérificateur.";
  }
  if (/(métadonn|metadonn|extrai|extraction|\bia\b|intelligence|résumé|resume|mots-clés)/.test(t)) {
    return "L'IA analyse la mise en page et le texte de votre PDF pour détecter le titre, les auteurs, le résumé, les mots-clés, l'année et le domaine. Un score de confiance indique la fiabilité — et vous gardez toujours la main pour corriger avant de soumettre.";
  }
  if (/(dossier|suivre|statut|état|etat|validation|attente|rejet)/.test(t)) {
    return "Dans « Mes dossiers », chaque dépôt affiche son statut (brouillon, en attente, validé, rejeté). Ouvrez un dossier pour consulter la frise de validation détaillée et accéder à sa preuve d'authenticité une fois le dépôt validé.";
  }
  if (/(bonjour|salut|coucou|hello|bonsoir|merci|aide|help)/.test(t)) {
    return "Avec plaisir ! Je peux vous orienter sur le dépôt de documents, l'extraction de métadonnées par IA, le suivi de vos dossiers et les preuves d'authenticité vérifiables.";
  }
  return "Bonne question ! Je peux vous aider sur le dépôt de documents, l'extraction de métadonnées par IA, le suivi de vos dossiers et les preuves d'authenticité. Choisissez une suggestion ou reformulez pour une réponse plus précise.";
}

export function AiAssistant() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    { id: 0, role: "assistant", text: GREETING },
  ]);

  const idRef = React.useRef(1);
  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function send(text: string) {
    const value = text.trim();
    if (!value || typing) return;
    setMessages((m) => [
      ...m,
      { id: idRef.current++, role: "user", text: value },
    ]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: idRef.current++, role: "assistant", text: answerFor(value) },
      ]);
      setTyping(false);
    }, 750);
  }

  const showSuggestions = messages.length <= 1 && !typing;

  return (
    <div className="fixed right-4 bottom-4 z-[60] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6 print:hidden">
      {open && (
        <div
          role="dialog"
          aria-label="Assistant IA"
          className="flex h-[min(560px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
            <span className="grid size-9 place-items-center rounded-full bg-ai/10 text-ai">
              <Sparkles className="size-4.5" />
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-sm font-semibold text-foreground">
                Assistant IA
              </p>
              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="inline-block size-1.5 rounded-full bg-success" />
                En ligne · OpenScience Hub
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer l'assistant"
              className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 px-3.5 py-4">
            {messages.map((m) =>
              m.role === "assistant" ? (
                <div key={m.id} className="flex items-end gap-2">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ai/10 text-ai">
                    <Sparkles className="size-3.5" />
                  </span>
                  <div className="max-w-[82%] rounded-2xl rounded-bl-sm border border-border bg-card px-3 py-2 text-sm leading-relaxed text-foreground shadow-xs">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[82%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm leading-relaxed text-primary-foreground shadow-xs">
                    {m.text}
                  </div>
                </div>
              )
            )}

            {typing && (
              <div className="flex items-end gap-2">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ai/10 text-ai">
                  <Sparkles className="size-3.5" />
                </span>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-card px-3 py-2.5 shadow-xs">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {showSuggestions && (
              <div className="flex flex-col items-start gap-1.5 pt-1 pl-9">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-left text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-card px-3 py-3"
          >
            <Input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question…"
              aria-label="Votre message"
              autoComplete="off"
              className="h-9"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || typing}
              aria-label="Envoyer"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Floating action button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Fermer l'assistant IA" : "Ouvrir l'assistant IA"}
        className="group relative grid size-14 place-items-center rounded-full text-white shadow-lg shadow-brand/30 transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ai/40"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--brand) 0%, var(--primary) 55%, var(--ai) 100%)",
        }}
      >
        {!open && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-ai/30" />
        )}
        {open ? <X className="size-6" /> : <Sparkles className="size-6" />}
      </button>
    </div>
  );
}

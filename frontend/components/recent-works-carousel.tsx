"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { DocumentCardMini } from "@/components/document-card";
import type { ScientificDocument } from "@/lib/mock-data";

const GAP = 24; // gap-6
const AUTOPLAY_MS = 5000;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

export function RecentWorksCarousel({ docs }: { docs: ScientificDocument[] }) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const pausedRef = React.useRef(false);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(true);
  const [active, setActive] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);

  const stepSize = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 0;
    const first = el.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + GAP : el.clientWidth;
  }, []);

  const update = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < maxScroll - 8);
    const step = stepSize();
    setActive(step > 0 ? Math.round(el.scrollLeft / step) : 0);
  }, [stepSize]);

  React.useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  // Autoplay (paused on hover/focus, hidden tab, or reduced motion)
  React.useEffect(() => {
    if (!playing || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      const el = scrollerRef.current;
      if (!el || pausedRef.current || document.hidden) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 8;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: stepSize(), behavior: "smooth" });
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [playing, stepSize]);

  function scrollByDir(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * stepSize(), behavior: "smooth" });
  }

  function goTo(i: number) {
    scrollerRef.current?.scrollTo({ left: i * stepSize(), behavior: "smooth" });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByDir(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByDir(-1);
    }
  }

  const pause = () => (pausedRef.current = true);
  const resume = () => (pausedRef.current = false);

  return (
    <div
      className="group relative"
      role="region"
      aria-roledescription="carrousel"
      aria-label="Travaux récemment archivés"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
    >
      {/* Edge fades */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent transition-opacity duration-300",
          canPrev ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent transition-opacity duration-300",
          canNext ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Side arrows (sm+) */}
      <button
        type="button"
        onClick={() => scrollByDir(-1)}
        disabled={!canPrev}
        aria-label="Travaux précédents"
        className={cn(
          "absolute left-1 top-1/2 z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-md backdrop-blur transition-all sm:flex",
          "hover:border-primary/40 hover:text-primary",
          canPrev
            ? "opacity-0 group-hover:opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollByDir(1)}
        disabled={!canNext}
        aria-label="Travaux suivants"
        className={cn(
          "absolute right-1 top-1/2 z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-md backdrop-blur transition-all sm:flex",
          "hover:border-primary/40 hover:text-primary",
          canNext
            ? "opacity-0 group-hover:opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Track */}
      <div
        ref={scrollerRef}
        onScroll={update}
        onKeyDown={onKeyDown}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 outline-none [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:ring-3 focus-visible:ring-ring/30 [&::-webkit-scrollbar]:hidden"
      >
        {docs.map((doc, i) => (
          <div
            key={doc.id}
            role="group"
            aria-roledescription="diapositive"
            aria-label={`${i + 1} sur ${docs.length}`}
            className="flex min-w-[80%] shrink-0 snap-start sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)]"
          >
            <DocumentCardMini doc={doc} className="h-full w-full" />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? "Mettre en pause le défilement" : "Lancer le défilement"}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          {playing ? "Pause" : "Lecture"}
        </button>

        <div
          className="flex items-center gap-1.5"
          role="tablist"
          aria-label="Sélection du travail"
        >
          {docs.map((doc, i) => (
            <button
              key={doc.id}
              type="button"
              role="tab"
              onClick={() => goTo(i)}
              aria-label={`Aller au travail ${i + 1}`}
              aria-selected={i === active}
              className={cn(
                "h-2 rounded-full transition-all",
                i === active
                  ? "w-6 bg-primary"
                  : "w-2 bg-border hover:bg-muted-foreground/40"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

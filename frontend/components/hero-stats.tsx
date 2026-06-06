"use client";

import * as React from "react";

const fr = new Intl.NumberFormat("fr-FR");

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

function useCountUp(target: number, start: boolean, duration = 1600) {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      setValue(Math.round(easeOutCubic(p) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);

  return value;
}

export interface HeroStat {
  value: number;
  suffix?: string;
  label: string;
}

function Stat({
  value,
  suffix,
  label,
  start,
}: HeroStat & { start: boolean }) {
  const n = useCountUp(value, start);
  return (
    <div className="bg-card px-5 py-6 text-center">
      <div className="font-heading text-2xl font-semibold tabular-nums text-brand lg:text-3xl">
        {fr.format(n)}
        {suffix}
      </div>
      <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</div>
    </div>
  );
}

export function HeroStats({ stats }: { stats: HeroStat[] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [start, setStart] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setStart(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStart(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3 lg:grid-cols-5"
    >
      {stats.map((s) => (
        <Stat key={s.label} {...s} start={start} />
      ))}
    </div>
  );
}

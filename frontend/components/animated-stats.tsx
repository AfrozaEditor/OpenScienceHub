"use client";

import * as React from "react";

const fr = new Intl.NumberFormat("fr-FR");

export interface StatItem {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function AnimatedNumber({
  value,
  active,
  durationRef,
}: {
  value: number;
  active: boolean;
  durationRef: React.RefObject<number>;
}) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!active) return;

    const duration = durationRef.current;
    let frame = 0;
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = duration > 0 ? Math.min(elapsed / duration, 1) : 1;
      setDisplay(Math.round(easeOutExpo(progress) * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value, durationRef]);

  return <>{fr.format(display)}</>;
}

export function AnimatedStats({ stats }: { stats: StatItem[] }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const durationRef = React.useRef(2000);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      durationRef.current = 0;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <dl
      ref={ref}
      className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-5"
    >
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center text-center">
          <dd className="font-heading text-4xl font-semibold tracking-tight tabular-nums text-brand sm:text-5xl">
            {stat.prefix}
            <AnimatedNumber
              value={stat.value}
              active={active}
              durationRef={durationRef}
            />
            {stat.suffix}
          </dd>
          <span className="mt-3 h-0.5 w-8 rounded-full bg-gradient-to-r from-primary to-ai" />
          <dt className="mt-3 text-xs font-medium text-muted-foreground sm:text-sm">
            {stat.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}

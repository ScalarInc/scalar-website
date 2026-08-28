"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projects, tracks, type Project, type Track } from "@/lib/projects";
import Reveal from "./ui/Reveal";

/** Deterministic geometric mark so every card reads distinct without imagery. */
function Glyph({ seed, className = "" }: { seed: string; className?: string }) {
  const h = useMemo(() => {
    let n = 0;
    for (let i = 0; i < seed.length; i++) n = (n * 31 + seed.charCodeAt(i)) >>> 0;
    return n;
  }, [seed]);

  const rings = 2 + (h % 3);
  const spokes = 6 + (h % 7);
  const rot = h % 90;

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <g transform={`rotate(${rot} 60 60)`} strokeWidth="0.9">
        {Array.from({ length: rings }).map((_, i) => (
          <circle key={i} cx="60" cy="60" r={16 + i * 15} strokeOpacity={0.5 - i * 0.1} />
        ))}
        {Array.from({ length: spokes }).map((_, i) => {
          const a = (i / spokes) * Math.PI * 2;
          const r = 16 + (rings - 1) * 15;
          // Rounded so the SSR and client path strings are byte-identical;
          // raw Math.cos/sin differ in the final digit between engines.
          const x = (60 + Math.cos(a) * r).toFixed(3);
          const y = (60 + Math.sin(a) * r).toFixed(3);
          return (
            <path key={i} d={`M60 60 L${x} ${y}`} strokeOpacity="0.32" />
          );
        })}
        <rect x="34" y="34" width="52" height="52" strokeOpacity="0.4" />
        <circle cx="60" cy="60" r="2.6" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

function Detail({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("is-locked");
    // Move focus into the dialog so PageDown/arrows scroll the panel rather
    // than doing nothing, and so screen readers land in the right place.
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[95] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-ink-950/85 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        ref={panelRef}
        tabIndex={-1}
        layoutId={`card-${project.slug}`}
        /* data-lenis-prevent hands the wheel back to this element, otherwise
           smooth scroll swallows it and the page moves behind the dialog. */
        data-lenis-prevent
        className="relative max-h-[88vh] w-full max-w-[820px] overflow-y-auto overscroll-contain border border-ink-700 bg-ink-900 p-[clamp(24px,3.2vw,52px)] outline-none"
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-start justify-between gap-6">
          <motion.span layoutId={`idx-${project.slug}`} className="font-mono text-[11px] text-ink-400">
            {project.index}
          </motion.span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="grid h-10 w-10 flex-none place-items-center border border-ink-600 text-paper transition-colors hover:border-paper"
          >
            <span className="relative grid h-4 w-4 place-items-center rotate-45">
              <span className="absolute h-px w-4 bg-current" />
              <span className="absolute h-4 w-px bg-current" />
            </span>
          </button>
        </div>

        <motion.h3
          layoutId={`title-${project.slug}`}
          className="display mt-5 max-w-[20ch] text-[clamp(24px,3.1vw,42px)] text-paper"
        >
          {project.name}
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          <dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-ink-700 pt-7 sm:grid-cols-2">
            {[
              ["Sector", project.sector],
              ["Type", project.kind],
              ["Status", project.status],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow mb-1.5 text-ink-400">{k}</dt>
                <dd className="text-[15px] text-paper">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid gap-7 border-t border-ink-700 pt-7">
            <div>
              <h4 className="eyebrow mb-2.5 text-ink-400">What it is</h4>
              <p className="max-w-[62ch] text-[15px] leading-[1.72] text-ink-100">
                {project.summary}
              </p>
            </div>
            {project.problem && (
              <div>
                <h4 className="eyebrow mb-2.5 text-ink-400">The problem</h4>
                <p className="max-w-[62ch] text-[15px] leading-[1.72] text-ink-200">
                  {project.problem}
                </p>
              </div>
            )}
            {project.audience && (
              <div>
                <h4 className="eyebrow mb-2.5 text-ink-400">Built for</h4>
                <p className="max-w-[62ch] text-[15px] leading-[1.72] text-ink-200">
                  {project.audience}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Work() {
  const [filter, setFilter] = useState<Track | "All">("All");
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(
    () =>
      filter === "All" ? projects : projects.filter((p) => p.track === filter),
    [filter]
  );

  const selected = projects.find((p) => p.slug === open) ?? null;

  return (
    <section
      id="work"
      className="lip relative z-[2] -mt-8 bg-ink-950 py-[clamp(64px,8vw,128px)] text-paper"
    >
      <div className="shell">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal>
              <span className="eyebrow mb-4 block text-ink-400">Work</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="display text-[clamp(26px,3.4vw,48px)]">
                {projects.length} products
                <br />
                <span className="italic font-serif font-normal normal-case text-[1.08em] tracking-tight text-paper/95">in motion.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <p className="max-w-[38ch] text-[15px] leading-relaxed text-ink-300">
              Across security, enterprise operations, education, accessibility
              and platform infrastructure. Select any one to read the brief.
            </p>
          </Reveal>
        </div>

        {/* filters */}
        <Reveal delay={0.2}>
          <div className="mb-9 flex flex-wrap gap-2.5" role="group" aria-label="Filter products by track">
            {(["All", ...tracks] as const).map((t) => {
              const on = filter === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilter(t)}
                  aria-pressed={on}
                  className={`relative rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-300 ${
                    on
                      ? "border-paper text-ink-950"
                      : "border-ink-700 text-ink-300 hover:border-ink-500 hover:text-paper"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-paper"
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <span className="relative">
                    {t}
                    <span className="ml-2 opacity-50">
                      {t === "All"
                        ? projects.length
                        : projects.filter((p) => p.track === t).length}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* grid */}
        <motion.div layout className="grid gap-px bg-ink-800 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.button
                key={p.slug}
                type="button"
                layout
                layoutId={`card-${p.slug}`}
                onClick={() => setOpen(p.slug)}
                aria-haspopup="dialog"
                aria-label={`View details for ${p.name}`}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.55,
                  delay: Math.min(i * 0.045, 0.35),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden bg-ink-950 p-7 text-left transition-colors duration-500 hover:bg-ink-900"
              >
                {/* glyph watermark */}
                <div className="pointer-events-none absolute -right-8 -top-8 text-ink-700 opacity-40 transition-all duration-700 group-hover:rotate-45 group-hover:opacity-70">
                  <Glyph seed={p.slug} className="h-40 w-40" />
                </div>

                <div className="relative flex items-start justify-between gap-4">
                  <motion.span
                    layoutId={`idx-${p.slug}`}
                    className="font-mono text-[11px] text-ink-400"
                  >
                    {p.index}
                  </motion.span>
                  <span className="rounded-full border border-ink-700 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-300">
                    {p.track}
                  </span>
                </div>

                <div className="relative">
                  <motion.h3
                    layoutId={`title-${p.slug}`}
                    className="display mb-3 max-w-[16ch] text-[clamp(17px,1.5vw,23px)] text-paper"
                  >
                    {p.name}
                  </motion.h3>
                  <p className="mb-6 max-w-[36ch] text-[13.5px] leading-[1.65] text-ink-300 line-clamp-3">
                    {p.summary}
                  </p>

                  <div className="flex items-center justify-between gap-4 border-t border-ink-800 pt-4">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-400">
                      {p.sector} · {p.kind}
                    </span>
                    <span className="relative grid h-7 w-7 place-items-center border border-ink-700 text-ink-300 transition-all duration-500 group-hover:rotate-90 group-hover:border-paper group-hover:text-paper">
                      <span className="absolute h-px w-2.5 bg-current" />
                      <span className="absolute h-2.5 w-px bg-current" />
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && <Detail project={selected} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}

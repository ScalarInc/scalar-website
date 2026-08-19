"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "./ui/Reveal";
import PlusLink from "./ui/PlusLink";

const DWELL = 5200;

const PANELS = [
  {
    title: "Architecture & System Design",
    body: "We define the shape of a system before a line of it is written — boundaries, data flow, failure modes, and the migration path from whatever exists today.",
    bg: "bg-ink-900",
    fg: "text-paper",
  },
  {
    title: "Applied AI & Machine Learning",
    body: "Models put to work on real problems: detection, extraction, forecasting and generation, evaluated against the cost of a confident wrong answer.",
    bg: "bg-ink-800",
    fg: "text-paper",
  },
  {
    title: "Security Engineering",
    body: "Threat detection, vulnerability analysis and compliance automation built as products, not checklists — because the flaws that matter are the ones nobody reviewed.",
    bg: "bg-ink-600",
    fg: "text-paper",
  },
  {
    title: "Platform & Cloud Infrastructure",
    body: "The substrate everything else runs on: provisioning, pipelines, GPU and CPU pods, observability, and environments that let a small team ship without ceremony.",
    bg: "bg-ink-200",
    fg: "text-ink-950",
  },
  {
    title: "Product Delivery",
    body: "Interfaces people actually use. We take a system from working to shipped, then stay on it while real usage reshapes what it needs to be.",
    bg: "bg-paper-dim",
    fg: "text-ink-950",
  },
];

export default function Capabilities() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setActive((i) => (i + 1) % PANELS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(advance, DWELL);
    return () => window.clearTimeout(t);
  }, [active, paused, advance]);

  const pct = Math.round(((active + 1) / PANELS.length) * 100);

  return (
    <section
      id="capabilities"
      className="lip relative z-[2] -mt-8 bg-paper py-[clamp(64px,8vw,128px)] text-ink-950"
    >
      <div className="shell">
        <div className="mb-[clamp(32px,4vw,60px)] flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal>
              <span className="eyebrow mb-4 block text-ink-400">
                Capabilities
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="display text-[clamp(26px,3.4vw,48px)]">
                <span className="italic font-serif font-normal normal-case text-[1.08em] tracking-tight text-ink-950/90">Hard problems.</span>
                <br />
                Systems that hold.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <PlusLink href="#work">See the work</PlusLink>
          </Reveal>
        </div>
      </div>

      <div className="shell">
        <Reveal y={40}>
          <div
            className="flex h-[620px] flex-col overflow-hidden md:h-[clamp(420px,44vw,540px)] md:flex-row"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {PANELS.map((panel, i) => {
              const isActive = i === active;
              return (
                <motion.div
                  key={panel.title}
                  className={`relative cursor-pointer overflow-hidden ${panel.bg} ${panel.fg}`}
                  animate={{ flexGrow: isActive ? 7 : 1 }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  style={{ flexBasis: 0, flexShrink: 1 }}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                  aria-label={`Capability ${i + 1} of ${PANELS.length}: ${panel.title}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActive(i);
                    }
                  }}
                >
                  {/* Collapsed label — unmounted while active so it can't
                      ghost through the expanded content mid-transition. */}
                  <AnimatePresence>
                    {!isActive && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center p-4 md:items-end md:justify-start md:p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.85 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="vertical-label font-mono text-[11px] font-medium uppercase tracking-[0.16em] leading-tight">
                          {panel.title}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* expanded content */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 flex flex-col justify-between p-[clamp(20px,2.4vw,40px)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45, delay: 0.2 }}
                      >
                        <div className="flex items-start justify-between gap-6">
                          <motion.h3
                            className="max-w-[16ch] font-mono text-[clamp(15px,1.5vw,22px)] font-medium uppercase tracking-[0.02em] leading-snug"
                            initial={{ y: 18, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.28 }}
                          >
                            {panel.title}
                          </motion.h3>
                          <span className="font-mono text-[11px] opacity-50">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <motion.p
                          className="max-w-[52ch] font-mono text-[clamp(12px,1.02vw,14px)] leading-[1.75] opacity-80"
                          initial={{ y: 18, opacity: 0 }}
                          animate={{ y: 0, opacity: 0.8 }}
                          transition={{ duration: 0.6, delay: 0.36 }}
                        >
                          {panel.body}
                        </motion.p>

                        {/* dwell progress */}
                        <div className="flex items-center gap-4">
                          <div className="relative h-px flex-1 bg-current/25">
                            <motion.div
                              key={`${active}-${paused}`}
                              className="absolute inset-y-0 left-0 bg-current"
                              initial={{ width: "0%" }}
                              animate={{ width: paused ? "0%" : "100%" }}
                              transition={{
                                duration: paused ? 0 : DWELL / 1000,
                                ease: "linear",
                              }}
                            />
                          </div>
                          <span className="font-mono text-[11px] opacity-50">
                            {pct}%
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

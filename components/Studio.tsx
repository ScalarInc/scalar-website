"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { projects, tracks, leads } from "@/lib/projects";
import Reveal from "./ui/Reveal";
import SplitText from "./ui/SplitText";

const PRINCIPLES = [
  {
    n: "01",
    title: "Think beyond the given",
    body: "The brief is a starting point, not a specification. We push on the assumptions underneath it before we build against them.",
    pct: 92,
  },
  {
    n: "02",
    title: "Small teams, senior hands",
    body: "Every product here is led by someone who writes the code. Nobody on your project is learning on your budget.",
    pct: 84,
  },
  {
    n: "03",
    title: "Stay curious, stay practical",
    body: "Stay curious about what technology can become. Push into what is possible, then make it practical enough to run on a Tuesday morning.",
    pct: 85,
  },
  {
    n: "04",
    title: "No two systems are the same",
    body: "Patterns transfer; solutions don't. We reuse hard-won judgement, not last year's architecture with the names swapped out.",
    pct: 64,
  },
];

const STATS = [
  { v: String(projects.length), l: "Products in motion" },
  { v: String(tracks.length), l: "Capability tracks" },
  { v: String(leads.length), l: "Product leads" },
  { v: "100%", l: "Built in-house" },
];

function Counter({ value }: { value: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="display block text-[clamp(32px,3.6vw,56px)] text-paper"
    >
      {value}
    </motion.span>
  );
}

export default function Studio() {
  const [open, setOpen] = useState(0);

  return (
    <section id="studio" className="relative bg-ink-950 pb-[clamp(64px,8vw,128px)] text-paper">
      {/* marquee of sectors */}
      <div className="relative overflow-hidden border-y border-ink-800 py-6">
        <motion.div
          className="flex gap-10 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 gap-10">
              {projects.map((p) => (
                <span
                  key={`${dup}-${p.slug}`}
                  className="flex items-center gap-10 font-mono text-[12px] uppercase tracking-[0.16em] text-ink-400"
                >
                  {p.sector}
                  <span className="text-ink-700">/</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="shell pt-[clamp(56px,7vw,110px)]">
        <div className="grid gap-[clamp(32px,4vw,72px)] lg:grid-cols-2">
          {/* left */}
          <div>
            <Reveal>
              <span className="eyebrow mb-5 block text-ink-400">Studio</span>
            </Reveal>
            <SplitText
              as="h2"
              text="Don't be a cog in the machine."
              className="display mb-8 block text-[clamp(36px,5.6vw,84px)]"
              stagger={0.05}
            />
            <div className="grid gap-6 sm:grid-cols-2">
              <Reveal delay={0.12}>
                <p className="max-w-[42ch] text-[15px] leading-[1.7] text-ink-300">
                  Scalar is built around engineers who take a product from the
                  first whiteboard through to the version people depend on. No
                  ticket queues, no hand-offs into the void.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="max-w-[42ch] text-[15px] leading-[1.7] text-ink-300">
                  Every track below is owned end to end. If you want that kind
                  of ownership over systems that matter, we should talk.
                </p>
              </Reveal>
            </div>

            {/* stats */}
            <div className="mt-[clamp(36px,4vw,64px)] grid grid-cols-2 gap-px bg-ink-800">
              {STATS.map((s) => (
                <div key={s.l} className="bg-ink-950 p-5">
                  <Counter value={s.v} />
                  <span className="mt-2 block font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-400">
                    {s.l}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* principles accordion — self-start so the container's hairline
              background doesn't stretch past the last item */}
          <div className="grid self-start gap-px bg-ink-800">
            {PRINCIPLES.map((p, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={p.n}
                  className={`transition-colors duration-500 ${
                    isOpen ? "bg-ink-850" : "bg-ink-950"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-5 p-[clamp(18px,2vw,30px)] text-left"
                  >
                    <span className="font-mono text-[12px] text-ink-500">
                      {p.n}
                    </span>
                    <span className="font-mono text-[clamp(12.5px,1.15vw,16px)] font-medium uppercase tracking-[0.03em] text-paper">
                      {p.title}
                    </span>
                    <motion.span
                      className="relative grid h-5 w-5 place-items-center text-ink-300"
                      animate={{ rotate: isOpen ? 135 : 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="absolute h-px w-4 bg-current" />
                      <span className="absolute h-4 w-px bg-current" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-5 px-[clamp(18px,2vw,30px)] pb-[clamp(18px,2vw,30px)]">
                          <p className="max-w-[52ch] font-mono text-[12.5px] leading-[1.8] text-ink-300">
                            {p.body}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="relative h-px flex-1 bg-ink-700">
                              <motion.div
                                className="absolute inset-y-0 left-0 bg-paper"
                                initial={{ width: 0 }}
                                animate={{ width: `${p.pct}%` }}
                                transition={{
                                  duration: 1.1,
                                  delay: 0.15,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                              />
                            </div>
                            <span className="font-mono text-[11px] text-ink-500">
                              {p.pct}%
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

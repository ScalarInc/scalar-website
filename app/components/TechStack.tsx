"use client";

import { motion } from "framer-motion";
import OrbitingCirclesGlobe from "@/components/ui/orbiting-circles-02";
import { fadeUp, stagger, EASE } from "@/app/lib/motion";

const stack = [
  { name: "OpenAI / Claude / Gemini", detail: "Multi-model routing with fallbacks" },
  { name: "React + Python", detail: "Full-stack delivery your team can own" },
  { name: "Postgres + Supabase", detail: "Retrieval corpora and product data" },
  { name: "Evals & Observability", detail: "Traces, regressions, prompt versions" },
];

export default function TechStack() {
  return (
    <section id="stack" className="relative overflow-hidden border-t border-line bg-canvas">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] opacity-80"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, var(--color-glow), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1180px] px-6 pt-[clamp(72px,10vw,120px)]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger(0.08)}
          className="mx-auto max-w-[640px] text-center"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 font-mono text-[11.5px] uppercase tracking-[0.14em] text-muted"
          >
            Technology
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-balance text-[clamp(34px,4.8vw,56px)] font-semibold leading-[1.02] tracking-[-0.05em]"
          >
            The stack we ship with.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-[48ch] text-[16.5px] leading-[1.6] text-muted"
          >
            The same models, data layer, and engineering surface we use to put LLM products into
            production for your team.
          </motion.p>
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0.07)}
          className="mx-auto mt-12 grid max-w-[900px] gap-4 sm:grid-cols-2"
        >
          {stack.map((item) => (
            <motion.li
              key={item.name}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex items-start gap-3 px-1 py-2 text-left"
            >
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand shadow-[0_0_12px_var(--color-glow)]" />
              <div>
                <p className="text-[15.5px] font-semibold tracking-[-0.02em] text-ink">{item.name}</p>
                <p className="mt-1 text-[14px] text-muted">{item.detail}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Full-bleed orbit visual — not boxed in a card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative mt-8 w-full"
      >
        <OrbitingCirclesGlobe />
      </motion.div>
    </section>
  );
}

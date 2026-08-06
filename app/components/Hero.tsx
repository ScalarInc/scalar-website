"use client";

import { motion } from "framer-motion";
import { EASE, fadeUp, stagger } from "@/app/lib/motion";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-24 pt-[170px]">
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0.55, 0.9, 0.55], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
        className="pointer-events-none absolute left-1/2 top-[-160px] h-[560px] w-[900px] -translate-x-1/2 rounded-full blur-2xl"
        style={{
          background: "radial-gradient(ellipse at center, var(--color-glow), transparent 62%)",
        }}
      />

      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex max-w-[1180px] flex-col items-center text-center"
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex h-[34px] items-center gap-[10px] whitespace-nowrap rounded-full border border-line bg-surface px-[14px] font-mono text-[11.5px] uppercase tracking-[0.1em] text-dim"
        >
          <span className="h-[6px] w-[6px] rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
          AI product engineering
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mt-[26px] max-w-[16ch] text-balance text-[clamp(44px,7.2vw,92px)] font-semibold leading-[0.98] tracking-[-0.055em]"
        >
          AI systems, engineered for production.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="gradient-sweep mt-[22px] text-[clamp(22px,3vw,34px)] font-medium leading-none tracking-[-0.04em]"
        >
          Built for What&apos;s Next
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mt-[26px] max-w-[60ch] text-pretty text-[18px] leading-[1.55] text-dim"
        >
          Scalar is an AI engineering partner for teams shipping real products. We design, build and
          operate LLM applications, agents and the data infrastructure underneath them — then hand
          you something your engineers can own.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.a
            href="#contact"
            whileHover={{ y: -3 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="inline-flex h-[52px] items-center gap-[10px] rounded-[14px] bg-accent px-[26px] text-[15.5px] font-semibold text-accent-on transition-shadow hover:!text-accent-on hover:shadow-[0_18px_44px_var(--color-glow)]"
          >
            Start a project
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </motion.a>
          <motion.a
            href="#features"
            whileHover={{ y: -3 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="inline-flex h-[52px] items-center rounded-[14px] border border-line-strong bg-surface px-[26px] text-[15.5px] font-medium transition-colors hover:border-accent"
          >
            See what we build
          </motion.a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-[34px] flex flex-wrap items-center justify-center gap-[26px] font-mono text-xs tracking-[0.04em] text-dim"
        >
          <span>SOC 2 aligned delivery</span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-line-strong" />
          <span>Your cloud or ours</span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-line-strong" />
          <span>Code and weights you own</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.7 }}
          className="mx-auto mt-16 w-full max-w-[1120px]"
        >
          <div className="relative overflow-hidden rounded-[22px] border border-line bg-surface shadow-glow">
            <div className="flex h-11 items-center gap-2 border-b border-line px-4">
              <span className="h-[9px] w-[9px] rounded-full bg-line-strong" />
              <span className="h-[9px] w-[9px] rounded-full bg-line-strong" />
              <span className="h-[9px] w-[9px] rounded-full bg-line-strong" />
              <span className="ml-3 font-mono text-[11.5px] text-dim">scalar / console</span>
            </div>
            <div
              className="grid aspect-video place-items-center"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, var(--color-line) 0 1px, transparent 1px 13px)",
              }}
            >
              <span className="font-mono text-[12.5px] uppercase tracking-[0.08em] text-dim">
                hero product shot — 1600 × 900
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

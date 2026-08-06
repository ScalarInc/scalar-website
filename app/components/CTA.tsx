"use client";

import { motion } from "framer-motion";
import { EASE, fadeUp, stagger } from "@/app/lib/motion";

export default function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-line px-6 py-[clamp(80px,9vw,140px)]">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
        viewport={{ once: false }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, var(--color-glow), transparent 65%)" }}
      />
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative mx-auto flex max-w-[900px] flex-col items-center text-center"
      >
        <motion.p
          variants={fadeUp}
          className="mb-5 font-mono text-[11.5px] uppercase tracking-[0.14em] text-dim"
        >
          Let&apos;s build
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="text-balance text-[clamp(40px,5.6vw,72px)] font-semibold leading-[1] tracking-[-0.055em]"
        >
          Ship the AI system your users actually needed.
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="gradient-sweep mt-5 text-[clamp(20px,2.4vw,28px)] font-medium leading-none tracking-[-0.035em]"
        >
          Built for What&apos;s Next
        </motion.p>
        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap justify-center gap-3">
          <motion.a
            href="mailto:hello@scalar.dev"
            whileHover={{ y: -3 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="inline-flex h-14 items-center gap-3 rounded-[14px] bg-accent px-8 text-[16px] font-semibold text-accent-on transition-shadow hover:!text-accent-on hover:shadow-[0_18px_50px_var(--color-glow)]"
          >
            Book a call
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </motion.a>
          <motion.a
            href="#features"
            whileHover={{ y: -3 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="inline-flex h-14 items-center rounded-[14px] border border-line-strong bg-surface px-8 text-[16px] font-medium transition-colors hover:border-accent"
          >
            See what we build
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}

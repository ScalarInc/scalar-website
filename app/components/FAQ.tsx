"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { EASE, fadeUp, stagger } from "@/app/lib/motion";

const items = [
  {
    q: "How is Scalar different from an agency?",
    a: "We are an engineering team, not a design shop with contractors. Every engagement is led by a senior IC who ships code alongside your team and stays with the project past launch.",
  },
  {
    q: "Do you work with our stack?",
    a: "Yes. We build with your existing cloud, data platform, model providers and CI. If you have gaps, we bring vetted defaults — Postgres + pgvector, OpenAI or Anthropic, Modal or your own GPUs.",
  },
  {
    q: "Who owns the code and model weights?",
    a: "You do, from day one. All IP produced under an engagement is yours. Our infrastructure and evaluations are handed over with runbooks so your team can operate them without us.",
  },
  {
    q: "Can you fine-tune or train models for us?",
    a: "Yes. We handle the full loop — data collection, filtering, supervised fine-tuning, DPO, evaluation, and deployment. We only fine-tune when the data and evals justify it.",
  },
  {
    q: "How do you handle security and compliance?",
    a: "SOC 2 aligned delivery process. We can operate inside your VPC, sign your data-processing agreements, and produce artefacts your infosec team can review.",
  },
  {
    q: "How quickly can we start?",
    a: "Discovery engagements start within two weeks. Embedded pods usually kick off inside a month, subject to interviews and scoping calls.",
  },
];

function Row({ q, a, i, open, onToggle }: { q: string; a: string; i: number; open: boolean; onToggle: () => void }) {
  return (
    <motion.div variants={fadeUp} className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="flex items-center gap-5">
          <span className="font-mono text-[11px] tracking-[0.12em] text-dim">
            0{i + 1}
          </span>
          <span className="text-[19px] font-medium tracking-[-0.02em]">{q}</span>
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="grid h-9 w-9 flex-none place-items-center rounded-full border border-line text-dim"
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-14 pl-[52px] text-[15.5px] leading-[1.65] text-dim">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section id="faq" className="border-t border-line px-6 py-[clamp(80px,9vw,140px)]">
      <div className="mx-auto grid max-w-[1180px] gap-16 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger(0.08)}
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 font-mono text-[11.5px] uppercase tracking-[0.14em] text-dim"
          >
            Frequently asked
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-balance text-[clamp(34px,4.4vw,54px)] font-semibold leading-[1.02] tracking-[-0.05em]"
          >
            Answers before you book the call.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[42ch] text-[15.5px] leading-[1.6] text-dim"
          >
            Still curious? Reach out and one of our engineers will get back to you within a business day.
          </motion.p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger(0.06)}
          className="border-t border-line"
        >
          {items.map((it, i) => (
            <Row
              key={it.q}
              i={i}
              q={it.q}
              a={it.a}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

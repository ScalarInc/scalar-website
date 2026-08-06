"use client";

import { motion } from "framer-motion";
import { EASE, fadeUp, stagger } from "@/app/lib/motion";
import { useState } from "react";

type Tier = {
  name: string;
  price: { monthly: string; annual: string };
  cadence: string;
  blurb: string;
  features: string[];
  cta: string;
  highlight?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Starter",
    price: { monthly: "$4k", annual: "$3.4k" },
    cadence: "per week",
    blurb: "A two-week discovery to de-risk a first LLM feature and hand you a working prototype.",
    features: [
      "Scoping and evals workshop",
      "One prototype build",
      "Model + retrieval selection",
      "Async review sessions",
    ],
    cta: "Book discovery",
  },
  {
    name: "Growth",
    price: { monthly: "$18k", annual: "$15k" },
    cadence: "per week",
    blurb: "An embedded pod that ships production LLM features with your engineers.",
    features: [
      "2 engineers embedded",
      "Retrieval, agents, evals",
      "Weekly release cadence",
      "On-call handover to your team",
      "Full IP and code ownership",
    ],
    cta: "Start an engagement",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", annual: "Custom" },
    cadence: "annual",
    blurb: "Multiple pods and long-run infrastructure work with SOC 2 aligned delivery.",
    features: [
      "3+ engineers per pod",
      "Dedicated MLOps stream",
      "SOC 2 aligned processes",
      "Dedicated Slack + SLAs",
      "Executive weekly reviews",
    ],
    cta: "Talk to sales",
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  return (
    <section
      id="pricing"
      className="border-t border-line px-6 py-[clamp(80px,9vw,140px)]"
    >
      <div className="mx-auto max-w-[1180px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger(0.08)}
          className="mx-auto max-w-[760px] text-center"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 font-mono text-[11.5px] uppercase tracking-[0.14em] text-dim"
          >
            Engagement models
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-balance text-[clamp(34px,4.8vw,62px)] font-semibold leading-[1.02] tracking-[-0.05em]"
          >
            Priced by outcome, not by seat.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-[54ch] text-pretty text-[17px] leading-[1.55] text-dim"
          >
            Flexible engagements from a first prototype to a permanent pod. Every plan comes with
            code, weights, and documentation you own on day one.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1 text-sm"
            role="tablist"
          >
            {(["annual", "monthly"] as const).map((mode) => {
              const active = (mode === "annual") === annual;
              return (
                <button
                  key={mode}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setAnnual(mode === "annual")}
                  className="relative rounded-full px-4 py-1.5 font-medium transition-colors"
                >
                  {active && (
                    <motion.span
                      layoutId="pricing-toggle"
                      transition={{ duration: 0.35, ease: EASE }}
                      className="absolute inset-0 -z-0 rounded-full bg-raise"
                    />
                  )}
                  <span className={`relative ${active ? "text-txt" : "text-dim"}`}>
                    {mode === "annual" ? "Annual · save 15%" : "Monthly"}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0.1)}
          className="mt-14 grid gap-4 md:grid-cols-3"
        >
          {tiers.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              className={`relative flex flex-col rounded-[22px] border p-8 transition-transform duration-300 hover:-translate-y-1 ${
                t.highlight
                  ? "border-accent/50 bg-raise shadow-[0_20px_80px_var(--color-glow)]"
                  : "border-line bg-surface"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-8 inline-flex h-6 items-center rounded-full bg-accent px-3 font-mono text-[10.5px] uppercase tracking-[0.1em] text-accent-on">
                  Most picked
                </span>
              )}
              <h3 className="text-[22px] font-semibold tracking-[-0.03em]">{t.name}</h3>
              <p className="mt-2 min-h-[3rem] text-[14.5px] leading-[1.5] text-dim">{t.blurb}</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-[42px] font-semibold tracking-[-0.04em]">
                  {annual ? t.price.annual : t.price.monthly}
                </span>
                <span className="text-sm text-dim">{t.cadence}</span>
              </div>
              <ul className="mt-6 flex flex-col gap-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[14.5px]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-1 flex-none"
                      aria-hidden
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-[12px] px-5 text-[14.5px] font-semibold transition-transform hover:-translate-y-0.5 ${
                  t.highlight
                    ? "bg-accent text-accent-on hover:!text-accent-on hover:shadow-[0_18px_44px_var(--color-glow)]"
                    : "border border-line-strong text-txt hover:border-accent"
                }`}
              >
                {t.cta}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

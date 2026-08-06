"use client";

import { Cpu, Lock, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, stagger, EASE } from "@/app/lib/motion";

const items = [
  {
    icon: Zap,
    title: "Fast to production",
    body: "Ship a working LLM feature in weeks — with evals, not slide decks.",
  },
  {
    icon: Cpu,
    title: "Full-stack AI",
    body: "Retrieval, agents, and the infra underneath, owned by senior ICs.",
  },
  {
    icon: Lock,
    title: "Secure by default",
    body: "SOC 2 aligned delivery, your cloud or ours, code and weights you own.",
  },
  {
    icon: Sparkles,
    title: "AI-native ops",
    body: "Prompt versions, traces, and offline evals that catch regressions early.",
  },
];

export function Features() {
  return (
    <section id="features" className="overflow-hidden border-t border-line py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger(0.08)}
          className="relative z-10 max-w-2xl"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 font-mono text-[11.5px] uppercase tracking-[0.14em] text-muted"
          >
            What we build
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-balance text-4xl font-semibold tracking-[-0.04em] text-ink lg:text-5xl"
          >
            Built for teams shipping AI at scale
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-muted">
            Workflows that adapt to how you ship — from retrieval pipelines to agent interfaces —
            engineered so your team can own them on day one.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative -mx-4 p-3 md:-mx-12 lg:col-span-3"
        >
          <div className="[perspective:800px]">
            <div className="[transform:skewY(-2deg)_skewX(-2deg)_rotateX(6deg)]">
              <div className="relative aspect-[88/36] overflow-hidden rounded-2xl border border-line bg-surface">
                <div className="absolute -inset-[4.25rem] z-[1] bg-[radial-gradient(ellipse_at_75%_25%,transparent,var(--color-canvas)_75%)]" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2400&q=80"
                  className="absolute inset-0 z-10 h-full w-full object-cover object-top opacity-90"
                  alt="Scalar product console — analytics and AI ops surface"
                  width={2797}
                  height={1137}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 z-20 bg-gradient-to-t from-canvas via-transparent to-transparent"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={stagger(0.08)}
          className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-8 lg:grid-cols-4"
        >
          {items.map(({ icon: Icon, title, body }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-ink">
                <Icon className="size-4 text-brand" aria-hidden />
                <h3 className="text-sm font-medium">{title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Features;

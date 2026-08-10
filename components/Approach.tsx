"use client";

import { motion } from "motion/react";
import Reveal from "./ui/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Identify the problem",
    body: "We define the problem inside the context of the wider system — constraints, data, dependencies and the real operating pressures — before anything gets built.",
    diagram: "converge",
  },
  {
    n: "02",
    title: "Build the solution",
    body: "A small senior team designs and delivers end to end, from architecture through integration and release, so it works inside the systems already running.",
    diagram: "radial",
  },
  {
    n: "03",
    title: "Execute the outcome",
    body: "We make sure the result holds up in the real world — measured, iterated, and embedded into operations so the value is realised and sustained.",
    diagram: "nested",
  },
] as const;

/** Technical line-art plates, drawn with bracket corners like a spec sheet. */
function Diagram({ kind }: { kind: (typeof STEPS)[number]["diagram"] }) {
  const stroke = "currentColor";
  return (
    <svg viewBox="0 0 200 200" className="h-[168px] w-[168px] opacity-70">
      {/* bracket corners */}
      <g stroke={stroke} strokeWidth="2.4" fill="none">
        <path d="M10 34 V10 H34" />
        <path d="M166 10 H190 V34" />
        <path d="M190 166 V190 H166" />
        <path d="M34 190 H10 V166" />
      </g>

      <g stroke={stroke} strokeWidth="1.1" fill="none">
        {kind === "converge" && (
          <>
            <rect x="30" y="30" width="140" height="140" />
            <rect x="66" y="66" width="68" height="68" />
            <path d="M30 30 L66 66 M170 30 L134 66 M170 170 L134 134 M30 170 L66 134" />
            <path d="M30 70 L66 88 M30 130 L66 112 M170 70 L134 88 M170 130 L134 112" />
            <path d="M100 30 V66 M100 134 V170" />
            <circle cx="100" cy="100" r="7" />
            <circle cx="100" cy="100" r="2.6" fill={stroke} />
          </>
        )}

        {kind === "radial" && (
          <>
            <rect x="30" y="30" width="140" height="140" />
            <circle cx="100" cy="100" r="66" />
            <circle cx="100" cy="100" r="40" />
            <circle cx="100" cy="100" r="18" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              // Rounded: Node and the browser disagree on the last bit of
              // Math.cos/sin, which would break hydration on the path string.
              const x = (100 + Math.cos(a) * 66).toFixed(3);
              const y = (100 + Math.sin(a) * 66).toFixed(3);
              return <path key={i} d={`M100 100 L${x} ${y}`} />;
            })}
            <circle cx="100" cy="100" r="3" fill={stroke} />
          </>
        )}

        {kind === "nested" && (
          <>
            <rect x="30" y="30" width="140" height="140" />
            <rect x="58" y="58" width="84" height="84" />
            <path d="M58 58 L142 142 M142 58 L58 142" />
            <path d="M44 44 L58 58 M156 44 L142 58 M156 156 L142 142 M44 156 L58 142" />
            <path d="M52 58 L58 58 L58 64 M148 58 L142 58 L142 64 M148 142 L142 142 L142 136 M52 142 L58 142 L58 136" />
            <circle cx="100" cy="100" r="3.4" fill={stroke} />
          </>
        )}
      </g>
    </svg>
  );
}

export default function Approach() {
  return (
    <section
      id="approach"
      className="relative bg-paper py-[clamp(56px,7vw,110px)] text-ink-950"
    >
      <div className="shell">
        <Reveal>
          <span className="eyebrow mb-4 block text-ink-400">Our approach</span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="display mb-[clamp(36px,4.4vw,68px)] text-[clamp(28px,3.8vw,54px)]">
            Think <span className="italic font-serif font-normal normal-case text-[1.08em] tracking-tight text-ink-950/90">outside</span> the box
          </h2>
        </Reveal>

        <div className="grid border-t border-l border-ink-950/12 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.article
              key={step.n}
              className="group relative flex flex-col justify-between gap-10 border-r border-b border-ink-950/12 p-[clamp(24px,2.6vw,44px)]"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{
                duration: 0.8,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* wash that follows the hover */}
              <div className="pointer-events-none absolute inset-0 bg-ink-950/[0.035] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-5 flex items-start justify-between gap-6">
                  <h3 className="display max-w-[14ch] text-[clamp(20px,2.05vw,30px)]">
                    {step.title}
                  </h3>
                  <span className="font-mono text-[11px] text-ink-400">
                    {step.n}
                  </span>
                </div>
                <p className="max-w-[42ch] font-mono text-[12.5px] leading-[1.8] text-ink-500">
                  {step.body}
                </p>
              </div>

              <motion.div
                className="relative flex justify-center text-ink-950"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Diagram kind={step.diagram} />
              </motion.div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

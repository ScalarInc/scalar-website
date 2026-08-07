"use client";

import Image from "next/image";
import { motion } from "motion/react";
import Reveal from "./ui/Reveal";
import PlusLink from "./ui/PlusLink";

/** Rotating seal: Scalar mark centred, brand line revolving around it. */
function Seal() {
  return (
    <motion.div
      className="relative grid h-[clamp(150px,15vw,210px)] w-[clamp(150px,15vw,210px)] place-items-center text-ink-200"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      >
        <defs>
          <path
            id="sealArc"
            d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
          />
        </defs>
        <text
          fontFamily="var(--font-jetbrains), monospace"
          fontSize="8.8"
          letterSpacing="1.6"
          fill="currentColor"
          fillOpacity="0.75"
        >
          <textPath href="#sealArc" startOffset="0">
            BUILT WITH WHAT&rsquo;S NEXT · EST 2026 · BUILT WITH WHAT&rsquo;S NEXT · EST 2026 ·
          </textPath>
        </text>
      </motion.svg>

      <Image
        src="/brand/scalar-mark.png"
        alt=""
        width={200}
        height={200}
        className="h-[46%] w-auto object-contain"
      />
    </motion.div>
  );
}

export default function Intro() {
  return (
    <section
      id="intro"
      className="grain relative overflow-hidden bg-ink-900 py-[clamp(72px,10vw,150px)] text-paper"
    >
      <div className="shell">
        <div className="grid gap-[clamp(36px,5vw,80px)] lg:grid-cols-[1.25fr_0.75fr]">
          {/* Headline. The whileInView trigger sits on the <h2>, not on the
              masked lines — a clipped child never intersects, so putting it
              there would deadlock the reveal. */}
          <motion.h2
            className="display text-[clamp(22px,2.9vw,42px)] leading-[1.1]"
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ staggerChildren: 0.07 }}
          >
            {[
              "Providing technical leadership",
              "and engineering across",
              "architecture, integration,",
              "security and applied",
              "machine learning.",
            ].map((line) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  variants={{ hidden: { y: "110%" }, shown: { y: "0%" } }}
                  transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h2>

          {/* supporting copy */}
          <div className="flex flex-col justify-center lg:pt-[18%]">
            <Reveal delay={0.15}>
              <p className="max-w-[52ch] text-[clamp(14px,1.12vw,17px)] leading-[1.72] text-ink-300">
                A small senior team means context compounds instead of
                resetting. Every product draws on what the last one taught us,
                so the architecture keeps sharpening and the decisions keep
                getting cheaper to make.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-9">
                <PlusLink href="#capabilities">Learn more</PlusLink>
              </div>
            </Reveal>
          </div>
        </div>

        {/* seal, bottom right */}
        <div className="mt-[clamp(40px,6vw,90px)] flex justify-end">
          <Seal />
        </div>
      </div>
    </section>
  );
}

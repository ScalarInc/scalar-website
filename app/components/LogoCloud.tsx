"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/app/lib/motion";

const logos = ["stellar", "northline", "hexform", "orbital", "meridian", "quanta"];

export default function LogoCloud() {
  return (
    <section aria-label="Trusted by" className="overflow-hidden border-t border-line pb-20 pt-16">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mb-8 text-center font-mono text-[11.5px] uppercase tracking-[0.14em] text-dim"
      >
        Teams building with Scalar
      </motion.p>
      <div className="marquee-mask relative">
        <div
          className="flex w-max"
          style={{ animation: "drift 38s linear infinite" }}
        >
          {[0, 1].map((dup) => (
            <div
              key={dup}
              aria-hidden={dup === 1}
              className="flex items-center gap-14 pr-14"
            >
              {logos.map((name) => (
                <span
                  key={`${dup}-${name}`}
                  className="grid h-14 w-[168px] place-items-center rounded-[12px] border border-dashed border-line-strong font-mono text-[13px] tracking-[0.02em] text-dim"
                >
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

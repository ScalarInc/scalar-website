"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/app/lib/motion";

const cols = [
  {
    label: "Product",
    links: ["Services", "Platform", "Features", "Changelog"],
  },
  {
    label: "Company",
    links: ["About", "Blog", "Customers", "Careers"],
  },
  {
    label: "Social",
    links: ["LinkedIn", "X", "GitHub"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 pb-14 pt-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger(0.08)}
        className="mx-auto grid max-w-[1180px] gap-16 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]"
      >
        <motion.div variants={fadeUp} className="flex flex-col gap-5">
          <a href="#top" aria-label="Scalar home" className="flex items-center gap-3 text-[20px] font-semibold tracking-[-0.04em]">
            <Image src="/scalar-logo.jpg" alt="" width={36} height={36} className="h-9 w-9 rounded-[10px] bg-black" />
            <span>scalar</span>
          </a>
          <p className="max-w-[36ch] text-[14.5px] leading-[1.55] text-dim">
            An engineering partner for teams shipping real AI products. Built for what&apos;s next.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-2 flex h-11 max-w-sm items-center gap-2 rounded-[12px] border border-line bg-surface px-1 focus-within:border-line-strong"
          >
            <label htmlFor="newsletter" className="sr-only">
              Email
            </label>
            <input
              id="newsletter"
              type="email"
              required
              placeholder="you@company.com"
              className="h-full flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-dim"
            />
            <button
              type="submit"
              className="h-8 rounded-[8px] bg-txt px-3 text-xs font-semibold text-bg transition-transform hover:-translate-y-0.5"
            >
              Subscribe
            </button>
          </form>
        </motion.div>

        {cols.map((c) => (
          <motion.div key={c.label} variants={fadeUp} className="flex flex-col gap-3">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-dim">
              {c.label}
            </p>
            {c.links.map((l) => (
              <a key={l} href="#contact" className="text-[15px] text-txt/90 transition-colors hover:text-accent">
                {l}
              </a>
            ))}
          </motion.div>
        ))}
      </motion.div>

      <div className="mx-auto mt-16 flex max-w-[1180px] flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-xs text-dim">
        <span>© {new Date().getFullYear()} Scalar. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#contact" className="hover:text-txt">Privacy</a>
          <a href="#contact" className="hover:text-txt">Terms</a>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { motion } from "motion/react";

const COLS = [
  {
    h: "Enquiries",
    items: [
      {
        label: "scalarinc.dev@gmail.com",
        href: "mailto:scalarinc.dev@gmail.com",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/scalarinc/",
        external: true,
      },
    ],
  },
  {
    h: "Sitemap",
    items: [
      { label: "Capabilities", href: "#capabilities" },
      { label: "Approach", href: "#approach" },
      { label: "Work", href: "#work" },
      { label: "Studio", href: "#studio" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    h: "Tracks",
    items: [
      { label: "Security", href: "#work" },
      { label: "Enterprise", href: "#work" },
      { label: "Education", href: "#work" },
      { label: "Accessibility", href: "#work" },
      { label: "Platforms", href: "#work" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-ink-950 pt-[clamp(56px,7vw,110px)] text-paper">
      <div className="shell">
        {/* oversized brand heading */}
        <div className="pb-[clamp(36px,5vw,72px)]">
          <motion.span
            className="metal metal-sheen font-mark text-[clamp(30px,8.2vw,124px)] uppercase leading-none tracking-[0.04em]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            SCALAR INC.
          </motion.span>
        </div>

        <div className="grid gap-8 border-t border-ink-800 pt-[clamp(32px,4vw,56px)] pb-[clamp(32px,4vw,56px)] sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="eyebrow mb-4 text-ink-400">Built for what&rsquo;s next</h3>
            <p className="max-w-[30ch] text-[14.5px] leading-relaxed text-ink-300">
              A product studio shipping AI systems across five tracks.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.h}>
              <h3 className="eyebrow mb-4 text-ink-400">{col.h}</h3>
              <ul className="grid gap-1.5">
                {col.items.map((it) => (
                  <li key={it.label}>
                    <a
                      href={it.href}
                      target={it.external ? "_blank" : undefined}
                      rel={it.external ? "noopener noreferrer" : undefined}
                      className="group inline-flex items-center gap-2 text-[14.5px] text-ink-300 transition-colors hover:text-paper"
                    >
                      <span className="h-px w-0 bg-paper transition-all duration-400 group-hover:w-3" />
                      {it.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-ink-800 py-6 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-500">
          <span>
            &copy; {new Date().getFullYear()} Scalar — Design demonstration
          </span>
          <a
            href="#main"
            className="group inline-flex items-center gap-2.5 transition-colors hover:text-paper"
          >
            Back to top
            <svg
              className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M12 20V4M5 11l7-7 7 7" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

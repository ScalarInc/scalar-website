"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE } from "@/app/lib/motion";

const links = [
  { href: "#vision", label: "Vision" },
  { href: "#stack", label: "Stack" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 pointer-events-none sm:px-6 sm:pt-[18px]">
        <motion.nav
          aria-label="Main"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
          style={{
            background: scrolled
              ? "color-mix(in srgb, var(--color-canvas) 84%, transparent)"
              : "color-mix(in srgb, var(--color-canvas) 60%, transparent)",
            boxShadow: scrolled ? "0 12px 44px rgba(0,0,0,.4)" : "none",
          }}
          className="pointer-events-auto flex h-[62px] w-full max-w-[1200px] items-center gap-4 rounded-2xl border border-line px-2 pl-4 backdrop-blur-2xl transition-all duration-500"
        >
          <a href="#top" aria-label="Scalar home" className="flex items-center gap-3 text-[18px] font-semibold tracking-[-0.04em]">
            <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-[9px] bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-3))] text-on-brand ring-1 ring-white/10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 17l6-6 4 4 6-8" />
                <path d="M14 5h6v6" />
              </svg>
            </span>
            <span>scalar</span>
          </a>

          <div className="ml-4 hidden items-center gap-7 text-[14px] font-medium text-[#D2D6DE] md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative transition-colors duration-200 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <a
              href="#contact"
              className="hidden md:inline-flex"
              style={{ textDecoration: "none" }}
            >
              <motion.span
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                style={{
                  background: "linear-gradient(135deg, var(--color-ink), #FFFFFF)",
                  color: "var(--color-on-brand)",
                }}
                className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-xl px-4 text-[14px] font-semibold shadow-[0_1px_0_rgba(255,255,255,.4)_inset] transition-shadow hover:shadow-[0_1px_0_rgba(255,255,255,.4)_inset,0_12px_28px_var(--color-glow)]"
              >
                Book a call
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </motion.span>
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink md:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 17h18" />}
              </svg>
            </button>
          </div>
        </motion.nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col gap-2 bg-canvas/95 px-6 pb-10 pt-28 backdrop-blur-xl md:hidden"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35, ease: EASE, delay: 0.05 + i * 0.05 }}
                className="border-b border-line py-3 text-[34px] font-semibold tracking-[-0.045em]"
              >
                {l.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, ease: EASE, delay: 0.05 + links.length * 0.05 }}
              className="mt-6 grid h-14 place-items-center rounded-[14px] bg-ink text-base font-semibold text-canvas"
            >
              Book a call
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

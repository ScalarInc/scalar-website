"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { projects } from "@/lib/projects";

const NAV = [
  { label: "Capabilities", href: "#capabilities", idx: "01" },
  { label: "Approach", href: "#approach", idx: "02" },
  { label: "Work", href: "#work", idx: "03" },
  { label: "Studio", href: "#studio", idx: "04" },
  { label: "Contact", href: "#contact", idx: "05" },
];

export default function Header() {
  const [stuck, setStuck] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setStuck(y > 40);

      // Once past the hero, retreat on the way down and return on the way up,
      // so long reading stretches stay uninterrupted.
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        setHidden(y > 600 && delta > 0);
        lastY.current = y;
      }
    };
    onScroll();
    lastY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-locked", open);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("is-locked");
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? "-105%" : "0%" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[90] flex items-center transition-[background-color,height,border-color] duration-500 ${
          stuck
            ? "h-[72px] border-b border-ink-800 bg-ink-950/95 backdrop-blur-sm"
            : "h-[88px] border-b border-transparent bg-transparent"
        }`}
      >
        <div className="flex w-full items-center justify-between px-[var(--pad)]">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="Scalar Inc. — Home"
          >
            <Image
              src="/brand/scalar-mark.png"
              alt="Scalar Inc. Logo"
              width={40}
              height={40}
              priority
              className="h-9 w-9 object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
            />
            <span className="metal metal-sheen font-mark text-[clamp(14px,1.25vw,18px)] uppercase tracking-[0.14em] leading-none">
              Scalar
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="nav-overlay"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className="relative z-[2] inline-flex items-center gap-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-paper"
          >
            <span className="hidden sm:block">{open ? "Close" : "Menu"}</span>
            <motion.span
              className="relative grid h-5.5 w-5.5 place-items-center"
              animate={{ rotate: open ? 135 : 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="absolute h-px w-5.5 bg-paper" />
              <span className="absolute h-5.5 w-px bg-paper" />
            </motion.span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-overlay"
            className="grain fixed inset-0 z-[80] flex flex-col justify-center bg-ink-950 px-[var(--pad)] pt-[calc(var(--header-h)+24px)] pb-10"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:gap-24">
              <nav aria-label="Primary navigation">
                <ul>
                  {NAV.map((item, i) => (
                    <li
                      key={item.href}
                      className="overflow-hidden border-t border-ink-800 last:border-b"
                    >
                      <motion.div
                        initial={{ y: "110%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "110%" }}
                        transition={{
                          duration: 0.8,
                          delay: 0.1 + i * 0.06,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <a
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="group flex items-baseline gap-5 py-4 text-[clamp(30px,5.2vw,72px)] font-normal uppercase leading-none tracking-[-0.035em] text-paper transition-colors duration-300 hover:text-ink-300 lg:py-5"
                        >
                          <span className="font-mono text-[11px] tracking-[0.1em] text-ink-400">
                            {item.idx}
                          </span>
                          {item.label}
                        </a>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </nav>

              <motion.div
                className="grid gap-7"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div>
                  <span className="eyebrow mb-2.5 block text-ink-400">Enquiries</span>
                  <a
                    href="mailto:info@scalar-ai.co"
                    className="text-[15px] text-ink-200 transition-colors hover:text-paper"
                  >
                    info@scalar-ai.co
                  </a>
                </div>
                <div>
                  <span className="eyebrow mb-2.5 block text-ink-400">Studio</span>
                  <p className="text-[15px] leading-relaxed text-ink-200">
                    Remote-first
                    <br />
                    Building across five product tracks
                  </p>
                </div>
                <div>
                  <span className="eyebrow mb-2.5 block text-ink-400">Now</span>
                  <p className="text-[15px] leading-relaxed text-ink-200">
                    {projects.length} products in motion
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

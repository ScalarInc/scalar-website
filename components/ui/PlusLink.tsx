"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * The bracketed "+ LABEL" affordance used throughout the layout. The plus
 * rotates and the box inverts on hover.
 */
export default function PlusLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] whitespace-nowrap ${className}`}
    >
      <motion.span
        className="relative grid h-12 w-12 flex-none place-items-center border border-current/45 transition-colors duration-500 group-hover:border-current"
        whileHover={{ rotate: 90 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="absolute h-px w-3 bg-current" />
        <span className="absolute h-3 w-px bg-current" />
      </motion.span>
      {/* inline-block so overflow actually clips the hover clone */}
      <span className="relative inline-block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
          {children}
        </span>
      </span>
    </Link>
  );
}

"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import Reveal from "./ui/Reveal";
import PlusLink from "./ui/PlusLink";
import SplitText from "./ui/SplitText";

/**
 * A halftone aperture that opens as the section is scrolled into view: dots
 * appear from the aperture edge outward against a dithered threshold, so the
 * growing boundary reads as noise rather than a clean circle.
 */
export default function Partnering() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progress = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const p = progress.current;
    if (p <= 0) return;

    const cx = w / 2;
    const cy = h / 2;

    /* Clear aperture. The fraction eases from 0.94 on a phone to 0.7 at
     * desktop: the text column only ever gives back --pad, so a flat 0.7
     * leaves the copy hanging outside the corner marks on narrow screens. */
    const t = Math.min(1, Math.max(0, (w - 500) / 700));
    const apW = Math.min(w * (0.94 - 0.24 * t), 990);
    const apH = Math.min(h * 0.56, 600);
    const apL = cx - apW / 2;
    const apT = cy - apH / 2;

    // fade boundary
    const rx = w * 0.52;
    const ry = h * 0.54;

    const step = 11;
    const dot = 4.6;

    for (let y = step / 2; y < h; y += step) {
      for (let x = step / 2; x < w; x += step) {
        if (x > apL && x < apL + apW && y > apT && y < apT + apH) continue;

        const nx = (x - cx) / rx;
        const ny = (y - cy) / ry;
        const r = Math.sqrt(nx * nx + ny * ny);
        if (r > 1) continue;

        // deterministic per-cell jitter so the advancing edge dithers
        const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453);
        const jitter = (hash % 1) * 0.22;

        // dots nearest the aperture arrive first
        if (r > p * 1.24 - jitter) continue;

        const a = Math.pow(1 - r, 1.05) * 0.8;
        if (a <= 0.01) continue;

        ctx.fillStyle = `rgba(10,10,10,${a.toFixed(3)})`;
        ctx.fillRect(x, y, dot, dot);
      }
    }

    // corner marks land once the field is mostly open
    const markAlpha = Math.max(0, Math.min(1, (p - 0.5) / 0.3));
    if (markAlpha > 0) {
      ctx.strokeStyle = `rgba(10,10,10,${(markAlpha * 0.85).toFixed(3)})`;
      ctx.lineWidth = 1.8;
      const arm = 9 * markAlpha;
      const corners: [number, number][] = [
        [apL, apT],
        [apL + apW, apT],
        [apL + apW, apT + apH],
        [apL, apT + apH],
      ];
      for (const [x, y] of corners) {
        ctx.beginPath();
        ctx.moveTo(x - arm, y);
        ctx.lineTo(x + arm, y);
        ctx.moveTo(x, y - arm);
        ctx.lineTo(x, y + arm);
        ctx.stroke();
      }
    }
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
    draw();
  });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) progress.current = 1;
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-paper py-[clamp(72px,10vw,150px)] text-ink-950"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-[860px] flex-col items-center px-[var(--pad)] py-[clamp(48px,7vw,110px)] text-center">
        <SplitText
          as="h2"
          text="Partnering to build better systems"
          className="display text-[clamp(28px,4.4vw,64px)]"
          stagger={0.05}
        />
        <Reveal delay={0.25}>
          <p className="mx-auto mt-7 max-w-[34ch] text-[clamp(14px,1.15vw,17px)] leading-relaxed text-ink-500 sm:max-w-[48ch]">
            We build partnerships, not deliverables. Every product here is one we
            intend to still be responsible for years from now.
          </p>
        </Reveal>
        <Reveal delay={0.35}>
          <motion.div
            className="mt-9"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <PlusLink href="#contact">Contact us</PlusLink>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

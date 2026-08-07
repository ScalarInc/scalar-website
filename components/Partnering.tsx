"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Reveal from "./ui/Reveal";
import PlusLink from "./ui/PlusLink";
import SplitText from "./ui/SplitText";

/**
 * A halftone aperture: a dot matrix that clears a rectangle in the middle and
 * fades out along an ellipse, framing the statement inside it.
 */
function Halftone() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // clear aperture
      const apW = Math.min(w * 0.7, 990);
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
          // inside the aperture → leave clear
          if (x > apL && x < apL + apW && y > apT && y < apT + apH) continue;

          const nx = (x - cx) / rx;
          const ny = (y - cy) / ry;
          const r = Math.sqrt(nx * nx + ny * ny);
          if (r > 1) continue;

          // densest at the aperture edge, thinning outward
          const a = Math.pow(1 - r, 1.05) * 0.8;
          if (a <= 0.01) continue;

          ctx.fillStyle = `rgba(10,10,10,${a.toFixed(3)})`;
          ctx.fillRect(x, y, dot, dot);
        }
      }

      // corner marks on the aperture
      ctx.strokeStyle = "rgba(10,10,10,.85)";
      ctx.lineWidth = 1.8;
      const corners: [number, number][] = [
        [apL, apT],
        [apL + apW, apT],
        [apL + apW, apT + apH],
        [apL, apT + apH],
      ];
      for (const [x, y] of corners) {
        ctx.beginPath();
        ctx.moveTo(x - 9, y);
        ctx.lineTo(x + 9, y);
        ctx.moveTo(x, y - 9);
        ctx.lineTo(x, y + 9);
        ctx.stroke();
      }
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

export default function Partnering() {
  return (
    <section className="relative overflow-hidden bg-paper py-[clamp(72px,10vw,150px)] text-ink-950">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.06 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Halftone />
      </motion.div>

      <div className="relative mx-auto flex max-w-[860px] flex-col items-center px-[var(--pad)] py-[clamp(48px,7vw,110px)] text-center">
        <SplitText
          as="h2"
          text="Partnering to build better systems"
          className="display text-[clamp(28px,4.4vw,64px)]"
          stagger={0.05}
        />
        <Reveal delay={0.25}>
          <p className="mx-auto mt-7 max-w-[48ch] text-[clamp(14px,1.15vw,17px)] leading-relaxed text-ink-500">
            We build partnerships, not deliverables. Every product here is one we
            intend to still be responsible for years from now.
          </p>
        </Reveal>
        <Reveal delay={0.35}>
          <div className="mt-9">
            <PlusLink href="#contact">Contact us</PlusLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

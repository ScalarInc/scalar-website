"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * Hero: a rotating point-cloud sphere ringed by dotted orbits and crosshair
 * markers, with the tagline split either side of it.
 */
export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], [0, -110]);

  /* Depth rig. Three planes move at different rates so the composition reads
   * as space rather than a flat image: the sky drifts up, the type lifts
   * faster, and the peak settles down and dollies in. */
  const pX = useSpring(0, { stiffness: 45, damping: 22 });
  const pY = useSpring(0, { stiffness: 45, damping: 22 });

  const skyY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const textX = useTransform(pX, (v) => v * -0.5);
  const peakX = useTransform(pX, (v) => v * 1.2);
  const peakY = useTransform(
    [scrollYProgress, pY] as const,
    ([s, p]: number[]) => s * 78 + p * 0.8
  );
  const peakScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      pointer.current = { x: nx, y: ny };
      // foreground counter-moves against the cursor, which reads as depth
      pX.set(nx * -20);
      pY.set(ny * -12);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [pX, pY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let base = 0;
    let raf = 0;

    /* -- orbital rings --------------------------------------------------
     * Dot counts scale with radius so density stays even as the rings grow.
     * The outermost deliberately runs past the top and bottom edges. */
    const RINGS = [
      { r: 1.15, dots: 165, speed: 0.00019, alpha: 0.5, tilt: 0.1 },
      { r: 1.65, dots: 235, speed: -0.00014, alpha: 0.4, tilt: -0.06 },
      { r: 2.15, dots: 305, speed: 0.00011, alpha: 0.3, tilt: 0.05 },
      { r: 2.65, dots: 375, speed: -0.00008, alpha: 0.22, tilt: -0.08 },
    ];

    const MARKERS = [
      { ring: 3, base: Math.PI * 1.22, sweep: 0.22, speed: 0.00021 }, // Top-Left sky (~220°)
      { ring: 3, base: Math.PI * 1.76, sweep: 0.22, speed: 0.00018 }, // Top-Right sky (~317°)
      { ring: 2, base: Math.PI * 1.14, sweep: 0.18, speed: 0.00014 }, // Top-Left outer sky (~205°)
      { ring: 2, base: Math.PI * 1.83, sweep: 0.18, speed: 0.00016 }, // Top-Right outer sky (~330°)
    ];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
      base = Math.min(w, h) * 0.2;
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      const ox = pointer.current.x * 22;
      const oy = pointer.current.y * 16;

      /* rings */
      RINGS.forEach((ring, ri) => {
        const rr = base * ring.r;
        const phase = now * ring.speed;
        for (let i = 0; i < ring.dots; i++) {
          const a = (i / ring.dots) * Math.PI * 2 + phase;
          const x = cx + Math.cos(a) * rr + ox;
          const y = cy + Math.sin(a) * rr * (1 + ring.tilt * 0.14) + oy;
          const flicker = 0.6 + 0.4 * Math.sin(a * 6 + ri);
          ctx.fillStyle = `rgba(255,255,255,${(ring.alpha * flicker * 0.8).toFixed(3)})`;
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      });

      /* crosshair markers with angular readouts */
      if (w >= 900) {
        for (const m of MARKERS) {
          const ring = RINGS[m.ring];
          const rr = base * ring.r;
          const a = m.base + Math.sin(now * m.speed) * m.sweep;
          const x = cx + Math.cos(a) * rr + ox;
          const y = cy + Math.sin(a) * rr * (1 + ring.tilt * 0.14) + oy;

          ctx.strokeStyle = "rgba(255,255,255,.7)";
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(x - 7, y);
          ctx.lineTo(x + 7, y);
          ctx.moveTo(x, y - 7);
          ctx.lineTo(x, y + 7);
          ctx.stroke();

          const deg = ((((a * 180) / Math.PI) % 360) + 360) % 360;
          const rad = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          ctx.font =
            "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
          ctx.fillStyle = "rgba(255,255,255,.34)";
          ctx.textAlign = "left";
          ctx.fillText(`${deg.toFixed(1)}°`, x + 15, y - 2);
          ctx.fillText(`${rad.toFixed(3)} rad`, x + 15, y + 11);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduce) {
      draw(0);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const word = {
    hidden: { y: "110%" },
    shown: { y: "0%" },
  };

  return (
    <section
      ref={sectionRef}
      className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink-950"
    >
      {/* Orbital field. Sits above the peak (z-30) so the rings read as
          foreground instrumentation rather than distant sky. */}
      <motion.canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[30] h-full w-full"
        style={{ y: skyY }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 26%, rgba(6,6,6,.72) 76%)",
        }}
        aria-hidden="true"
      />

      {/* PLANE 2 — type, which the peak will cut across */}
      <motion.div
        className="relative z-[10] grid w-full grid-cols-1 items-center gap-2 px-[clamp(24px,6.5vw,96px)] md:-mt-[9vh] md:grid-cols-2 md:gap-6"
        style={{ y: lift, opacity: fade, x: textX }}
      >
        <motion.h1
          className="display text-[clamp(24px,3.4vw,50px)] text-paper"
          initial="hidden"
          animate="shown"
          transition={{ staggerChildren: 0.09, delayChildren: 0.25 }}
        >
          {["Solving", "Complexity"].map((t) => (
            <span key={t} className="block overflow-hidden">
              <motion.span
                className="block"
                variants={word}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                {t}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          className="display text-[clamp(24px,3.4vw,50px)] text-paper md:text-right"
          initial="hidden"
          animate="shown"
          transition={{ staggerChildren: 0.09, delayChildren: 0.43 }}
        >
          {["Delivering", "Clarity"].map((t, i) => (
            <span key={t} className="block overflow-hidden">
              <motion.span
                className={`block ${i === 1 ? "metal metal-sheen" : ""}`}
                variants={word}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                {t}
              </motion.span>
            </span>
          ))}
        </motion.p>
      </motion.div>

      {/* PLANE 2.5 — haze, so the type recedes into air before the peak */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[64%]"
        style={{
          background:
            "linear-gradient(to top, rgba(6,6,6,.9) 0%, rgba(6,6,6,.42) 44%, rgba(6,6,6,0) 100%)",
        }}
        aria-hidden="true"
      />

      {/* PLANE 3 — the peak, in front of everything */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[20]"
        style={{
          y: peakY,
          x: peakX,
          scale: peakScale,
          transformOrigin: "50% 100%",
        }}
        aria-hidden="true"
      >
        <motion.div
          initial={{ opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* The plate is full-bleed at its natural aspect (~2.21:1, the sky
              cropped off) and bottom-anchored. Scaled up on narrow screens so
              the silhouette still reads. Viewports wider than ~2.21:1 will
              clip the summit slightly; common 16:9 and 16:10 sizes fit. */}
          <div className="origin-bottom scale-[2.05] sm:scale-[1.45] md:scale-[1.15] lg:scale-100">
            <Image
              src="/brand/mountain.webp"
              alt=""
              width={2400}
              height={1085}
              priority
              sizes="100vw"
              className="h-auto w-full select-none object-contain grayscale contrast-[1.08] brightness-[0.82]"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* base fade, so the snow melts into the section below instead of
          ending on a hard edge */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-[22%]"
        style={{
          background:
            "linear-gradient(to top, rgba(6,6,6,1) 4%, rgba(6,6,6,0) 100%)",
        }}
        aria-hidden="true"
      />

      {/* minimal scroll cue — the rotating seal lives in the section below */}
      <motion.a
        href="#intro"
        className="absolute bottom-[clamp(24px,5vw,52px)] right-[var(--pad)] z-[40] inline-flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-300 transition-colors hover:text-paper"
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        Scroll
        <motion.span
          className="relative grid h-4 w-4 place-items-center"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="absolute h-px w-4 bg-current" />
          <span className="absolute h-4 w-px bg-current" />
        </motion.span>
      </motion.a>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

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

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

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
    let spin = 0;
    let last = 0;

    /* -- point cloud: latitude-banded, irregular body -------------------
     * Points sit on latitude rings (not a fibonacci scatter) so the surface
     * shows curved rows as it turns, and the radius is displaced by stacked
     * sinusoids to give the lumpy, asteroid-like silhouette of the reference.
     * ------------------------------------------------------------------ */
    const bump = (x: number, y: number, z: number) =>
      0.5 * Math.sin(2.1 * x + 1.3) * Math.sin(1.7 * y + 0.4) * Math.sin(2.3 * z + 2.1) +
      0.3 * Math.sin(4.3 * x + 0.7) * Math.sin(3.1 * y + 2.2) * Math.sin(3.7 * z + 0.9) +
      0.2 * Math.sin(7.1 * x) * Math.sin(6.3 * y) * Math.sin(5.9 * z);

    const BANDS = 58;
    const cloud: { x: number; y: number; z: number }[] = [];
    for (let b = 0; b < BANDS; b++) {
      const theta = ((b + 0.5) / BANDS) * Math.PI;
      const ringR = Math.sin(theta);
      const count = Math.max(3, Math.round(78 * ringR));
      for (let k = 0; k < count; k++) {
        // offset each band so the rows read as a weave, not a grid
        const phi = (k / count) * Math.PI * 2 + b * 0.35;
        const ux = ringR * Math.cos(phi);
        const uy = Math.cos(theta);
        const uz = ringR * Math.sin(phi);
        const r = 1 + 0.17 * bump(ux, uy, uz);
        cloud.push({ x: ux * r, y: uy * r, z: uz * r });
      }
    }

    /* -- orbital rings -------------------------------------------------- */
    const RINGS = [
      { r: 1.5, dots: 160, speed: 0.00019, alpha: 0.5, tilt: 0.1 },
      { r: 1.95, dots: 205, speed: -0.00014, alpha: 0.4, tilt: -0.06 },
      { r: 2.45, dots: 250, speed: 0.00011, alpha: 0.3, tilt: 0.05 },
      { r: 3.0, dots: 300, speed: -0.00008, alpha: 0.2, tilt: -0.08 },
    ];

    const MARKERS = [
      { ring: 3, base: 0.62, sweep: 0.3, speed: 0.00021 },
      { ring: 2, base: 2.32, sweep: 0.26, speed: 0.00016 },
      { ring: 1, base: 1.38, sweep: 0.34, speed: 0.00012 },
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
      base = Math.min(w, h) * 0.132;
    };

    const draw = (now: number) => {
      const dt = last ? Math.min(now - last, 48) : 16;
      last = now;
      spin += dt * 0.00016;

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
          const rr = base * RINGS[m.ring].r;
          const a = m.base + Math.sin(now * m.speed) * m.sweep;
          const x = cx + Math.cos(a) * rr + ox;
          const y = cy + Math.sin(a) * rr + oy;

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

      /* the sphere */
      const sin = Math.sin(spin);
      const cos = Math.cos(spin);
      const tiltS = Math.sin(0.42);
      const tiltC = Math.cos(0.42);

      // key light from upper-left-front
      const LX = -0.42;
      const LY = -0.55;
      const LZ = 0.72;

      for (const p of cloud) {
        const x1 = p.x * cos + p.z * sin;
        const z1 = -p.x * sin + p.z * cos;
        const y2 = p.y * tiltC - z1 * tiltS;
        const z2 = p.y * tiltS + z1 * tiltC;

        // opaque body: drop the far hemisphere, keeping a little of the rim
        if (z2 < -0.05) continue;

        const persp = 1 / (1.9 - z2 * 0.42);
        const sx = cx + x1 * base * persp * 2.35 + ox;
        const sy = cy + y2 * base * persp * 2.35 + oy;

        // lambert against the rotated normal (which is the point itself)
        const len = Math.hypot(x1, y2, z2) || 1;
        const lambert = (x1 * LX + y2 * LY + z2 * LZ) / len;
        const front = (z2 + 1) / 2;

        const lit = Math.max(0, lambert) * 0.85 + front * 0.3;
        const alpha = Math.min(1, 0.05 + lit * 0.95);
        const size = 1.15 + lit * 1.35;

        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fillRect(sx, sy, size, size);
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
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 32%, rgba(6,6,6,.7) 80%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        className="relative z-[1] grid w-full grid-cols-1 items-center gap-2 px-[clamp(20px,9.5vw,150px)] md:grid-cols-2 md:gap-8"
        style={{ y: lift, opacity: fade }}
      >
        <motion.h1
          className="display text-[clamp(34px,5.1vw,74px)] text-paper"
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
          className="display text-[clamp(34px,5.1vw,74px)] text-paper md:text-right"
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

      {/* minimal scroll cue — the rotating seal lives in the section below */}
      <motion.a
        href="#intro"
        className="absolute bottom-[clamp(24px,5vw,52px)] right-[var(--pad)] z-[2] inline-flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-300 transition-colors hover:text-paper"
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

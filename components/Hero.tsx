"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

/**
 * Hero composition: a dotted orbital field rendered to canvas, the Scalar mark
 * floating at its centre, and the tagline split either side of it.
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
  const markScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);

  // Pointer parallax, damped so it glides rather than snaps.
  const px = useSpring(0, { stiffness: 60, damping: 20 });
  const py = useSpring(0, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      pointer.current = { x: nx, y: ny };
      px.set(nx * 26);
      py.set(ny * 20);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py]);

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

    const RINGS = [
      { r: 1.55, dots: 160, speed: 0.000185, alpha: 0.5, tilt: 0.1 },
      { r: 2.0, dots: 205, speed: -0.00014, alpha: 0.4, tilt: -0.06 },
      { r: 2.5, dots: 250, speed: 0.000105, alpha: 0.3, tilt: 0.05 },
      { r: 3.05, dots: 300, speed: -0.00008, alpha: 0.2, tilt: -0.08 },
    ];

    const MARKERS = [
      { ring: 3, base: 0.6, sweep: 0.3, speed: 0.00022 },
      { ring: 2, base: 2.34, sweep: 0.26, speed: 0.00017 },
      { ring: 1, base: 1.4, sweep: 0.34, speed: 0.00013 },
    ];

    // Slow drifting dust across the whole field
    const DUST = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.00004,
      vy: (Math.random() - 0.5) * 0.00003,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
      base = Math.min(w, h) * 0.118;
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      const ox = pointer.current.x * 22;
      const oy = pointer.current.y * 16;

      // dust
      for (const d of DUST) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x += 1;
        if (d.x > 1) d.x -= 1;
        if (d.y < 0) d.y += 1;
        if (d.y > 1) d.y -= 1;
        const a = 0.06 + d.z * 0.16;
        ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        ctx.fillRect(d.x * w + ox * d.z, d.y * h + oy * d.z, 1.3, 1.3);
      }

      // orbital rings
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

      // crosshair markers with angular readouts
      if (w >= 900) {
        for (const m of MARKERS) {
          const rr = base * RINGS[m.ring].r;
          const a = m.base + Math.sin(now * m.speed) * m.sweep;
          const x = cx + Math.cos(a) * rr + ox;
          const y = cy + Math.sin(a) * rr + oy;

          ctx.strokeStyle = "rgba(255,255,255,.72)";
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(x - 7, y);
          ctx.lineTo(x + 7, y);
          ctx.moveTo(x, y - 7);
          ctx.lineTo(x, y + 7);
          ctx.stroke();

          const deg = (((a * 180) / Math.PI) % 360 + 360) % 360;
          const rad = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          ctx.font =
            '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
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
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 30%, rgba(6,6,6,.72) 78%)",
        }}
        aria-hidden="true"
      />

      {/* the mark */}
      <motion.div
        className="pointer-events-none absolute inset-0 grid place-items-center"
        style={{ x: px, y: py, scale: markScale, opacity: fade }}
        aria-hidden="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/brand/scalar-mark.png"
              alt=""
              width={520}
              height={520}
              priority
              className="h-[clamp(150px,21vw,290px)] w-auto object-contain"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* tagline, split either side of the mark */}
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
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              variants={word}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              Built
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              variants={word}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              For
            </motion.span>
          </span>
        </motion.h1>

        <motion.p
          className="display text-[clamp(34px,5.1vw,74px)] text-paper md:text-right"
          initial="hidden"
          animate="shown"
          transition={{ staggerChildren: 0.09, delayChildren: 0.43 }}
        >
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              variants={word}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              What&rsquo;s
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="metal metal-sheen block"
              variants={word}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              Next.
            </motion.span>
          </span>
        </motion.p>
      </motion.div>

      {/* rotating scroll badge */}
      <motion.a
        href="#capabilities"
        className="absolute bottom-[clamp(24px,5vw,56px)] right-[var(--pad)] z-[2] grid h-[104px] w-[104px] place-items-center text-ink-200"
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        aria-label="Scroll to capabilities"
      >
        <motion.svg
          viewBox="0 0 120 120"
          className="absolute h-full w-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <path
              id="badgeCircle"
              d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0"
            />
          </defs>
          <circle
            cx="60"
            cy="60"
            r="55"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".3"
          />
          <text
            fontFamily="var(--font-jetbrains), monospace"
            fontSize="9.5"
            letterSpacing="3.2"
            fill="currentColor"
          >
            <textPath href="#badgeCircle" startOffset="0">
              SCROLL · TO · EXPLORE · SCROLL · TO · EXPLORE ·
            </textPath>
          </text>
        </motion.svg>
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

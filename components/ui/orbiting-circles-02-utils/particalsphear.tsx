"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  z: number;
  ox: number;
  oy: number;
  oz: number;
};

/**
 * Canvas particle globe used as the center of the orbiting-circles visual.
 * Tuned to Scalar brand tokens (brand / brand-2).
 */
export default function ParticleSphereAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    let width = 0;
    let height = 0;
    let raf = 0;
    let rotation = 0;
    const particles: Particle[] = [];
    const COUNT = 1400;
    const RADIUS = 1;

    const resize = () => {
      const size = Math.min(parent?.clientWidth ?? 400, parent?.clientHeight ?? 400);
      width = size;
      height = size;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const x = RADIUS * Math.sin(phi) * Math.cos(theta);
        const y = RADIUS * Math.sin(phi) * Math.sin(theta);
        const z = RADIUS * Math.cos(phi);
        particles.push({ x, y, z, ox: x, oy: y, oz: z });
      }
    };

    const draw = () => {
      rotation += 0.004;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const scale = width * 0.42;
      const cosY = Math.cos(rotation);
      const sinY = Math.sin(rotation);
      const cosX = Math.cos(0.35);
      const sinX = Math.sin(0.35);

      // Soft core glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.9);
      glow.addColorStop(0, "rgba(124, 140, 249, 0.22)");
      glow.addColorStop(0.45, "rgba(79, 214, 224, 0.08)");
      glow.addColorStop(1, "rgba(8, 8, 11, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 0.95, 0, Math.PI * 2);
      ctx.fill();

      for (const p of particles) {
        // Rotate around Y then X
        let x = p.ox * cosY - p.oz * sinY;
        let z = p.ox * sinY + p.oz * cosY;
        let y = p.oy * cosX - z * sinX;
        z = p.oy * sinX + z * cosX;

        const perspective = 2.2 / (2.2 + z);
        const sx = cx + x * scale * perspective;
        const sy = cy + y * scale * perspective;
        const size = Math.max(0.6, 1.8 * perspective);
        const depth = (z + 1) / 2;
        const alpha = 0.25 + depth * 0.75;

        // Brand → cyan by depth
        const r = Math.round(124 + depth * 50);
        const g = Math.round(140 + depth * 70);
        const b = Math.round(249 - depth * 40);

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    seed();
    draw();

    const ro = new ResizeObserver(resize);
    if (parent) ro.observe(parent);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      aria-hidden
    />
  );
}

"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  motion,
  useTransform,
  useSpring,
  useMotionValue,
  useScroll,
  type MotionValue,
} from "framer-motion";

export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
  src: string;
  index: number;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
  label: string;
}

const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;

function FlipCard({ src, index, target, label }: FlipCardProps) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: "spring", stiffness: 40, damping: 15 }}
      style={{
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="group cursor-pointer"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl border border-line bg-raise shadow-glow"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={label || `vision-${index}`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-canvas/20 transition-colors group-hover:bg-transparent" />
        </div>

        <div
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-line-strong bg-surface p-3"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center">
            <p className="mb-1 font-mono text-[8px] font-bold uppercase tracking-widest text-brand">
              Scalar
            </p>
            <p className="text-[11px] font-medium leading-tight text-ink">{label}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const TOTAL_IMAGES = 20;

const IMAGES = [
  { src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&q=80", label: "LLM apps" },
  { src: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300&q=80", label: "Agents" },
  { src: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&q=80", label: "Retrieval" },
  { src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&q=80", label: "Infra" },
  { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80", label: "Pipelines" },
  { src: "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=300&q=80", label: "Evals" },
  { src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&q=80", label: "Security" },
  { src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80", label: "Cloud" },
  { src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&q=80", label: "Product" },
  { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&q=80", label: "Analytics" },
  { src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&q=80", label: "Ops" },
  { src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&q=80", label: "Automation" },
  { src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&q=80", label: "Data" },
  { src: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=300&q=80", label: "Models" },
  { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=80", label: "Design" },
  { src: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&q=80", label: "Research" },
  { src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&q=80", label: "Code" },
  { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80", label: "Systems" },
  { src: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=300&q=80", label: "Robotics" },
  { src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&q=80", label: "Engineering" },
];

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

type IntroAnimationProps = {
  /** 0–1 page scroll progress through the sticky vision section */
  progress: MotionValue<number>;
};

export default function IntroAnimation({ progress }: IntroAnimationProps) {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);
    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });
    return () => observer.disconnect();
  }, []);

  // Page scroll → morph (0–0.35) then arc shuffle (0.35–1)
  const morphProgress = useTransform(progress, [0, 0.35], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });
  const scrollRotate = useTransform(progress, [0.35, 1], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      mouseX.set(((relativeX / rect.width) * 2 - 1) * 100);
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  useEffect(() => {
    const timer1 = setTimeout(() => setIntroPhase("line"), 500);
    const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const scatterPositions = useMemo(
    () =>
      IMAGES.map(() => ({
        x: (Math.random() - 0.5) * 1500,
        y: (Math.random() - 0.5) * 1000,
        rotation: (Math.random() - 0.5) * 180,
        scale: 0.6,
        opacity: 0,
      })),
    []
  );

  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const unsubMorph = smoothMorph.on("change", setMorphValue);
    const unsubRotate = smoothScrollRotate.on("change", setRotateValue);
    const unsubParallax = smoothMouseX.on("change", setParallaxValue);
    return () => {
      unsubMorph();
      unsubRotate();
      unsubParallax();
    };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-canvas">
      <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">
        <div className="pointer-events-none absolute top-1/2 z-0 flex -translate-y-1/2 flex-col items-center justify-center px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                : { opacity: 0, filter: "blur(10px)" }
            }
            transition={{ duration: 1 }}
            className="text-2xl font-semibold tracking-tight text-ink md:text-4xl"
          >
            AI systems, engineered for production.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 0.55 - morphValue }
                : { opacity: 0 }
            }
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-4 font-mono text-xs font-bold tracking-[0.2em] text-muted"
          >
            KEEP SCROLLING
          </motion.p>
        </div>

        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="pointer-events-none absolute top-[18%] z-10 flex flex-col items-center justify-center px-6 text-center md:top-[16%]"
        >
          <h2 className="mb-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            Explore what we ship
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-muted md:text-base">
            From retrieval to agents to production ops — keep scrolling to move through the
            systems Scalar builds for teams shipping real AI products.
          </p>
        </motion.div>

        <div className="relative flex h-full w-full items-center justify-center">
          {IMAGES.slice(0, TOTAL_IMAGES).map((item, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            if (introPhase === "scatter") {
              target = scatterPositions[i];
            } else if (introPhase === "line") {
              const lineSpacing = 70;
              const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
              const lineX = i * lineSpacing - lineTotalWidth / 2;
              target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
            } else {
              const isMobile = containerSize.width < 768;
              const minDimension = Math.min(containerSize.width, containerSize.height);
              const circleRadius = Math.min(minDimension * 0.35, 350);
              const circleAngle = (i / TOTAL_IMAGES) * 360;
              const circleRad = (circleAngle * Math.PI) / 180;
              const circlePos = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
              };

              const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
              const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
              const arcApexY = containerSize.height * (isMobile ? 0.28 : 0.2);
              const arcCenterY = arcApexY + arcRadius;
              const spreadAngle = isMobile ? 100 : 130;
              const startAngle = -90 - spreadAngle / 2;
              const step = spreadAngle / (TOTAL_IMAGES - 1);
              const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
              const maxRotation = spreadAngle * 0.8;
              const boundedRotation = -scrollProgress * maxRotation;
              const currentArcAngle = startAngle + i * step + boundedRotation;
              const arcRad = (currentArcAngle * Math.PI) / 180;

              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: isMobile ? 1.4 : 1.8,
              };

              target = {
                x: lerp(circlePos.x, arcPos.x, morphValue),
                y: lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                scale: lerp(1, arcPos.scale, morphValue),
                opacity: 1,
              };
            }

            return (
              <FlipCard
                key={i}
                src={item.src}
                index={i}
                target={target}
                label={item.label}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Full-page sticky vision block — scrolls with the document, not a nested card. */
export function VisionScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="vision" ref={sectionRef} className="relative h-[280vh] bg-canvas">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <IntroAnimation progress={scrollYProgress} />
      </div>
    </section>
  );
}

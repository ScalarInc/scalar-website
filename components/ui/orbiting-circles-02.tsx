"use client";

import React from "react";
import ParticleSphereAnimation from "@/components/ui/orbiting-circles-02-utils/particalsphear";

const orbits = [
  {
    size: "w-[17.5rem] h-[17.5rem] md:w-[28rem] md:h-[28rem]",
    duration: 18,
    icons: [
      { src: "https://cdn.simpleicons.org/supabase/3ECF8E", alt: "Supabase", angle: -60 },
      { src: "https://cdn.simpleicons.org/googlegemini/8E75B2", alt: "Gemini", angle: 0 },
      { src: "https://cdn.simpleicons.org/openai/FFFFFF", alt: "OpenAI", angle: 60 },
    ],
  },
  {
    size: "w-[23.5rem] h-[23.5rem] md:w-[34rem] md:h-[34rem]",
    duration: 24,
    icons: [
      { src: "https://cdn.simpleicons.org/figma/F24E1E", alt: "Figma", angle: 0 },
      { src: "https://cdn.simpleicons.org/postgresql/4169E1", alt: "Postgres", angle: -90 },
    ],
  },
  {
    size: "w-[28rem] h-[28rem] md:w-[41rem] md:h-[41rem]",
    duration: 30,
    icons: [
      { src: "https://cdn.simpleicons.org/anthropic/D4A27F", alt: "Claude", angle: -60 },
      { src: "https://cdn.simpleicons.org/react/61DAFB", alt: "React", angle: 0 },
      { src: "https://cdn.simpleicons.org/python/3776AB", alt: "Python", angle: 60 },
    ],
  },
];

export default function OrbitingCirclesGlobeDemo() {
  return (
    <div className="relative flex h-[32rem] w-full items-end justify-center overflow-hidden md:h-[48rem]">
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)) }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) - 360deg)) }
        }
        @keyframes counter-cw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)) }
        }
        @keyframes counter-ccw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)) }
        }
      `}</style>

      <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 aspect-square w-[18.75rem] -translate-x-1/2 translate-y-1/2 md:w-[36.25rem]">
        <ParticleSphereAnimation />
      </div>

      {orbits.map((orbit, index) => {
        const isCW = index % 2 === 0;
        const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
        const counterAnim = isCW ? "counter-cw" : "counter-ccw";

        const allIcons = [
          ...orbit.icons,
          ...orbit.icons.map((ic) => ({
            ...ic,
            angle: ic.angle + 180,
            alt: `${ic.alt}-mirror`,
          })),
        ];

        return (
          <div
            key={index}
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-border ${orbit.size}`}
          >
            {allIcons.map((iconData, iconIndex) => (
              <div
                key={iconIndex}
                className="absolute left-1/2 top-0 flex h-1/2 origin-bottom -ml-8 flex-col items-center justify-start"
                style={
                  {
                    "--start-angle": `${iconData.angle}deg`,
                    animation: `${orbitAnim} ${orbit.duration}s linear infinite`,
                  } as React.CSSProperties
                }
              >
                <div
                  className="relative z-10 -mt-8 rounded-full border border-border bg-background p-3 sm:p-4"
                  style={
                    {
                      "--counter-offset": `${-iconData.angle}deg`,
                      animation: `${counterAnim} ${orbit.duration}s linear infinite`,
                    } as React.CSSProperties
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={iconData.src}
                    alt={iconData.alt}
                    width={32}
                    height={32}
                    className="h-6 w-6 md:h-8 md:w-8"
                  />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

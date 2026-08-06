"use client";

import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useAspect, useTexture } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three/webgpu";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import type { Mesh } from "three";

import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  mix,
  add,
} from "three/tsl";

const TEXTUREMAP = { src: "https://i.postimg.cc/XYwvXN8D/img-4.png" };
const DEPTHMAP = { src: "https://i.postimg.cc/2SHKQh2q/raw-4.webp" };

extend(THREE as never);

const PostProcessing = ({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true,
}: {
  strength?: number;
  threshold?: number;
  fullScreenEffect?: boolean;
}) => {
  const { gl, scene, camera } = useThree();
  const progressRef = useRef({ value: 0 });

  const render = useMemo(() => {
    // three r185+: PostProcessing renamed to RenderPipeline
    const Pipeline = (THREE as typeof THREE & { RenderPipeline?: typeof THREE.PostProcessing }).RenderPipeline
      ?? THREE.PostProcessing;
    const postProcessing = new Pipeline(gl as never);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);

    const uScanProgress = uniform(0);
    progressRef.current = uScanProgress;

    const scanPos = float(uScanProgress.value);
    const uvY = uv().y;
    const scanWidth = float(0.05);
    const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(scanPos)));
    // Brand-tinted scan (indigo) instead of raw red
    const scanOverlay = vec3(0.49, 0.55, 0.98).mul(oneMinus(scanLine)).mul(0.35);

    const withScanEffect = mix(
      scenePassColor,
      add(scenePassColor, scanOverlay),
      fullScreenEffect ? smoothstep(0.9, 1.0, oneMinus(scanLine)) : 1.0
    );

    const final = withScanEffect.add(bloomPass);
    postProcessing.outputNode = final;

    return postProcessing;
  }, [camera, gl, scene, strength, threshold, fullScreenEffect]);

  useFrame(({ clock }) => {
    progressRef.current.value = Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;
    const pipeline = render as { render?: () => void; renderAsync?: () => Promise<void> };
    if (typeof pipeline.render === "function") pipeline.render();
    else void pipeline.renderAsync?.();
  }, 1);

  return null;
};

const WIDTH = 300;
const HEIGHT = 300;

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);
  const meshRef = useRef<Mesh>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (rawMap && depthMap) setVisible(true);
  }, [rawMap, depthMap]);

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);
    const strength = 0.01;
    const tDepthMap = texture(depthMap);
    const tMap = texture(rawMap, uv().add(tDepthMap.r.mul(uPointer).mul(strength)));

    const aspect = float(WIDTH).div(HEIGHT);
    const tUv = vec2(uv().x.mul(aspect), uv().y);
    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);
    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));
    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);
    const depth = tDepthMap;
    const flow = oneMinus(smoothstep(0, 0.02, abs(depth.sub(uProgress))));
    const mask = dot.mul(flow).mul(vec3(0.49, 0.55, 0.98));
    const final = blendScreen(tMap, mask);

    const material = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0,
    });

    return {
      material,
      uniforms: { uPointer, uProgress },
    };
  }, [rawMap, depthMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  useFrame(({ clock }) => {
    uniforms.uProgress.value = Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;
    if (meshRef.current?.material) {
      const mat = meshRef.current.material as THREE.MeshBasicNodeMaterial & { opacity: number };
      if ("opacity" in mat) {
        // Keep graphic atmospheric — never full-strength over copy
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, visible ? 0.42 : 0, 0.07);
      }
    }
  });

  useFrame(({ pointer }) => {
    uniforms.uPointer.value = pointer;
  });

  const scaleFactor = 0.55;
  return (
    <mesh
      ref={meshRef}
      position={[0, -0.35, 0]}
      scale={[w * scaleFactor, h * scaleFactor, 1]}
      material={material}
    >
      <planeGeometry />
    </mesh>
  );
};

function HeroFallback() {
  return (
    <div className="absolute inset-0 bg-canvas">
      <div className="aurora noise absolute inset-0" />
      <div className="grid-bg absolute inset-0 opacity-50" />
    </div>
  );
}

export const Html = () => {
  const subtitle = "AI systems, engineered for production.";
  const [webgpuOk, setWebgpuOk] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const nav = navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown> } };
        if (!nav.gpu) {
          setWebgpuOk(false);
          return;
        }
        const adapter = await nav.gpu.requestAdapter();
        setWebgpuOk(Boolean(adapter));
      } catch {
        setWebgpuOk(false);
      }
    };
    void check();
  }, []);

  return (
    <div id="top" className="relative h-svh overflow-hidden bg-canvas">
      {webgpuOk === false && <HeroFallback />}

      {webgpuOk && (
        <Canvas
          flat
          className="!absolute inset-0 z-0 opacity-40"
          gl={async (props) => {
            const renderer = new THREE.WebGPURenderer(props as ConstructorParameters<typeof THREE.WebGPURenderer>[0]);
            await renderer.init();
            return renderer;
          }}
        >
          <PostProcessing fullScreenEffect={false} strength={0.35} threshold={0.85} />
          <Scene />
        </Canvas>
      )}

      {/* Heavy center vignette so stripe texture can't wash out copy */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 58% 48% at 50% 45%, rgba(8,8,11,0.97) 0%, rgba(8,8,11,0.88) 38%, rgba(8,8,11,0.45) 68%, rgba(8,8,11,0.15) 100%), linear-gradient(180deg, rgba(8,8,11,0.7) 0%, transparent 30%, transparent 58%, rgba(8,8,11,0.9) 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-20 flex h-svh w-full flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-white">
          AI product engineering
        </p>
        <h1 className="text-[clamp(64px,13vw,128px)] font-semibold leading-none tracking-[-0.06em] text-white">
          scalar
        </h1>
        <p className="mt-6 text-2xl font-semibold uppercase tracking-[-0.03em] text-white md:text-4xl xl:text-5xl">
          Built for What&apos;s Next
        </p>
        <p className="mt-4 max-w-[38ch] text-base font-semibold leading-snug text-white md:text-xl">
          {subtitle}
        </p>

        <div className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#contact"
            className="inline-flex h-12 items-center rounded-[14px] bg-brand px-6 text-[15px] font-semibold text-on-brand shadow-[0_12px_32px_var(--color-glow)] transition-shadow hover:shadow-[0_18px_44px_var(--color-glow)]"
          >
            Start a project
          </a>
          <a
            href="#stack"
            className="inline-flex h-12 items-center rounded-[14px] border border-white/25 bg-[#0F1015] px-6 text-[15px] font-semibold text-white shadow-[0_12px_32px_rgba(0,0,0,0.55)] transition-colors hover:border-brand"
          >
            See our stack
          </a>
        </div>
      </div>

      <a href="#vision" className="explore-btn" style={{ animationDelay: "2.2s" }}>
        Scroll to explore
        <span className="explore-arrow">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-svg">
            <path d="M11 5V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 12L11 17L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </a>
    </div>
  );
};

export default Html;

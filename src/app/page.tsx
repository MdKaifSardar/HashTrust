"use client";

import HeroSectionComponent from "@/components/HomePage/HeroSectionComponent";
import ServicesComponent from "@/components/HomePage/ServicesComponent";
import UniqueFeaturesComp from "@/components/HomePage/UniqueFeaturesComp";
import React, { useEffect, useRef } from "react";

const NUM_BLOBS = 10;
const HUES = [190, 200, 210, 195, 185, 220, 205];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function useAnimatedBlobs(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    const blobs = Array.from(ref.current.children) as HTMLDivElement[];
    const state = blobs.map(() => ({
      x: randomBetween(0, 80),
      y: randomBetween(0, 80),
      dx: randomBetween(-0.08, 0.08),
      dy: randomBetween(-0.08, 0.08),
      hue: HUES[Math.floor(Math.random() * HUES.length)],
      opacity: randomBetween(0.22, 0.38),
    }));
    function animate() {
      blobs.forEach((blob, i) => {
        let s = state[i];
        s.x += s.dx;
        s.y += s.dy;
        if (s.x < 0 || s.x > 80) s.dx *= -1;
        if (s.y < 0 || s.y > 80) s.dy *= -1;
        blob.style.left = `${s.x}%`;
        blob.style.top = `${s.y}%`;
        blob.style.background = `radial-gradient(circle at 50% 50%, hsl(${s.hue}, 100%, 85%) 0%, hsl(${s.hue}, 100%, 70%) 80%, transparent 100%)`;
        blob.style.opacity = `${s.opacity}`;
      });
      requestAnimationFrame(animate);
    }
    animate();
    // eslint-disable-next-line
  }, [ref]);
}

function AnimatedBlueBg() {
  const ref = useRef<HTMLDivElement>(null);
  useAnimatedBlobs(ref);
  return (
    <div
      ref={ref}
      className="absolute inset-0 w-full h-full -z-10 overflow-hidden bg-blue-50"
    >
      {Array.from({ length: NUM_BLOBS }).map((_, i) => (
        <div
          key={i}
          className="absolute w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full pointer-events-none"
          style={{ filter: "blur(70px)" }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-home-gradient">
      <HeroSectionComponent />
      <ServicesComponent />
      <UniqueFeaturesComp />
    </div>
  );
}

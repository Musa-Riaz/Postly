"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface MarqueeProps {
  items: React.ReactNode[];
  speed?: number;
}

export const Marquee = ({ items, speed = 1 }: MarqueeProps) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current || !contentRef.current) return;

    const contentWidth = contentRef.current.offsetWidth;
    
    const animation = gsap.to(contentRef.current, {
      x: -contentWidth / 2,
      duration: 20 / speed,
      ease: "none",
      repeat: -1,
    });

    const handleMouseEnter = () => {
      gsap.to(animation, { timeScale: 0.2, duration: 0.5 });
    };

    const handleMouseLeave = () => {
      gsap.to(animation, { timeScale: 1, duration: 0.5 });
    };

    const marquee = marqueeRef.current;
    marquee.addEventListener("mouseenter", handleMouseEnter);
    marquee.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      animation.kill();
      marquee.removeEventListener("mouseenter", handleMouseEnter);
      marquee.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [speed]);

  return (
    <div 
      ref={marqueeRef}
      className="w-full overflow-hidden bg-white border-y-4 border-black py-8"
    >
      <div 
        ref={contentRef}
        className="flex whitespace-nowrap gap-16 items-center px-8"
        style={{ width: "fit-content" }}
      >
        {/* Render twice for seamless loop */}
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex-shrink-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

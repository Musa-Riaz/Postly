"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { LandingCard } from "./LandingCard";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export const MorphingPreview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 1,
        // markers: true,
      },
    });

    // Initial state: cards are stacked or hidden
    tl.set([card2Ref.current, card3Ref.current], { opacity: 0, scale: 0.8, x: 0, y: 0 });

    // Step 1: Split the cards
    tl.to(card1Ref.current, { x: -350, y: -50, rotate: -5, duration: 1 }, "split")
      .to(card2Ref.current, { opacity: 1, scale: 1, x: 0, y: 50, rotate: 2, duration: 1 }, "split")
      .to(card3Ref.current, { opacity: 1, scale: 1, x: 350, y: -30, rotate: -3, duration: 1 }, "split");

    // Step 2: Morph content/shapes (simulated by aspect ratios and specific styles)
    tl.to(card1Ref.current, { width: 300, height: 400, duration: 1 }, "morph")
      .to(card2Ref.current, { width: 450, height: 250, duration: 1 }, "morph")
      .to(card3Ref.current, { width: 320, height: 350, duration: 1 }, "morph");

    // Step 3: Reveal platform-specific headers
    tl.from(".platform-badge", { opacity: 0, y: 10, stagger: 0.2, duration: 0.5 });

  }, { scope: sectionRef });

  const dummyContent = "Our new product launch is live! 🚀 Check out the link in bio to explore the future of social media management. #SaaS #AI #Postly";

  return (
    <section ref={sectionRef} className="h-screen bg-background flex flex-col items-center justify-center overflow-hidden border-b-4 border-black">
      <div className="absolute top-20 text-center px-6">
        <h2 className="text-4xl md:text-6xl mb-4">One Draft, Infinite Possibilities</h2>
        <p className="font-mono uppercase tracking-widest opacity-60">Watch your content adapt in real-time</p>
      </div>

      <div ref={containerRef} className="relative flex items-center justify-center w-full max-w-6xl h-[600px]">
        {/* Instagram Preview */}
        <div ref={card1Ref} className="absolute z-30">
          <LandingCard className="w-[320px] h-[320px] flex flex-col p-0 overflow-hidden border-accent">
            <div className="platform-badge p-3 border-b-2 border-black flex items-center gap-2 bg-accent/10">
              <FaInstagram size={18} />
              <span className="text-xs font-mono font-bold">Instagram Preview</span>
            </div>
            <div className="flex-1 p-4 bg-white flex flex-col">
              <div className="aspect-square w-full bg-gray-100 border-2 border-black mb-3 flex items-center justify-center font-black text-4xl opacity-20">IMAGE</div>
              <p className="text-[10px] font-bold line-clamp-3">{dummyContent}</p>
            </div>
          </LandingCard>
        </div>

        {/* X / Twitter Preview */}
        <div ref={card2Ref} className="absolute z-10">
          <LandingCard className="w-[320px] h-[320px] flex flex-col p-0 overflow-hidden border-secondary">
            <div className="platform-badge p-3 border-b-2 border-black flex items-center gap-2 bg-secondary/10">
              <FaTwitter size={18} />
              <span className="text-xs font-mono font-bold">X / Twitter Preview</span>
            </div>
            <div className="flex-1 p-4 bg-white flex flex-col justify-center">
              <p className="text-sm font-bold leading-tight mb-3">{dummyContent}</p>
              <div className="aspect-video w-full bg-gray-100 border-2 border-black flex items-center justify-center font-black text-xl opacity-20">MEDIA</div>
            </div>
          </LandingCard>
        </div>

        {/* LinkedIn Preview */}
        <div ref={card3Ref} className="absolute z-20">
          <LandingCard className="w-[320px] h-[320px] flex flex-col p-0 overflow-hidden border-main">
            <div className="platform-badge p-3 border-b-2 border-black flex items-center gap-2 bg-main/10">
              <FaLinkedin size={18} />
              <span className="text-xs font-mono font-bold">LinkedIn Preview</span>
            </div>
            <div className="flex-1 p-4 bg-white flex flex-col">
              <div className="flex gap-2 mb-3">
                <div className="w-8 h-8 bg-black/10 border border-black" />
                <div className="flex-1">
                  <div className="h-2 w-24 bg-black/20 mb-1" />
                  <div className="h-1.5 w-16 bg-black/10" />
                </div>
              </div>
              <p className="text-xs font-bold mb-3">{dummyContent}</p>
              <div className="flex-1 w-full bg-gray-100 border-2 border-black flex items-center justify-center font-black text-xl opacity-20">ARTICLE</div>
            </div>
          </LandingCard>
        </div>
      </div>
    </section>
  );
};

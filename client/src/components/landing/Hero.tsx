"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { LandingButton } from "./LandingButton";
import { LandingCard } from "./LandingCard";
import {  X, Sparkles } from "lucide-react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Staggered headline reveal
    if (headlineRef.current) {
      const words = headlineRef.current.innerText.split(" ");
      headlineRef.current.innerHTML = words
        .map(word => `<span class="inline-block overflow-hidden"><span class="word inline-block">${word}</span></span>`)
        .join(" ");

      tl.from(".word", {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.out",
      });
    }

    // Fade in subheadline and CTA
    tl.from(".hero-sub", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
      .from(".hero-cta", { opacity: 0, scale: 0.8, duration: 0.5, ease: "back.out(1.7)" }, "-=0.2");

    // Floating cards parallax
    const cards = gsap.utils.toArray(".float-card");
    cards.forEach((card: any, i) => {
      gsap.to(card, {
        y: i % 2 === 0 ? -20 : 20,
        duration: 2 + i,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.5,
      });
    });
  }, { scope: containerRef });

  const prompts = [
    { text: "Product Launch", icon: "🚀" },
    { text: "Weekly Tips", icon: "💡" },
    { text: "Event Teaser", icon: "🗓️" },
  ];

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-20 pb-32"
    >
      {/* Background Floating Cards */}
      <div ref={cardsRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <LandingCard className="float-card absolute top-[15%] left-[10%] w-48 rotate-[-6deg] hidden lg:block border-accent bg-accent/10">
          <div className="flex items-center gap-2 mb-2">
            <FaInstagram size={16} />
            <span className="text-[10px] font-mono">Instagram</span>
          </div>
          <div className="h-2 w-full bg-black/10 rounded-full mb-1" />
          <div className="h-2 w-2/3 bg-black/10 rounded-full" />
        </LandingCard>

        <LandingCard className="float-card absolute top-[20%] right-[10%] w-52 rotate-[8deg] hidden lg:block border-secondary bg-secondary/10">
          <div className="flex items-center gap-2 mb-2">
            <X size={16} />
            <span className="text-[10px] font-mono">X / Twitter</span>
          </div>
          <div className="h-2 w-full bg-black/10 rounded-full mb-1" />
          <div className="h-2 w-1/2 bg-black/10 rounded-full" />
        </LandingCard>

        <LandingCard className="float-card absolute bottom-[20%] left-[15%] w-56 rotate-[4deg] hidden lg:block border-main bg-main/10">
          <div className="flex items-center gap-2 mb-2">
            <FaLinkedin size={16} />
            <span className="text-[10px] font-mono">LinkedIn</span>
          </div>
          <div className="h-2 w-full bg-black/10 rounded-full mb-1" />
          <div className="h-2 w-3/4 bg-black/10 rounded-full" />
        </LandingCard>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl">
        <h1 
          ref={headlineRef}
          className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter"
        >
          ONE PROMPT. TEN PLATFORMS. ZERO EFFORT.
        </h1>
        
        <p className="hero-sub text-xl md:text-2xl font-bold mb-12 max-w-2xl mx-auto uppercase tracking-tight opacity-80">
          Generate, schedule, and measure your social media presence with AI-powered neobrutalist precision.
        </p>

        <div className="hero-cta flex flex-col items-center gap-8">
          <LandingButton size="lg" className="group">
            Get Started for Free
            <Sparkles className="ml-2 w-6 h-6 group-hover:rotate-12 transition-transform" />
          </LandingButton>

          <div className="flex flex-wrap justify-center gap-4">
            <span className="w-full text-xs font-mono uppercase tracking-widest opacity-60">Try a demo prompt</span>
            {prompts.map((prompt) => (
              <button 
                key={prompt.text}
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 bg-white border-2 border-black neo-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all font-black text-sm uppercase tracking-tight flex items-center gap-2"
              >
                <span>{prompt.icon}</span>
                {prompt.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

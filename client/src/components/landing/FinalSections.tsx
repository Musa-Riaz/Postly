 "use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { LandingCard } from "./LandingCard";
import { LandingButton } from "./LandingButton";
import { Check, Zap, Sparkles } from "lucide-react";

export const PricingSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".pricing-card", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      y: 100,
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: "back.out(1.7)",
    });
  }, { scope: containerRef });

  return (
    <section id="pricing" ref={containerRef} className="py-24 bg-background px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl mb-6">Simple Pricing. Infinite Value.</h2>
        <p className="text-xl font-bold uppercase tracking-tight mb-16 opacity-70">
          Everything you need to dominate social media, at a price that makes sense.
        </p>

        <div className="pricing-card max-w-md mx-auto">
          <LandingCard variant="main" className="p-0 border-4">
            <div className="p-8 border-b-4 border-black bg-white text-left">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-black uppercase">Creator Pro</h3>
                  <p className="text-xs font-mono opacity-60">Perfect for individuals</p>
                </div>
                <div className="px-3 py-1 bg-accent border-2 border-black font-black text-[10px] uppercase">Best Value</div>
              </div>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black">$29</span>
                <span className="font-bold opacity-60">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited Social Accounts",
                  "AI Content Generation (Gemini Pro)",
                  "Advanced Multi-Platform Scheduling",
                  "Unified Analytics Dashboard",
                  "Post Performance Insights",
                  "Priority Support"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 font-bold text-sm">
                    <div className="bg-main border-2 border-black p-0.5"><Check size={14} /></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <LandingButton className="w-full py-4 text-xl" variant="outline">
                Get Started Now
              </LandingButton>
            </div>
            <div className="p-4 bg-black text-white font-mono text-[10px] uppercase tracking-widest text-center">
              No credit card required • 14-day free trial
            </div>
          </LandingCard>
        </div>
      </div>
    </section>
  );
};

export const FinalCTA = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Set random positions for sparkles after mount
    gsap.set(".sparkle-item", {
      top: () => `${Math.random() * 100}%`,
      left: () => `${Math.random() * 100}%`,
      scale: () => Math.random() * 2,
      opacity: 1,
    });

    // Periodic jiggle animation
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 4 });
    tl.to(buttonRef.current, { rotate: 2, duration: 0.1 })
      .to(buttonRef.current, { rotate: -2, duration: 0.1 })
      .to(buttonRef.current, { rotate: 1, duration: 0.1 })
      .to(buttonRef.current, { rotate: -1, duration: 0.1 })
      .to(buttonRef.current, { rotate: 0, duration: 0.1 });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 bg-main px-6 border-t-4 border-black text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Sparkles 
            key={i} 
            className="absolute animate-pulse sparkle-item opacity-0" 
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-8xl mb-8 leading-tight">READY TO GO NEOGRUDGE?</h2>
        <p className="text-xl md:text-2xl font-black uppercase mb-12 tracking-tight">
          Join 5,000+ creators building their empire with Postly.
        </p>
        
        <div ref={buttonRef} className="inline-block">
          <LandingButton size="lg" className="px-12 py-6 text-3xl neo-shadow-lg bg-white">
            START POSTING NOW <Zap className="ml-4 fill-main" />
          </LandingButton>
        </div>
        
        <p className="mt-8 font-mono text-xs uppercase opacity-60">
          Trusted by top agencies and solo creators worldwide
        </p>
      </div>
    </section>
  );
};

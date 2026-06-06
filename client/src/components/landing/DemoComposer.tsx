"use client";

import React, { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { LandingCard } from "./LandingCard";
import { LandingButton } from "./LandingButton";
import { Sparkles, Send, Copy, Calendar, RefreshCcw } from "lucide-react";

const DEMO_PROMPTS = [
  { 
    id: "launch",
    chip: "🚀 Product Launch", 
    prompt: "Write a high-energy announcement for a new AI social media tool called Postly.",
    result: "Big news! 🚀 We're officially launching Postly — the AI-powered social media manager built for creators who want to post more and stress less. \n\n✅ One-click multi-platform posting\n✅ AI-generated captions & hashtags\n✅ Neo-brutalist analytics\n\nTry it now at postly.com! #SaaS #AI #Marketing"
  },
  { 
    id: "tips",
    chip: "💡 Weekly Tips", 
    prompt: "Give me a social media tip about engagement for my LinkedIn audience.",
    result: "Struggling with LinkedIn engagement? 💡 Here's a pro tip: The 'Golden Hour' is real. \n\nResponding to every comment within the first 60 minutes of posting signals to the algorithm that your content is high-value. \n\nDouble your reach by just being present! 📈 #SocialMediaTips #Engagement #LinkedIn"
  },
  { 
    id: "teaser",
    chip: "🗓️ Event Teaser", 
    prompt: "Create a mysterious teaser for an upcoming webinar about AI in 2024.",
    result: "Something big is coming... 🗓️ \n\nWe're peeling back the curtain on how AI will redefine content creation in 2024. No fluff, just pure strategy. \n\nAre you ready for the shift? Save your seat below. 🔗 #Webinar #FutureOfAI #ComingSoon"
  }
];

export const DemoComposer = () => {
  const [activePrompt, setActivePrompt] = useState<typeof DEMO_PROMPTS[0] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handlePromptClick = (prompt: typeof DEMO_PROMPTS[0]) => {
    if (isGenerating) return;
    
    setActivePrompt(prompt);
    setIsGenerating(true);
    setHasResult(false);

    contextSafe(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsGenerating(false);
          setHasResult(true);
        }
      });

      // 1. Reset input and "type" the prompt
      tl.to(inputRef.current, { value: "", duration: 0.1 })
        .to(inputRef.current, { 
          value: prompt.prompt, 
          duration: 1.5, 
          ease: "none" 
        });

      // 2. Fill progress bar
      tl.to(progressBarRef.current, { width: "100%", duration: 2, ease: "power2.inOut" }, "+=0.2");

      // 3. Clear progress bar and reveal result
      tl.set(progressBarRef.current, { width: "0%" })
        .fromTo(resultRef.current, 
          { opacity: 0, scale: 0.9, y: 20 }, 
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
        );
    })();
  };

  return (
    <section id="demo" ref={containerRef} className="py-24 bg-surface px-6 border-b-4 border-black">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        
        {/* Left Side: Info */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-4xl md:text-6xl mb-6">Experience the AI Magic</h2>
          <p className="text-xl font-bold uppercase tracking-tight mb-8 opacity-70">
            Select a prompt below and watch Postly craft your perfect social media post in seconds.
          </p>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            {DEMO_PROMPTS.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePromptClick(p)}
                disabled={isGenerating}
                className={`px-6 py-3 border-2 border-black font-black uppercase tracking-tight transition-all neo-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none ${
                  activePrompt?.id === p.id ? "bg-main" : "bg-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {p.chip}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Simulated App */}
        <div className="flex-1 w-full max-w-xl">
          <LandingCard className="p-0 overflow-hidden bg-background">
            {/* Header */}
            <div className="p-4 border-b-2 border-black bg-main/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-main-foreground" />
                <span className="font-mono font-bold text-sm uppercase">AI Content Generator</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-black" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 border border-black" />
                <div className="w-3 h-3 rounded-full bg-green-500 border border-black" />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 border-b-2 border-black bg-white">
              <label className="block font-mono text-[10px] uppercase mb-2 opacity-60">Describe your post...</label>
              <textarea 
                ref={inputRef}
                readOnly
                className="w-full h-24 bg-surface border-2 border-black p-4 font-bold text-sm focus:outline-none resize-none"
                placeholder="Click a prompt on the left to start..."
              />
              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="p-2 border-2 border-black bg-gray-50"><RefreshCcw size={16} /></div>
                  <div className="p-2 border-2 border-black bg-gray-50"><Calendar size={16} /></div>
                </div>
                <LandingButton size="sm" className="h-10 px-4">
                  Generate <Send size={14} className="ml-2" />
                </LandingButton>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="h-2 bg-gray-100 w-full overflow-hidden">
              <div ref={progressBarRef} className="h-full bg-main w-0" />
            </div>

            {/* Result Area */}
            <div className="p-6 min-h-[200px] flex items-center justify-center bg-surface">
              {!isGenerating && !hasResult && (
                <div className="text-center opacity-30 font-black uppercase text-xl rotate-[-2deg]">
                  Waiting for prompt...
                </div>
              )}
              
              {isGenerating && (
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin text-main"><RefreshCcw size={32} /></div>
                  <span className="font-mono text-xs animate-pulse">Gemini AI is thinking...</span>
                </div>
              )}

              {hasResult && activePrompt && (
                <div ref={resultRef} className="w-full">
                  <LandingCard className="bg-white p-4 border-2 border-black neo-shadow-sm rotate-1">
                    <div className="flex items-center justify-between mb-3 border-b border-black/10 pb-2">
                      <span className="text-[10px] font-mono font-bold opacity-60">Generated Content</span>
                      <button className="hover:text-main transition-colors"><Copy size={14} /></button>
                    </div>
                    <p className="text-sm font-bold whitespace-pre-wrap leading-relaxed">
                      {activePrompt.result}
                    </p>
                  </LandingCard>
                </div>
              )}
            </div>
          </LandingCard>
        </div>

      </div>
    </section>
  );
};

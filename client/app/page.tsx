import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { MarqueeSection } from "@/components/landing/MarqueeSection";
import { MorphingPreview } from "@/components/landing/MorphingPreview";
import { DemoComposer } from "@/components/landing/DemoComposer";

import { PricingSection, FinalCTA } from "@/components/landing/FinalSections";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background font-sans selection:bg-main selection:text-main-foreground">
      <Navbar />
      
      <div className="relative">
        <Hero />
        
        <div className="relative z-20">
          <MarqueeSection />
        </div>
        
        <div id="features">
          <MorphingPreview />
        </div>
        
        <div id="demo">
          <DemoComposer />
        </div>
        
        <div id="pricing">
          <PricingSection />
        </div>
        
        <FinalCTA />
      </div>

      <footer className="py-12 bg-black text-white px-6 border-t-4 border-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-main border-2 border-white flex items-center justify-center font-black text-black">P</div>
            <span className="font-black text-xl uppercase tracking-tighter">Postly</span>
          </div>
          
          <div className="flex gap-8 font-mono text-[10px] uppercase tracking-widest opacity-60">
            <a href="#" className="hover:text-main">Privacy</a>
            <a href="#" className="hover:text-main">Terms</a>
            <a href="#" className="hover:text-main">Twitter</a>
            <a href="#" className="hover:text-main">Status</a>
          </div>
          
          <div className="font-mono text-[10px] uppercase tracking-widest opacity-40">
            © 2026 POSTLY INC. BUILT WITH NEO-BRUTALIST PRIDE.
          </div>
        </div>
      </footer>
    </main>
  );
}

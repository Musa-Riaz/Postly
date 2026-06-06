import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

// Set global defaults
gsap.defaults({
  duration: 0.6,
  ease: 'power2.out',
});

if (typeof window !== 'undefined') {
  ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
  });
}

export { gsap, ScrollTrigger, TextPlugin };

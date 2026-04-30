import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./lenis.client";

gsap.registerPlugin(ScrollTrigger);

export function initGsap(): void {
  // Bridge Lenis ↔ ScrollTrigger — NUNCA usar requestAnimationFrame propio para Lenis
  getLenis()?.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    getLenis()?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger };

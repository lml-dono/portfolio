import Lenis from "lenis";

// Make Lenis accessible if needed elsewhere
declare global {
  interface Window {
    lenis?: Lenis;
  }
}

// Read CSS var --nav-h to compensate sticky navbar on anchor scrolls
const getNavOffset = (): number => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--nav-h") || "72px";
  const n = parseFloat(raw);
  return Number.isFinite(n) ? -n : -72;
};

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

let started = false;
const startLenis = () => {
  if (started) return;
  started = true;

  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    // easing: (t) => t, // customize if desired
  });
  window.lenis = lenis;

  // RAF loop
  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Handle internal anchor links (#id) with navbar offset
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    const a = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (a && a.hash?.length > 1) {
      const el = document.querySelector<HTMLElement>(a.hash);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: getNavOffset() });
      }
    }
  });
};

// Respect reduced motion
if (!prefersReduced.matches) {
  startLenis();
}
prefersReduced.addEventListener?.("change", (ev: MediaQueryListEvent) => {
  if (!ev.matches) {
    startLenis();
  } else {
    window.lenis?.stop();
  }
});

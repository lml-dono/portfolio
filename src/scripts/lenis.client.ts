import Lenis from "lenis";

let instance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return instance;
}

export function initLenis(): void {
  if (instance) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  instance = new Lenis({ duration: 1.2, smoothWheel: true });

  const getNavOffset = (): number => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--nav-h") || "72px";
    const n = parseFloat(raw);
    return Number.isFinite(n) ? -n : -72;
  };

  // Anchor links con offset de navbar
  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (a?.hash?.length > 1) {
      const el = document.querySelector<HTMLElement>(a.hash);
      if (el) {
        e.preventDefault();
        instance?.scrollTo(el, { offset: getNavOffset() });
      }
    }
  });

  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener(
    "change",
    (ev: MediaQueryListEvent) => {
      if (ev.matches) instance?.stop();
      else instance?.start();
    }
  );
}

// Pausar/reanudar para modales
export function pauseScroll(): void {
  getLenis()?.stop();
}

export function resumeScroll(): void {
  getLenis()?.start();
}

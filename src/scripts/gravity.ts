import gsap from "gsap";
import { splitChars } from "./utils/splitChars";

export default function setupGravity(): void {
  const mq = window.matchMedia("(max-width: 991px)");
  let cleanup: (() => void) | null = null;

  const handleChange = () => {
    cleanup?.();
    cleanup = mq.matches ? activate() : null;
  };

  handleChange();
  mq.addEventListener("change", handleChange);
}

function activate(): () => void {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const roots = Array.from(
    document.querySelectorAll<HTMLElement>('[data-animate="font-weight"]')
  );

  roots.forEach((root) => splitChars(root));

  const chars = roots.flatMap((root) =>
    Array.from(root.querySelectorAll<HTMLElement>(".char"))
  );

  if (chars.length === 0) return () => {};

  const W_MIN = prefersReduced ? 300 : 100;
  const W_MAX = prefersReduced ? 600 : 800;

  const controllers = chars.map((el) =>
    gsap.quickTo(el, "--w", { duration: 0.35, ease: "power2.out" })
  );

  const viewportCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let centers: Array<{ x: number; y: number }> = [];

  const computeLayout = () => {
    centers = chars.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    viewportCenter.x = window.innerWidth / 2;
    viewportCenter.y = window.innerHeight / 2;
  };

  const gTarget = { x: 0, y: 1 };
  const gSmooth = { x: 0, y: 1 };
  const ALPHA = 0.15;
  const SENSITIVITY = 3;
  let rafId = 0;
  let needsUpdate = false;

  const requestTick = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(tick);
  };

  const tick = () => {
    rafId = 0;
    gSmooth.x += ALPHA * (gTarget.x - gSmooth.x);
    gSmooth.y += ALPHA * (gTarget.y - gSmooth.y);
    const glen = Math.hypot(gSmooth.x, gSmooth.y) || 1;
    const gx = gSmooth.x / glen;
    const gy = gSmooth.y / glen;
    const R = Math.max(1, Math.hypot(window.innerWidth, window.innerHeight) / 2);

    for (let i = 0; i < chars.length; i++) {
      const c = centers[i];
      if (!c) continue;
      let t = ((c.x - viewportCenter.x) * gx + (c.y - viewportCenter.y) * gy) / R * SENSITIVITY;
      t = Math.max(-1, Math.min(1, t));
      controllers[i](W_MIN + ((t + 1) / 2) * (W_MAX - W_MIN));
    }

    if (needsUpdate) { needsUpdate = false; requestTick(); }
  };

  const toRad = Math.PI / 180;
  const handleOrientation = (e: DeviceOrientationEvent) => {
    const g = clamp(e.gamma ?? 0, -90, 90);
    const b = clamp(e.beta ?? 0, -90, 90);
    const x = Math.sin(g * toRad);
    const y = Math.sin(b * toRad);
    const len = Math.hypot(x, y) || 1;
    gTarget.x = x / len;
    gTarget.y = y / len;
    needsUpdate = true;
    requestTick();
  };

  const onLayout = () => { computeLayout(); needsUpdate = true; requestTick(); };
  const onVisibility = () => {
    if (document.hidden) detachOrientation(); else maybeAttachOrientation();
  };

  window.addEventListener("resize", onLayout);
  window.addEventListener("scroll", onLayout, { passive: true });
  window.addEventListener("fitline:updated", onLayout as EventListener);
  computeLayout();

  let permBtn: HTMLButtonElement | null = null;
  const isiOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1);
  const needsPermission =
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof (DeviceOrientationEvent as any).requestPermission === "function" &&
    isiOS;

  const attachOrientation = () => {
    window.addEventListener("deviceorientation", handleOrientation, true);
    document.addEventListener("visibilitychange", onVisibility);
  };
  const detachOrientation = () => {
    window.removeEventListener("deviceorientation", handleOrientation, true);
    document.removeEventListener("visibilitychange", onVisibility);
  };

  const askPermission = async () => {
    try {
      const res = await (DeviceOrientationEvent as any).requestPermission();
      if (res === "granted") { permBtn?.remove(); permBtn = null; attachOrientation(); }
    } catch {}
  };

  const maybeAttachOrientation = () => {
    if (needsPermission) {
      if (!permBtn) {
        permBtn = document.createElement("button");
        permBtn.textContent = "Enable Motion";
        permBtn.style.cssText =
          "position:fixed;inset:auto 12px 12px auto;z-index:9999;padding:10px 14px;" +
          "border-radius:9999px;border:1px solid rgba(255,255,255,0.2);" +
          "background:rgba(255,255,255,0.08);color:#fff;backdrop-filter:blur(8px);" +
          "-webkit-backdrop-filter:blur(8px);font-size:14px;cursor:pointer;";
        permBtn.addEventListener("click", askPermission, { once: true });
        document.body.appendChild(permBtn);
      }
    } else {
      attachOrientation();
    }
  };

  maybeAttachOrientation();

  return () => {
    detachOrientation();
    permBtn?.remove();
    permBtn = null;
    window.removeEventListener("resize", onLayout);
    window.removeEventListener("scroll", onLayout);
    window.removeEventListener("fitline:updated", onLayout as EventListener);
  };
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

import gsap from "gsap";
import SplitType from "split-type";

/**
 * Mobile gravity-based variable weight controller.
 * - Active only under (max-width: 991px)
 * - Uses DeviceOrientation (beta/gamma) to derive a "down" vector in screen space
 * - Exponential smoothing (alpha ~ 0.15), updates grouped in rAF
 * - Maps projection of center→glyph vector along gravity to weight range (100..800)
 * - Animates CSS custom property --w via gsap.quickTo on [data-animate="font-weight"] .char
 * - Respects prefers-reduced-motion (reduces weight range)
 * - Recomputes layout on resize, scroll, and "fitline:updated"
 * - iOS permission flow with requestPermission() behind a tap button (removed after grant)
 * - Cleans up listeners when media query stops matching or on visibility hidden
 */
export default function setupGravity() {
  const mq = window.matchMedia("(max-width: 991px)");
  let cleanup: (() => void) | null = null;

  const handleChange = () => {
    if (mq.matches) {
      cleanup?.();
      cleanup = activate();
    } else {
      cleanup?.();
      cleanup = null;
    }
  };

  // Initial
  handleChange();
  // React to media query changes
  mq.addEventListener?.("change", handleChange);

  // Return a global cleanup (rarely used in SPA navigation)
  return () => {
    mq.removeEventListener?.("change", handleChange);
    cleanup?.();
    cleanup = null;
  };
}

function activate() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Gather roots and ensure we have .char on mobile.
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-animate="font-weight"]'));
  let chars = roots.flatMap((root) => Array.from(root.querySelectorAll<HTMLElement>(".char")));

  // If not split yet, split safely just on mobile (desktop hover script runs >=992px)
  if (chars.length === 0) {
    roots.forEach((root) => {
      // Guard: only split if still no .char inside this root
      if (!root.querySelector(".char")) {
        try {
          new SplitType(root, { types: "chars" });
        } catch {}
      }
    });
    // Recollect after splitting
    chars = roots.flatMap((root) => Array.from(root.querySelectorAll<HTMLElement>(".char")));
    // If still none, abort quietly
    if (chars.length === 0) {
      return () => {};
    }
  }

  // Quick controllers for CSS var --w
  const controllers = chars.map((el) =>
    gsap.quickTo(el, "--w", { duration: 0.35, ease: "power2.out" })
  );

  // Precompute glyph centers (viewport coordinates)
  let centers: Array<{ x: number; y: number }> = [];
  const computeLayout = () => {
    centers = chars.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    // Also keep viewport reference center
    viewportCenter.x = window.innerWidth / 2;
    viewportCenter.y = window.innerHeight / 2;
  };

  const viewportCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  // Gravity vector (screen space), smoothed
  const gTarget = { x: 0, y: 1 };
  const gSmooth = { x: 0, y: 1 };
  const alpha = 0.15;
  const SENSITIVITY = 4;

  // Weight range (reduced for PRM)
  const W_MIN = prefersReduced ? 300 : 100;
  const W_MAX = prefersReduced ? 600 : 800;

  // rAF coordination
  let rafId = 0;
  let needsUpdate = false;
  const requestTick = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(tick);
  };

  const tick = () => {
    rafId = 0;
    // Exponential smoothing
    gSmooth.x += alpha * (gTarget.x - gSmooth.x);
    gSmooth.y += alpha * (gTarget.y - gSmooth.y);
    // Normalize
    const glen = Math.hypot(gSmooth.x, gSmooth.y) || 1;
    const gx = gSmooth.x / glen;
    const gy = gSmooth.y / glen;

    // Radius for projection normalization: half of screen diagonal
    const R = Math.max(1, Math.hypot(window.innerWidth, window.innerHeight) / 2);

    for (let i = 0; i < chars.length; i++) {
      const c = centers[i];
      if (!c) continue;
      const dx = c.x - viewportCenter.x;
      const dy = c.y - viewportCenter.y;
      // Signed projection along gravity
      const proj = dx * gx + dy * gy;
      // Normalize to [-1, 1]
      let t = (proj / R) * SENSITIVITY;
      if (t > 1) t = 1;
      else if (t < -1) t = -1;
      // Map to [W_MIN, W_MAX]
      const w = W_MIN + ((t + 1) / 2) * (W_MAX - W_MIN);
      controllers[i](w);
    }

    if (needsUpdate) {
      needsUpdate = false;
      requestTick();
    }
  };

  // DeviceOrientation → update gTarget
  const toRad = Math.PI / 180;
  const handleOrientation = (e: DeviceOrientationEvent) => {
    // Use gamma (left-right) and beta (front-back), clamp for stability
    const gamma = clamp(e.gamma ?? 0, -90, 90); // x-axis tilt
    const beta = clamp(e.beta ?? 0, -90, 90); // y-axis tilt (clamped tighter)
    // Convert to screen-space vector (approx)
    const x = Math.sin(gamma * toRad);
    const y = Math.sin(beta * toRad);
    // Update target (normalize)
    const len = Math.hypot(x, y) || 1;
    gTarget.x = x / len;
    gTarget.y = y / len;

    needsUpdate = true;
    requestTick();
  };

  // Layout updates
  const onLayout = () => {
    computeLayout();
    needsUpdate = true;
    requestTick();
  };

  // Visibility
  const onVisibility = () => {
    if (document.hidden) {
      detachOrientation();
    } else {
      maybeAttachOrientation();
    }
  };

  // Attach basic layout listeners
  window.addEventListener("resize", onLayout);
  window.addEventListener("scroll", onLayout, { passive: true });
  window.addEventListener("fitline:updated", onLayout as EventListener);

  computeLayout();

  // iOS permission button logic
  let permissionButton: HTMLButtonElement | null = null;
  const isiOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1);

  const needPermission =
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof (DeviceOrientationEvent as any).requestPermission === "function" &&
    isiOS;

  const attachOrientation = () => {
    // Listen to both events (some browsers only fire one of them)
    window.addEventListener("deviceorientation", handleOrientation, true);
    window.addEventListener("deviceorientationabsolute" as any, handleOrientation as any, true);
    document.addEventListener("visibilitychange", onVisibility);
  };

  const detachOrientation = () => {
    window.removeEventListener("deviceorientation", handleOrientation, true);
    window.removeEventListener("deviceorientationabsolute" as any, handleOrientation as any, true);
    document.removeEventListener("visibilitychange", onVisibility);
  };

  const maybeAttachOrientation = () => {
    if (needPermission) {
      // Show button if not already present
      if (!permissionButton) {
        permissionButton = createPermissionButton();
        document.body.appendChild(permissionButton);
      }
    } else {
      attachOrientation();
    }
  };

  const askPermission = async () => {
    try {
      const res = await (DeviceOrientationEvent as any).requestPermission();
      if (res === "granted") {
        permissionButton?.remove();
        permissionButton = null;
        attachOrientation();
      }
    } catch {
      // ignore
    }
  };

  const createPermissionButton = () => {
    const btn = document.createElement("button");
    btn.textContent = "Enable Motion";
    btn.style.position = "fixed";
    (btn.style as any).inset = "auto 12px 12px auto";
    btn.style.zIndex = "9999";
    btn.style.padding = "10px 14px";
    btn.style.borderRadius = "9999px";
    btn.style.border = "1px solid rgba(255,255,255,0.2)";
    btn.style.background = "rgba(255,255,255,0.08)";
    btn.style.color = "#fff";
    (btn.style as any).backdropFilter = "blur(8px)";
    (btn.style as any).WebkitBackdropFilter = "blur(8px)";
    btn.style.fontSize = "14px";
    btn.style.cursor = "pointer";
    btn.addEventListener("click", askPermission, { once: true });
    return btn;
  };

  // Start
  maybeAttachOrientation();

  // Final cleanup when media query stops matching
  const cleanup = () => {
    detachOrientation();
    permissionButton?.remove();
    permissionButton = null;
    window.removeEventListener("resize", onLayout);
    window.removeEventListener("scroll", onLayout);
    window.removeEventListener("fitline:updated", onLayout as EventListener);
  };

  return cleanup;
}

function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v;
}

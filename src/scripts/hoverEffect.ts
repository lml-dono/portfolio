import gsap from "gsap";
import { splitChars } from "./utils/splitChars";

const MAX_DISTANCE = 300;
const MAX_WEIGHT = 800;
const MIN_WEIGHT = 100;

export default function setupVariableWeightHover(): void {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 992px)", () => {
    const roots = Array.from(
      document.querySelectorAll<HTMLElement>('[data-animate="font-weight"]')
    );

    roots.forEach((root) => splitChars(root));

    let ticking = false;
    const onMove = (e: MouseEvent) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const mouseX = e.pageX;
        const mouseY = e.pageY;

        roots.forEach((root) => {
          root.querySelectorAll<HTMLElement>(".char").forEach((char) => {
            const rect = char.getBoundingClientRect();
            const cx = rect.left + rect.width / 2 + window.scrollX;
            const cy = rect.top + rect.height / 2 + window.scrollY;
            const dist = Math.hypot(mouseX - cx, mouseY - cy);

            const w =
              dist < MAX_DISTANCE
                ? gsap.utils.mapRange(0, MAX_DISTANCE, MIN_WEIGHT, MAX_WEIGHT, Math.max(0, MAX_DISTANCE - dist))
                : MIN_WEIGHT;

            gsap.to(char, { fontWeight: w, duration: 0.5 });
          });
        });

        ticking = false;
      });
    };

    document.addEventListener("mousemove", onMove);

    return () => {
      document.removeEventListener("mousemove", onMove);
      roots.forEach((root) =>
        root.querySelectorAll<HTMLElement>(".char").forEach((c) => {
          gsap.set(c, { fontWeight: MIN_WEIGHT });
        })
      );
    };
  });
}

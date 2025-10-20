import gsap from "gsap";
import SplitType from "split-type";

const setupVariableWeightHover = () => {
  // GSAP matchMedia para activar solo en ≥992px
  const mm = gsap.matchMedia();

  mm.add("(min-width: 992px)", () => {
    const fontWeightItems = document.querySelectorAll<HTMLElement>('[data-animate="font-weight"]');

    const MAX_DISTANCE = 300;
    const MAX_FONT_WEIGHT = 800;
    const MIN_FONT_WEIGHT = 100;

    // Split a chars y prepara quickTo por caracter
    const controllers: Array<(v: number) => void> = [];

    fontWeightItems.forEach((item) => {
      const { chars } = new SplitType(item, { types: "chars" });

      chars?.forEach((char) => {
        // quickTo devuelve una función para animar esa prop eficientemente
        const q = gsap.quickTo(char as HTMLElement, "fontWeight", {
          duration: 0.5,
        });
        controllers.push(q);
      });
    });

    // Listener de mousemove (raf para suavizar)
    let ticking = false;
    const onMove = (e: MouseEvent) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const mouseX = e.pageX;
        const mouseY = e.pageY;

        fontWeightItems.forEach((item) => {
          item.querySelectorAll<HTMLElement>(".char").forEach((char) => {
            const rect = char.getBoundingClientRect();
            const cx = rect.left + rect.width / 2 + window.scrollX;
            const cy = rect.top + rect.height / 2 + window.scrollY;

            const dx = mouseX - cx;
            const dy = mouseY - cy;
            const distance = Math.hypot(dx, dy);

            const mapped =
              distance < MAX_DISTANCE
                ? gsap.utils.mapRange(
                    0,
                    MAX_DISTANCE,
                    MIN_FONT_WEIGHT,
                    MAX_FONT_WEIGHT,
                    Math.max(0, MAX_DISTANCE - distance)
                  )
                : MIN_FONT_WEIGHT;

            gsap.to(char, { fontWeight: mapped, duration: 0.5 });
          });
        });

        ticking = false;
      });
    };

    document.addEventListener("mousemove", onMove);

    // Limpieza cuando cambie el media query
    return () => {
      document.removeEventListener("mousemove", onMove);
      // Opcional: resetear peso si quieres
      fontWeightItems.forEach((item) =>
        item.querySelectorAll<HTMLElement>(".char").forEach((c) => {
          gsap.set(c, { fontWeight: MIN_FONT_WEIGHT });
        })
      );
    };
  });
};

export default setupVariableWeightHover;

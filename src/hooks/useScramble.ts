import { useEffect, useRef } from "react";
import gsap from "gsap";

const SCRAMBLE_CHARSET = "01#@&_-+=";
const STAGGER = 0.035;
const PER_CHAR_DURATION = 0.18;
const FRAMES_PER_CHAR = 6;

function randomGlyph(): string {
  return SCRAMBLE_CHARSET[Math.floor(Math.random() * SCRAMBLE_CHARSET.length)];
}

function setText(el: HTMLElement, text: string): HTMLSpanElement[] {
  el.replaceChildren();
  const fragment = document.createDocumentFragment();
  const chars: HTMLSpanElement[] = [];

  for (const char of text) {
    const span = document.createElement("span");
    span.setAttribute("data-theme-char", "");
    span.textContent = char === " " ? " " : char;
    fragment.appendChild(span);
    chars.push(span);
  }

  el.appendChild(fragment);
  return chars;
}

export function useScramble<T extends HTMLElement = HTMLElement>(
  targetText: string,
  trigger: number,
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const didMountRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!didMountRef.current) {
      didMountRef.current = true;
      setText(el, targetText);
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const chars = setText(el, targetText);

    if (reduceMotion || chars.length === 0) {
      return;
    }

    const targetChars = [...targetText];
    const tweens: gsap.core.Tween[] = [];

    chars.forEach((span, index) => {
      const finalChar = targetChars[index] ?? "";
      const display = finalChar === " " ? " " : finalChar;
      let lastFrame = -1;

      span.textContent = randomGlyph();

      const tween = gsap.to(span, {
        duration: PER_CHAR_DURATION,
        delay: index * STAGGER,
        ease: "none",
        onUpdate() {
          const progress = this.progress();
          const frame = Math.floor(progress * FRAMES_PER_CHAR);
          if (frame !== lastFrame) {
            lastFrame = frame;
            span.textContent = randomGlyph();
          }
        },
        onComplete() {
          span.textContent = display;
        },
      });

      tweens.push(tween);
    });

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, [targetText, trigger]);

  return ref;
}

// Reemplaza SplitType — no usar split-type (conflictos con ScrollTrigger pin)
export function splitChars(el: HTMLElement): HTMLElement[] {
  if (el.querySelector(".char")) {
    return Array.from(el.querySelectorAll<HTMLElement>(".char"));
  }
  const text = el.textContent ?? "";
  el.textContent = "";
  return [...text].map((ch) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = ch;
    el.appendChild(span);
    return span;
  });
}

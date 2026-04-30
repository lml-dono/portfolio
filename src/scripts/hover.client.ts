import setupVariableWeightHover from "./hoverEffect";

document.addEventListener("astro:page-load", () => {
  try { setupVariableWeightHover(); } catch {}
});

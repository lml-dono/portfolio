import setupGravity from "./gravity";

document.addEventListener("astro:page-load", () => {
  try { setupGravity(); } catch {}
});

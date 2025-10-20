import setupGravity from "./variable-weight-gravity";

const initGravity = () => {
  try {
    setupGravity();
  } catch {
    // no-op
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGravity, { once: true });
} else {
  initGravity();
}

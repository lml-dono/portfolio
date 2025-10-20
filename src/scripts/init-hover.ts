import setupVariableWeightHover from "./VariableFontEffect";

const init = () => {
  try {
    setupVariableWeightHover();
  } catch {
    // no-op
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

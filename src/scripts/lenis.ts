import Lenis from "lenis"

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

const _lenis = new Lenis({
  autoRaf: true,
  lerp: prefersReducedMotion ? 1 : 0.25,
  smoothWheel: !prefersReducedMotion,
  wheelMultiplier: 1,
  touchMultiplier: 2,
})

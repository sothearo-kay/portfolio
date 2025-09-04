import Lenis from "lenis"

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

const lenis = new Lenis({
  autoRaf: true,
  lerp: prefersReducedMotion ? 1 : 0.2,
  duration: prefersReducedMotion ? 0 : 0.6,
  easing: t => 1 - (1 - t) ** 3,
  touchMultiplier: 0,
})

document.addEventListener("astro:after-swap", () => {
  lenis.scrollTo(0, { immediate: true })
})

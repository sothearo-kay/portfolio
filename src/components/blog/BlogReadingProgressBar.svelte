<script>
  import { MediaQuery } from "svelte/reactivity"

  const desktop = new MediaQuery("(min-width: 1024px)")
  const SCROLL_BLUR_HEIGHT = 64

  let scrollProgress = $state(0)
  let bounds = $state(null)

  $effect(() => {
    if (!desktop.current) {
      scrollProgress = 0
      bounds = null
      return
    }

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress()
          ticking = false
        })
        ticking = true
      }
    }

    const handleResize = () => {
      bounds = calculateBounds()
      updateProgress()
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  })

  function calculateBounds() {
    const article = document.querySelector("article.post")
    if (!article)
      return null

    return {
      start: article.offsetTop,
      end: article.offsetTop + article.offsetHeight - window.innerHeight - SCROLL_BLUR_HEIGHT,
    }
  }

  function updateProgress() {
    if (!desktop.current)
      return

    bounds = bounds || calculateBounds()
    if (!bounds)
      return

    const scrollTop = window.pageYOffset

    if (scrollTop <= bounds.start) {
      scrollProgress = 0
    }
    else if (scrollTop >= bounds.end) {
      scrollProgress = 100
    }
    else {
      scrollProgress = Math.round(((scrollTop - bounds.start) / (bounds.end - bounds.start)) * 100)
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
</script>

{#if desktop.current}
  <div class="progress-container">
    <div
      class="progress-bar"
      class:visible={scrollProgress > 0}
      role="button"
      tabindex="0"
      aria-label="Scroll to top"
      onclick={scrollToTop}
      onkeydown={e => e.key === "Enter" && scrollToTop()}
    >
      <svg width="48" height="48">
        <circle
          class="bg"
          stroke="var(--color-border)"
          stroke-width="2"
          fill="transparent"
          r="20"
          cx="24"
          cy="24"
        />
        <circle
          class="progress"
          stroke="var(--color-progress)"
          stroke-width="2"
          fill="transparent"
          r="20"
          cx="24"
          cy="24"
          style="stroke-dasharray: {20 * 2 * Math.PI}; stroke-dashoffset: {20 * 2 * Math.PI * (1 - scrollProgress / 100)}"
        />
      </svg>

      <div class="percentage">
        {scrollProgress}%
      </div>

      <div class="tooltip top">
        Scroll to top
      </div>
    </div>
  </div>
{/if}

<style>
  .progress-container {
    --border-offset: calc(3px / 2); /* 2px app border + 1px progress border, divided by 2 */
    width: 100%;
    max-width: 56rem;
    position: fixed;
    bottom: 4rem;
    display: flex;
    justify-content: flex-end;
    pointer-events: none;
  }

  .progress-bar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--color-background);
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    pointer-events: auto;
    transform: translateX(calc(50% - var(--border-offset))) scale(0.8);
    transition: all 0.3s ease;
    z-index: 100;
    box-shadow: var(--shadow-header);

    &.visible {
      opacity: 1;
      transform: translateX(calc(50% - var(--border-offset))) scale(1);
    }

    &:hover {
      box-shadow: var(--shadow-card);

      .tooltip {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }

    .tooltip {
      opacity: 0;
      transform: translateX(-50%) translateY(10px);
      transition: opacity 0.2s ease, transform 0.2s ease;
    }

    svg {
      position: absolute;
      transform: rotate(-90deg);

      .bg {
        opacity: 0.2;
      }

      .progress {
        transition: stroke-dashoffset 0.1s ease;
      }
    }

    .percentage {
      font-size: 12px;
      font-weight: 500;
      font-family: var(--font-code);
      color: var(--color-foreground);
    }
  }
</style>

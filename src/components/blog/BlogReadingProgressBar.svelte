<script>
  import { MediaQuery } from "svelte/reactivity"

  let scrollProgress = $state(0)

  const largeScreen = new MediaQuery("(min-width: 1280px)")

  let article = $state(null)
  let ticking = $state(false)

  function updateProgress() {
    if (!largeScreen.current || ticking)
      return

    ticking = true
    requestAnimationFrame(() => {
      if (!article) {
        article = document.querySelector("article.post")
        if (!article) {
          ticking = false
          return
        }
      }

      const articleRect = article.getBoundingClientRect()
      const articleTop = articleRect.top + window.pageYOffset
      const articleHeight = article.offsetHeight
      const viewportHeight = window.innerHeight

      const scrollStart = articleTop
      const scrollEnd = articleTop + articleHeight - viewportHeight
      const currentScroll = window.pageYOffset

      if (currentScroll <= scrollStart) {
        scrollProgress = 0
      }
      else if (currentScroll >= scrollEnd) {
        scrollProgress = 100
      }
      else {
        const progress = ((currentScroll - scrollStart) / (scrollEnd - scrollStart)) * 100
        scrollProgress = Math.min(Math.max(progress, 0), 100)
      }

      ticking = false
    })
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  $effect(() => {
    if (!largeScreen.current)
      return

    window.addEventListener("scroll", updateProgress, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener("scroll", updateProgress)
    }
  })

  $effect(() => {
    if (largeScreen.current) {
      article = null
      updateProgress()
    }
    else {
      scrollProgress = 0
    }
  })
</script>

{#if largeScreen.current}
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
        {Math.round(scrollProgress)}%
      </div>

      <div class="tooltip right">
        Scroll to top
      </div>
    </div>
  </div>
{/if}

<style>
  .progress-container {
    --border-offset: calc(3px / 2); /* 2px app border + 1px progress border, divided by 2 */
    width: 100%;
    max-width: 58rem;
    position: fixed;
    bottom: 2rem;
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
        transform: translateY(-50%) translateX(0);
      }
    }

    .tooltip {
      opacity: 0;
      transform: translateY(-50%) translateX(-10px);
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

    @media (max-width: 768px) {
      display: none;
    }
  }
</style>

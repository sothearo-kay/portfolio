<script>
  import { onMount } from "svelte"

  let scrollProgress = $state(0)

  onMount(() => {
    function updateProgress() {
      const article = document.querySelector("article.post")
      if (!article)
        return

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
    }

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress)
    updateProgress()

    const progressBar = document.querySelector(".progress-bar")
    if (progressBar) {
      progressBar.addEventListener("click", scrollToTop)
    }

    return () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
      if (progressBar) {
        progressBar.removeEventListener("click", scrollToTop)
      }
    }
  })
</script>

<div
  class="progress-bar"
  class:visible={scrollProgress > 0}
  role="button"
  tabindex="0"
  aria-label="Scroll to top"
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

<style>
  .progress-bar {
    position: fixed;
    right: calc(50vw - 29rem - 2rem);
    bottom: 2rem;
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
    transform: scale(0.8);
    transition: all 0.3s ease;
    z-index: 100;
    box-shadow: var(--shadow-header);

    &.visible {
      opacity: 1;
      transform: scale(1);
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
      font-size: 10px;
      font-weight: 600;
      color: var(--color-foreground);
      font-family: var(--font-mono);
    }

    @media (max-width: 768px) {
      display: none;
    }
  }
</style>

<script lang="ts">
  import { onMount } from "svelte"

  let shortcut = $state("")

  onMount(() => {
    shortcut = navigator.userAgent.includes("Mac") ? "⌘K" : "⌃K"
  })

  function handleClick() {
    document.dispatchEvent(new CustomEvent("command-palette:open"))
  }

  function handleHover() {
    document.dispatchEvent(new CustomEvent("command-palette:preload"))
  }
</script>

<button class="search-button" onclick={handleClick} onmouseenter={handleHover} aria-label="Search">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m21 21-4.34-4.34" />
    <circle cx="11" cy="11" r="8" />
  </svg>
  <span class="shortcut">
    <span class="mobile">Search</span>
    <kbd class="desktop tag">{shortcut}</kbd>
  </span>
</button>

<style>
  .search-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.6rem;
    background-color: var(--color-background-secondary);
    border-radius: 999px;
    color: var(--color-accent-foreground);
    font-size: 14px;
    cursor: pointer;
    box-shadow: var(--shadow-inset);

    &:active {
      transform: scale(0.98);
    }

    .shortcut {
      display: flex;
      align-items: center;
      box-sizing: border-box;

      .mobile {
        font-size:  14px;
        font-family: var(--font-heading);
        color: var(--color-accent-foreground);
        min-width: 2.8rem;
        display: none;

        @media (max-width: 768px) {
          display: inline-block;
        }
      }

      .desktop {
        background: var(--color-background-interactive);
        width: 2rem;
        min-height: 1.375rem;
        display: inline-block;
        letter-spacing: 0.2em;

        @media (max-width: 768px) {
          display: none;
        }
      }
    }
  }
</style>

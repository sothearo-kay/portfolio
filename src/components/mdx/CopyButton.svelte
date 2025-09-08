<script>
  import { onMount } from "svelte"
  import { fly } from "svelte/transition"

  let { code = $bindable("") } = $props()

  let copied = $state(false)
  let button = $state()

  onMount(() => {
    // Auto-detect code content if not provided
    if (!code && button) {
      const codeElement = button.closest(".code-snippet")?.querySelector("pre code")
      if (codeElement) {
        code = codeElement.textContent || ""
      }
    }
  })

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(code)
      copied = true
      setTimeout(() => {
        copied = false
      }, 1500)
    }
    catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }
</script>

<button
  bind:this={button}
  class="copy-button"
  class:copied
  onclick={copyToClipboard}
  aria-label="Copy code to clipboard"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>

  {#if copied}
    <div class="tooltip left" transition:fly={{ y: 10, duration: 200 }}>
      Copied!
    </div>
  {/if}
</button>

<style>
  .copy-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    background-color: transparent;
    border: 1px solid var(--color-border);
    transform: scale(0.95);
    transform-origin: top right;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s ease;
    transition-property: opacity, background-color, transform;
    opacity: 0;

    &:hover {
      background-color: var(--color-accent);
    }

    @media (hover: none) {
      opacity: 1;
      transform: scale(1);
    }
  }

  :global(.code-snippet:hover) .copy-button,
  .copy-button.copied {
    opacity: 1;
    transform: scale(1);
  }
</style>

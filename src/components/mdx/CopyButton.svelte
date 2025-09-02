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
    <div class="tooltip" transition:fly={{ y: 10, duration: 200 }}>
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
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.15s ease-in-out;
    transition-property: background-color, color, opacity, border-color;
    opacity: 0;
  }

  :global(.code-snippet:hover) .copy-button,
  .copy-button.copied {
    opacity: 1;
    border-color: var(--color-border);
  }

  .copy-button:hover {
    background-color: var(--color-accent);
    color: var(--color-foreground);
  }

  .tooltip {
    position: absolute;
    top: 50%;
    right: calc(100% + 0.5rem);
    transform: translateY(-50%);
    background: var(--color-foreground);
    color: var(--color-background);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 12px;
    font-weight: 500;
    font-family: var(--font-code);
    white-space: nowrap;
    pointer-events: none;
  }

  .tooltip::after {
    content: '';
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 4px solid transparent;
    border-left-color: var(--color-foreground);
  }
</style>

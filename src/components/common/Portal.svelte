<script lang="ts">
  import type { Snippet } from "svelte"
  import { onDestroy, onMount } from "svelte"

  interface Props {
    target?: string | HTMLElement
    children: Snippet
  }

  const { target = "body", children }: Props = $props()

  let portalElement: HTMLElement | null = null

  onMount(() => {
    let targetElement: HTMLElement

    if (typeof target === "string") {
      targetElement = document.querySelector(target) || document.body
    }
    else {
      targetElement = target || document.body
    }

    targetElement.appendChild(portalElement!)
  })

  onDestroy(() => {
    portalElement?.remove()
  })
</script>

<div bind:this={portalElement} class="portal-container">
  {@render children()}
</div>

<style>
  :global(.portal-container) {
    position: fixed;
    inset: 0;
    z-index: 9999;
    transform: translate3d(0, 0, 0);
  }
</style>

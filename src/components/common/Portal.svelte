<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import type { Snippet } from 'svelte'

  interface Props {
    target?: string | HTMLElement
    children: Snippet
  }

  let { target = 'body', children }: Props = $props()

  let portalElement: HTMLElement | null = null

  onMount(() => {
    let targetElement: HTMLElement
    
    if (typeof target === 'string') {
      targetElement = document.querySelector(target) || document.body
    } else {
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
  .portal-container {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
  }

  .portal-container > :global(*) {
    pointer-events: auto;
  }
</style>

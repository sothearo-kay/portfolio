<script lang="ts">
  import type { Snippet } from "svelte"

  const { children }: { children: Snippet } = $props()
</script>

<div class="overlay">
  {@render children?.()}
</div>

<style>
  :global(.overlay) {
    position: fixed;
    inset: 0;
    z-index: 9999;
    transform: translate3d(0, 0, 0);
  }
</style>

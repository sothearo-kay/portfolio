<script lang="ts">
  import type { Post } from "~/utils/commands"
  import { onMount } from "svelte"
  import { MediaQuery } from "svelte/reactivity"
  import SearchIcon from "~/icons/search.svg?component"
  import { commandStore } from "~/stores/command.svelte"
  import { addBlogCommands, addNavCommands, addSocialCommands, addThemeCommands } from "~/utils/commands"

  interface Props {
    posts?: Post[]
  }

  const { posts = [] }: Props = $props()

  const mobile = new MediaQuery("(max-width: 768px)")
  const isMac = typeof navigator !== "undefined" ? navigator.userAgent.includes("Mac") : true

  let isDetecting = $state(true)

  const displayText = $derived(
    isDetecting ? "" : mobile.current ? "Search" : isMac ? "⌘K" : "⌃K",
  )

  onMount(() => {
    commandStore.clearCommands()

    addNavCommands()
    addBlogCommands(posts)
    addSocialCommands()
    addThemeCommands()

    isDetecting = false
  })

  function handleClick() {
    commandStore.show()
  }
</script>

<button class="search-button" onclick={handleClick} aria-label="Open search">
  <SearchIcon width="16" height="16" />
  <span class="shortcut">
    {#if displayText === "Search"}
      <span>{displayText}</span>
    {:else}
      <kbd class="tag">{displayText}</kbd>
    {/if}
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

      & kbd {
        background: var(--color-background-interactive);
        width: 2rem;
        min-height: 1.375rem;
        display: inline-block;

        @media (max-width: 768px) {
          width: 2.8rem;
        }
      }

      span {
        font: var(--font-sm);
        font-family: var(--font-heading);
        color: var(--color-accent-foreground);
        min-width: 2.8rem;
        display: inline-block;
      }
    }
  }
</style>

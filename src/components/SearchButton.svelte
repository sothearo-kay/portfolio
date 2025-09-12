<script lang="ts">
  import type { Post } from "~/utils/commands"
  import { onMount } from "svelte"
  import SearchIcon from "~/icons/search.svg?component"
  import { commandStore } from "~/stores/command.svelte"
  import { addBlogCommands, addNavCommands, addSocialCommands, addThemeCommands } from "~/utils/commands"

  const { posts = [] }: { posts?: Post[] } = $props()

  let shortcutText = $state("⌘K")

  onMount(() => {
    commandStore.clearCommands()

    addNavCommands()
    addBlogCommands(posts)
    addSocialCommands()
    addThemeCommands()

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const isMac = navigator.userAgent.includes("Mac")

    if (isMobile) {
      shortcutText = "Search"
    }
    else if (isMac) {
      shortcutText = "⌘K"
    }
    else {
      shortcutText = "⌃K"
    }
  })

  function handleClick() {
    commandStore.show()
  }
</script>

<button class="search-button" onclick={handleClick} aria-label="Open search">
  <SearchIcon width="16" height="16" />
  <span class="shortcut">
    {#if shortcutText === "Search"}
      <span>{shortcutText}</span>
    {:else}
      <kbd class="tag">{shortcutText}</kbd>
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
      & kbd {
        background: var(--color-background-interactive);
      }

      span {
        font: var(--font-sm);
        font-family: var(--font-heading);
        color: var(--color-accent-foreground);
      }
    }
  }
</style>

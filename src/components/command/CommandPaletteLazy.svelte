<script lang="ts">
  import type { Post } from "~/utils/commands"
  import { commandStore } from "~/stores/command.svelte"

  interface Props {
    posts: Post[]
  }

  const { posts }: Props = $props()

  let shouldLoad = $state(false)

  $effect(() => {
    const handleSearchClick = () => {
      shouldLoad = true
      commandStore.show()
    }

    const handleSearchHover = () => {
      shouldLoad = true
    }

    document.addEventListener("command-palette:open", handleSearchClick)
    document.addEventListener("command-palette:preload", handleSearchHover)

    return () => {
      document.removeEventListener("command-palette:open", handleSearchClick)
      document.removeEventListener("command-palette:preload", handleSearchHover)
    }
  })

  function handleGlobalKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault()
      shouldLoad = true
      commandStore.show()
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (shouldLoad && commandStore.isShown) {
      // Don't close if clicking on search button or inside the command palette
      const target = event.target as HTMLElement
      if (target.closest(".search-button") || target.closest(".palette .content")) {
        return
      }
      commandStore.hide()
    }
  }
</script>

<svelte:window onkeydown={handleGlobalKeydown} onclick={handleClickOutside} />

{#if shouldLoad}
  {#await import("./CommandPalette.svelte") then { default: CommandPalette }}
    <CommandPalette {posts} />
  {/await}
{/if}

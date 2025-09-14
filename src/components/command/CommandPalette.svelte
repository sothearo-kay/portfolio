<script lang="ts">
  import type { Command } from "~/stores/command.svelte"
  import type { Post } from "~/utils/commands"
  import { onMount, tick } from "svelte"
  import { quintOut } from "svelte/easing"
  import { MediaQuery } from "svelte/reactivity"
  import { fade, scale } from "svelte/transition"
  import SearchIcon from "~/icons/search.svg?component"
  import XIcon from "~/icons/x.svg?component"
  import { commandStore } from "~/stores/command.svelte"
  import { addBlogCommands, addNavCommands, addSocialCommands, addThemeCommands } from "~/utils/commands"
  import Portal from "../common/Portal.svelte"
  import CommandResults from "./CommandResults.svelte"

  interface Props {
    posts: Post[]
  }

  const { posts }: Props = $props()

  const mobile = new MediaQuery("(max-width: 768px)")

  // svelte-ignore non_reactive_update
  let overlayElement: HTMLDivElement, inputElement: HTMLInputElement, contentElement: HTMLDivElement
  let selectedIndex = $state(0)
  let isKeyboardMode = $state(false)

  let lastNavigationTime = 0

  const groupedCommands = $derived.by(() => {
    return commandStore.filteredCommands.reduce((acc, command) => {
      const group = command.group || "General"
      if (!acc[group])
        acc[group] = []
      acc[group].push(command)
      return acc
    }, {} as Record<string, Command[]>)
  })

  const flatCommands = $derived(Object.values(groupedCommands).flat())

  onMount(() => {
    if (commandStore.commands.length === 0) {
      addNavCommands()
      addBlogCommands(posts)
      addSocialCommands()
      addThemeCommands()
    }
  })

  $effect(() => {
    if (commandStore.isShown) {
      selectedIndex = 0
      // Wait for Portal mount and DOM updates
      tick().then(() => {
        if (inputElement) {
          inputElement.focus()
        }
      })
    }
    else if (!commandStore.isShown) {
      selectedIndex = 0
    }
  })

  $effect(() => {
    if (commandStore.isShown && selectedIndex >= 0) {
      const now = Date.now()
      const timeDiff = now - lastNavigationTime
      lastNavigationTime = now

      const selectedButton = contentElement?.querySelector(".cmd.active")
      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: timeDiff < 100 ? "instant" : "smooth",
          block: "nearest",
        })
      }
    }
  })

  function handleKeydown(event: KeyboardEvent) {
    if (!commandStore.isShown)
      return

    switch (event.key) {
      case "Escape":
        event.preventDefault()
        commandStore.hide()
        break
      case "ArrowDown":
        event.preventDefault()
        isKeyboardMode = true
        selectedIndex = Math.min(selectedIndex + 1, flatCommands.length - 1)
        break
      case "ArrowUp":
        event.preventDefault()
        isKeyboardMode = true
        selectedIndex = Math.max(selectedIndex - 1, 0)
        break
      case "Enter":
        event.preventDefault()
        executeCommand(flatCommands[selectedIndex])
        break
    }
  }

  function executeCommand(command: Command) {
    if (command.handler) {
      command.handler()
    }
    else if (command.to) {
      const link = document.createElement("a")
      link.href = command.to
      link.style.display = "none"
      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)
    }
    commandStore.hide()
  }

  function handleSelectIndex(index: number) {
    if (index === -1) {
      isKeyboardMode = false
    }
    else {
      selectedIndex = index
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (commandStore.isShown && contentElement && !contentElement.contains(event.target as Node)) {
      // Don't close if clicking on search button
      const target = event.target as HTMLElement
      if (target.closest(".search-button")) {
        return
      }
      commandStore.hide()
    }
  }

  function handleGlobalKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault()
      commandStore.show()
      return
    }

    handleKeydown(event)
  }
</script>

<svelte:window onkeydown={handleGlobalKeydown} onclick={handleClickOutside} />

{#if commandStore.isShown}
  <Portal>
    <div
      bind:this={overlayElement}
      class="palette"
      in:fade|global={{ duration: 300, easing: quintOut }}
      out:fade|global={{ duration: 300, easing: quintOut }}
    >
      <div
        bind:this={contentElement}
        class="content"
        in:scale|global={{ duration: 350, start: 0.95, easing: quintOut }}
        out:scale|global={{ duration: 300, start: 0.96, easing: quintOut }}
      >
        <div class="search">
          <SearchIcon width="20" height="20" />
          <input
            id="search"
            name="search"
            bind:this={inputElement}
            bind:value={commandStore.search}
            placeholder="Search for menu and commands..."
          />
          <button class="close" onclick={() => commandStore.hide()} aria-label="Close search">
            <XIcon width="16" height="16" />
          </button>
        </div>

        <CommandResults
          {groupedCommands}
          {selectedIndex}
          {isKeyboardMode}
          onSelectIndex={handleSelectIndex}
          onExecuteCommand={executeCommand}
        />

        {#if !mobile.current}
          <div class="footer">
            <span><kbd class="tag">↑</kbd><kbd class="tag">↓</kbd> to navigate</span>
            <span><kbd class="tag">↵</kbd> to select</span>
            <span><kbd class="tag">esc</kbd> to close</span>
          </div>
        {/if}
      </div>
    </div>
  </Portal>
{/if}

<style>
  .palette {
    position: fixed;
    inset: 0;
    background: var(--color-overlay);
    border: none;
    padding: 0;
    z-index: 9999;

    &::backdrop {
      background: var(--color-overlay);
    }
  }

  .content {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: min(640px, calc(100vw - 2 * var(--inline-spacing)));
    max-height: 60vh;
    background: var(--color-background-elevated);
    border: 1px solid var(--color-border-subtle);
    border-radius: 12px;
    box-shadow: var(--shadow-dialog);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .search {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--color-border-subtle);

    input {
      width: 100%;
      margin-inline: 0.5rem;
      border: none;
      background: transparent;
      color: var(--color-foreground);
      outline: none;

      &::placeholder {
        color: var(--color-accent-foreground);
      }
    }

    .close {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-accent-foreground);
      transition: color 0.15s ease;

      &:hover {
        color: var(--color-foreground);
      }
    }
  }

  .footer {
    border-top: 1px solid var(--color-border-subtle);
    padding: 1rem;
    background: var(--color-background-subtle);
    display: flex;
    gap: 1rem;
    font: var(--font-xs);
    color: var(--color-accent-foreground);

    & > span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
</style>

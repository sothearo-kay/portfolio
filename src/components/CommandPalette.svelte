<script lang="ts">
  import type { Command } from "~/stores/command.svelte"
  import { quintOut } from "svelte/easing"
  import { fade, scale } from "svelte/transition"
  import BookImageIcon from "~/icons/book-image.svg?component"
  import FileMinusIcon from "~/icons/file-minus.svg?component"
  import FolderOpenIcon from "~/icons/folder-open.svg?component"
  import MouseIcon from "~/icons/mouse.svg?component"
  import RssIcon from "~/icons/rss.svg?component"
  import SearchIcon from "~/icons/search.svg?component"
  import FacebookIcon from "~/icons/social/facebook.svg?component"
  import GitHubIcon from "~/icons/social/github.svg?component"
  import KhmerCoderIcon from "~/icons/social/khmercoder.svg?component"
  import LinkedInIcon from "~/icons/social/linkedin.svg?component"
  import MonitorIcon from "~/icons/theme/monitor.svg?component"
  import MoonIcon from "~/icons/theme/moon.svg?component"
  import SunIcon from "~/icons/theme/sun.svg?component"
  import XIcon from "~/icons/x.svg?component"
  import { commandStore } from "~/stores/command.svelte"
  import Portal from "./common/Portal.svelte"

  const icons = {
    "mouse": MouseIcon,
    "rss": RssIcon,
    "folder-open": FolderOpenIcon,
    "file-minus": FileMinusIcon,
    "book-image": BookImageIcon,
    "sun": SunIcon,
    "moon": MoonIcon,
    "monitor": MonitorIcon,
    "github": GitHubIcon,
    "linkedin": LinkedInIcon,
    "facebook": FacebookIcon,
    "khmercoder": KhmerCoderIcon,
  }

  // svelte-ignore non_reactive_update
  let overlayElement: HTMLDivElement, inputElement: HTMLInputElement, contentElement: HTMLDivElement
  let selectedIndex = $state(0)

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

  $effect(() => {
    if (commandStore.isShown && inputElement) {
      selectedIndex = 0
      inputElement.focus()
    }
    else if (!commandStore.isShown) {
      selectedIndex = 0
    }
  })

  $effect(() => {
    if (commandStore.isShown && selectedIndex >= 0) {
      const selectedButton = contentElement?.querySelector(".item.selected")
      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: "smooth",
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
        selectedIndex = Math.min(selectedIndex + 1, flatCommands.length - 1)
        break
      case "ArrowUp":
        event.preventDefault()
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

  function getTitle(command: Command) {
    return typeof command.title === "function" ? command.title() : command.title
  }

  function getIcon(command: Command) {
    const iconKey = typeof command.icon === "function" ? command.icon() : command.icon
    if (typeof iconKey === "string") {
      return icons[iconKey as keyof typeof icons] || iconKey
    }
    return iconKey || ""
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
      in:fade={{ duration: 300, easing: quintOut }}
      out:fade={{ duration: 250, easing: quintOut }}
    >
      <div
        bind:this={contentElement}
        class="content"
        in:scale={{ duration: 350, start: 0.95, easing: quintOut }}
        out:scale={{ duration: 250, start: 0.96, easing: quintOut }}
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

        <div class="results">
          {#each Object.entries(groupedCommands) as [groupName, commands], groupIndex}
            <section class="group">
              <h3>{groupName}</h3>
              <ul>
                {#each commands as command, commandIndex}
                  {@const flatIndex = Object.values(groupedCommands).slice(0, groupIndex).flat().length + commandIndex}
                  {@const Icon = getIcon(command)}
                  <li>
                    <button
                      class="cmd"
                      class:active={flatIndex === selectedIndex}
                      onclick={() => executeCommand(command)}
                      onmouseenter={() => selectedIndex = flatIndex}
                    >
                      {#if Icon}
                        <span class="icon">
                          {#if typeof Icon === "string"}
                            {Icon}
                          {:else}
                            <Icon width="16" height="16" />
                          {/if}
                        </span>
                      {/if}
                      <p>{getTitle(command)}</p>
                    </button>
                  </li>
                {/each}
              </ul>
            </section>
          {/each}

          {#if flatCommands.length === 0}
            <div class="empty">
              No commands found
            </div>
          {/if}
        </div>

        <div class="footer">
          <span><kbd class="tag">↑</kbd><kbd class="tag">↓</kbd> to navigate</span>
          <span><kbd class="tag">↵</kbd> to select</span>
          <span><kbd class="tag">esc</kbd> to close</span>
        </div>
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
    width: min(640px, calc(100vw - 2rem));
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
      font: var(--font-sm);
      width: 100%;
      margin-inline: 1rem;
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

  .results {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
    max-height: 400px;
  }

  .group {
    &:first-child {
      padding-block: 0;
    }

    &:not(:first-child) {
      border-top: 1px solid var(--color-border-subtle);
      padding-top: 0.5rem;
    }

    &:not(:last-child) {
      margin-bottom: 0.5rem;
    }

    h3 {
      font: var(--font-xs);
      color: var(--color-accent-foreground);
      text-transform: capitalize;
      letter-spacing: 0.05em;
      padding: 0.5rem 0.75rem 0.25rem;
      margin: 0;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  }

  .cmd {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    color: var(--color-foreground);
    background: transparent;
    border-radius: 10px;
    box-sizing: border-box;
    text-align: left;
    transition: background-color 0.15s ease;
    scroll-margin-block: 0.5rem;

    &.active {
      background: var(--color-background-hover);
    }

    .icon {
      font-size: 1.125rem;
      width: 1.25rem;
      height: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    p {
      font-family: var(--font-heading);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
      flex: 1;
      min-width: 0;
    }
  }

  .empty {
    text-align: center;
    padding: 2rem;
    color: var(--color-accent-foreground);
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

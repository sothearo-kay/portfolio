<script lang="ts">
  import type { Command } from "~/stores/command.svelte"
  import BookImageIcon from "~/icons/book-image.svg?component"
  import FileMinusIcon from "~/icons/file-minus.svg?component"
  import FolderOpenIcon from "~/icons/folder-open.svg?component"
  import MouseIcon from "~/icons/mouse.svg?component"
  import RssIcon from "~/icons/rss.svg?component"
  import FacebookIcon from "~/icons/social/facebook.svg?component"
  import GitHubIcon from "~/icons/social/github.svg?component"
  import KhmerCoderIcon from "~/icons/social/khmercoder.svg?component"
  import LinkedInIcon from "~/icons/social/linkedin.svg?component"
  import MonitorIcon from "~/icons/theme/monitor.svg?component"
  import MoonIcon from "~/icons/theme/moon.svg?component"
  import SunIcon from "~/icons/theme/sun.svg?component"

  interface Props {
    groupedCommands: Record<string, Command[]>
    selectedIndex: number
    isKeyboardMode: boolean
    onSelectIndex: (index: number) => void
    onExecuteCommand: (command: Command) => void
  }

  const { groupedCommands, selectedIndex, isKeyboardMode, onSelectIndex, onExecuteCommand }: Props = $props()

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

  const flatCommands = $derived(Object.values(groupedCommands).flat())

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
</script>

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
              onclick={() => onExecuteCommand(command)}
              onmousemove={() => {
                if (isKeyboardMode) {
                  onSelectIndex(-1) // Reset keyboard mode
                }
              }}
              onmouseenter={() => {
                if (!isKeyboardMode) {
                  onSelectIndex(flatIndex)
                }
              }}
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

<style>
  .results {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
    max-height: 400px;
  }

  .group {
    margin-block: 0;

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
      font-weight: 500;
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
</style>

<script>
  import { fly } from "svelte/transition"
  import Portal from "./Portal.svelte"

  let {
    value = $bindable(""),
    options = [],
    placeholder = "Select option",
    onchange = () => {},
  } = $props()

  let isOpen = $state(false)
  let selectButton = $state()

  function toggle() {
    isOpen = !isOpen
  }

  function selectOption(optionValue) {
    value = optionValue
    isOpen = false
    onchange(value)
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      isOpen = false
    }
  }

  function handleClickOutside(event) {
    if (selectButton && !selectButton.contains(event.target)) {
      isOpen = false
    }
  }

  const selectedOption = $derived(options.find(opt => opt.value === value))
</script>

<svelte:window onkeydown={handleKeydown} onclick={handleClickOutside} />

<div class="select">
  <button
    bind:this={selectButton}
    type="button"
    class="button"
    class:open={isOpen}
    onclick={toggle}
  >
    <span>{selectedOption?.label || placeholder}</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>

  {#if isOpen}
    <Portal>
      <div
        class="dropdown"
        style="
          position: absolute;
          top: {selectButton?.getBoundingClientRect().bottom + 4}px;
            left: {selectButton?.getBoundingClientRect().left}px;
            width: {selectButton?.offsetWidth}px;
        "
        transition:fly={{ y: -6, duration: 150 }}
      >
        {#each options as option}
          <button
            type="button"
            class="option"
            class:selected={option.value === value}
            onclick={() => selectOption(option.value)}
          >
            {option.label}
          </button>
        {/each}
      </div>
    </Portal>
  {/if}
</div>

<style>
.select {
  position: relative;
  display: inline-block;
}

.button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  color: var(--color-foreground-muted);
  font: var(--font-sm);
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-background-secondary);
  }

  svg {
    width: 1rem;
    height: 1rem;
    color: var(--color-foreground-muted);
    transition: transform 0.2s ease, color 0.2s ease;
  }

  &.open svg {
    transform: rotate(180deg);
    color: var(--color-accent-foreground);
  }
}

.dropdown {
  z-index: 50;
  background: var(--color-background-elevated);
  padding: 0.25rem;
  border: 1px solid var(--color-border-subtle);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px oklch(0% 0 0deg / 0.1);
  pointer-events: auto;
}

.option {
  display: flex;
  align-items: center;
  width: 100%;
  height: 2rem;
  padding-inline: 0.75rem;
  background: transparent;
  border: none;
  color: var(--color-foreground);
  font: var(--font-sm);
  border-radius: 0.25rem;
  margin-bottom: 0.125rem;
  box-sizing: border-box;
  transition: all 0.15s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: var(--color-background-secondary);
  }

  &.selected {
    background: var(--color-accent-foreground);
    color: var(--color-background);

    &:hover {
      background: var(--color-accent-foreground);
    }
  }
}
</style>

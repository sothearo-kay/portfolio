<script>
  import { fly } from "svelte/transition"
  import Portal from "../common/Portal.svelte"

  let postsContainer = $state()
  let selectButton = $state()
  let sortValue = $state("newest")
  let isOpen = $state(false)
  let dropdownPosition = $state({ top: 0, left: 0, width: 0 })

  const sortOptions = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
  ]

  const selectedOption = $derived(sortOptions.find(opt => opt.value === sortValue))

  $effect(() => {
    postsContainer = document.getElementById("posts-container")
    updateDropdownPosition()

    window.addEventListener("resize", updateDropdownPosition)

    return () => {
      window.removeEventListener("resize", updateDropdownPosition)
    }
  })

  function updateDropdownPosition() {
    if (selectButton) {
      let top = selectButton.offsetTop + selectButton.offsetHeight + 4
      let left = selectButton.offsetLeft

      let element = selectButton.offsetParent
      while (element) {
        top += element.offsetTop
        left += element.offsetLeft
        element = element.offsetParent
      }

      dropdownPosition = {
        top,
        left,
        width: selectButton.offsetWidth,
      }
    }
  }

  function toggle() {
    isOpen = !isOpen
  }

  function selectOption(optionValue) {
    sortValue = optionValue
    isOpen = false
    handleSortChange(optionValue)
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

  function handleSortChange(value) {
    if (!postsContainer)
      return

    const isOldest = value === "oldest"
    const allPosts = Array.from(postsContainer.querySelectorAll("li[data-date]"))

    allPosts.sort((a, b) => {
      const dateA = new Date(a.dataset.date || "").getTime()
      const dateB = new Date(b.dataset.date || "").getTime()
      return isOldest ? dateA - dateB : dateB - dateA
    })

    const postsByYear = allPosts.reduce((acc, post) => {
      const year = new Date(post.dataset.date || "").getFullYear()
      acc[year] ||= []
      acc[year].push(post)
      return acc
    }, {})

    const yearSections = Array.from(postsContainer.querySelectorAll(".year-section"))

    yearSections.forEach((section) => {
      const year = Number.parseInt(section.querySelector(".heading")?.textContent, 10)
      const postsList = section.querySelector(".posts")
      postsList.innerHTML = ""
      postsByYear[year]?.forEach(post => postsList.appendChild(post))
    })

    yearSections.sort((a, b) => {
      const yearA = Number.parseInt(a.querySelector(".heading")?.textContent, 10)
      const yearB = Number.parseInt(b.querySelector(".heading")?.textContent, 10)
      return isOldest ? yearA - yearB : yearB - yearA
    })

    yearSections.forEach(section => postsContainer.appendChild(section))
  }
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
    <span>{selectedOption?.label || "Select option"}</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>

  {#if isOpen}
    <Portal>
      <div
        class="dropdown"
        style="
          position: fixed;
          top: {dropdownPosition.top}px;
            left: {dropdownPosition.left}px;
            width: {dropdownPosition.width}px;
        "
        transition:fly|global={{ y: -6, duration: 150 }}
      >
        {#each sortOptions as option}
          <button
            type="button"
            class="option"
            class:selected={option.value === sortValue}
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
    padding: 0.375rem 0.75rem;
    box-shadow: var(--shadow-inset);
    transition: background-color 0.2s ease;
    user-select: none;
    -webkit-user-select: none;

    &:hover {
      background: var(--color-background-secondary);
    }

    &:active {
      transform: scale(0.98);
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
    background: var(--color-background-elevated);
    padding: 0.25rem;
    border: 1px solid var(--color-border-subtle);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px oklch(0% 0 0deg / 0.1);
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

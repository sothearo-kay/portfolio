<script>
  import Select from "../common/Select.svelte"

  let sortValue = $state("newest")
  let postsContainer = $state()

  $effect(() => {
    postsContainer = document.getElementById("posts-container")
  })

  const sortOptions = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
  ]

  function handleSortChange(value) {
    sortValue = value

    if (!postsContainer)
      return

    const posts = Array.from(postsContainer.children)
    const isOldest = value === "oldest"

    posts.sort((a, b) => {
      const dateA = new Date(a.dataset.date || "")
      const dateB = new Date(b.dataset.date || "")

      return isOldest
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime()
    })

    posts.forEach(post => postsContainer.appendChild(post))
  }
</script>

<div class="filter">
  <Select
    bind:value={sortValue}
    options={sortOptions}
    onchange={handleSortChange}
  />
</div>

<style>
.filter {
  display: flex;
  justify-content: flex-end;
  margin-block: 1rem;
}
</style>

type FilterType = "all" | "reading" | "finished"

class MangaFilter {
  private filterButtons: NodeListOf<HTMLButtonElement>
  private mangaItems: NodeListOf<HTMLElement>

  constructor() {
    this.filterButtons = document.querySelectorAll(".btn")
    this.mangaItems = document.querySelectorAll(".item")
    this.init()
  }

  private init() {
    this.filterButtons.forEach((button) => {
      button.addEventListener("click", this.handleFilterClick)
    })
  }

  private handleFilterClick = (event: Event) => {
    const button = event.target as HTMLButtonElement
    const filterType = button.getAttribute("data-filter") as FilterType

    if (filterType) {
      this.filterManga(filterType)
    }
  }

  private filterManga(filterType: FilterType) {
    if ("startViewTransition" in document) {
      document.startViewTransition(() => {
        this.applyFilter(filterType)
      })
    }
    else {
      this.applyFilter(filterType)
    }
  }

  private applyFilter(filterType: FilterType) {
    this.mangaItems.forEach((item) => {
      const status = item.getAttribute("data-status") as "reading" | "finished"
      const shouldShow = filterType === "all" || status === filterType
      item.style.display = shouldShow ? "block" : "none"
    })

    this.updateButtonStates(filterType)
  }

  private updateButtonStates(activeFilter: FilterType) {
    this.filterButtons.forEach((button) => {
      const isActive = button.getAttribute("data-filter") === activeFilter
      button.classList.toggle("active", isActive)
    })
  }
}

document.addEventListener("astro:page-load", () => {
  void new MangaFilter()
})

document.addEventListener("astro:before-preparation", () => {
  const mangaItems = document.querySelectorAll<HTMLElement>(".item")
  mangaItems.forEach((item) => {
    item.style.viewTransitionName = ""
  })
})

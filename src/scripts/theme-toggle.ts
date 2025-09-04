document.addEventListener("astro:page-load", () => {
  const themeToggle = document.getElementById("theme-toggle")
  const html = document.documentElement

  if (!themeToggle)
    return

  const isAppearanceTransition = typeof document !== "undefined"
    // @ts-expect-error: Transition API
    && document.startViewTransition
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches

  function applyTheme(isDark: boolean) {
    if (isDark) {
      html.removeAttribute("data-theme")
      localStorage.setItem("theme", "light")
      document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", "#ffffff")
    }
    else {
      html.setAttribute("data-theme", "dark")
      localStorage.setItem("theme", "dark")
      document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", "#1a1a1a")
    }
  }

  function toggleTheme(event: MouseEvent) {
    const isDark = html.getAttribute("data-theme") === "dark"

    if (!isAppearanceTransition || !event) {
      applyTheme(isDark)
      return
    }

    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )

    const transition = document.startViewTransition(() => {
      applyTheme(isDark)
    })

    // Animate the transition with a circular clip path
    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]

      html.animate(
        {
          clipPath,
        },
        {
          duration: 400,
          easing: "ease-in",
          pseudoElement: "::view-transition-new(root)",
        },
      )
    })
  }

  themeToggle.addEventListener("click", toggleTheme)
})

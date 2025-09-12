import type { Command } from "../stores/command.svelte"
import { commandStore } from "../stores/command.svelte"

export function addNavCommands() {
  const commands: Command[] = [
    {
      id: "nav-home",
      title: "Home",
      to: "/",
      icon: "mouse",
      group: "Menu",
    },
    {
      id: "nav-blog",
      title: "Blog",
      to: "/blog",
      icon: "rss",
      group: "Menu",
    },
    {
      id: "nav-projects",
      title: "Projects",
      to: "/projects",
      icon: "folder-open",
      group: "Menu",
    },
    {
      id: "nav-manga",
      title: "Manga",
      to: "/manga",
      icon: "book-image",
      group: "Menu",
    },
  ]

  commandStore.addCommands(...commands)
}

export interface Post {
  id: string
  title: string
}

export function addBlogCommands(posts: Post[]) {
  const commands: Command[] = posts.slice(0, 10).map(post => ({
    id: `blog-${post.id}`,
    title: post.title,
    to: `/blog/${post.id}`,
    icon: "file-minus",
    group: "Blog",
  }))

  commandStore.addCommands(...commands)
}

export function addThemeCommands() {
  const commands: Command[] = [
    {
      id: "theme-light",
      title: "Light",
      icon: "sun",
      group: "Theme",
      handler: () => {
        localStorage.setItem("theme", "light")
        document.documentElement.removeAttribute("data-theme")
      },
    },
    {
      id: "theme-dark",
      title: "Dark",
      icon: "moon",
      group: "Theme",
      handler: () => {
        localStorage.setItem("theme", "dark")
        document.documentElement.setAttribute("data-theme", "dark")
      },
    },
    {
      id: "theme-auto",
      title: "System",
      icon: "monitor",
      group: "Theme",
      handler: () => {
        localStorage.removeItem("theme")
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        if (prefersDark) {
          document.documentElement.setAttribute("data-theme", "dark")
        }
        else {
          document.documentElement.removeAttribute("data-theme")
        }
      },
    },
  ]

  commandStore.addCommands(...commands)
}

export function addSocialCommands() {
  const commands: Command[] = [
    {
      id: "social-github",
      title: "GitHub",
      icon: "github",
      group: "Social Links",
      handler: () => window.open("https://github.com/sothearo-kay", "_blank"),
    },
    {
      id: "social-khmercoder",
      title: "KhmerCoder",
      icon: "khmercoder",
      group: "Social Links",
      handler: () => window.open("https://khmercoder.com/@sothearo", "_blank"),
    },
    {
      id: "social-linkedin",
      title: "LinkedIn",
      icon: "linkedin",
      group: "Social Links",
      handler: () => window.open("https://www.linkedin.com/in/kaysothearo19/", "_blank"),
    },
    {
      id: "social-facebook",
      title: "Facebook",
      icon: "facebook",
      group: "Social Links",
      handler: () => window.open("https://www.facebook.com/sothearo19/", "_blank"),
    },
  ]

  commandStore.addCommands(...commands)
}

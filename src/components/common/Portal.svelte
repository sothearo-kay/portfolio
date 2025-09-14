<script lang="ts">
  import type { Snippet } from "svelte"
  import { mount, unmount } from "svelte"
  import Overlay from "./Overlay.svelte"

  interface Props {
    children: Snippet
    target?: string | HTMLElement
    disabled?: boolean
  }

  const { children, target = "body", disabled = false }: Props = $props()

  let app: Record<string, unknown>
  let element: Element | null

  $effect(() => {
    if (disabled) {
      return
    }

    if (typeof target === "string") {
      element = document.querySelector(target)
    }
    else {
      element = target
    }

    if (element) {
      document.body.style.overflow = "hidden"

      app = mount(Overlay, {
        target: element,
        props: {
          children,
        },
      })

      return () => {
        document.body.style.overflow = ""
        if (app) {
          unmount(app, { outro: true })
        }
      }
    }
  })
</script>

{#if disabled}
  {@render children()}
{/if}

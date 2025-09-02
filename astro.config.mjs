// @ts-check
import svelte from "@astrojs/svelte"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  site: "https://sothearo.dev",

  markdown: {
    shikiConfig: {
      themes: {
        light: "vitesse-light",
        dark: "vitesse-dark",
      },
    },
  },

  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mangadex.org",
        pathname: "/covers/**",
      },
    ],
  },

  integrations: [svelte()],
})

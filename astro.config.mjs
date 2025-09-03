// @ts-check
import mdx from "@astrojs/mdx"
import svelte from "@astrojs/svelte"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  site: "https://sothearo.dev",

  prefetch: {
    defaultStrategy: "viewport",
    prefetchAll: true,
  },

  build: {
    inlineStylesheets: "always",
  },

  experimental: {
    clientPrerender: true,
  },

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

  integrations: [
    svelte(),
    mdx(),
  ],
})

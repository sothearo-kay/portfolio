// @ts-check
import mdx from "@astrojs/mdx"
import svelte from "@astrojs/svelte"
import compress from "@playform/compress"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  site: "https://sothearo.dev",

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  build: {
    inlineStylesheets: "always",
    format: "file",
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["astro", "svelte"],
          },
        },
      },
    },
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
    compress({
      JavaScript: false,
      Image: false,
      HTML: true,
      CSS: false,
      SVG: true,
    }),
  ],
})

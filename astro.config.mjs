// @ts-check
import mdx from "@astrojs/mdx"
import svelte from "@astrojs/svelte"
import vercel from "@astrojs/vercel"
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers"
import { defineConfig } from "astro/config"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import { remarkReadingTime } from "./src/plugins/index.mjs"

// https://astro.build/config
export default defineConfig({
  site: "https://sothearo.dev",

  prefetch: {
    defaultStrategy: "viewport",
    prefetchAll: true,
  },

  build: {
    inlineStylesheets: "auto",
    format: "file",
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
      transformers: [
        transformerNotationHighlight(),
        transformerNotationFocus(),
        transformerNotationDiff(),
      ],
    },
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append" }],
    ],
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

  output: "static",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
})

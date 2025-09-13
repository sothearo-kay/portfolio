// @ts-check
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import svelte from "@astrojs/svelte"
import vercel from "@astrojs/vercel"
import svg from "@poppanator/sveltekit-svg"
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers"
import { defineConfig } from "astro/config"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeKatex from "rehype-katex"
import rehypeSlug from "rehype-slug"
import remarkMath from "remark-math"
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
    remarkPlugins: [remarkMath, remarkReadingTime],
    rehypePlugins: [
      rehypeKatex,
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
    mdx(),
    svelte(),
    sitemap(),
  ],

  vite: {
    plugins: [
      svg({
        svgoOptions: {
          multipass: true,
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  cleanupIds: false,
                },
              },
            },
          ],
        },
      }),
    ],
  },

  output: "static",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
})

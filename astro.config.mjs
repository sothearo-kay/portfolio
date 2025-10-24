// @ts-check
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import svelte from "@astrojs/svelte"
import vercel from "@astrojs/vercel"
import compress from "@playform/compress"
import svg from "@poppanator/sveltekit-svg"
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers"
import { defineConfig } from "astro/config"
import browserslist from "browserslist"
import { browserslistToTargets, Features } from "lightningcss"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeKatex from "rehype-katex"
import rehypeSlug from "rehype-slug"
import remarkMath from "remark-math"
import Sonda from "sonda/astro"
import { site } from "./src/constants"
import { remarkReadingTime } from "./src/plugins/index.mjs"

const isDev = process.env.NODE_ENV === "development"

// https://astro.build/config
export default defineConfig({
  site,

  prefetch: {
    defaultStrategy: "viewport",
    prefetchAll: true,
  },

  build: {
    inlineStylesheets: "always",
    format: "file",
  },

  experimental: {
    clientPrerender: true,
    fonts: [
      {
        provider: "local",
        name: "M PLUS Rounded 1c",
        cssVariable: "--font-heading",
        fallbacks: ["M PLUS Rounded 1c override", "system-ui", "sans-serif"],
        variants: [
          {
            weight: 500,
            style: "normal",
            src: ["./src/assets/fonts/MPLUSRounded1c-Medium.woff2"],
          },
          {
            weight: 700,
            style: "normal",
            src: ["./src/assets/fonts/MPLUSRounded1c-Bold.woff2"],
          },
        ],
      },
      {
        provider: "local",
        name: "Open Sans",
        cssVariable: "--font-body",
        fallbacks: ["Open Sans override", "system-ui", "sans-serif"],
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/OpenSans-Regular.woff2"],
          },
          {
            weight: 500,
            style: "normal",
            src: ["./src/assets/fonts/OpenSans-Medium.woff2"],
          },
        ],
      },
      {
        provider: "local",
        name: "JetBrains Mono",
        cssVariable: "--font-code",
        fallbacks: ["JetBrains Mono override", "monospace"],
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/JetBrainsMono-Regular.woff2"],
          },
        ],
      },
    ],
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
      {
        protocol: "https",
        hostname: "assets.sothearo.dev",
        pathname: "/images/**",
      },
    ],
  },

  integrations: [
    mdx(),
    svelte(),
    sitemap(),
    compress({
      CSS: false,
      HTML: true,
      Image: false,
      JavaScript: false,
      SVG: true,
    }),
    isDev && Sonda(),
  ].filter(Boolean),

  vite: {
    build: {
      sourcemap: isDev,
    },
    css: {
      lightningcss: {
        targets: browserslistToTargets(
          browserslist.loadConfig({ path: "." }) ?? [...browserslist.defaults],
        ),
        include: Features.Nesting,
      },
      transformer: "lightningcss",
    },
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
  adapter: vercel(),
})

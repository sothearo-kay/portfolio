import antfu from "@antfu/eslint-config"

export default antfu({
  astro: true,
  typescript: true,
  formatters: true,

  stylistic: {
    indent: 2,
    quotes: "double",
  },

  ignores: [
    "dist",
    ".astro",
    "node_modules",
    "*.min.*",
    "CHANGELOG.md",
    "LICENSE*",
    "public",
  ],
}, {
  files: ["**/*.astro"],
  rules: {
    "style/indent": ["error", 2],
    "style/quotes": ["error", "double"],
    "style/semi": ["error", "never"],
  },
})

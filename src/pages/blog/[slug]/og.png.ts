import type { APIRoute } from "astro"
import { Buffer } from "node:buffer"
import { readFile } from "node:fs/promises"
import { ImageResponse } from "@vercel/og"
import { getCollection, getEntry, render } from "astro:content"
import { colors, siteName } from "~/constants"

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

  if (resource) {
    const response = await fetch(resource[1])
    if (response.status === 200) {
      return await response.arrayBuffer()
    }
  }

  throw new Error("failed to load font data")
}

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params

  if (!slug) {
    return new Response("Not found", { status: 404 })
  }

  try {
    const entry = await getEntry("blog", slug)

    if (!entry) {
      return new Response("Not found", { status: 404 })
    }

    const { remarkPluginFrontmatter } = await render(entry)
    const { title, description, publishedAt, tags } = entry.data
    const readingTime = remarkPluginFrontmatter.minutesRead
    const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

    const [mPlusFont, openSansFont, logoSvg] = await Promise.all([
      loadGoogleFont("M+PLUS+Rounded+1c:wght@700", `${siteName} ${title}`),
      loadGoogleFont("Open+Sans:wght@400", `${description} ${formattedDate} ${readingTime || ""} ${tags?.join(" ") || ""}`),
      readFile("src/icons/monkey-illustration.svg", "utf-8"),
    ])

    const logoDataUrl = `data:image/svg+xml;base64,${Buffer.from(
      logoSvg
        .replace(/var\(--color-foreground, #171717\)/g, colors.foreground)
        .replace(/var\(--color-accent, #FFB800\)/g, colors.accent)
        .replace(/var\(--color-accent, #FF7F0A\)/g, colors.accent),
    ).toString("base64")}`

    const html = {
      props: {
        children: [
          {
            props: {
              style: {
                position: "absolute",
                top: "40px",
                left: 0,
                right: 0,
                height: "1px",
                backgroundColor: "#e5e7eb",
              },
            },
            type: "div",
          },
          {
            props: {
              children: [
                {
                  props: {
                    children: [
                      {
                        props: {
                          src: logoDataUrl,
                          style: {
                            width: "100px",
                            height: "100px",
                            marginRight: "16px",
                          },
                        },
                        type: "img",
                      },
                      {
                        props: {
                          children: siteName,
                          style: {
                            color: "#111827",
                            fontSize: 40,
                            fontWeight: 700,
                            fontFamily: "M PLUS Rounded 1c",
                          },
                        },
                        type: "div",
                      },
                    ],
                    style: {
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "24px",
                    },
                  },
                  type: "div",
                },
                {
                  props: {
                    children: title,
                    style: {
                      fontSize: 64,
                      fontWeight: 700,
                      color: "#111827",
                      lineHeight: 1.1,
                      marginBottom: "24px",
                      fontFamily: "M PLUS Rounded 1c",
                    },
                  },
                  type: "div",
                },
                {
                  props: {
                    children: description,
                    style: {
                      fontSize: 28,
                      color: "#6b7280",
                      lineHeight: 1.4,
                      fontFamily: "Open Sans",
                    },
                  },
                  type: "div",
                },
              ],
              style: {
                marginLeft: "40px",
                marginRight: "40px",
                paddingLeft: "40px",
                paddingRight: "40px",
                borderLeft: "1px solid #e5e7eb",
                borderRight: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                justifyContent: "center",
              },
            },
            type: "div",
          },
          {
            props: {
              children: [
                {
                  props: {
                    children: [
                      {
                        props: {
                          children: formattedDate,
                          style: {
                            fontSize: 20,
                            color: "#6b7280",
                            fontFamily: "Open Sans",
                          },
                        },
                        type: "div",
                      },
                      ...(readingTime
                        ? [{
                            props: {
                              children: "•",
                              style: {
                                fontSize: 20,
                                color: "#6b7280",
                                fontFamily: "Open Sans",
                                margin: "0 12px",
                              },
                            },
                            type: "div",
                          }, {
                            props: {
                              children: readingTime,
                              style: {
                                fontSize: 20,
                                color: "#6b7280",
                                fontFamily: "Open Sans",
                              },
                            },
                            type: "div",
                          }]
                        : []),
                    ],
                    style: {
                      display: "flex",
                      alignItems: "center",
                    },
                  },
                  type: "div",
                },
                {
                  props: {
                    children: tags?.slice(0, 3).map((tag: string) => ({
                      props: {
                        children: tag,
                        style: {
                          fontSize: 20,
                          fontWeight: 500,
                          color: "#6b7280",
                          backgroundColor: "#f3f4f6",
                          border: "1px solid #e5e7eb",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontFamily: "Open Sans",
                        },
                      },
                      type: "div",
                    })) || [],
                    style: {
                      display: "flex",
                      gap: "8px",
                    },
                  },
                  type: "div",
                },
              ],
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "20px 40px",
                borderTop: "1px solid #e5e7eb",
              },
            },
            type: "div",
          },
        ],
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          paddingBlock: "40px",
          position: "relative",
          boxSizing: "border-box",
        },
      },
      type: "div",
    }

    return new ImageResponse(html, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "M PLUS Rounded 1c",
          data: mPlusFont,
          style: "normal",
        },
        {
          name: "Open Sans",
          data: openSansFont,
          style: "normal",
        },
      ],
    })
  }
  catch {
    return new Response("Error generating image", { status: 500 })
  }
}

export async function getStaticPaths() {
  const posts = await getCollection("blog")

  return posts.map(post => ({
    params: { slug: post.id },
  }))
}

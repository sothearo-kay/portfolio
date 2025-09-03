import type { APIRoute } from "astro"
import { ImageResponse } from "@vercel/og"
import { getCollection, getEntry } from "astro:content"

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

    const { title, description } = entry.data

    const html = {
      props: {
        children: [
          {
            props: {
              children: "BLOG POST",
              style: {
                fontSize: 20,
                color: "#6366f1",
                fontWeight: 600,
                marginBottom: "20px",
              },
            },
            type: "div",
          },
          {
            props: {
              children: title,
              style: {
                fontSize: 50,
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.2,
                marginBottom: "30px",
                maxWidth: "90%",
              },
            },
            type: "div",
          },
          {
            props: {
              children: description,
              style: {
                fontSize: 24,
                color: "#a0a0a0",
                lineHeight: 1.4,
                maxWidth: "80%",
              },
            },
            type: "div",
          },
          {
            props: {
              children: "sothearo.dev",
              style: {
                position: "absolute",
                bottom: "80px",
                right: "80px",
                fontSize: 24,
                color: "#6366f1",
                fontWeight: 600,
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
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#0f0f23",
          padding: "80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        },
      },
      type: "div",
    }

    return new ImageResponse(html, {
      width: 1200,
      height: 630,
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

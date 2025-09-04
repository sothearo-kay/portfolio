import type { APIRoute } from "astro"
import rss from "@astrojs/rss"
import { siteName } from "~/constants"
import { getPosts } from "~/utils/blog"

export const GET: APIRoute = async (context) => {
  const posts = await getPosts()

  return rss({
    title: siteName,
    description: "Personal blog about web development, programming, and technology",
    site: context.site!,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  })
}

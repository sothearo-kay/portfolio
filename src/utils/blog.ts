import { getCollection } from "astro:content"

export async function getPosts() {
  const blogPosts = await getCollection("blog", ({ data }) => !data.draft)
  return blogPosts.sort(
    (a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime(),
  )
}

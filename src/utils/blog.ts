import { getCollection, render } from "astro:content"

export async function getPosts() {
  const blogPosts = await getCollection("blog", ({ data }) => !data.draft)
  return blogPosts.sort(
    (a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime(),
  )
}

export async function getPostsWithReadingTime() {
  const posts = await getPosts()
  
  return Promise.all(
    posts.map(async (post) => {
      const { remarkPluginFrontmatter } = await render(post)
      return {
        ...post,
        readingTime: remarkPluginFrontmatter.minutesRead
      }
    })
  )
}

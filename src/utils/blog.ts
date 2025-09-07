import { getCollection, render } from "astro:content"

export async function getPosts() {
  const blogPosts = await getCollection("blog", ({ data }) => !data.draft)
  return blogPosts.sort(
    (a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime(),
  )
}

export async function getTags() {
  const posts = await getPosts()
  const allTags = new Set<string>()

  posts.forEach((post) => {
    post.data.tags.forEach((tag: string) => allTags.add(tag))
  })

  return {
    tags: [...allTags],
    posts,
  }
}

export async function getPostsWithReadingTime() {
  const posts = await getPosts()

  return Promise.all(
    posts.map(async (post) => {
      const { remarkPluginFrontmatter } = await render(post)
      return {
        ...post,
        readingTime: remarkPluginFrontmatter.minutesRead as string,
      }
    }),
  )
}

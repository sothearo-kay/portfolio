import { Buffer } from "node:buffer"
import sharp from "sharp"
import { rgbaToThumbHash, thumbHashToDataURL } from "thumbhash"

const isDev = process.env.NODE_ENV === "development"
const cache = new Map<string, string>()

export async function getThumbHash(imageUrl: string): Promise<string> {
  if (isDev && cache.has(imageUrl)) {
    return cache.get(imageUrl)!
  }

  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const buffer = await response.arrayBuffer()

    const image = sharp(Buffer.from(buffer))
      .resize(100, 100, { fit: "inside" })

    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const hash = rgbaToThumbHash(info.width, info.height, data)
    const thumbHashDataURL = thumbHashToDataURL(hash)

    if (isDev) {
      cache.set(imageUrl, thumbHashDataURL)
    }

    return thumbHashDataURL
  }
  catch (error) {
    console.error("Error generating ThumbHash:", error)
    const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23cccccc'/%3E%3C/svg%3E"
    if (isDev) {
      cache.set(imageUrl, fallback)
    }
    return fallback
  }
}

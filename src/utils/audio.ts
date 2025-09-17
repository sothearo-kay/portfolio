class AudioManager {
  private audios = new Map<string, HTMLAudioElement>()
  private initialized = false

  init(src: string, volume = 0.3) {
    if (!this.audios.has(src)) {
      const audio = new Audio(src)
      audio.volume = volume
      audio.preload = "auto"
      audio.load()
      this.audios.set(src, audio)
    }
  }

  async play(src: string) {
    if (!this.audios.has(src))
      this.init(src)

    const audio = this.audios.get(src)!

    if (audio.readyState < 2) {
      await new Promise((resolve) => {
        audio.addEventListener("canplaythrough", resolve, { once: true })
      })
    }

    audio.currentTime = 0

    try {
      await audio.play()
    }
    catch (err) {
      console.error("Audio play error:", err)
      if (!this.initialized) {
        document.addEventListener("click", () => {
          this.initialized = true
          audio.play().catch(console.error)
        }, { once: true })
      }
    }
  }
}

export const audioManager = new AudioManager()

export interface Project {
  title: string
  description: string
  previewUrl?: string
  githubUrl?: string
}

export const projectList: Project[] = [
  {
    title: "Quickkeys",
    description: "A minimalist typing speed test application with real-time performance metrics and user tracking capabilities.",
    previewUrl: "https://wpm.sothearo.dev",
    githubUrl: "https://github.com/sothearo-kay/quickkeys",
  },
]

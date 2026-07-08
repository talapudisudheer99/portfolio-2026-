import type { ProjectActions, SectionContent } from "@/types"

export const sections: SectionContent = {
  about: {
    title: "About",
    description: "From business foundations to production frontend engineering.",
  },
  skills: {
    title: "Skills",
    description: "Technologies and practices I use to ship reliable interfaces.",
  },
  experience: {
    title: "Experience",
    description: "Roles where I grew from fundamentals to enterprise frontend work.",
  },
  projects: {
    title: "Projects",
    description: "Selected work focused on architecture, scale, and user experience.",
  },
  contact: {
    title: "Contact",
    description: "Open to frontend engineering opportunities — let's connect.",
  },
}

export const projectActions: ProjectActions = {
  liveDemo: "Live Demo",
  github: "GitHub",
}

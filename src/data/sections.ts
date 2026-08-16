import type { ProjectActions, SectionContent } from "@/types"

export const sections: SectionContent = {
  about: {
    title: "A wider lens",
    description:
      "Business foundations, production frontend work, and the curiosity to own the system behind the screen.",
  },
  skills: {
    title: "Capabilities",
    description:
      "Grouped by how products actually ship — UI, data, realtime, auth, AI, and ops.",
  },
  experience: {
    title: "Selected experience",
    description:
      "Independent product ownership alongside production frontend roles.",
  },
  projects: {
    title: "One product, end to end",
    description:
      "Sameward is where interface craft, systems thinking, and shipping discipline meet.",
  },
  contact: {
    title: "Let’s build something clear",
    description:
      "Open to frontend engineering opportunities with ambitious product teams.",
  },
}

export const projectActions: ProjectActions = {
  liveDemo: "Visit Sameward",
  github: "GitHub",
}

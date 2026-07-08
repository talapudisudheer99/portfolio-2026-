import type { Project } from "@/types"

export const projects: Project[] = [
  {
    id: "enterprise-platform",
    title: "Enterprise Web Platform",
    description:
      "Frontend engineering for a large-scale enterprise platform under active development, featuring dual Next.js applications, GraphQL data layers, and real-time UI updates.",
    stack: [
      "Next.js",
      "TypeScript",
      "GraphQL",
      "RTK Query",
      "WebSocket",
      "Tailwind CSS",
    ],
  },
  {
    id: "mern-ecommerce",
    title: "MERN E-Commerce Capstone",
    description:
      "Full-stack e-commerce application with product catalog, cart management, and checkout flows built as a capstone project to demonstrate end-to-end web development.",
    stack: ["React", "Node.js", "Express", "MongoDB", "REST API"],
    githubUrl: "https://github.com/talapudisudheer99",
  },
]

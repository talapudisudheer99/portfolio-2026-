import type { Project } from "@/types"

export const projects: Project[] = [
  {
    id: "sameward",
    title: "Sameward",
    featured: true,
    subtitle: "One workspace for teams to talk, share files and get AI help",
    description:
      "Sameward brings team channels, direct messages, file sharing and AI help into one workspace. I built and launched the full product on my own; it is live at sameward.com.",
  problem:
    "Teams often switch between chat, files, and AI tools. Each switch loses context. Sameward keeps the conversation, files, and AI help together in one workspace.",
  problemLines: [
    "Teams often switch between chat, files, and AI tools.",
    "Each switch loses context.",
    "Sameward keeps the conversation, files, and AI help together in one workspace.",
  ],
  approachHeadline: "Three moves to keep one workspace fast.",
  approachLead: "How context loss shaped the architecture.",
  approachSteps: [
    {
      title: "Split realtime out",
      detail: "A standalone Socket.IO service only broadcasts. It never writes, so live updates stay fast without a second source of truth",
    },
    {
      title: "One API for every write",
      detail: "Next.js Route Handlers validate with Zod, check workspace roles, save to MongoDB, then tell the socket service what to broadcast",
    },
    {
      title: "Ground AI in context",
      detail: "Channel AI reads the channel history and safely fetched links. It drafts replies; the user decides what to send",
    },
  ],
    liveUrl: "https://sameward.com/",
    decisions: [
      "Ran broadcasting as its own Socket.IO service while the REST API stays the source of truth for every message",
      "Built Channel AI to answer from channel context and links fetched with SSRF protection",
      "Changed the product from TeamHub to Sameward without risky changes to live data or storage",
    ],
  },
]

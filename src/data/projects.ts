import type { Project } from "@/types"
import { shippedFlowNodes } from "@/data/shipped-flow"

export const projects: Project[] = [
  {
    id: "sameward",
    title: "Sameward",
    featured: true,
    subtitle: "One workspace for teams to talk, plan, and get AI help",
    description:
      "Sameward brings team chat, planning, files, and AI help into one workspace. I designed, built, and launched the full product at sameward.com.",
  problem:
    "Teams often switch between chat, notes, plans, and AI tools. Each switch loses context. Sameward keeps the conversation, work, and AI help together in one workspace.",
  problemLines: [
    "Teams often switch between chat, notes, plans, and AI tools.",
    "Each switch loses context.",
    "Sameward keeps the conversation, work, and AI help together in one workspace.",
  ],
  approachHeadline: "Three moves to keep one workspace fast.",
  approachLead: "How context loss shaped the architecture.",
  approachSteps: [
    {
      title: "Split realtime out",
      detail: "Socket.IO owns messages, typing, and presence — the UI never waits on chat",
    },
    {
      title: "Keep the web app thin",
      detail: "Next.js handles pages, APIs, and product actions in one surface",
    },
    {
      title: "Ground AI in context",
      detail: "Channel AI reads workspace history — not a disconnected chatbot",
    },
  ],
    liveUrl: "https://sameward.com/",
    decisions: [
      "Ran live messaging as its own service so updates stay fast and the web app stays simple",
      "Built Channel AI to answer from workspace context and useful public links",
      "Changed the product from TeamHub to Sameward without risky changes to live data or storage",
    ],
    shippedFlowHub: {
      title: "Sameward",
      subtitle: "One workspace · tested · live on Railway",
    },
    shippedFlow: shippedFlowNodes,
  },
]

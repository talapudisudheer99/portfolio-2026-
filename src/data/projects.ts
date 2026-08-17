import type { Project } from "@/types"

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
    liveUrl: "https://sameward.com/",
    decisions: [
      "Ran live messaging as its own service so updates stay fast and the web app stays simple",
      "Built Channel AI to answer from workspace context and useful public links",
      "Changed the product from TeamHub to Sameward without risky changes to live data or storage",
    ],
    buildList: [
      "Built the web app with Next.js, TypeScript, RTK Query, and a shared design system",
      "Added secure sessions, Google sign-in, email checks, password reset, and sign-out across devices",
      "Designed MongoDB workspaces, members, and roles",
      "Built live typing, presence, and channel messages with Socket.IO",
      "Added direct AWS S3 uploads for profile images and files",
      "Set up account and product email with Resend",
      "Built AI tools to summarize, catch up, answer questions, and draft replies",
      "Deployed the web and realtime services on Railway",
    ],
  },
]

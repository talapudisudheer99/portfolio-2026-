export const samewardChannels = [
  "# general",
  "# product",
  "# development",
  "# design",
] as const

export const samewardTones = {
  sam: "bg-[#1c2a36] text-[#9eb8c9]",
  aisha: "bg-[#2a1c20] text-[#d4a3a8]",
  rohit: "bg-[#1c211e] text-[#b7c2b8]",
  sudheer: "bg-[#161414] text-[#e0dedd]",
} as const

export type SamewardPerson = keyof typeof samewardTones

export const samewardAvatarUrls: Record<string, string> = {
  sam: "https://i.pravatar.cc/64?img=11",
  aisha: "https://i.pravatar.cc/64?img=5",
  rohit: "https://i.pravatar.cc/64?img=8",
  sudheer: "https://i.pravatar.cc/64?img=12",
}

export const samewardMembers = [
  { id: "sam", name: "Sam Chen", short: "Sam", status: "Online" },
  { id: "aisha", name: "Aisha Patel", short: "Aisha", status: "Online" },
  { id: "rohit", name: "Rohit Singh", short: "Rohit", status: "Online" },
] as const

export const samewardMessages = [
  {
    id: "sam",
    name: "Sam Chen",
    time: "9:41",
    body: "Product sync at 10 — agenda shared.",
    reactions: [{ emoji: "👍", count: 2 }],
  },
  {
    id: "aisha",
    name: "Aisha Patel",
    time: "9:42",
    body: "Deploy runbook for Friday: docs.northwind.dev",
    reactions: [
      { emoji: "🚀", count: 1 },
      { emoji: "👀", count: 1 },
    ],
  },
  {
    id: "rohit",
    name: "Rohit Singh",
    time: "9:44",
    body: "I pushed the notification debounce fix. QA build is ready.",
    reactions: [{ emoji: "✅", count: 2 }],
  },
  {
    id: "sam",
    name: "Sam Chen",
    time: "9:46",
    body: "Nice. Let's ship after smoke test and update the release notes.",
    reactions: [{ emoji: "👍", count: 1 }],
  },
] as const

export const samewardAiActions = [
  { id: "summarize", label: "Summarize", accent: "cyan" },
  { id: "catch-up", label: "Catch up", accent: "violet" },
  { id: "ask", label: "Ask", accent: "blue" },
  { id: "draft", label: "Draft reply", accent: "pink" },
] as const

export type SamewardAiAccent = (typeof samewardAiActions)[number]["accent"]

export const samewardAiActionTone: Record<
  SamewardAiAccent,
  { box: string; icon: string }
> = {
  cyan: {
    box: "border-cyan-400/40 bg-cyan-400/10",
    icon: "bg-cyan-400/25 text-cyan-400",
  },
  violet: {
    box: "border-violet-400/40 bg-violet-400/10",
    icon: "bg-violet-400/25 text-violet-400",
  },
  blue: {
    box: "border-blue-400/40 bg-blue-400/10",
    icon: "bg-blue-400/25 text-blue-400",
  },
  pink: {
    box: "border-pink-400/40 bg-pink-400/10",
    icon: "bg-pink-400/25 text-pink-400",
  },
}

export const samewardMockTiming = {
  aiSummary:
    "Catch-up · last 7 days — sync today, Friday deploy runbook linked.",
  aiBlocker: "1 linked page read for context.",
  aiTypeStartMs: 1500,
  lineStart: 0.5,
  lineStep: 0.14,
} as const

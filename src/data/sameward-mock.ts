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

export type SamewardLinkPreview = {
  host: string
  title: string
  description?: string
}

export type SamewardAttachment = {
  name: string
  kind: "pdf" | "image" | "file"
  sizeLabel: string
}

export type SamewardMessage = {
  id: SamewardPerson
  name: string
  time: string
  body?: string
  linkPreview?: SamewardLinkPreview
  attachment?: SamewardAttachment
  reactions: ReadonlyArray<{ emoji: string; count: number }>
}

/** Feed: (1) body + attachment + reactions · (2) link only · (3) Channel AI in panel */
export const samewardMessages: readonly SamewardMessage[] = [
  {
    id: "rohit",
    name: "Rohit Singh",
    time: "9:44",
    body: "I pushed the notification debounce fix. QA build is ready.",
    attachment: {
      name: "qa-build-notes.pdf",
      kind: "pdf",
      sizeLabel: "248 KB",
    },
    reactions: [{ emoji: "✅", count: 2 }],
  },
  {
    id: "aisha",
    name: "Aisha Patel",
    time: "9:42",
    linkPreview: {
      host: "docs.northwind.dev",
      title: "Friday deploy runbook",
      description: "Checklist, rollback steps, and owners for the release.",
    },
    reactions: [],
  },
]

export const samewardAiActions = [
  { id: "summarize", label: "Summarize", accent: "orange" },
  { id: "catch-up", label: "Catch up", accent: "amber" },
  { id: "ask", label: "Ask", accent: "lime" },
  { id: "draft", label: "Draft reply", accent: "coral" },
] as const

export type SamewardAiAccent = (typeof samewardAiActions)[number]["accent"]

export const samewardAiActionTone: Record<SamewardAiAccent, string> = {
  orange: "text-[#ff9f4a]",
  amber: "text-[#ffe066]",
  lime: "text-[#c8ff63]",
  coral: "text-[#ff7a7a]",
}

export const samewardMockTiming = {
  aiSummary:
    "Catch-up · last 7 days — sync today, Friday deploy runbook linked.",
  aiBlocker: "1 linked page read for context.",
  aiTypeStartMs: 1500,
  lineStart: 0.5,
  lineStep: 0.14,
} as const

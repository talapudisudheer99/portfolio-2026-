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

/** Feed, oldest first: (1) link only · (2) body + attachment + reactions · (3) Channel AI */
export const samewardMessages: readonly SamewardMessage[] = [
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
]

export const samewardAiActions = [
  { id: "summarize", label: "Summarize", hint: "The whole channel", accent: "orange" },
  { id: "catch-up", label: "Catch up", hint: "What you missed", accent: "amber" },
  { id: "ask", label: "Ask", hint: "About this channel", accent: "lime" },
  { id: "draft", label: "Draft reply", hint: "You review and send", accent: "coral" },
] as const

/** The action whose result is showing in the thread */
export const samewardActiveAiAction = "catch-up"



export const samewardMockTiming = {
  aiSummary:
    "Catch-up · last 7 days — sync today, Friday deploy runbook linked.",
  aiBlocker: "1 linked page read for context.",
  aiTypeStartMs: 900,
  lineStart: 0.15,
  lineStep: 0.12,
} as const

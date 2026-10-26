/** The three things a reviewer should see in the first scroll. Facts only. */
export interface WorkItem {
  id: string
  name: string
  context: string
  summary: string
  tags: string[]
  /** Primary link — in-page anchor or external */
  href: string
  cta: string
  /** Extra external links (live site, code, demo) */
  extras?: { href: string; label: string }[]
}

export const selectedWork: WorkItem[] = [
  {
    id: "phrontier",
    name: "Phrontier AI",
    context: "Profolo Talent Solutions · Jan 2025 – Jul 2026",
    summary:
      "AI hiring platform. Senior on the frontend for its Candidate and Employer apps: sign-in for three roles, the streaming ATS Copilot, realtime chat and search.",
    tags: ["Next.js", "TypeScript", "RTK Query", "GraphQL", "WebSockets"],
    href: "#experience",
    cta: "Read the role",
  },
  {
    id: "sameward",
    name: "Sameward",
    context: "Own product · Live since Aug 2026",
    summary:
      "Team workspace with channels, DMs, file sharing and Channel AI. Designed, built and launched alone: REST API plus a separate Socket.IO service.",
    tags: ["Next.js", "Node.js", "Socket.IO", "MongoDB", "OpenAI"],
    href: "#projects",
    cta: "See the case study",
    extras: [{ href: "https://sameward.com/", label: "sameward.com" }],
  },
  {
    id: "task-list",
    name: "Task List App",
    context: "Take-home · Oct 2026",
    summary:
      "Per-user tasks with Supabase Row-Level Security, CSV bulk import with per-row validation, and 32 Vitest tests.",
    tags: ["Server Actions", "Supabase", "PostgreSQL", "Vitest"],
    href: "https://task-list-app-rho.vercel.app/",
    cta: "Open the app",
    extras: [
      { href: "https://github.com/talapudisudheer99/task-list-app", label: "Code" },
      { href: "https://youtu.be/DIufKqp48aE", label: "Demo video" },
    ],
  },
]

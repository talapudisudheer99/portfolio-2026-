import type { SkillGroup, WorkingRange } from "@/types"

/** The interface-through-infrastructure span, summarised above the detail. */
export const workingRange: WorkingRange = {
  role: "Frontend-strong, full stack",
  note: "New technology joins the stack when it solves a real product need.",
  layers: [
    { layer: "Interface", detail: "React · Next.js · TypeScript" },
    { layer: "Data", detail: "Node.js · MongoDB · PostgreSQL" },
    { layer: "Live updates", detail: "Socket.IO · presence" },
    { layer: "Sign-in", detail: "Sessions · OAuth" },
    { layer: "AI", detail: "OpenAI · Channel AI" },
    { layer: "Testing", detail: "Jest · RTL · Vitest" },
    { layer: "Launch", detail: "Railway · Vercel · AWS S3" },
  ],
}

export const skillGroups: SkillGroup[] = [
  {
    id: "ui",
    title: "UI engineering",
    summary:
      "Responsive product screens and reusable components built from Figma, consistent as the product grows.",
    skills: [
      "React",
      "Next.js App Router",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Design systems",
      "Responsive layout",
      "Accessibility",
      "Component architecture",
    ],
  },
  {
    id: "testing",
    title: "Testing",
    summary:
      "Jest and React Testing Library on production work, Vitest on the Task List App, and manual end-to-end release checks on Sameward.",
    skills: ["Jest", "React Testing Library", "Vitest", "Component tests", "End-to-end release checks"],
  },
  {
    id: "api-data",
    title: "API & data",
    summary: "Reliable API connections, forms, validation, and frontend state.",
    skills: [
      "Node.js",
      "Express",
      "Route Handlers",
      "REST APIs",
      "GraphQL",
      "Redux Toolkit",
      "RTK Query",
      "MongoDB / Mongoose",
      "PostgreSQL / Supabase",
      "Zod",
      "React Hook Form",
    ],
  },
  {
    id: "realtime",
    title: "Realtime",
    summary:
      "Fast live updates for messages, typing, presence, and shared team activity.",
    skills: [
      "Socket.IO",
      "Handshake auth",
      "Channel rooms",
      "Typing & presence",
      "WebSocket patterns",
    ],
  },
  {
    id: "auth",
    title: "Sign-in & access",
    summary:
      "Secure sign-in with HttpOnly cookie sessions, Google OAuth and OTP, account recovery, session control, and access by role.",
    skills: [
      "Session cookies",
      "Google OAuth",
      "OTP sign-in",
      "Email verification",
      "Password reset",
      "Role-based access",
      "Logout-all sessions",
    ],
  },
  {
    id: "ai",
    title: "AI product features",
    summary:
      "AI features that use real product context to give useful answers and actions.",
    skills: [
      "OpenAI integration",
      "Channel AI (summarize / catch-up / ask / draft)",
      "Link-aware context",
      "Grounded workspace prompts",
    ],
  },
  {
    id: "ship-ops",
    title: "Launch & hosting",
    summary:
      "Production releases, file storage, email, domains, and day-to-day debugging.",
    skills: [
      "Railway",
      "Vercel",
      "AWS S3 (presigned uploads)",
      "Resend email",
      "Git & GitHub",
      "Env / domain wiring",
      "Performance & debugging",
    ],
  },
]

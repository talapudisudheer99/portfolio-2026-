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
    proof: [
      { where: "Profolo", text: "Two Next.js apps with feature-based folders, shared form inputs and accessible, responsive screens from Figma." },
      { where: "Sameward", text: "The whole workspace UI: channels, DMs, chat, files and Channel AI, in React 19 and Tailwind." },
      { where: "Codegene", text: "Reusable React components for Top Wallet, including a chat composer with drag-and-drop images." },
    ],
  },
  {
    id: "testing",
    title: "Testing",
    summary:
      "Jest and React Testing Library on production work, Vitest on the Task List App, and manual end-to-end release checks on Sameward.",
    skills: ["Jest", "React Testing Library", "Vitest", "Component tests", "End-to-end release checks"],
    proof: [
      { where: "Profolo", text: "Unit and component tests with Jest and React Testing Library." },
      { where: "Task List App", text: "32 Vitest tests covering validation, CSV import and task actions." },
      { where: "Sameward", text: "Every release type-checked, linted and tested end to end by hand." },
    ],
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
    proof: [
      { where: "Profolo", text: "RTK Query over GraphQL for chat, a feed with optimistic updates and global search with URL filters." },
      { where: "Sameward", text: "REST API on Next.js Route Handlers with Mongoose models and Zod validation." },
      { where: "Task List App", text: "Server Actions on Supabase PostgreSQL with Row-Level Security per user." },
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
    proof: [
      { where: "Profolo", text: "WebSocket streaming for the ATS Copilot chat: markdown, @mentions and action widgets." },
      { where: "Sameward", text: "A standalone Socket.IO service that only broadcasts; room membership re-checked on every join." },
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
    proof: [
      { where: "Profolo", text: "Sign-in for three roles with OTP and Google; fixed users being logged out on every deploy." },
      { where: "Sameward", text: "HttpOnly cookie sessions, bcrypt, hashed tokens, email verification, password reset and log out of all devices." },
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
    proof: [
      { where: "Sameward", text: "Channel AI on OpenAI: summarize, catch up, ask and draft replies the user sends; SSRF-safe link reading." },
      { where: "Profolo", text: "Frontend for the ATS Copilot recruiting assistant (the AI team owned the model)." },
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
    proof: [
      { where: "Profolo", text: "Weekly releases from dev to QA, staging and production." },
      { where: "Sameward", text: "Two services on Railway, S3 presigned uploads and Resend email, live at sameward.com." },
      { where: "Task List App", text: "Deployed on Vercel with a recorded demo." },
    ],
  },
]

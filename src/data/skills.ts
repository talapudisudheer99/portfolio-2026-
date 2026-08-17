import type { SkillGroup } from "@/types"

export const skillGroups: SkillGroup[] = [
  {
    id: "ui",
    title: "UI & product design",
    summary:
      "Responsive product screens, reusable components, and design systems that stay consistent as the product grows.",
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
    id: "api-data",
    title: "API & data",
    summary: "Reliable API connections, forms, validation, and frontend state.",
    skills: [
      "Route Handlers",
      "REST APIs",
      "GraphQL",
      "Redux Toolkit",
      "RTK Query",
      "MongoDB / Mongoose",
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
      "Secure sign-in, account recovery, session control, and access by role.",
    skills: [
      "Session cookies",
      "Google OAuth",
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

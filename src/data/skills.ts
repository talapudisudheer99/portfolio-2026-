import type { SkillGroup } from "@/types"

export const skillGroups: SkillGroup[] = [
  {
    id: "ui",
    title: "UI & product craft",
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
    title: "Auth & access",
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
    skills: [
      "OpenAI integration",
      "Channel AI (summarize / catch-up / ask / draft)",
      "Link-aware context",
      "Grounded workspace prompts",
    ],
  },
  {
    id: "ship-ops",
    title: "Ship & ops",
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

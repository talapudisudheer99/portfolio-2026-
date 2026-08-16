import type { Experience } from "@/types"

export const experience: Experience[] = [
  {
    id: "sameward",
    company: "Sameward",
    role: "Independent product — frontend-strong full stack",
    period: "2025 – Present",
    bullets: [
      "Designed and shipped Sameward (sameward.com): channels, realtime messaging, profiles, and Channel AI in one workspace.",
      "Built the web app (Next.js, TypeScript, RTK Query, design system) plus a separate Socket.IO realtime service with authenticated channel rooms.",
      "Owned auth (sessions, Google OAuth, email verification), MongoDB multi-tenant workspaces, S3 uploads, Resend email, and Railway production deploy.",
      "Rebranded TeamHub → Sameward in product UI while keeping internal datastore and bucket identities stable — shipping judgment over cosmetic renames.",
    ],
  },
  {
    id: "phrontier-ai",
    company: "Phrontier AI",
    role: "Frontend Engineer",
    period: "Jan 2025 – Present",
    bullets: [
      "Building frontend systems for an enterprise platform under active development using Next.js, TypeScript, and GraphQL.",
      "Implemented scalable UI architecture across dual Next.js applications with shared patterns for data fetching and state management.",
      "Integrated RTK Query and WebSocket-driven updates for responsive, real-time user experiences.",
      "Collaborated on authentication flows, role-based access patterns, and production-ready component libraries.",
    ],
  },
  {
    id: "innoclique",
    company: "Innoclique",
    role: "Frontend Developer",
    period: "Jul 2024 – Dec 2024",
    bullets: [
      "Developed React-based interfaces with a focus on reusable components and maintainable UI patterns.",
      "Worked with REST APIs and client-side state to deliver responsive, user-facing features.",
      "Improved frontend performance and consistency through structured component design and code reviews.",
    ],
  },
  {
    id: "codegene",
    company: "Codegene",
    role: "Frontend Developer",
    period: "Feb 2024 – Jul 2024",
    bullets: [
      "Built responsive web interfaces using React and modern CSS workflows.",
      "Translated design requirements into accessible, mobile-first UI implementations.",
      "Supported feature delivery through close collaboration with backend and design stakeholders.",
    ],
  },
  {
    id: "edureka",
    company: "Edureka",
    role: "Web Development Intern",
    period: "May 2023 – Feb 2024",
    bullets: [
      "Completed structured training in HTML, CSS, JavaScript, and React fundamentals.",
      "Built practice projects to strengthen component-based architecture and responsive layout skills.",
      "Established a foundation for transitioning into production frontend engineering roles.",
    ],
  },
]

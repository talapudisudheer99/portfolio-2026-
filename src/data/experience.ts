import type { Experience } from "@/types"

export const experience: Experience[] = [
  {
    id: "sameward",
    company: "Sameward",
    role: "Independent Product · Founder / Product Engineer",
    period: "2025 – Present",
    bullets: [
      "Designed and launched Sameward, a live workspace for team chat, planning, files, and AI help.",
      "Built the Next.js web app and a separate realtime service for fast, secure messaging.",
      "Built sign-in, team roles, file uploads, email flows, the database, and production deployment.",
      "Covered core product flows with React Testing Library so messaging, sign-in, and Channel AI stay stable.",
      "Changed the product from TeamHub to Sameward without putting live data or storage at risk.",
    ],
  },
  {
    id: "phrontier-ai",
    company: "Phrontier AI",
    role: "Frontend Engineer",
    period: "Jan 2025 – Jul 2026",
    bullets: [
      "Built reusable frontend systems for two Next.js apps used by an enterprise platform.",
      "Connected GraphQL data, shared state, and common UI patterns across both apps.",
      "Added live updates with WebSockets and built secure, role-based screens.",
      "Kept shared components clear, consistent, and ready for production.",
    ],
  },
  {
    id: "innoclique",
    company: "Innoclique",
    role: "Frontend Developer",
    period: "Jul 2024 – Dec 2024",
    bullets: [
      "Built React screens with reusable components and clear UI patterns.",
      "Connected REST APIs and frontend state to deliver responsive product features.",
      "Improved speed and consistency through better component structure and code reviews.",
    ],
  },
  {
    id: "codegene",
    company: "Codegene",
    role: "Frontend Developer",
    period: "Feb 2024 – Jul 2024",
    bullets: [
      "Built responsive web interfaces with React and modern CSS.",
      "Turned designs into accessible screens that worked well on mobile.",
      "Shipped product features with backend and design teams.",
    ],
  },
  {
    id: "edureka",
    company: "Edureka",
    role: "Web Development Intern",
    period: "May 2023 – Feb 2024",
    bullets: [
      "Built web projects with HTML, CSS, JavaScript, and React.",
      "Created reusable components and responsive layouts.",
      "Turned product requirements into working frontend features.",
    ],
  },
]

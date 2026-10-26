import type { Experience } from "@/types"

/**
 * Experience — facts only, from Sudheer's career profile.
 * Order: newest first. `defaultExperienceId` opens first in the mission log.
 */
export const experience: Experience[] = [
  {
    id: "sameward",
    company: "Sameward",
    role: "Independent Product Engineer",
    period: "Aug 2026 – Present",
    kind: "role",
    context: "Own product · live at sameward.com",
    summary:
      "Designed, built and launched a live team workspace on my own: channels and DMs, realtime chat, file sharing and Channel AI.",
    highlights: [
      {
        tag: "Architecture",
        text: "A Next.js REST API owns every write; a separate Node.js Socket.IO service only broadcasts, linked by one shared-secret internal endpoint.",
      },
      {
        tag: "Auth",
        text: "HttpOnly cookie sessions, bcrypt, hashed tokens, Google OAuth, and owner / admin / member roles with tenant isolation.",
      },
      {
        tag: "AI",
        text: "Channel AI on the OpenAI API summarizes channels, answers questions and drafts replies the user sends; link reading is SSRF-safe.",
      },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "MongoDB", "Socket.IO", "OpenAI", "Railway", "AWS S3"],
  },
  {
    id: "profolo",
    company: "Profolo Talent Solutions",
    role: "Frontend Engineer",
    period: "Jan 2025 – Jul 2026",
    kind: "role",
    context: "Phrontier AI · AI hiring platform",
    summary:
      "Senior of three frontend engineers on the Candidate and Employer apps. Reviewed every pull request from two juniors and shipped weekly releases from dev to QA, staging and production.",
    highlights: [
      {
        tag: "Auth",
        text: "Sign-in for three user roles (email, Google OAuth, OTP). Stopped logouts on every deploy: cookie as source of truth, retry with backoff, log out only on 401/403.",
      },
      {
        tag: "Realtime AI",
        text: "Built the frontend for ATS Copilot: WebSocket streaming, markdown, @mentions, and widgets to compare candidates and move them through the pipeline. The AI team owned the model.",
      },
      {
        tag: "Product",
        text: "Realtime chat, a feed with optimistic updates and global search with URL filters on RTK Query over GraphQL; Jest + RTL tests and 15+ module docs.",
      },
    ],
    stack: ["Next.js", "TypeScript", "Redux Toolkit", "RTK Query", "GraphQL", "WebSockets", "Jest + RTL"],
  },
  {
    id: "innoclique",
    company: "Innoclique Cognitive Technologies",
    role: "Frontend Developer",
    period: "Aug 2024 – Dec 2024",
    kind: "role",
    context: "Deployed to Profolo · Phrontier AI v1",
    summary:
      "Built the first version (MVP) of Phrontier AI, which later became the base of the v2 I led at Profolo.",
    highlights: [
      {
        tag: "MVP",
        text: "Sign-in, user profiles, job posting for employers, and job browsing and detail pages for candidates.",
      },
      {
        tag: "Iteration",
        text: "Rebuilt core flows through several product redesigns as the direction changed.",
      },
      {
        tag: "Foundation",
        text: "The MVP's structure carried into v2, so the next version started from working code, not a rewrite.",
      },
    ],
    stack: ["Next.js", "TypeScript", "React"],
  },
  {
    id: "codegene",
    company: "Codegene",
    role: "Frontend Developer",
    period: "Feb 2024 – Jul 2024",
    kind: "role",
    context: "Top Wallet · consumer wallet app",
    summary:
      "Built reusable React components for Top Wallet, a live consumer wallet app.",
    highlights: [
      {
        tag: "UI",
        text: "A WhatsApp-style chat composer with drag-and-drop images, sliders and responsive screens.",
      },
      {
        tag: "Security",
        text: "Encrypted and decrypted API payloads on the frontend with CryptoJS, matching the backend's scheme.",
      },
      {
        tag: "Quality",
        text: "Replaced hard-coded values with data-driven config and tested releases across browsers and devices.",
      },
    ],
    stack: ["React", "Redux", "JavaScript", "CryptoJS"],
  },
  {
    id: "edureka",
    company: "Edureka",
    role: "Full-Stack Web Development Intern",
    period: "May 2023 – Jan 2024",
    kind: "training",
    context: "Internship · Edureka Super Intern, Best Performance",
    summary:
      "Full-stack training before my first role, finished with the Edureka Super Intern award for best performance.",
    highlights: [
      {
        tag: "Full stack",
        text: "Built web projects with HTML, CSS, JavaScript, Node.js, Express, MongoDB and React.",
      },
      {
        tag: "Components",
        text: "Created reusable components and responsive layouts from product requirements.",
      },
    ],
    stack: ["JavaScript", "React", "Node.js", "Express", "MongoDB"],
  },
]

/** Opens first — the strongest role, since Sameward is featured above. */
export const defaultExperienceId = "profolo"

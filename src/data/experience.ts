import type { Experience } from "@/types"

export const experience: Experience[] = [
  {
    id: "sameward",
    company: "Sameward",
    role: "Independent Product Engineer",
    period: "Aug 2026 – Present",
    bullets: [
      "Designed, built and launched Sameward on my own: a live workspace for team chat, files and AI help.",
      "Split it into two services: a Next.js REST API that handles every write, and a standalone Node.js Socket.IO service that only broadcasts, linked by a shared-secret internal endpoint.",
      "Built sign-in and team roles with HttpOnly cookie sessions, bcrypt, hashed tokens and Google OAuth.",
      "Built Channel AI on the OpenAI API: it summarizes channels, answers questions and drafts replies that the user sends.",
      "Deployed both services on Railway with S3 uploads and Resend email, and tested every release end to end.",
    ],
  },
  {
    id: "profolo",
    company: "Profolo Talent Solutions",
    role: "Frontend Engineer · Phrontier AI",
    period: "Jan 2025 – Jul 2026",
    bullets: [
      "Senior of three frontend engineers on Phrontier AI, an AI hiring platform with Candidate and Employer apps built in Next.js and TypeScript.",
      "Built authentication for three user roles, and stopped users being logged out on every deploy by making sessions resilient to restarts.",
      "Built the realtime frontend for the ATS Copilot, an AI recruiting assistant that streams answers and lets recruiters act on candidates from the chat.",
      "Built realtime chat, a feed with optimistic updates and global search, using RTK Query over GraphQL.",
      "Reviewed every pull request from two junior engineers, wrote Jest and React Testing Library tests, and shipped weekly releases.",
    ],
  },
  {
    id: "innoclique",
    company: "Innoclique Cognitive Technologies",
    role: "Frontend Developer",
    period: "Aug 2024 – Dec 2024",
    bullets: [
      "Deployed to Profolo Talent Solutions to build the first version (MVP) of Phrontier AI.",
      "Built sign-in, user profiles, job posting for employers, and job browsing for candidates.",
      "Rebuilt core flows through several product redesigns; the MVP became the base of the next version I later led.",
    ],
  },
  {
    id: "codegene",
    company: "Codegene",
    role: "Frontend Developer",
    period: "Feb 2024 – Jul 2024",
    bullets: [
      "Built reusable React components for Top Wallet, a live consumer wallet app, including a WhatsApp-style chat composer with drag-and-drop images.",
      "Encrypted and decrypted API data on the frontend with CryptoJS, matching the backend's scheme.",
      "Replaced hard-coded settings with data-driven config and tested releases across browsers and devices.",
    ],
  },
  {
    id: "edureka",
    company: "Edureka",
    role: "Full-Stack Web Development Intern",
    period: "May 2023 – Jan 2024",
    bullets: [
      "Awarded Edureka Super Intern, Certificate for Best Performance.",
      "Built web projects with HTML, CSS, JavaScript, Node.js, Express, MongoDB and React.",
      "Created reusable components and responsive layouts from product requirements.",
    ],
  },
]

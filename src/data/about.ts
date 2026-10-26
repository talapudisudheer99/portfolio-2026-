import { GitPullRequest, Rocket, ShieldCheck } from "lucide-react"

import type { AboutContent } from "@/types"

/**
 * Profile — every line here is a fact from real work (no self-rated scores).
 * Source of truth: Sudheer's career profile.
 */
export const aboutContent: AboutContent = {
  kicker: "Profile",
  headline: {
    lead: "More than",
    accent: "the screen.",
  },
  section: {
    title: "More than the screen",
    description:
      "Business degree, full-stack training, then about 2.5 years shipping production frontends for an AI hiring platform, plus a product of my own.",
  },
  featureCards: [
    {
      title: "Own the hard parts",
      detail:
        "Built sign-in for three user roles at Profolo, then fixed the bug that logged users out on every deploy.",
      accent: "gold",
      icon: ShieldCheck,
    },
    {
      title: "Raise the team",
      detail:
        "Senior of three frontend engineers. Reviewed every pull request from two juniors and wrote 15+ module docs.",
      accent: "gold",
      icon: GitPullRequest,
    },
    {
      title: "Ship it myself",
      detail:
        "Built and launched Sameward alone: two services on Railway, live at sameward.com.",
      accent: "gold",
      icon: Rocket,
    },
  ],
  impact: {
    title: "Proof",
    stats: [
      {
        value: "~2.5 yrs",
        label: "Production frontend",
        detail: "Feb 2024 to now, at three companies",
      },
      {
        value: "2 apps",
        label: "Phrontier AI",
        detail: "Candidate and Employer apps in Next.js + TypeScript",
      },
      {
        value: "Weekly",
        label: "Releases",
        detail: "dev → QA → staging → production",
      },
      {
        value: "32 tests",
        label: "Vitest",
        detail: "Task List App; Jest + RTL at Profolo",
      },
    ],
  },
  availability: "Open to frontend roles · Immediate joiner · Hyderabad, Bengaluru, Chennai or remote",
}

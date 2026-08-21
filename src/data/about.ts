import { Code2, Layers, Rocket } from "lucide-react"

import type { AboutContent } from "@/types"

export const aboutContent: AboutContent = {
  kicker: "Behind the code",
  headline: {
    lead: "More than",
    accent: "the screen.",
  },
  section: {
    title: "More than the screen",
    description:
      "Business thinking, strong frontend work, and full-stack ownership\nbehind the screen.",
  },
  featureCards: [
    {
      title: "Build Thoughtfully",
      detail:
        "Turning business needs into clean, scalable and\nmaintainable solutions.",
      accent: "gold",
      icon: Code2,
    },
    {
      title: "Ship End-to-End",
      detail:
        "From clean architecture to production-ready\nsystems.",
      accent: "amber",
      icon: Layers,
    },
    {
      title: "Solve Real Problems",
      detail:
        "Creating smooth, performant and delightful\nexperiences.",
      accent: "ember",
      icon: Rocket,
    },
  ],
  impact: {
    floatBadge: "Engineering Mindset",
    title: "Engineering Impact",
    liveBadge: "Live Systems",
    stats: [
      { value: "3+ Years", label: "Frontend Engineering" },
      { value: "1 Live Product", label: "Built End-to-End" },
      { value: "∞", label: "Learning Mode" },
    ],
  },
  radarAxes: [
    { label: "Frontend", value: 0.92 },
    { label: "Prod", value: 0.8 },
    { label: "Performance", value: 0.85 },
    { label: "Architecture", value: 0.9 },
    { label: "Tools", value: 0.78 },
  ],
}

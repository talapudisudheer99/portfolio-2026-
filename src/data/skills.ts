import type { SkillGroup } from "@/types"

export const skillGroups: SkillGroup[] = [
  {
    id: "core",
    title: "Core",
    skills: [
      "JavaScript (ES6+)",
      "TypeScript",
      "React",
      "Next.js",
      "HTML5",
      "CSS3",
    ],
  },
  {
    id: "state-data",
    title: "State & Data",
    skills: [
      "Redux Toolkit",
      "RTK Query",
      "GraphQL",
      "REST APIs",
      "WebSocket",
      "React Hook Form",
    ],
  },
  {
    id: "ui-forms",
    title: "UI & Forms",
    skills: [
      "Tailwind CSS",
      "shadcn/ui",
      "Responsive Design",
      "Accessibility",
      "Zod",
      "Component Architecture",
    ],
  },
  {
    id: "platform",
    title: "Platform",
    skills: [
      "Git & GitHub",
      "Vercel",
      "Node.js",
      "MongoDB",
      "Postman",
      "VS Code",
    ],
  },
  {
    id: "practices",
    title: "Practices",
    skills: [
      "Code Reviews",
      "Agile/Scrum",
      "Performance Optimization",
      "Debugging",
      "Technical Documentation",
      "Cross-functional Collaboration",
    ],
  },
]

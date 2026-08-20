import type { LucideIcon } from "lucide-react"
import {
  Cloud,
  Code2,
  Database,
  FlaskConical,
  Layers,
  Monitor,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"

export type CapabilityAccent =
  | "violet"
  | "cyan"
  | "teal"
  | "blue"
  | "pink"
  | "amber"
  | "emerald"

export interface CapabilityCardMeta {
  accent: CapabilityAccent
  icon: LucideIcon
  fullWidth?: boolean
  layer: string
}

/** Maps working-range layer label → capability card id. */
export const layerToCapabilityId: Record<string, string> = {
  Interface: "ui",
  Data: "api-data",
  "Live updates": "realtime",
  "Sign-in": "auth",
  AI: "ai",
  Testing: "testing",
  Launch: "ship-ops",
}

export const layerDisplayNames: Record<string, string> = {
  "Sign-in": "Auth & sessions",
}

export const capabilityCardMeta: Record<string, CapabilityCardMeta> = {
  ui: { accent: "violet", icon: Layers, layer: "Interface" },
  testing: { accent: "cyan", icon: FlaskConical, layer: "Testing" },
  "api-data": { accent: "teal", icon: Database, layer: "Data" },
  realtime: { accent: "blue", icon: Zap, layer: "Live updates" },
  auth: { accent: "pink", icon: ShieldCheck, layer: "Sign-in" },
  ai: { accent: "amber", icon: Sparkles, layer: "AI" },
  "ship-ops": {
    accent: "emerald",
    icon: Rocket,
    layer: "Launch",
    fullWidth: true,
  },
}

export const layerIcons: Record<string, LucideIcon> = {
  Interface: Code2,
  Data: Database,
  "Live updates": Zap,
  "Sign-in": ShieldCheck,
  AI: Sparkles,
  Testing: Monitor,
  Launch: Cloud,
}

export const capabilitiesHero = {
  lines: [
    { text: "From idea to" },
    { text: "stable ", accent: "live release." },
  ],
  description:
    "A working stack for taking products from an idea to a stable live release.",
}

export const capabilitiesCta = {
  kicker: "End-to-end delivery",
  sub: "Design. Build. Test. Ship. Maintain.",
  copy: "This stack is optimized for speed, scalability, and reliability—so your product can grow without limits.",
  action: "Let's build something great",
  href: "#contact",
}

export const layerAccents: Record<string, CapabilityAccent> = {
  Interface: "violet",
  Data: "teal",
  "Live updates": "blue",
  "Sign-in": "pink",
  AI: "amber",
  Testing: "cyan",
  Launch: "emerald",
}

export const workingRangeIntro = [
  {
    icon: Code2,
    accent: "violet" as const,
    title: "Frontend—strong,",
    detail: "full stack",
  },
  {
    icon: Sparkles,
    accent: "cyan" as const,
    title: "Modern tech stack for",
    detail: "real product needs",
  },
] as const

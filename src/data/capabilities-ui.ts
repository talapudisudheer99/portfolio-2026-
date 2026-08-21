import type { LucideIcon } from "lucide-react"
import {
  Database,
  FlaskConical,
  Layers,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"

export interface CapabilityCardMeta {
  icon: LucideIcon
  /** Short label on the release pipeline rail */
  stage: string
  layer: string
}

/**
 * Idea → live release order (not alphabetical).
 * Drives the pipeline rail and active stage detail.
 */
export const capabilityPipelineIds = [
  "ui",
  "api-data",
  "realtime",
  "auth",
  "ai",
  "testing",
  "ship-ops",
] as const

export type CapabilityPipelineId = (typeof capabilityPipelineIds)[number]

export const capabilityCardMeta: Record<string, CapabilityCardMeta> = {
  ui: { icon: Layers, stage: "Interface", layer: "Interface" },
  "api-data": { icon: Database, stage: "Data", layer: "Data" },
  realtime: { icon: Zap, stage: "Live", layer: "Live updates" },
  auth: { icon: ShieldCheck, stage: "Auth", layer: "Sign-in" },
  ai: { icon: Sparkles, stage: "AI", layer: "AI" },
  testing: { icon: FlaskConical, stage: "Test", layer: "Testing" },
  "ship-ops": { icon: Rocket, stage: "Ship", layer: "Launch" },
}

export const capabilitiesHero = {
  lines: [
    { text: "From idea to" },
    { text: "stable ", accent: "live release." },
  ],
  description:
    "A working stack for taking products from an idea to a stable live release.",
  stance: "Frontend—strong, full stack · Modern tech for real product needs",
}
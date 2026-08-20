/**
 * Phase 08 — Global motion tokens
 * Single source of truth. Do not invent a second token file.
 */

export const easeOut = [0.22, 1, 0.36, 1] as const

/** GSAP-friendly cubic strings */
export const ease = {
  reveal: "power3.out",
  hover: "power2.out",
  cinematic: "power2.inOut",
} as const

/**
 * Timing families (seconds)
 * MICRO 150–250 · UI 250–400 · SECTION 500–900 · CINEMATIC 800–1400
 */
export const duration = {
  /** Hover / micro UI */
  micro: 0.2,
  /** Menus, drawers, small UI */
  ui: 0.35,
  /** Trace nodes / rows (legacy alias family) */
  trace: 0.5,
  /** Supporting copy */
  copy: 0.55,
  /** Section block reveals */
  section: 0.72,
  /** Hero / display / cinematic */
  hero: 0.9,
  cinematic: 1.1,
} as const

/** Y travel (px) — opacity + transform only */
export const rise = {
  sm: 12,
  md: 24,
  lg: 36,
} as const

export const gap = {
  nodes: 0.12,
  rows: 0.1,
  facts: 0.08,
} as const

export const viewportOnce = {
  once: true,
  margin: "-72px" as const,
}

/** Parallax / depth (conceptual strengths → px or scrub lag) */
export const parallax = {
  bg: -0.14,
  mid: -0.06,
  fg: 0.08,
  emerge: 16,
  stageLag: 28,
  footer: -28,
  drawerSpring: {
    stiffness: 118,
    damping: 30,
    restDelta: 0.001,
  },
  product: {
    headlineY: [36, -24] as const,
    panelY: [34, -46] as const,
    panelX: [8, -8] as const,
    panelScale: [0.95, 1, 0.985] as const,
    panelRotate: [1.1, -0.8] as const,
    glowY: [78, -44] as const,
  },
} as const

/**
 * GSAP parallax travel (px each direction).
 * bg ≈ 0.15 · decoration ≈ 0.25 · visual ≈ 0.45 of a conceptual band.
 */
export const depth = {
  bg: 28,
  decoration: 42,
  visual: 56,
} as const

/** Atmosphere — visible fluid presence; palette colors must read clearly */
export const atmosphere = {
  /** Canvas CSS opacity — present, not washed out */
  opacity: 0.92,
  opacityMobile: 0.72,
  glowIntensity: 0.07,
  timeScale: 0.7,
} as const

/**
 * Phase 08 Task 16 — section mood tints (subtle; mix into palette, don't replace).
 * Values are hex ints for Three.Color.
 */
export const sectionMoods = {
  hero: { tint: 0x3a2a6a, intensity: 0.95, speed: 0.9 },
  projects: { tint: 0x4a2a3a, intensity: 1.05, speed: 1 },
  skills: { tint: 0x2a3a5a, intensity: 0.98, speed: 1 },
  experience: { tint: 0x1a2438, intensity: 0.9, speed: 0.85 },
  about: { tint: 0x222028, intensity: 0.82, speed: 0.7 },
  contact: { tint: 0x4a3020, intensity: 0.95, speed: 0.8 },
} as const

export type SectionMoodId = keyof typeof sectionMoods

export const sectionMoodOrder: { id: SectionMoodId; selector: string }[] = [
  { id: "hero", selector: "#hero" },
  { id: "projects", selector: "#projects" },
  { id: "skills", selector: "#skills" },
  { id: "experience", selector: "#experience" },
  { id: "about", selector: "#about" },
  { id: "contact", selector: "#contact" },
]

export const fadeRise = {
  hidden: { opacity: 0, y: rise.md },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.copy, ease: easeOut },
  },
}

export const traceParent = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: gap.nodes,
      delayChildren: 0.05,
    },
  },
}

export const traceNodeChild = {
  hidden: { opacity: 0, y: rise.sm },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.trace, ease: easeOut },
  },
}

export const traceRowChild = {
  hidden: { opacity: 0, y: rise.sm },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.trace, ease: easeOut },
  },
}

/** @deprecated Prefer gap / duration.trace */
export const stagger = {
  fast: gap.facts,
  base: gap.nodes,
  slow: gap.rows,
} as const

export const staggerParent = traceParent
export const staggerChild = traceNodeChild

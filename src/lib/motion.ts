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
  copy: 0.6,
  /** Section block reveals */
  section: 0.85,
  /** Hero / display / cinematic */
  hero: 1.15,
  cinematic: 1.25,
} as const

/**
 * Phase 09 Task 2 — Lenis authorship (intentional, not laggy).
 * One instance; GSAP ticker still owns raf.
 */
export const scrollFeel = {
  duration: 1.08,
  wheelMultiplier: 0.88,
  touchMultiplier: 1,
  syncTouchLerp: 0.1,
} as const

/** Y travel (px) — opacity + transform only */
export const rise = {
  sm: 16,
  md: 32,
  lg: 48,
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
  /** Sameward stage scrub travel (px each way) — Task 6 */
  stageLag: 52,
  footer: -36,
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
  /** Sameward pointer depth (Task 6) — small, readable */
  stageTilt: {
    x: 8,
    y: 5,
    rotateX: 1.6,
    rotateY: 2,
  },
} as const

/**
 * GSAP parallax travel (px each direction) — Phase 09 Task 4 calibrated.
 * Background slower, decoration mid, visual faster — still restrained.
 */
export const depth = {
  bg: 52,
  decoration: 72,
  visual: 96,
} as const

/** Atmosphere — felt, not ignored; UI stays primary (Phase 09 Task 3) */
export const atmosphere = {
  /** Canvas CSS opacity — present, not washed out */
  opacity: 0.95,
  opacityMobile: 0.75,
  glowIntensity: 0.11,
  timeScale: 0.9,
  /** Mood tint mix into palette (desktop / mobile) */
  moodMix: 0.34,
  moodMixMobile: 0.18,
  /** Scroll orbit amplitude */
  scrollX: 1.55,
  scrollY: 1.05,
  mouseInfluence: 0.28,
} as const

/**
 * Section mood tints — gradual journey glue (hex ints for Three.Color).
 * Intensity/speed deltas must read without hard jumps.
 */
export const sectionMoods = {
  hero: { tint: 0x3a2a6a, intensity: 1, speed: 0.85 },
  projects: { tint: 0x5a2838, intensity: 1.12, speed: 1.05 },
  skills: { tint: 0x2a3a5a, intensity: 1.02, speed: 1 },
  experience: { tint: 0x1a2438, intensity: 0.92, speed: 0.8 },
  about: { tint: 0x222028, intensity: 0.78, speed: 0.65 },
  contact: { tint: 0x5a3020, intensity: 1.02, speed: 0.85 },
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

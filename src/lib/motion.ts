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
  duration: 0.92,
  wheelMultiplier: 0.94,
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
  /** Moon mesh on — horizon composition (Mars-style under the type). */
  moonEnabled: true,
  /**
   * Horizon sentinel + slow orbit — limb at the bottom with tiny L/R + yaw.
   * Hero: full limb · Sameward: slight rise + dim · Deeper: settle + soften.
   */
  horizonY: -2.56,
  horizonYMobile: -2.04,
  horizonScale: 1.33,
  horizonScaleMobile: 1.08,
  /** Canvas CSS opacity — present, not washed out */
  opacity: 0.95,
  opacityMobile: 0.75,
  glowIntensity: 0.11,
  timeScale: 0.9,
  /** Mood tint mix into palette (desktop / mobile) */
  moodMix: 0.34,
  moodMixMobile: 0.18,
  mouseInfluence: 0.14,
  /**
   * Sentinel pose deltas (added to horizon rest).
   * y > 0 lifts the limb; fade multiplies --atmosphere-scroll-fade.
   */
  /**
   * Sentinel pose per chapter — limb stays the floor; scale is the “approach.”
   */
  sentinel: {
    hero: { y: 0, scale: 1, fade: 1, spin: 1 },
    /** Sameward — quiet the limb so the product owns the frame */
    projects: { y: 0.22, scale: 0.88, fade: 0.48, spin: 0.8 },
    skills: { y: -0.08, scale: 0.96, fade: 0.62, spin: 0.88 },
    experience: { y: -0.1, scale: 0.92, fade: 0.58, spin: 0.85 },
    about: { y: 0.04, scale: 1.06, fade: 0.72, spin: 0.7 },
    contact: { y: -0.22, scale: 0.82, fade: 0.32, spin: 0.52 },
  },
  sentinelMobile: {
    hero: { y: 0, scale: 1, fade: 1, spin: 1 },
    projects: { y: 0.18, scale: 0.92, fade: 0.55, spin: 0.84 },
    skills: { y: -0.02, scale: 1.02, fade: 0.7, spin: 0.9 },
    experience: { y: -0.04, scale: 1.04, fade: 0.74, spin: 0.92 },
    about: { y: 0.06, scale: 1.12, fade: 0.82, spin: 0.75 },
    contact: { y: -0.14, scale: 0.88, fade: 0.4, spin: 0.6 },
  },
  /**
   * Slow orbit drift — tiny lateral + yaw; never flies off the horizon.
   * Angle = time * rate + scroll * scrollTurns * π.
   */
  orbit: {
    x: 0.16,
    y: 0.04,
    yaw: 0.07,
    bank: 0.035,
    /** Continuous idle radians / second */
    rate: 0.085,
    /** Extra turns across full page scroll */
    scrollTurns: 0.55,
  },
  orbitMobile: {
    x: 0.1,
    y: 0.028,
    yaw: 0.05,
    bank: 0.025,
    rate: 0.07,
    scrollTurns: 0.45,
  },
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

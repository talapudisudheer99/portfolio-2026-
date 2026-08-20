/** Engineering Trace motion language — docs/phases/motion/README.md */

export const easeOut = [0.22, 1, 0.36, 1] as const

/** Distinct timing families (seconds) */
export const duration = {
  /** Micro: arrows, dots, rule draw */
  micro: 0.35,
  /** Trace: node/row settle */
  trace: 0.5,
  /** Editorial supporting copy */
  copy: 0.55,
  /** Hero / display masked lines */
  hero: 0.72,
} as const

/** Keep Y travel small — never large slides. Masked lines rise via CSS. */
export const rise = {
  sm: 10,
  md: 16,
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

/** Scroll-linked depth — Podium-style restraint, not carnival parallax. */
export const parallax = {
  /** Hero grid / ambient background */
  bg: -0.14,
  /** Section eyebrows, kickers */
  mid: -0.06,
  /** Foreground accents */
  fg: 0.08,
  /** ScrollEmergence travel (px) */
  emerge: 36,
  /** Footer negative lift (px) */
  footer: -28,
  /** Drawer sheet spring (enter scrub smoothing) */
  drawerSpring: {
    stiffness: 118,
    damping: 30,
    restDelta: 0.001,
  },
  /** Featured work — headline vs product surface */
  product: {
    headlineY: [36, -24] as const,
    panelY: [34, -46] as const,
    panelX: [8, -8] as const,
    panelScale: [0.95, 1, 0.985] as const,
    panelRotate: [1.1, -0.8] as const,
    glowY: [78, -44] as const,
  },
} as const

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

/** @deprecated Prefer gap / duration.trace — kept for any residual imports */
export const stagger = {
  fast: gap.facts,
  base: gap.nodes,
  slow: gap.rows,
} as const

export const staggerParent = traceParent
export const staggerChild = traceNodeChild

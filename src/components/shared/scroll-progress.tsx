"use client"

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"

/** Thin reading progress under the sticky nav. Hidden when reduced motion. */
export function ScrollProgress() {
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  })

  if (prefersReducedMotion) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-primary"
      style={{ scaleX }}
    />
  )
}

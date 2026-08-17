"use client"

import { motion, useScroll, useSpring } from "framer-motion"

/**
 * Thin reading progress under the sticky nav.
 * CSS hides it for reduced motion so server and client render the same tree.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      className="scroll-progress pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-primary"
      style={{ scaleX }}
    />
  )
}

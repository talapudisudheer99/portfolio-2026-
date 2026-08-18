"use client"

import { useScroll, useSpring } from "framer-motion"
import { useEffect, useRef } from "react"

/**
 * Thin reading progress under the sticky nav.
 * Plain DOM + a subscription, so Framer cannot write a client-only transform
 * that mismatches the server HTML.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  })

  useEffect(() => {
    return scaleX.on("change", (value) => {
      const node = ref.current
      if (node) node.style.transform = `scaleX(${value})`
    })
  }, [scaleX])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="scroll-progress pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-primary"
      style={{ transform: "scaleX(0)" }}
    />
  )
}

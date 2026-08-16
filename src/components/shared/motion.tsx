"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

import { easeOut, viewportOnce } from "@/lib/motion"

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

/** One of only two site-wide motion patterns: restrained section reveal. */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 18,
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.5, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

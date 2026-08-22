"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import type { ReactNode } from "react"
import { useRef } from "react"

import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import { parallax } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface ParallaxFooterProps {
  children: ReactNode
  className?: string
}

/** Footer lifts against scroll — negative parallax inertia. */
export function ParallaxFooter({
  children,
  className,
}: Readonly<ParallaxFooterProps>) {
  const ref = useRef<HTMLElement>(null)
  const prefersReducedMotion = useHydratedReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [parallax.footer, 0])

  if (prefersReducedMotion) {
    return (
      <footer ref={ref} className={className}>
        {children}
      </footer>
    )
  }

  return (
    <footer ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </footer>
  )
}

/** Fixed film grain — CSS only, no mix-blend (Safari/Firefox paint tax). */
export function ScrollGrain() {
  const prefersReducedMotion = useHydratedReducedMotion()

  if (prefersReducedMotion) return null

  return (
    <div
      aria-hidden="true"
      className="scroll-grain pointer-events-none fixed inset-0 z-40"
    />
  )
}

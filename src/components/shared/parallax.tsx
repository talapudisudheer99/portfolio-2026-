"use client"

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import type { ReactNode } from "react"
import { useRef } from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"
import { parallax } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface ParallaxFloatProps {
  children: ReactNode
  className?: string
  /** Multiplier on page scrollY. Negative = lag (background), positive = lead. */
  speed?: number
}

/** Ties movement to global scroll — hero grid, ambient layers. */
export function ParallaxFloat({
  children,
  className,
  speed = parallax.mid,
}: Readonly<ParallaxFloatProps>) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useHydratedReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const smooth = useSpring(scrollYProgress, parallax.drawerSpring)
  const distance = speed * 160
  const y = useTransform(smooth, [0, 1], [distance * -0.5, distance * 0.5])

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

interface ParallaxLayerProps {
  children: ReactNode
  className?: string
  /** Viewport-relative travel. Negative = slower depth layer. */
  speed?: number
}

/** Element-scoped parallax as it crosses the viewport. */
export function ParallaxLayer({
  children,
  className,
  speed = parallax.mid,
}: Readonly<ParallaxLayerProps>) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useHydratedReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const travel = speed * 100
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${travel * -0.5}%`, `${travel * 0.5}%`]
  )

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

interface ScrollEmergenceProps {
  children: ReactNode
  className?: string
  /** Extra px travel at the start of the reveal. */
  distance?: number
}

/**
 * Podium-style emergence: copy and blocks materialize as scroll brings them
 * into focus — scrubbed, not one-shot.
 */
export function ScrollEmergence({
  children,
  className,
  distance = parallax.emerge,
}: Readonly<ScrollEmergenceProps>) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useHydratedReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.94", "start 0.58"],
  })
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  })
  const opacity = useTransform(smooth, [0, 0.35, 1], [0.12, 0.72, 1])
  const y = useTransform(smooth, [0, 1], [distance, 0])

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  )
}

interface ScrollRevealProps {
  children: ReactNode
  className?: string
}

/** Media and panels open via clip-path as they enter the viewport. */
export function ScrollReveal({
  children,
  className,
}: Readonly<ScrollRevealProps>) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useHydratedReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.45"],
  })
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.001,
  })
  const clipPath = useTransform(
    smooth,
    [0, 1],
    ["inset(8% 12% 8% 12% round 2px)", "inset(0% 0% 0% 0% round 0px)"]
  )

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} style={{ clipPath }} className={className}>
      {children}
    </motion.div>
  )
}

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

/** Fixed film grain — Podium-adjacent texture without WebGL. */
export function ScrollGrain() {
  const prefersReducedMotion = useHydratedReducedMotion()

  if (prefersReducedMotion) return null

  return (
    <div
      aria-hidden="true"
      className="scroll-grain pointer-events-none fixed inset-0 z-40 mix-blend-multiply dark:mix-blend-soft-light"
    />
  )
}

interface ScrollCueProps {
  className?: string
}

/** Hero scroll affordance — fades once the reader moves. */
export function ScrollCue({ className }: Readonly<ScrollCueProps>) {
  const prefersReducedMotion = useHydratedReducedMotion()
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 120], [1, 0])
  const y = useTransform(scrollY, [0, 120], [0, 16])

  if (prefersReducedMotion) return null

  return (
    <motion.div
      style={{ opacity, y }}
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-2",
        className
      )}
      aria-hidden="true"
    >
      <span className="type-meta text-muted-foreground">
        Scroll
      </span>
      <span className="scroll-cue-line block h-8 w-px origin-top bg-border" />
    </motion.div>
  )
}

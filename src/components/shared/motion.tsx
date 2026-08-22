"use client"

import {
  motion,
  useInView,
} from "framer-motion"
import type { CSSProperties, ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"

import {
  duration,
  easeOut,
  gap,
  rise,
  traceNodeChild,
  traceParent,
  traceRowChild,
  viewportOnce,
} from "@/lib/motion"
import { cn } from "@/lib/utils"

/** First paint stays masked; the next frame starts CSS animations. */
export function useMountReveal(enabled = true) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!enabled) return

    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setRevealed(true))
    })

    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [enabled])

  return revealed
}

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  x?: number
  /** When true, animates on mount instead of whileInView (hero signature). */
  onMount?: boolean
}

/** Supporting copy / section block arrive — never the hero signature beat. */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = rise.sm,
  x = 0,
  onMount = false,
}: FadeInProps) {
  const prefersReducedMotion = useHydratedReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  if (onMount) {
    return (
      <motion.div
        initial={{ opacity: 0, y, x }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: duration.copy, delay, ease: easeOut }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={viewportOnce}
      transition={{ duration: duration.copy, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface MaskedLineProps {
  children: ReactNode
  className?: string
  delay?: number
  /** Longer display-type timing for hero/editorial headlines. */
  display?: boolean
  onMount?: boolean
  /** Seconds. Overrides display/trace defaults. */
  durationSec?: number
  /** Use `span` inside headings so SSR does not hoist the mask out of `h1`. */
  as?: "div" | "span"
  /** Full-ink clip — no fade. Hero signature only. */
  ink?: boolean
}

/**
 * True line mask: outer clip + inner rise.
 * Put grid/layout classes on `className` (outer wrapper) so columns stay intact.
 *
 * The rise is a percentage of the line's own height. Framer Motion leaves
 * percentage transforms stuck at their start value, so CSS owns the motion
 * (`@keyframes mask-rise`). This only decides when to reveal. Reduced motion
 * is handled by the stylesheet, which keeps server and client markup identical.
 */
export function MaskedLine({
  children,
  className,
  delay = 0,
  display = false,
  onMount = false,
  durationSec,
  as: Tag = "div",
  ink = false,
}: MaskedLineProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, viewportOnce)
  const mountRevealed = useMountReveal(onMount)

  const revealed = onMount ? mountRevealed : inView
  const time = durationSec ?? (display ? duration.hero : duration.trace)
  const Inner = Tag === "span" ? "span" : "div"

  return (
    <Tag
      ref={ref as never}
      className={cn("mask-line", ink && "mask-line-ink", className)}
      style={
        {
          "--mask-duration": `${time}s`,
          "--mask-delay": `${delay}s`,
        } as CSSProperties
      }
    >
      <Inner className={cn("mask-line-inner", revealed && "is-revealed")}>
        {children}
      </Inner>
    </Tag>
  )
}

interface TraceRuleProps {
  className?: string
  delay?: number
  onMount?: boolean
  /** Origin of the draw. */
  origin?: "left" | "right" | "center"
}

/** Decorative hairline that draws via scaleX. Always aria-hidden. */
export function TraceRule({
  className,
  delay = 0,
  onMount = false,
  origin = "left",
}: TraceRuleProps) {
  const prefersReducedMotion = useHydratedReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden="true"
        className={cn("h-px w-full bg-border", className)}
      />
    )
  }

  const motionProps = onMount
    ? { initial: { scaleX: 0 }, animate: { scaleX: 1 } }
    : {
        initial: { scaleX: 0 },
        whileInView: { scaleX: 1 },
        viewport: viewportOnce,
      }

  return (
    <motion.div
      aria-hidden="true"
      {...motionProps}
      transition={{ duration: duration.micro, delay, ease: easeOut }}
      className={cn(
        "h-px w-full origin-left bg-border",
        origin === "right" && "origin-right",
        origin === "center" && "origin-center",
        className
      )}
    />
  )
}

interface TraceSequenceProps {
  children: ReactNode
  className?: string
  gap?: number
  delayChildren?: number
  onMount?: boolean
  as?: "div" | "ol" | "ul" | "dl"
}

/** Parent for TraceNode / TraceRow children. */
export function TraceSequence({
  children,
  className,
  gap: childGap = gap.nodes,
  delayChildren = 0.05,
  onMount = false,
  as = "div",
}: TraceSequenceProps) {
  const prefersReducedMotion = useHydratedReducedMotion()

  if (prefersReducedMotion) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  const variants = {
    ...traceParent,
    visible: {
      transition: {
        staggerChildren: childGap,
        delayChildren,
      },
    },
  }

  const Component =
    as === "ol"
      ? motion.ol
      : as === "ul"
        ? motion.ul
        : as === "dl"
          ? motion.dl
          : motion.div

  if (onMount) {
    return (
      <Component
        initial="hidden"
        animate="visible"
        variants={variants}
        className={className}
      >
        {children}
      </Component>
    )
  }

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants}
      className={className}
    >
      {children}
    </Component>
  )
}

interface TraceNodeProps {
  children: ReactNode
  className?: string
  as?: "div" | "li"
}

/** Activating system node (product surface columns, architecture cells). */
export function TraceNode({ children, className, as = "div" }: TraceNodeProps) {
  const prefersReducedMotion = useHydratedReducedMotion()
  const Component = as === "li" ? motion.li : motion.div

  if (prefersReducedMotion) {
    const Static = as === "li" ? "li" : "div"
    return <Static className={className}>{children}</Static>
  }

  return (
    <Component variants={traceNodeChild} className={className}>
      {children}
    </Component>
  )
}

interface TraceRowProps {
  children: ReactNode
  className?: string
  as?: "div" | "li"
}

/**
 * List/timeline row: border settles with the row (use border classes on the row).
 * Prefer TraceSequence as="ol|ul" + TraceRow as="li".
 */
export function TraceRow({ children, className, as = "div" }: TraceRowProps) {
  const prefersReducedMotion = useHydratedReducedMotion()
  const Component = as === "li" ? motion.li : motion.div

  if (prefersReducedMotion) {
    const Static = as === "li" ? "li" : "div"
    return <Static className={className}>{children}</Static>
  }

  return (
    <Component variants={traceRowChild} className={className}>
      {children}
    </Component>
  )
}

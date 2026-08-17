"use client"

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import type { MotionValue } from "framer-motion"
import type { CSSProperties, ReactNode } from "react"
import { useRef, useSyncExternalStore } from "react"

import {
  duration,
  easeOut,
  fadeRise,
  gap,
  rise,
  traceNodeChild,
  traceParent,
  traceRowChild,
  viewportOnce,
} from "@/lib/motion"
import { cn } from "@/lib/utils"

/** The snapshot never changes after hydration, so there is nothing to watch. */
const subscribeNever = () => () => {}

/** Keeps the server and first client render identical, then applies the choice. */
export function useHydratedReducedMotion() {
  const prefersReducedMotion = useReducedMotion()
  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )

  return hydrated && prefersReducedMotion === true
}

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  /** When true, animates on mount instead of whileInView (hero signature). */
  onMount?: boolean
}

/** Supporting copy only — never the signature beat. */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = rise.md,
  onMount = false,
}: FadeInProps) {
  const prefersReducedMotion = useHydratedReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  if (onMount) {
    return (
      <motion.div
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.copy, delay, ease: easeOut }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
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
}

/**
 * True line mask: outer clip + inner rise.
 * Put grid/layout classes on `className` (outer wrapper) so columns stay intact.
 *
 * The rise is a percentage of the line's own height. Framer Motion leaves
 * percentage transforms stuck at their start value, so the transition lives in
 * CSS (`.mask-line-inner`) and this only decides when to reveal. Reduced motion
 * is handled by the stylesheet, which keeps server and client markup identical.
 */
export function MaskedLine({
  children,
  className,
  delay = 0,
  display = false,
  onMount = false,
}: MaskedLineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, viewportOnce)
  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )

  const revealed = onMount ? hydrated : inView
  const time = display ? duration.hero : duration.trace

  return (
    <div ref={ref} className={cn("mask-line", className)}>
      <div
        className={cn("mask-line-inner", revealed && "is-revealed")}
        style={
          {
            "--mask-duration": `${time}s`,
            "--mask-delay": `${delay}s`,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  )
}

/** @deprecated Use MaskedLine — alias kept during migration. */
export const Reveal = MaskedLine

interface WordRevealProps {
  text: string
  className?: string
  /** Delay before the first word moves. */
  delay?: number
  /** Spacing between consecutive words. */
  step?: number
  onMount?: boolean
}

/**
 * Settles a headline one word at a time. Words stay in normal inline flow so the
 * line still wraps, and the entrance is rise + fade + defocus rather than a clip
 * (a clip would only mask the last visual line once the headline wraps).
 *
 * Unlike `MaskedLine` this travels in pixels, so Framer can own the animation —
 * which also avoids depending on the browser painting a CSS start state first.
 */
export function WordReveal({
  text,
  className,
  delay = 0,
  step = 0.11,
  onMount = false,
}: WordRevealProps) {
  const prefersReducedMotion = useHydratedReducedMotion()
  const words = text.split(" ")

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>
  }

  const sequence = {
    hidden: {},
    visible: { transition: { staggerChildren: step, delayChildren: delay } },
  }

  const word = {
    hidden: { opacity: 0, y: 26, filter: "blur(9px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: duration.hero, ease: easeOut },
    },
  }

  const activation = onMount
    ? { initial: "hidden", animate: "visible" }
    : { initial: "hidden", whileInView: "visible", viewport: viewportOnce }

  return (
    <motion.span variants={sequence} {...activation} className={className}>
      {words.map((value, index) => (
        <span key={`${value}-${index}`}>
          {index > 0 ? " " : null}
          <motion.span variants={word} className="inline-block">
            {value}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

interface ScrollWordProps {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  from: number
}

/**
 * One word of a scrubbed paragraph. This has to be its own component because
 * `useTransform` is a hook — calling it inside the parent's `.map()` would break
 * the rules of hooks the moment the word count changed.
 */
function ScrollWord({ children, progress, range, from }: ScrollWordProps) {
  const opacity = useTransform(progress, range, [from, 1])

  return <motion.span style={{ opacity }}>{children}</motion.span>
}

interface ScrollWordRevealProps {
  text: string
  className?: string
  /** Resting opacity of words the reader has not reached yet. */
  from?: number
}

/**
 * Long-form statement that lights up word by word as it passes through the
 * viewport. Unlike the one-shot reveals, this is scrubbed: progress is tied to
 * scroll position, so the reader controls the pace and can scrub back.
 *
 * Words stay legible at `from` rather than starting at zero — a paragraph of
 * invisible text reads as a layout bug while it is only partly revealed.
 */
export function ScrollWordReveal({
  text,
  className,
  from = 0.16,
}: ScrollWordRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const prefersReducedMotion = useHydratedReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.65"],
  })

  if (prefersReducedMotion) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    )
  }

  const words = text.split(" ")

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          {index > 0 ? " " : null}
          <ScrollWord
            progress={scrollYProgress}
            range={[index / words.length, (index + 1) / words.length]}
            from={from}
          >
            {word}
          </ScrollWord>
        </span>
      ))}
    </p>
  )
}

interface TraceRuleProps {
  className?: string
  delay?: number
  onMount?: boolean
  /** Origin of the draw. */
  origin?: "left" | "right"
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

/** Aliases for gradual migration from Stagger API */
export const Stagger = TraceSequence
export const StaggerItem = TraceNode
export const TraceRows = TraceSequence

export { duration, easeOut, fadeRise, gap, rise, viewportOnce }

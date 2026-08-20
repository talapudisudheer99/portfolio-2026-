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
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import type { HeadlineSegment } from "@/types"

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

/**
 * Sitewide section-arrive (Phase 07.2). Same as FadeIn — prefer this name for
 * block wrappers so ScrollEmergence does not re-enter the stack.
 */
export const SectionArrive = FadeIn

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

/** @deprecated Use MaskedLine — alias kept during migration. */
export const Reveal = MaskedLine

interface WordRevealProps {
  segments: HeadlineSegment[]
  className?: string
  /** Applied to segments flagged as the accent. */
  accentClassName?: string
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
  segments,
  className,
  accentClassName,
  delay = 0,
  step = 0.11,
  onMount = false,
}: WordRevealProps) {
  const prefersReducedMotion = useHydratedReducedMotion()

  if (prefersReducedMotion) {
    return (
      <span className={className}>
        {segments.map((segment, index) => (
          <span key={`${segment.text}-${index}`}>
            {index > 0 ? " " : null}
            <span className={segment.accent ? accentClassName : undefined}>
              {segment.text}
            </span>
          </span>
        ))}
      </span>
    )
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
      {segments.map((segment, index) => (
        <span key={`${segment.text}-${index}`}>
          {index > 0 ? " " : null}
          <motion.span
            variants={word}
            className={
              segment.accent
                ? `inline-block ${accentClassName ?? ""}`
                : "inline-block"
            }
          >
            {segment.text}
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
  accent?: boolean
  lift?: number
}

/**
 * One word of a scrubbed paragraph. This has to be its own component because
 * `useTransform` is a hook — calling it inside the parent's `.map()` would break
 * the rules of hooks the moment the word count changed.
 */
function ScrollWord({
  children,
  progress,
  range,
  from,
  accent = false,
  lift = 5,
}: ScrollWordProps) {
  const opacity = useTransform(progress, range, [from, 1])
  const y = useTransform(progress, range, [lift, 0])

  return (
    <motion.span
      style={{ opacity, y, display: "inline-block" }}
      className={accent ? "text-primary" : undefined}
    >
      {children}
    </motion.span>
  )
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

interface EditorialWordRevealProps {
  lines: string[]
  className?: string
  /** Resting opacity before a word is reached. */
  from?: number
  /** Subtle rise (px) as each word lights up. */
  lift?: number
  accentWords?: string[]
}

function isAccentWord(word: string, accentWords: string[]) {
  const bare = word.replace(/[^a-zA-Z0-9]/g, "")
  return accentWords.some(
    (accent) =>
      bare.toLowerCase() === accent.toLowerCase() ||
      bare.toLowerCase().startsWith(accent.toLowerCase())
  )
}

/**
 * Multi-line editorial statement — words light up in sequence as the reader
 * scrolls, with accent hits and a longer scrub window for engagement.
 */
export function EditorialWordReveal({
  lines,
  className,
  from = 0.38,
  lift = 6,
  accentWords = ["Sameward", "context", "AI", "workspace"],
}: EditorialWordRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useHydratedReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.4"],
  })

  const totalWords = lines.reduce(
    (count, line) => count + line.split(" ").length,
    0
  )

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {lines.map((line) => (
          <p key={line} className="projects-problem-line editorial-display">
            {line}
          </p>
        ))}
      </div>
    )
  }

  const lineStarts = lines.map((_, lineIndex) =>
    lines
      .slice(0, lineIndex)
      .reduce((sum, line) => sum + line.split(" ").length, 0)
  )

  return (
    <div ref={ref} className={className}>
      {lines.map((line, lineIndex) => {
        const words = line.split(" ")
        const lineStart = lineStarts[lineIndex] ?? 0
        const isResolution = lineIndex === lines.length - 1

        return (
          <p
            key={line}
            className={
              isResolution
                ? "projects-problem-line projects-problem-line--resolution editorial-display"
                : "projects-problem-line editorial-display"
            }
          >
            {words.map((word, wordIndex) => {
              const globalIndex = lineStart + wordIndex

              return (
                <span key={`${word}-${wordIndex}`}>
                  {wordIndex > 0 ? " " : null}
                  <ScrollWord
                    progress={scrollYProgress}
                    range={[
                      globalIndex / totalWords,
                      (globalIndex + 1) / totalWords,
                    ]}
                    from={from}
                    lift={lift}
                    accent={isAccentWord(word, accentWords)}
                  >
                    {word}
                  </ScrollWord>
                </span>
              )
            })}
          </p>
        )
      })}
    </div>
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

interface HoverLiftProps {
  children: ReactNode
  className?: string
  y?: number
}

export function HoverLift({ children, className, y = -4 }: HoverLiftProps) {
  const prefersReducedMotion = useHydratedReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      whileHover={{ y, transition: { duration: 0.25, ease: easeOut } }}
    >
      {children}
    </motion.div>
  )
}

interface ImageRevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function ImageReveal({
  children,
  className,
  delay = 0,
}: ImageRevealProps) {
  const prefersReducedMotion = useHydratedReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={{ clipPath: "inset(8% 12% 8% 12% round 4px)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, delay, ease: easeOut }}
    >
      <motion.div
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.9, delay, ease: easeOut }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/** Aliases for gradual migration from Stagger API */
export const Stagger = TraceSequence
export const StaggerItem = TraceNode
export const TraceRows = TraceSequence

export { duration, easeOut, fadeRise, gap, rise, viewportOnce }

"use client"

import { AnimatePresence, motion } from "framer-motion"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"
import { duration, easeOut } from "@/lib/motion"

const messages = [
  {
    id: "maya",
    initials: "MA",
    name: "Maya",
    time: "9:41",
    body: "Can we get onboarding out this week?",
  },
  {
    id: "dev",
    initials: "DV",
    name: "Dev",
    time: "9:42",
    body: "API is ready. Waiting on the final flow.",
  },
]

const START = 0.5
const STEP = 0.14

const AI_SUMMARY = "Caught up on 24 messages — 3 open decisions."
const AI_BLOCKER = "Blocker: billing owner is unassigned."
/** Roughly when the AI row has finished entering, so it composes on cue. */
const AI_TYPE_START = 1500

/**
 * Each element owns its delay rather than inheriting a parent variant. Variant
 * propagation through nested plain DOM has silently left content at opacity 0
 * in this project before, and an invisible hero panel is not a failure worth
 * risking for a slightly tidier component.
 */
function Line({
  order,
  still,
  className,
  children,
}: Readonly<{
  order: number
  still: boolean
  className?: string
  children: ReactNode
}>) {
  if (still) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: duration.trace,
        ease: easeOut,
        delay: START + order * STEP,
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * The AI summary composes itself one character at a time, then the blocker
 * fades in. This is the one animation worth the complexity: a hiring reader
 * watching a real typing state machine is the proof, not a static mock. Driven
 * by React state + timeouts rather than variant inheritance, which has silently
 * left content invisible in this project before.
 */
function AiReply({ still }: Readonly<{ still: boolean }>) {
  // Character count so far; state is left at 0 when reduced motion wins.
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (still) return

    let cancelled = false
    let step: ReturnType<typeof setTimeout>
    let index = 0

    const type = () => {
      if (cancelled) return
      index += 1
      setCount(index)
      if (index < AI_SUMMARY.length) {
        step = setTimeout(type, 34)
      } else {
        step = setTimeout(() => {
          if (!cancelled) setDone(true)
        }, 280)
      }
    }

    const kickoff = setTimeout(type, AI_TYPE_START)

    return () => {
      cancelled = true
      clearTimeout(step)
      clearTimeout(kickoff)
    }
  }, [still])

  // Reduced motion renders the finished line; otherwise follow the timers.
  const summary = still ? AI_SUMMARY : AI_SUMMARY.slice(0, count)
  const finished = still || done

  return (
    <div className="border-l-2 border-primary pl-3.5">
      <p className="font-mono text-[10px] tracking-[0.14em] text-primary uppercase">
        Channel AI
      </p>
      <p className="mt-1.5 min-h-5 text-[13px] leading-snug text-foreground">
        {summary}
        {!finished && (
          <motion.span
            aria-hidden="true"
            className="ml-0.5 inline-block h-[0.95em] w-0.5 translate-y-px bg-primary align-middle"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
        )}
      </p>
      <AnimatePresence>
        {finished && (
          <motion.p
            initial={still ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.trace, ease: easeOut }}
            className="mt-1 text-[13px] leading-snug text-foreground-secondary"
          >
            {AI_BLOCKER}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Keeps cycling so the panel reads live rather than frozen. */
function TypingDots({ still }: Readonly<{ still: boolean }>) {
  if (still) {
    return <span className="text-muted-foreground">···</span>
  }

  return (
    <span className="inline-flex items-center gap-0.75">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="size-1 rounded-full bg-muted-foreground"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.18,
          }}
        />
      ))}
    </span>
  )
}

/** A card is justified here because a product surface is genuinely bounded. */
export function SamewardPanel({ className }: Readonly<{ className?: string }>) {
  const still = useHydratedReducedMotion()

  return (
    <figure
      className={`overflow-hidden rounded-(--radius) border border-border bg-card shadow-(--shadow-md) ${className ?? ""}`}
    >
      <Line
        order={0}
        still={still}
        className="flex items-center justify-between border-b border-border px-4 py-2.5"
      >
        <span className="font-mono text-[10px] tracking-[0.16em] text-foreground uppercase">
          Sameward
        </span>
        <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          <motion.span
            className="size-1.5 rounded-full bg-primary"
            animate={still ? undefined : { opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          3 online
        </span>
      </Line>

      <div className="px-4 py-3.5">
        <Line order={1} still={still}>
          <p className="font-mono text-[11px] text-muted-foreground"># launch</p>
        </Line>

        <div className="mt-3.5 flex flex-col gap-3.5">
          {messages.map((message, index) => (
            <Line
              key={message.id}
              order={2 + index}
              still={still}
              className="flex gap-3"
            >
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-background-tertiary font-mono text-[9px] tracking-[0.06em] text-foreground-secondary">
                {message.initials}
              </span>
              <div className="min-w-0">
                <p className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {message.name}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {message.time}
                  </span>
                </p>
                <p className="mt-1 text-[13px] leading-snug text-foreground-secondary">
                  {message.body}
                </p>
              </div>
            </Line>
          ))}

          {/* The AI block is the one element allowed to carry the accent. */}
          <Line order={2 + messages.length} still={still}>
            <AiReply still={still} />
          </Line>
        </div>
      </div>

      <Line
        order={3 + messages.length}
        still={still}
        className="flex items-center gap-2 border-t border-border px-4 py-2.5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase"
      >
        Maya is typing
        <TypingDots still={still} />
      </Line>
    </figure>
  )
}

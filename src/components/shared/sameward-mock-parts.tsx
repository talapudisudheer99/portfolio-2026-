"use client"

import { AnimatePresence, motion } from "framer-motion"
import { User } from "lucide-react"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  samewardMockTiming,
  samewardAvatarUrls,
  samewardTones,
  type SamewardPerson,
} from "@/data/sameward-mock"
import { duration, easeOut } from "@/lib/motion"
import { cn } from "@/lib/utils"

export function SamewardLine({
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
        delay: samewardMockTiming.lineStart + order * samewardMockTiming.lineStep,
      }}
    >
      {children}
    </motion.div>
  )
}

export function SamewardPersonAvatar({
  person,
  live = false,
  size = "sm",
}: Readonly<{
  person: SamewardPerson
  live?: boolean
  size?: "sm" | "md"
}>) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0",
        size === "md" ? "size-7" : "size-6"
      )}
    >
      <Avatar
        className={cn(size === "md" ? "size-7" : "size-6", samewardTones[person])}
      >
        <AvatarImage src={samewardAvatarUrls[person]} alt={person} />
        <AvatarFallback className={cn("bg-transparent", samewardTones[person])}>
          <User
            className={size === "md" ? "size-3.5" : "size-3"}
            aria-hidden="true"
          />
        </AvatarFallback>
      </Avatar>
      {live ? (
        <span className="absolute right-0 bottom-0 size-1.5 rounded-full bg-primary ring-2 ring-card" />
      ) : null}
    </span>
  )
}

export function SamewardAiReply({ still }: Readonly<{ still: boolean }>) {
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
      if (index < samewardMockTiming.aiSummary.length) {
        step = setTimeout(type, 34)
      } else {
        step = setTimeout(() => {
          if (!cancelled) setDone(true)
        }, 280)
      }
    }

    const kickoff = setTimeout(type, samewardMockTiming.aiTypeStartMs)

    return () => {
      cancelled = true
      clearTimeout(step)
      clearTimeout(kickoff)
    }
  }, [still])

  const summary = still ? samewardMockTiming.aiSummary : samewardMockTiming.aiSummary.slice(0, count)
  const finished = still || done

  return (
    <div className="border-l-2 border-primary pl-3">
      <p className="type-micro text-primary">Channel AI</p>
      <p className="sameward-message-body mt-1.5 min-h-5 text-foreground">
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
            className="sameward-message-body mt-1 text-foreground-secondary"
          >
            {samewardMockTiming.aiBlocker}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export function SamewardMessageReactions({
  reactions,
}: Readonly<{
  reactions: ReadonlyArray<{ emoji: string; count: number }>
}>) {
  if (!reactions.length) return null

  return (
    <ul className="sameward-reactions" aria-label="Reactions">
      {reactions.map((reaction) => (
        <li key={`${reaction.emoji}-${reaction.count}`}>
          <span className="sameward-reaction">
            <span aria-hidden="true">{reaction.emoji}</span>
            <span>{reaction.count}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export function SamewardTypingDots({ still }: Readonly<{ still: boolean }>) {
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

export function SamewardOnlinePulse({ still }: Readonly<{ still: boolean }>) {
  return (
    <motion.span
      className="size-1.5 rounded-full bg-primary"
      animate={still ? undefined : { opacity: [0.35, 1, 0.35] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

export function useSamewardMotion() {
  return useHydratedReducedMotion()
}

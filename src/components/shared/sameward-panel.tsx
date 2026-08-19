"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  AlignLeft,
  ArrowUp,
  MessageSquare,
  Paperclip,
  PenLine,
  Smile,
  Sparkles,
  User,
} from "lucide-react"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { duration, easeOut } from "@/lib/motion"
import { cn } from "@/lib/utils"

const channels = ["# general", "# product", "# development", "# design"] as const

const tones = {
  sam: "bg-[#1c2a36] text-[#9eb8c9]",
  aisha: "bg-[#2a1c20] text-[#d4a3a8]",
  rohit: "bg-[#1c211e] text-[#b7c2b8]",
  sudheer: "bg-[#161414] text-[#e0dedd]",
} as const

type Person = keyof typeof tones

const avatarUrls: Record<string, string> = {
  sam: "https://i.pravatar.cc/64?img=11",
  aisha: "https://i.pravatar.cc/64?img=5",
  rohit: "https://i.pravatar.cc/64?img=8",
  sudheer: "https://i.pravatar.cc/64?img=12",
}

const members = [
  { id: "sam", name: "Sam Chen", short: "Sam", status: "Online" },
  { id: "aisha", name: "Aisha Patel", short: "Aisha", status: "Online" },
  { id: "rohit", name: "Rohit Singh", short: "Rohit", status: "Online" },
] as const

const messages = [
  {
    id: "sam",
    name: "Sam Chen",
    time: "9:41",
    body: "Product sync at 10 — agenda shared.",
    reactions: [{ emoji: "👍", count: 2 }],
  },
  {
    id: "aisha",
    name: "Aisha Patel",
    time: "9:42",
    body: "Deploy runbook for Friday: docs.northwind.dev",
    reactions: [
      { emoji: "🚀", count: 1 },
      { emoji: "👀", count: 1 },
    ],
  },
  {
    id: "rohit",
    name: "Rohit Singh",
    time: "9:44",
    body: "I pushed the notification debounce fix. QA build is ready.",
    reactions: [{ emoji: "✅", count: 2 }],
  },
  {
    id: "sam",
    name: "Sam Chen",
    time: "9:46",
    body: "Nice. Let's ship after smoke test and update the release notes.",
    reactions: [{ emoji: "👍", count: 1 }],
  },
] as const

const aiActions = [
  { id: "summarize", label: "Summarize", icon: AlignLeft, accent: "cyan" },
  { id: "catch-up", label: "Catch up", icon: Sparkles, accent: "violet" },
  { id: "ask", label: "Ask", icon: MessageSquare, accent: "blue" },
  { id: "draft", label: "Draft reply", icon: PenLine, accent: "pink" },
] as const

type AiAccent = (typeof aiActions)[number]["accent"]

const aiActionTone: Record<AiAccent, { box: string; icon: string }> = {
  cyan: {
    box: "border-cyan-400/40 bg-cyan-400/10",
    icon: "bg-cyan-400/25 text-cyan-400",
  },
  violet: {
    box: "border-violet-400/40 bg-violet-400/10",
    icon: "bg-violet-400/25 text-violet-400",
  },
  blue: {
    box: "border-blue-400/40 bg-blue-400/10",
    icon: "bg-blue-400/25 text-blue-400",
  },
  pink: {
    box: "border-pink-400/40 bg-pink-400/10",
    icon: "bg-pink-400/25 text-pink-400",
  },
}

const START = 0.5
const STEP = 0.14

const AI_SUMMARY =
  "Catch-up · last 7 days — sync today, Friday deploy runbook linked."
const AI_BLOCKER = "1 linked page read for context."
const AI_TYPE_START = 1500

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

function PersonAvatar({
  person,
  live = false,
  size = "sm",
}: Readonly<{
  person: Person
  live?: boolean
  size?: "sm" | "md"
}>) {
  return (
    <span className="relative shrink-0">
      <Avatar
        className={cn(size === "md" ? "size-7" : "size-6", tones[person])}
      >
        <AvatarImage src={avatarUrls[person]} alt={person} />
        <AvatarFallback className={cn("bg-transparent", tones[person])}>
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

function AiReply({ still }: Readonly<{ still: boolean }>) {
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

  const summary = still ? AI_SUMMARY : AI_SUMMARY.slice(0, count)
  const finished = still || done

  return (
    <div className="border-l-2 border-primary pl-3">
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

function MessageReactions({
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
export function SamewardPanel({
  className,
  embedded = false,
}: Readonly<{ className?: string; embedded?: boolean }>) {
  const still = useHydratedReducedMotion()

  return (
    <figure
      className={cn(
        "sameward-app overflow-hidden bg-card",
        embedded
          ? "border-0 shadow-none"
          : "rounded-(--radius) border border-border shadow-(--shadow-md)",
        className
      )}
    >
      <aside className="sameward-rail sameward-rail--nav">
        <p className="editorial-display text-[1.05rem] leading-none font-medium tracking-[-0.03em]">
          SAMEWARD
        </p>

        <p className="sameward-kicker mt-5">Channels</p>
        <ul className="mt-1.5 space-y-0.5">
          {channels.map((channel) => {
            const active = channel === "# general"

            return (
              <li key={channel}>
                <span
                  className={cn("sameward-channel", active && "is-active")}
                >
                  {channel}
                </span>
              </li>
            )
          })}
        </ul>

        <p className="sameward-kicker mt-5">Direct messages</p>
        <ul className="mt-2 space-y-2">
          {members.map((member) => (
            <li key={member.id} className="flex items-center gap-2">
              <PersonAvatar person={member.id} live />
              <span className="truncate text-[11px] font-semibold text-foreground-secondary">
                {member.name}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center gap-2 border-t border-border pt-3">
          <PersonAvatar person="sudheer" live />
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold">Sudheer</p>
            <p className="font-mono text-[9px] tracking-[0.12em] text-primary uppercase">
              Online
            </p>
          </div>
        </div>
      </aside>

      <div className="sameward-thread">
        <Line
          order={0}
          still={still}
          className="flex items-center justify-between border-b border-border px-4 py-2.5"
        >
          <p className="font-mono text-[11px] text-foreground"># general</p>
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase lg:hidden">
            <motion.span
              className="size-1.5 rounded-full bg-primary"
              animate={still ? undefined : { opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            3 online
          </span>
        </Line>

        <div className="flex flex-1 flex-col px-4 py-3.5">
          <div className="flex flex-col gap-3.5">
            {messages.map((message, index) => (
              <Line
                key={`${message.id}-${index}`}
                order={1 + index}
                still={still}
                className="flex gap-2.5"
              >
                <PersonAvatar person={message.id} size="md" />
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
                  <MessageReactions reactions={message.reactions} />
                </div>
              </Line>
            ))}

            <Line order={1 + messages.length} still={still}>
              <AiReply still={still} />
            </Line>
          </div>
        </div>

        <Line
          order={2 + messages.length}
          still={still}
          className="px-4 pb-3"
        >
          <p className="mb-2 flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            Aisha is typing
            <TypingDots still={still} />
          </p>
          <div className="sameward-composer">
            <span className="min-w-0 flex-1 text-[12px] text-muted-foreground">
              Message #general
            </span>
            <Smile className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <Paperclip className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <span className="sameward-send">
              <ArrowUp className="size-3" aria-hidden="true" />
            </span>
          </div>
        </Line>
      </div>

      <aside className="sameward-rail sameward-rail--meta">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          <motion.span
            className="size-1.5 rounded-full bg-primary"
            animate={still ? undefined : { opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          3 online
        </p>

        <p className="sameward-kicker mt-5">Channel AI</p>
        <ul className="mt-2 space-y-1.5">
          {aiActions.map((action) => {
            const Icon = action.icon

            return (
              <li key={action.id}>
                <span
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-[11px] font-semibold text-foreground-secondary",
                    aiActionTone[action.accent].box
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-6 shrink-0 items-center justify-center rounded-md",
                      aiActionTone[action.accent].icon
                    )}
                  >
                    <Icon className="size-3.5 stroke-[2]" aria-hidden="true" />
                  </span>
                  {action.label}
                </span>
              </li>
            )
          })}
        </ul>

        <p className="sameward-kicker mt-5">Members — 3</p>
        <ul className="mt-2 space-y-2.5">
          {members.map((member) => (
            <li key={member.id} className="flex items-center gap-2">
              <PersonAvatar person={member.id} live />
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold">{member.short}</p>
                <p className="font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
                  {member.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </figure>
  )
}

"use client"

import {
  AlignLeft,
  ArrowUp,
  AtSign,
  Hash,
  Lock,
  MessageSquare,
  Paperclip,
  PenLine,
  Smile,
  Sparkles,
} from "lucide-react"
import { useEffect, useState } from "react"

import { SamewardMessageContent } from "@/components/shared/sameward-message-content"
import {
  SamewardPersonAvatar,
  SamewardTypingDots,
} from "@/components/shared/sameward-mock-parts"
import {
  samewardCatchUp,
  samewardDraft,
  samewardMembers,
  samewardMessages,
  samewardWorkspace,
} from "@/data/sameward-mock"
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import { cn } from "@/lib/utils"

const aiActions = [
  { id: "summarize", label: "Summarize", icon: AlignLeft },
  { id: "catch-up", label: "Catch up", icon: Sparkles, active: true },
  { id: "ask", label: "Ask", icon: MessageSquare },
  { id: "draft", label: "Draft reply", icon: PenLine },
] as const

/** Reveals the catch-up points one by one once the card is on screen. */
function useRevealCount(total: number, still: boolean) {
  const [el, setEl] = useState<HTMLDivElement | null>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!el || still) return
    let timer = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        io.disconnect()
        let n = 0
        const step = () => {
          n += 1
          setCount(n)
          if (n < total) timer = window.setTimeout(step, 420)
        }
        timer = window.setTimeout(step, 700)
      },
      { threshold: 0.6 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
    }
  }, [el, still, total])

  return [setEl, still ? total : count] as const
}

/**
 * Sameward product shot for desktop: a frameless glass window floating in
 * space, with Channel AI and a drafted reply as floating cards at different
 * depths (they parallax against the window on pointer move and on entry).
 * Mock content; layout mirrors the real app (workspace sidebar, channel
 * thread, Channel AI actions).
 */
export function SamewardWindow() {
  const still = useHydratedReducedMotion()
  const [catchUpRef, shown] = useRevealCount(samewardCatchUp.points.length, still)

  return (
    <div className="sw-scene" aria-label="Sameward product preview" role="img">
      <div className="sw-aura" aria-hidden="true" />

      <div className="sw-window" data-sw-layer="window">
        {/* Web app bar — Sameward runs in the browser */}
        <div className="sw-bar" aria-hidden="true">
          <span className="sw-bar-lights">
            <span />
            <span />
            <span />
          </span>
          <span className="sw-bar-url">
            <Lock className="size-3" strokeWidth={2} />
            sameward.com/northwind/general
          </span>
          <span className="sw-bar-spacer" />
        </div>

        <div className="sw-app">
          {/* Workspace sidebar */}
          <aside className="sw-side">
            <div className="sw-workspace">
              <span className="sw-workspace-badge">{samewardWorkspace.initial}</span>
              <span className="sw-workspace-name">{samewardWorkspace.name}</span>
            </div>

            <p className="sw-side-label">Channels</p>
            <ul className="sw-side-list">
              {samewardWorkspace.channels.map((channel) => (
                <li
                  key={channel.name}
                  className={cn("sw-channel", channel.active && "is-active")}
                >
                  <Hash className="size-3.5" strokeWidth={2} />
                  <span>{channel.name}</span>
                  {channel.unread ? (
                    <span className="sw-unread">{channel.unread}</span>
                  ) : null}
                </li>
              ))}
            </ul>

            <p className="sw-side-label">Direct messages</p>
            <ul className="sw-side-list">
              {samewardMembers.map((member) => (
                <li key={member.id} className="sw-dm">
                  <SamewardPersonAvatar person={member.id} live />
                  <span>{member.name}</span>
                </li>
              ))}
            </ul>

            <div className="sw-side-me">
              <SamewardPersonAvatar person="sudheer" live />
              <span>Sudheer</span>
            </div>
          </aside>

          {/* Channel thread */}
          <section className="sw-thread">
            <header className="sw-thread-head">
              <div className="min-w-0">
                <p className="sw-thread-title">
                  <Hash className="size-4" strokeWidth={2.2} />
                  general
                </p>
                <p className="sw-thread-topic">{samewardWorkspace.topic}</p>
              </div>
              <div className="sw-avatars" aria-hidden="true">
                {samewardMembers.map((member) => (
                  <SamewardPersonAvatar key={member.id} person={member.id} />
                ))}
                <span className="sw-avatars-count">3 online</span>
              </div>
            </header>

            <div className="sw-feed">
              <p className="sw-day">
                <span>Today</span>
              </p>
              {samewardMessages.map((message) => (
                <article key={message.id} className="sw-msg" data-sw-msg="">
                  <SamewardPersonAvatar person={message.id} size="md" />
                  <div className="min-w-0">
                    <p className="sw-msg-meta">
                      <span className="sw-msg-name">{message.name}</span>
                      <span className="sw-msg-time">{message.time}</span>
                    </p>
                    <SamewardMessageContent message={message} />
                  </div>
                </article>
              ))}
              <article className="sw-msg" data-sw-msg="">
                <SamewardPersonAvatar person="sam" size="md" />
                <div className="min-w-0">
                  <p className="sw-msg-meta">
                    <span className="sw-msg-name">Sam Chen</span>
                    <span className="sw-msg-time">9:46</span>
                  </p>
                  <p className="sameward-message-body mt-1 text-foreground-secondary">
                    <span className="sw-mention">
                      <AtSign className="size-3" strokeWidth={2.2} />
                      Channel AI
                    </span>{" "}
                    catch me up on this week?
                  </p>
                </div>
              </article>
            </div>

            <div className="sw-compose">
              <p className="sw-typing">
                Aisha is typing <SamewardTypingDots still={still} />
              </p>
              <div className="sameward-composer">
                <span className="sameward-composer-hint min-w-0 flex-1 truncate text-muted-foreground">
                  Message #general
                </span>
                <Smile className="size-3.5 text-muted-foreground" aria-hidden="true" />
                <Paperclip className="size-3.5 text-muted-foreground" aria-hidden="true" />
                <span className="sameward-send">
                  <ArrowUp className="size-3" aria-hidden="true" />
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Floating Channel AI card — nearer than the window */}
      <div className="sw-float sw-float--ai" data-sw-layer="ai" ref={catchUpRef}>
        <p className="sw-float-kicker">
          <Sparkles className="size-3.5" strokeWidth={2} />
          Channel AI
        </p>
        <ul className="sw-ai-actions" aria-hidden="true">
          {aiActions.map(({ id, label, icon: Icon, ...rest }) => (
            <li key={id} className={cn("sw-ai-chip", "active" in rest && "is-active")}>
              <Icon className="size-3" strokeWidth={2} />
              {label}
            </li>
          ))}
        </ul>
        <p className="sw-ai-title">{samewardCatchUp.title}</p>
        <ul className="sw-ai-points">
          {samewardCatchUp.points.map((point, i) => (
            <li key={point} className={cn(i < shown && "is-in")}>
              {point}
            </li>
          ))}
        </ul>
        <p className={cn("sw-ai-source", shown >= samewardCatchUp.points.length && "is-in")}>
          {samewardCatchUp.source}
        </p>
      </div>

      {/* Floating drafted reply — the user reviews and sends it */}
      <div className="sw-float sw-float--draft" data-sw-layer="draft">
        <p className="sw-float-kicker">
          <PenLine className="size-3.5" strokeWidth={2} />
          Draft reply
        </p>
        <p className="sw-draft-text">{samewardDraft.text}</p>
        <div className="sw-draft-actions" aria-hidden="true">
          <span className="sw-draft-btn">Edit</span>
          <span className="sw-draft-btn sw-draft-btn--send">
            Send <ArrowUp className="size-3" />
          </span>
        </div>
      </div>
    </div>
  )
}

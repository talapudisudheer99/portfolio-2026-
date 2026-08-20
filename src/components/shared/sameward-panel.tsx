"use client"

import {
  AlignLeft,
  ArrowUp,
  MessageSquare,
  Paperclip,
  PenLine,
  Smile,
  Sparkles,
} from "lucide-react"

import {
  SamewardAiReply,
  SamewardLine,
  SamewardMessageReactions,
  SamewardOnlinePulse,
  SamewardPersonAvatar,
  SamewardTypingDots,
  useSamewardMotion,
} from "@/components/shared/sameward-mock-parts"
import {
  samewardAiActionTone,
  samewardAiActions,
  samewardChannels,
  samewardMembers,
  samewardMessages,
  type SamewardAiAccent,
} from "@/data/sameward-mock"
import { cn } from "@/lib/utils"

const aiIcons = {
  summarize: AlignLeft,
  "catch-up": Sparkles,
  ask: MessageSquare,
  draft: PenLine,
} as const

/** Desktop/tablet three-column Sameward product surface. */
export function SamewardPanel({
  className,
  embedded = false,
}: Readonly<{ className?: string; embedded?: boolean }>) {
  const still = useSamewardMotion()

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
        <p className="sameward-brand editorial-display">SAMEWARD</p>

        <p className="sameward-kicker mt-5">Channels</p>
        <ul className="mt-1.5 space-y-0.5">
          {samewardChannels.map((channel) => {
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
          {samewardMembers.map((member) => (
            <li key={member.id} className="flex items-center gap-2">
              <SamewardPersonAvatar person={member.id} live />
              <span className="sameward-member-name truncate text-foreground-secondary">
                {member.name}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center gap-2 border-t border-border pt-3">
          <SamewardPersonAvatar person="sudheer" live />
          <div className="min-w-0">
            <p className="sameward-member-name truncate">Sudheer</p>
            <p className="type-micro text-primary">Online</p>
          </div>
        </div>
      </aside>

      <div className="sameward-thread">
        <SamewardLine
          order={0}
          still={still}
          className="sameward-thread-bar flex items-center justify-between border-b border-border px-4 py-2.5"
        >
          <p className="type-micro text-foreground"># general</p>
          <span className="type-micro inline-flex items-center gap-2 text-muted-foreground lg:hidden">
            <SamewardOnlinePulse still={still} />
            3 online
          </span>
        </SamewardLine>

        <div className="sameward-thread-feed flex flex-1 flex-col px-4 py-3.5">
          <div className="flex flex-col gap-3.5">
            {samewardMessages.map((message, index) => (
              <SamewardLine
                key={`${message.id}-${index}`}
                order={1 + index}
                still={still}
                className="flex gap-2.5"
              >
                <SamewardPersonAvatar person={message.id} size="md" />
                <div className="min-w-0">
                  <p className="flex items-baseline gap-2">
                    <span className="sameward-message-name text-foreground">
                      {message.name}
                    </span>
                    <span className="type-micro text-muted-foreground">
                      {message.time}
                    </span>
                  </p>
                  <p className="sameward-message-body mt-1 text-foreground-secondary">
                    {message.body}
                  </p>
                  <SamewardMessageReactions reactions={message.reactions} />
                </div>
              </SamewardLine>
            ))}

            <SamewardLine order={1 + samewardMessages.length} still={still}>
              <SamewardAiReply still={still} />
            </SamewardLine>
          </div>
        </div>

        <SamewardLine
          order={2 + samewardMessages.length}
          still={still}
          className="sameward-thread-composer shrink-0 px-4 pb-3"
        >
          <p className="type-micro mb-2 flex items-center gap-2 text-muted-foreground">
            Aisha is typing
            <SamewardTypingDots still={still} />
          </p>
          <div className="sameward-composer">
            <span className="sameward-composer-hint min-w-0 flex-1 text-muted-foreground">
              Message #general
            </span>
            <Smile className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <Paperclip className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <span className="sameward-send">
              <ArrowUp className="size-3" aria-hidden="true" />
            </span>
          </div>
        </SamewardLine>
      </div>

      <aside className="sameward-rail sameward-rail--meta">
        <p className="type-micro flex items-center gap-2 text-muted-foreground">
          <SamewardOnlinePulse still={still} />
          3 online
        </p>

        <p className="sameward-kicker mt-5">Channel AI</p>
        <ul className="mt-2 space-y-1.5">
          {samewardAiActions.map((action) => {
            const Icon = aiIcons[action.id]
            const tone = samewardAiActionTone[action.accent as SamewardAiAccent]

            return (
              <li key={action.id}>
                <span
                  className={cn(
                    "type-micro flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 font-semibold text-foreground-secondary",
                    tone.box
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-6 shrink-0 items-center justify-center rounded-md",
                      tone.icon
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
          {samewardMembers.map((member) => (
            <li key={member.id} className="flex items-center gap-2">
              <SamewardPersonAvatar person={member.id} live />
              <div className="min-w-0">
                <p className="sameward-member-name truncate">{member.short}</p>
                <p className="type-micro text-muted-foreground">{member.status}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </figure>
  )
}

"use client"

import { ArrowUp, Hash, Smile } from "lucide-react"

import {
  SamewardAiReply,
  SamewardLine,
  SamewardMessageReactions,
  SamewardOnlinePulse,
  SamewardPersonAvatar,
  useSamewardMotion,
} from "@/components/shared/sameward-mock-parts"
import { samewardMessages } from "@/data/sameward-mock"
import { cn } from "@/lib/utils"

/** Compact mobile chat — header, scroll feed, pinned composer. */
export function SamewardMobilePanel({
  className,
}: Readonly<{ className?: string }>) {
  const still = useSamewardMotion()
  const mobileMessages = samewardMessages.slice(0, 2)

  return (
    <figure
      className={cn(
        "sameward-mobile-app flex h-full min-h-0 flex-col overflow-hidden bg-card",
        className
      )}
    >
      <SamewardLine
        order={0}
        still={still}
        className="sameward-mobile-topbar shrink-0 border-b border-border px-3 py-2.5"
      >
        <div className="flex items-center gap-2.5">
          <SamewardPersonAvatar person="sam" size="md" />
          <div className="min-w-0 flex-1">
            <p className="sameward-mobile-channel flex items-center gap-1 text-foreground">
              <Hash className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="truncate">general</span>
            </p>
            <p className="type-micro mt-0.5 flex items-center gap-1.5 text-muted-foreground">
              <SamewardOnlinePulse still={still} />
              3 online
            </p>
          </div>
          <span className="sameward-mobile-brand shrink-0">SAMEWARD</span>
        </div>
      </SamewardLine>

      <div className="sameward-mobile-feed min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-2.5">
        <div className="flex flex-col gap-2.5">
          {mobileMessages.map((message, index) => (
            <SamewardLine
              key={`${message.id}-${index}`}
              order={1 + index}
              still={still}
              className="flex gap-2"
            >
              <SamewardPersonAvatar person={message.id} />
              <div className="min-w-0 flex-1">
                <p className="flex items-baseline gap-1.5">
                  <span className="sameward-message-name truncate text-foreground">
                    {message.name}
                  </span>
                  <span className="type-micro shrink-0 text-muted-foreground">
                    {message.time}
                  </span>
                </p>
                <p className="sameward-message-body mt-0.5 break-words text-foreground-secondary">
                  {message.body}
                </p>
                <MessageReactionsCompact reactions={message.reactions} />
              </div>
            </SamewardLine>
          ))}

          <SamewardLine order={1 + mobileMessages.length} still={still}>
            <SamewardAiReply still={still} />
          </SamewardLine>
        </div>
      </div>

      <SamewardLine
        order={2 + mobileMessages.length}
        still={still}
        className="sameward-mobile-footer shrink-0 border-t border-border px-3 pb-2 pt-2"
      >
        <div className="sameward-composer">
          <Smile className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="sameward-composer-hint min-w-0 flex-1 truncate text-muted-foreground">
            Message #general
          </span>
          <span className="sameward-send">
            <ArrowUp className="size-3" aria-hidden="true" />
          </span>
        </div>
        <span className="sameward-mobile-home-indicator" aria-hidden="true" />
      </SamewardLine>
    </figure>
  )
}

function MessageReactionsCompact({
  reactions,
}: Readonly<{
  reactions: ReadonlyArray<{ emoji: string; count: number }>
}>) {
  if (!reactions.length) return null

  return (
    <ul className="sameward-reactions mt-1" aria-label="Reactions">
      {reactions.slice(0, 2).map((reaction) => (
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

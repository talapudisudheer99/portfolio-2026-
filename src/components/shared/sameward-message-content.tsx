"use client"

import {
  SamewardFileAttachmentCard,
  SamewardLinkPreviewCard,
  SamewardMessageReactions,
} from "@/components/shared/sameward-mock-parts"
import type { SamewardMessage } from "@/data/sameward-mock"

export function SamewardMessageContent({
  message,
  compact = false,
}: Readonly<{
  message: SamewardMessage
  compact?: boolean
}>) {
  return (
    <>
      {message.body ? (
        <p
          className={
            compact
              ? "sameward-message-body mt-0.5 break-words text-foreground-secondary"
              : "sameward-message-body mt-1 text-foreground-secondary"
          }
        >
          {message.body}
        </p>
      ) : null}
      {message.linkPreview ? (
        <SamewardLinkPreviewCard preview={message.linkPreview} compact={compact} />
      ) : null}
      {message.attachment ? (
        <SamewardFileAttachmentCard attachment={message.attachment} compact={compact} />
      ) : null}
      <SamewardMessageReactions reactions={message.reactions} />
    </>
  )
}

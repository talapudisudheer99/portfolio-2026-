"use client"

import { useState, type ComponentProps } from "react"

import { cn } from "@/lib/utils"

function Avatar({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar"
      className={cn(
        "relative inline-block size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, onError, ...props }: ComponentProps<"img">) {
  const [failed, setFailed] = useState(false)

  if (failed) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element -- mockup avatars (external URLs)
    <img
      data-slot="avatar-image"
      className={cn(
        "absolute inset-0 z-10 size-full object-cover object-center",
        className
      )}
      onError={(event) => {
        setFailed(true)
        onError?.(event)
      }}
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        "absolute inset-0 z-0 flex size-full items-center justify-center rounded-full bg-muted text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }

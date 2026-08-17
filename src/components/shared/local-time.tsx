"use client"

import { useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
})

const PLACEHOLDER = "--:--:--"

/*
 * One interval feeds every subscriber. The snapshot is cached rather than
 * derived per read, because useSyncExternalStore requires a stable value
 * between renders.
 */
let snapshot = PLACEHOLDER
let timer: ReturnType<typeof setInterval> | null = null
const listeners = new Set<() => void>()

function publish() {
  const next = formatter.format(new Date())
  if (next === snapshot) return

  snapshot = next
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  if (!timer) {
    publish()
    timer = setInterval(publish, 1000)
  }

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }
}

const getSnapshot = () => snapshot
// The server cannot know the tick the client will hydrate on.
const getServerSnapshot = () => PLACEHOLDER

interface LocalTimeProps {
  className?: string
}

export function LocalTime({ className }: LocalTimeProps) {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="tabular-nums">{time}</span>
      <span aria-hidden="true">IST</span>
      <span className="sr-only">India Standard Time, my local time</span>
    </span>
  )
}

"use client"

import { useEffect, useState } from "react"

/**
 * False until the browser has painted once (optional extra delay).
 * Cursor / grain / toaster only — the space world mounts with the page.
 */
export function useDeferredLayer(delayMs = 0) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let timeoutId = 0
    let innerFrame = 0
    const outerFrame = window.requestAnimationFrame(() => {
      innerFrame = window.requestAnimationFrame(() => {
        timeoutId = window.setTimeout(() => setReady(true), delayMs)
      })
    })

    return () => {
      window.cancelAnimationFrame(outerFrame)
      window.cancelAnimationFrame(innerFrame)
      window.clearTimeout(timeoutId)
    }
  }, [delayMs])

  return ready
}

/**
 * True once the browser is idle after first paint (or after `timeoutMs`).
 * Heavy layers (three.js) wait for this so they never compete with the
 * hero's first paint and hydration.
 */
export function useIdleLayer(timeoutMs = 1200) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    let idleId = 0
    let timeoutId = 0
    const go = () => setReady(true)
    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(go, { timeout: timeoutMs })
    } else {
      timeoutId = window.setTimeout(go, 200)
    }
    return () => {
      if (idleId && w.cancelIdleCallback) w.cancelIdleCallback(idleId)
      window.clearTimeout(timeoutId)
    }
  }, [timeoutMs])

  return ready
}

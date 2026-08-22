"use client"

import { useEffect, useState } from "react"

/**
 * False until the browser has painted once (optional extra delay).
 * Cursor / grain only — world mounts immediately so it can sync with hero.
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

export const ATMOSPHERE_READY = "portfolio:atmosphere-ready"

export function waitForAtmosphere(fallbackMs: number, isCancelled: () => boolean) {
  return new Promise<void>((resolve) => {
    if (typeof document !== "undefined") {
      if (document.querySelector(".blob-scene-fixed.is-ready")) {
        resolve()
        return
      }
    }

    let settled = false
    const done = () => {
      if (settled || isCancelled()) return
      settled = true
      window.removeEventListener(ATMOSPHERE_READY, done)
      window.clearTimeout(timeoutId)
      resolve()
    }

    window.addEventListener(ATMOSPHERE_READY, done)
    const timeoutId = window.setTimeout(done, fallbackMs)
  })
}

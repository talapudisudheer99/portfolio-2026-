"use client"

import { useReducedMotion } from "framer-motion"
import { useSyncExternalStore } from "react"

/** The snapshot never changes after hydration, so there is nothing to watch. */
const subscribeNever = () => () => {}

/** Keeps the server and first client render identical, then applies the choice. */
export function useHydratedReducedMotion() {
  const prefersReducedMotion = useReducedMotion()
  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )

  return hydrated && prefersReducedMotion === true
}

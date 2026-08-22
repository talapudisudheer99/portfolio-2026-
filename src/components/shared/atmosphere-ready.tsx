"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

interface AtmosphereReadyValue {
  ready: boolean
  markReady: () => void
}

const AtmosphereReadyContext = createContext<AtmosphereReadyValue | null>(null)

export function AtmosphereReadyProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [ready, setReady] = useState(false)
  const markReady = useCallback(() => {
    setReady(true)
    document.documentElement.dataset.atmosphere = "ready"
  }, [])

  const value = useMemo(() => ({ ready, markReady }), [ready, markReady])

  return (
    <AtmosphereReadyContext.Provider value={value}>
      {children}
    </AtmosphereReadyContext.Provider>
  )
}

export function useAtmosphereReady() {
  const ctx = useContext(AtmosphereReadyContext)
  if (!ctx) {
    return { ready: true, markReady: () => {} }
  }
  return ctx
}

/** Hero entrance waits for moon — never longer than this. */
export const ATMOSPHERE_WAIT_MS = 1600

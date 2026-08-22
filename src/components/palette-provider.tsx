"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { PALETTE_STORAGE_KEY } from "@/components/palette-init-script"
import {
  blobPalettes,
  defaultBlobPaletteId,
  getBlobPalette,
  isBlobPaletteId,
  type BlobPalette,
  type BlobPaletteId,
} from "@/data/blob-palettes"

interface PaletteContextValue {
  palette: BlobPalette
  paletteId: BlobPaletteId
  setPaletteId: (id: BlobPaletteId) => void
  ready: boolean
}

const PaletteContext = createContext<PaletteContextValue | null>(null)

/** Prefer DOM (boot script) so first client paint matches applied tokens. */
function readBootPaletteId(): BlobPaletteId {
  if (typeof window === "undefined") return defaultBlobPaletteId
  try {
    const fromDom = document.documentElement.getAttribute("data-palette")
    if (fromDom && isBlobPaletteId(fromDom)) return fromDom
    const stored = window.localStorage.getItem(PALETTE_STORAGE_KEY)
    if (stored && isBlobPaletteId(stored)) return stored
  } catch {
    /* private mode / blocked storage */
  }
  return defaultBlobPaletteId
}

function applyPaletteTokens(palette: BlobPalette) {
  const root = document.documentElement
  root.dataset.palette = palette.id
  for (const [token, value] of Object.entries(palette.tokens)) {
    root.style.setProperty(token, value)
  }
  const primary = palette.tokens["--primary"]
  const border = palette.tokens["--border"]
  if (primary && border) {
    root.style.setProperty(
      "--input",
      `color-mix(in srgb, ${primary} 28%, ${border})`
    )
  }
}

export function PaletteProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  // SSR + first client render stay on default; boot script already painted stored tokens.
  const [paletteId, setPaletteIdState] =
    useState<BlobPaletteId>(defaultBlobPaletteId)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = readBootPaletteId()
    setPaletteIdState(stored)
    applyPaletteTokens(getBlobPalette(stored))
    setReady(true)
  }, [])

  const palette = useMemo(() => getBlobPalette(paletteId), [paletteId])

  useEffect(() => {
    if (!ready) return
    applyPaletteTokens(palette)
    try {
      window.localStorage.setItem(PALETTE_STORAGE_KEY, paletteId)
    } catch {
      /* ignore */
    }
  }, [palette, paletteId, ready])

  const setPaletteId = useCallback((id: BlobPaletteId) => {
    setPaletteIdState(id)
  }, [])

  const value = useMemo(
    () => ({ palette, paletteId, setPaletteId, ready }),
    [palette, paletteId, setPaletteId, ready]
  )

  return (
    <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>
  )
}

export function usePalette() {
  const context = useContext(PaletteContext)
  if (!context) {
    throw new Error("usePalette must be used within PaletteProvider")
  }
  return context
}

export { blobPalettes }

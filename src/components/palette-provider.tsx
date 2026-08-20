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

import {
  blobPalettes,
  defaultBlobPaletteId,
  getBlobPalette,
  isBlobPaletteId,
  type BlobPalette,
  type BlobPaletteId,
} from "@/data/blob-palettes"

const STORAGE_KEY = "portfolio-blob-palette"

interface PaletteContextValue {
  palette: BlobPalette
  paletteId: BlobPaletteId
  setPaletteId: (id: BlobPaletteId) => void
}

const PaletteContext = createContext<PaletteContextValue | null>(null)

function applyPaletteTokens(palette: BlobPalette) {
  const root = document.documentElement
  root.dataset.palette = palette.id
  for (const [token, value] of Object.entries(palette.tokens)) {
    root.style.setProperty(token, value)
  }
  // Keep form / input chrome in sync — not always listed in palette tokens.
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
  const [paletteId, setPaletteIdState] =
    useState<BlobPaletteId>(defaultBlobPaletteId)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isBlobPaletteId(stored)) {
      setPaletteIdState(stored)
    }
  }, [])

  const palette = useMemo(() => getBlobPalette(paletteId), [paletteId])

  useEffect(() => {
    applyPaletteTokens(palette)
    localStorage.setItem(STORAGE_KEY, paletteId)
  }, [palette, paletteId])

  const setPaletteId = useCallback((id: BlobPaletteId) => {
    setPaletteIdState(id)
  }, [])

  const value = useMemo(
    () => ({ palette, paletteId, setPaletteId }),
    [palette, paletteId, setPaletteId]
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

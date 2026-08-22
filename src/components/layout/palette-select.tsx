"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePalette } from "@/components/palette-provider"
import { blobPalettes, type BlobPaletteId } from "@/data/blob-palettes"
import { cn } from "@/lib/utils"

function Swatch({
  gradient,
  className,
  useActiveToken = false,
}: Readonly<{
  gradient?: string
  className?: string
  /** Nav trigger: follow CSS tokens from boot script (no gold→green flash). */
  useActiveToken?: boolean
}>) {
  return (
    <span
      aria-hidden="true"
      className={cn("nav-palette-swatch", className)}
      style={
        useActiveToken
          ? { background: "var(--ember-gradient)" }
          : { background: gradient }
      }
    />
  )
}

export function PaletteSelect() {
  const { palette, paletteId, setPaletteId, ready } = usePalette()

  // CSS token swatch is correct from first paint (boot script). Hold Select until ready.
  if (!ready) {
    return (
      <button
        type="button"
        aria-label="Choose blob color palette"
        className="nav-palette-trigger"
        disabled
        suppressHydrationWarning
      >
        <Swatch useActiveToken />
        <span className="sr-only">{palette.label}</span>
      </button>
    )
  }

  return (
    <Select
      value={paletteId}
      onValueChange={(value) => {
        if (value) setPaletteId(value as BlobPaletteId)
      }}
    >
      <SelectTrigger
        size="sm"
        aria-label="Choose blob color palette"
        className="nav-palette-trigger"
      >
        <SelectValue>
          <Swatch useActiveToken />
          <span className="sr-only">{palette.label}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        align="end"
        alignItemWithTrigger={false}
        sideOffset={8}
        className="nav-palette-menu"
      >
        {blobPalettes.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            <Swatch gradient={option.gradient} />
            <span className="nav-palette-option-copy">
              <span className="nav-palette-option-label">{option.label}</span>
              <span className="nav-palette-option-desc">
                {option.description}
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

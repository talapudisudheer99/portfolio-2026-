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
}: Readonly<{ gradient: string; className?: string }>) {
  return (
    <span
      aria-hidden="true"
      className={cn("nav-palette-swatch", className)}
      style={{ background: gradient }}
    />
  )
}

export function PaletteSelect() {
  const { palette, paletteId, setPaletteId } = usePalette()

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
          <Swatch gradient={palette.gradient} />
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

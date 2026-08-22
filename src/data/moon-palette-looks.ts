import type { BlobPaletteId } from "@/data/blob-palettes"

export interface MoonPaletteLook {
  /** Soft albedo multiply — stay bright so LRO crater contrast survives */
  albedo: number
  sunColor: number
  sunIntensity: number
  /**
   * Grazing key — crater rims catch light; +Z still fills the night side.
   */
  sunPosition: [number, number, number]
  fillColor: number
  fillIntensity: number
  rimColor: number
  rimIntensity: number
  ambientColor: number
  ambientIntensity: number
  exposure: number
  bumpScale: number
  roughness: number
}

/**
 * NASA LRO Moon — more relief + limb shine than a flat grey ball.
 * Mars would fight palette variants; this globe recolors with the theme.
 */
export const moonPaletteLooks: Record<BlobPaletteId, MoonPaletteLook> = {
  "molten-metal": {
    albedo: 0xf4ead0,
    sunColor: 0xfff2d8,
    sunIntensity: 2.55,
    sunPosition: [5.1, 1.35, 2.45],
    fillColor: 0xa88858,
    fillIntensity: 0.28,
    rimColor: 0xf0d060,
    rimIntensity: 0.26,
    ambientColor: 0x12100c,
    ambientIntensity: 0.1,
    exposure: 1.08,
    bumpScale: 0.26,
    roughness: 0.86,
  },
  "obsidian-emerald": {
    albedo: 0xffffff,
    sunColor: 0xfff6ea,
    sunIntensity: 2.5,
    sunPosition: [4.9, 1.4, 2.5],
    fillColor: 0x8a9ab0,
    fillIntensity: 0.3,
    rimColor: 0x7dffb0,
    rimIntensity: 0.24,
    ambientColor: 0x101218,
    ambientIntensity: 0.11,
    exposure: 1.05,
    bumpScale: 0.26,
    roughness: 0.87,
  },
  "ice-fire": {
    albedo: 0xe8f0fa,
    sunColor: 0xf2f8ff,
    sunIntensity: 2.55,
    sunPosition: [5.0, 1.32, 2.48],
    fillColor: 0x6088b0,
    fillIntensity: 0.29,
    rimColor: 0x70c0f0,
    rimIntensity: 0.28,
    ambientColor: 0x0c1018,
    ambientIntensity: 0.1,
    exposure: 1.1,
    bumpScale: 0.255,
    roughness: 0.85,
  },
  ember: {
    albedo: 0xf8e4cc,
    sunColor: 0xffe4c8,
    sunIntensity: 2.52,
    sunPosition: [5.15, 1.28, 2.42],
    fillColor: 0xb07050,
    fillIntensity: 0.28,
    rimColor: 0xf08040,
    rimIntensity: 0.26,
    ambientColor: 0x14100c,
    ambientIntensity: 0.1,
    exposure: 1.1,
    bumpScale: 0.26,
    roughness: 0.86,
  },
  "neon-crimson": {
    albedo: 0xf8dce4,
    sunColor: 0xffe8ee,
    sunIntensity: 2.52,
    sunPosition: [4.95, 1.35, 2.48],
    fillColor: 0xa04860,
    fillIntensity: 0.29,
    rimColor: 0xf05070,
    rimIntensity: 0.28,
    ambientColor: 0x140c10,
    ambientIntensity: 0.1,
    exposure: 1.1,
    bumpScale: 0.255,
    roughness: 0.85,
  },
  "sunset-fire": {
    albedo: 0xf8e8d4,
    sunColor: 0xffe8d0,
    sunIntensity: 2.5,
    sunPosition: [5.05, 1.32, 2.45],
    fillColor: 0xb87848,
    fillIntensity: 0.28,
    rimColor: 0xf09050,
    rimIntensity: 0.26,
    ambientColor: 0x14100c,
    ambientIntensity: 0.1,
    exposure: 1.09,
    bumpScale: 0.26,
    roughness: 0.86,
  },
  "real-fire": {
    albedo: 0xf4dcc8,
    sunColor: 0xffdcc0,
    sunIntensity: 2.58,
    sunPosition: [5.2, 1.22, 2.38],
    fillColor: 0xa84838,
    fillIntensity: 0.26,
    rimColor: 0xf05030,
    rimIntensity: 0.28,
    ambientColor: 0x140c0a,
    ambientIntensity: 0.09,
    exposure: 1.12,
    bumpScale: 0.27,
    roughness: 0.85,
  },
}

export function getMoonPaletteLook(id: BlobPaletteId): MoonPaletteLook {
  return moonPaletteLooks[id] ?? moonPaletteLooks["molten-metal"]
}

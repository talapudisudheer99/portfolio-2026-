export type BlobPaletteId =
  | "molten-metal"
  | "obsidian-emerald"
  | "ice-fire"
  | "ember"
  | "neon-crimson"
  | "sunset-fire"
  | "real-fire"

export interface BlobPalette {
  id: BlobPaletteId
  label: string
  description: string
  gradient: string
  swatch: string
  tokens: Record<string, string>
  blob: {
    color1: number
    color2: number
    color3: number
    glow: number
    light: number
  }
}

export const blobPalettes: BlobPalette[] = [
  {
    id: "molten-metal",
    label: "Molten Metal",
    description: "Bronze to gold — premium default",
    gradient: "linear-gradient(135deg, #8b6914, #d4a024, #f0d060)",
    swatch: "#d4a024",
    tokens: {
      "--primary": "#d4a024",
      "--primary-inverted": "#8b6914",
      "--primary-hover": "#e8b430",
      "--primary-light": "#1e1608",
      "--primary-foreground": "#000000",
      "--accent": "#f0d060",
      "--accent-foreground": "#000000",
      "--accent-soft": "#1e1608",
      "--ring": "#d4a024",
      "--realtime": "#d4a024",
      "--ai": "#f0d060",
      "--ember-gradient": "linear-gradient(135deg, #8b6914, #d4a024, #f0d060)",
      "--border": "#28220e",
      "--border-light": "#1c180a",
    },
    blob: {
      color1: 0xd4a024,
      color2: 0x0a0806,
      color3: 0xf0d060,
      glow: 0xd4a024,
      light: 0xf0d060,
    },
  },
  {
    id: "obsidian-emerald",
    label: "Obsidian Emerald",
    description: "Forest jewel + muted gold",
    gradient: "linear-gradient(135deg, #1c8a5c, #3cbc78, #c9a84c)",
    swatch: "#3cbc78",
    tokens: {
      "--primary": "#3cbc78",
      "--primary-inverted": "#1c8a5c",
      "--primary-hover": "#4fd08a",
      "--primary-light": "#0a1c14",
      "--primary-foreground": "#ffffff",
      "--accent": "#c9a84c",
      "--accent-foreground": "#000000",
      "--accent-soft": "#0a1c14",
      "--ring": "#3cbc78",
      "--realtime": "#3cbc78",
      "--ai": "#c9a84c",
      "--ember-gradient": "linear-gradient(135deg, #1c8a5c, #3cbc78, #c9a84c)",
      "--border": "#14241c",
      "--border-light": "#0e1813",
    },
    blob: {
      color1: 0x3cbc78,
      color2: 0x040a08,
      color3: 0xc9a84c,
      glow: 0x3cbc78,
      light: 0xc9a84c,
    },
  },
  {
    id: "ice-fire",
    label: "Ice & Fire",
    description: "Cyan → magenta → red",
    gradient: "linear-gradient(135deg, #00d4ff, #c850c0, #ff4040)",
    swatch: "#00d4ff",
    tokens: {
      "--primary": "#00d4ff",
      "--primary-inverted": "#0088a8",
      "--primary-hover": "#33dfff",
      "--primary-light": "#061a20",
      "--primary-foreground": "#ffffff",
      "--accent": "#c850c0",
      "--accent-foreground": "#ffffff",
      "--accent-soft": "#0d1520",
      "--ring": "#00d4ff",
      "--realtime": "#00d4ff",
      "--ai": "#c850c0",
      "--ember-gradient": "linear-gradient(135deg, #00d4ff, #c850c0, #ff4040)",
      "--border": "#1a1e2a",
      "--border-light": "#121520",
    },
    blob: {
      color1: 0x00d4ff,
      color2: 0x0a0818,
      color3: 0xc850c0,
      glow: 0x00d4ff,
      light: 0xc850c0,
    },
  },
  {
    id: "ember",
    label: "Ember Gradient",
    description: "Orange → red → gold",
    gradient: "linear-gradient(135deg, #e8450e, #c9352e, #d4a024)",
    swatch: "#e8450e",
    tokens: {
      "--primary": "#e8450e",
      "--primary-inverted": "#a33009",
      "--primary-hover": "#ff5a1f",
      "--primary-light": "#2a1208",
      "--primary-foreground": "#ffffff",
      "--accent": "#d4a024",
      "--accent-foreground": "#000000",
      "--accent-soft": "#2a1208",
      "--ring": "#e8450e",
      "--realtime": "#47b5d1",
      "--ai": "#9b7fd4",
      "--ember-gradient": "linear-gradient(135deg, #e8450e, #c9352e, #d4a024)",
      "--border": "#2a2520",
      "--border-light": "#1e1a16",
    },
    blob: {
      color1: 0xe8450e,
      color2: 0x1a0e08,
      color3: 0xd4a024,
      glow: 0xe8450e,
      light: 0xe8450e,
    },
  },
  {
    id: "neon-crimson",
    label: "Neon Crimson",
    description: "Electric red-pink",
    gradient: "linear-gradient(135deg, #ff2d55, #e8154a, #ff6b8a)",
    swatch: "#ff2d55",
    tokens: {
      "--primary": "#ff2d55",
      "--primary-inverted": "#a81a38",
      "--primary-hover": "#ff4d70",
      "--primary-light": "#2a0810",
      "--primary-foreground": "#ffffff",
      "--accent": "#ff2d55",
      "--accent-foreground": "#ffffff",
      "--accent-soft": "#2a0810",
      "--ring": "#ff2d55",
      "--realtime": "#47b5d1",
      "--ai": "#9b7fd4",
      "--ember-gradient": "linear-gradient(135deg, #ff2d55, #e8154a, #ff6b8a)",
      "--border": "#1e1e24",
      "--border-light": "#16161c",
    },
    blob: {
      color1: 0xff2d55,
      color2: 0x1a0810,
      color3: 0xff6b8a,
      glow: 0xff2d55,
      light: 0xff2d55,
    },
  },
  {
    id: "sunset-fire",
    label: "Sunset Fire",
    description: "Coral → amber → yellow",
    gradient: "linear-gradient(135deg, #ff6b42, #f59e0b, #fbbf24)",
    swatch: "#ff6b42",
    tokens: {
      "--primary": "#ff6b42",
      "--primary-inverted": "#b04420",
      "--primary-hover": "#ff8560",
      "--primary-light": "#261208",
      "--primary-foreground": "#000000",
      "--accent": "#f59e0b",
      "--accent-foreground": "#000000",
      "--accent-soft": "#261208",
      "--ring": "#ff6b42",
      "--realtime": "#47b5d1",
      "--ai": "#9b7fd4",
      "--ember-gradient": "linear-gradient(135deg, #ff6b42, #f59e0b, #fbbf24)",
      "--border": "#28231a",
      "--border-light": "#1c1812",
    },
    blob: {
      color1: 0xff6b42,
      color2: 0x1a0e05,
      color3: 0xfbbf24,
      glow: 0xff6b42,
      light: 0xff6b42,
    },
  },
  {
    id: "real-fire",
    label: "Real Fire",
    description: "The first blob — oxblood to orange",
    gradient: "linear-gradient(135deg, #c9352e, #e04038, #ff6b4a)",
    swatch: "#c9352e",
    tokens: {
      "--primary": "#c9352e",
      "--primary-inverted": "#891a20",
      "--primary-hover": "#e04038",
      "--primary-light": "#3a0f12",
      "--primary-foreground": "#ffffff",
      "--accent": "#ff6b4a",
      "--accent-foreground": "#000000",
      "--accent-soft": "#3a0f12",
      "--ring": "#c9352e",
      "--realtime": "#47b5d1",
      "--ai": "#9b7fd4",
      "--ember-gradient": "linear-gradient(135deg, #c9352e, #e04038, #ff6b4a)",
      "--border": "#2a1a1a",
      "--border-light": "#1a1212",
    },
    blob: {
      color1: 0xc9352e,
      color2: 0x1a1a2e,
      color3: 0xff6b4a,
      glow: 0xc9352e,
      light: 0xc9352e,
    },
  },
]

export const defaultBlobPaletteId: BlobPaletteId = "ice-fire"

export function getBlobPalette(id: BlobPaletteId): BlobPalette {
  return (
    blobPalettes.find((palette) => palette.id === id) ??
    blobPalettes.find((palette) => palette.id === defaultBlobPaletteId) ??
    blobPalettes[0]
  )
}

export function isBlobPaletteId(value: string): value is BlobPaletteId {
  return blobPalettes.some((palette) => palette.id === value)
}

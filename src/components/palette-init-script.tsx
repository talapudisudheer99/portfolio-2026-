import {
  blobPalettes,
  defaultBlobPaletteId,
} from "@/data/blob-palettes"

export const PALETTE_STORAGE_KEY = "portfolio-blob-palette"

/** Blocking boot script — applies stored palette before React paints. */
export function PaletteInitScript() {
  const tokenMap = Object.fromEntries(
    blobPalettes.map((palette) => [palette.id, palette.tokens])
  )

  const script = `(function(){try{var k=${JSON.stringify(PALETTE_STORAGE_KEY)};var d=${JSON.stringify(defaultBlobPaletteId)};var map=${JSON.stringify(tokenMap)};var id=localStorage.getItem(k);if(!map[id])id=d;var t=map[id];if(!t)return;var r=document.documentElement;r.setAttribute("data-palette",id);for(var p in t)r.style.setProperty(p,t[p]);var a=t["--primary"],b=t["--border"];if(a&&b)r.style.setProperty("--input","color-mix(in srgb, "+a+" 28%, "+b+")");}catch(e){}})();`

  return (
    <script
      id="portfolio-palette-init"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  )
}

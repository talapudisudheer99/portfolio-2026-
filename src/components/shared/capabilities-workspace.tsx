"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { SectionReveal } from "@/components/motion/section-reveal"
import { useHydratedReducedMotion } from "@/components/shared/motion"
import {
  capabilitiesHero,
  capabilityCardMeta,
  capabilityPipelineIds,
} from "@/data/capabilities-ui"
import { skillGroups } from "@/data/skills"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** Craggy asteroid silhouettes — angular rock, not soft eggs (viewBox 0 0 200 240) */
const ROCK_OUTLINES = [
  "M36 54 L48 30 L62 38 L80 18 L98 28 L118 14 L136 26 L154 22 L168 44 L178 68 L172 90 L184 112 L174 136 L182 160 L170 182 L176 202 L154 214 L140 228 L116 220 L98 232 L76 222 L56 230 L38 210 L26 186 L14 162 L22 138 L10 114 L20 90 L14 68 L28 56 Z",
  "M32 62 L46 36 L60 44 L78 20 L102 16 L120 28 L142 18 L160 36 L174 56 L182 84 L174 106 L186 130 L176 154 L184 178 L166 198 L172 218 L148 226 L128 236 L104 228 L84 236 L60 220 L42 228 L24 202 L30 176 L14 152 L22 126 L12 100 L24 76 L18 60 L30 54 Z",
  "M44 42 L58 24 L74 32 L96 14 L118 22 L138 12 L156 30 L170 48 L178 74 L184 102 L174 124 L186 148 L174 172 L180 194 L160 210 L166 226 L140 230 L118 238 L94 228 L72 236 L48 218 L30 224 L20 194 L28 170 L12 146 L22 120 L12 94 L24 70 L20 52 L36 44 Z",
  "M38 50 L52 28 L68 36 L90 16 L112 24 L132 14 L152 32 L168 50 L176 76 L182 104 L172 128 L184 152 L172 176 L180 198 L158 212 L164 228 L138 232 L116 240 L90 230 L68 238 L46 220 L30 226 L18 198 L26 174 L12 150 L20 124 L10 98 L22 74 L16 56 L32 48 Z",
  "M28 66 L42 40 L56 48 L76 22 L100 14 L122 24 L144 14 L164 34 L176 54 L184 82 L176 108 L188 132 L176 156 L186 180 L168 200 L174 220 L148 228 L126 238 L98 230 L74 238 L50 220 L32 226 L18 198 L26 172 L10 148 L20 122 L10 96 L24 74 L16 58 L26 54 Z",
  "M42 44 L56 26 L72 34 L94 14 L116 20 L136 12 L156 28 L170 46 L178 72 L184 100 L172 124 L186 146 L174 170 L182 194 L160 208 L168 226 L142 232 L118 238 L94 228 L70 236 L48 216 L32 222 L20 192 L28 168 L12 144 L22 118 L12 92 L24 68 L18 52 L34 44 Z",
  "M34 56 L48 32 L64 40 L86 18 L108 16 L128 26 L150 16 L166 38 L176 60 L182 88 L172 112 L186 136 L174 160 L182 184 L164 202 L170 220 L146 226 L124 236 L98 228 L76 236 L54 218 L36 224 L22 196 L30 172 L14 148 L22 122 L12 96 L24 74 L16 58 L30 52 Z",
] as const

/** Edge-only fractures — clear of copy zone */
const ROCK_CRACKS = [
  ["M22 78 Q30 100 26 128", "M172 58 Q180 84 174 116", "M150 196 Q162 214 138 224"],
  ["M18 90 Q26 114 22 144", "M176 66 Q184 96 178 128", "M40 206 Q58 220 82 226"],
  ["M24 70 Q32 96 28 124", "M174 74 Q182 104 176 136", "M146 200 Q158 216 134 226"],
  ["M20 82 Q28 108 24 136", "M170 60 Q180 90 172 122", "M48 210 Q66 222 90 228"],
  ["M16 96 Q24 122 20 150", "M178 70 Q186 100 180 132", "M156 198 Q168 214 148 224"],
  ["M22 74 Q30 100 26 130", "M172 68 Q182 98 174 130", "M38 202 Q56 218 80 226"],
  ["M20 86 Q28 112 24 140", "M174 62 Q184 92 176 124", "M148 198 Q160 214 136 224"],
] as const

/** CSS clip-path mirrors — keeps etched copy inside the stone */
const ROCK_FACE_CLIPS = [
  "polygon(18% 22.5%, 24% 12.5%, 31% 15.8%, 40% 7.5%, 49% 11.7%, 59% 5.8%, 68% 10.8%, 77% 9.2%, 84% 18.3%, 89% 28.3%, 86% 37.5%, 92% 46.7%, 87% 56.7%, 91% 66.7%, 85% 75.8%, 88% 84.2%, 77% 89.2%, 70% 95%, 58% 91.7%, 49% 96.7%, 38% 92.5%, 28% 95.8%, 19% 87.5%, 13% 77.5%, 7% 67.5%, 11% 57.5%, 5% 47.5%, 10% 37.5%, 7% 28.3%, 14% 23.3%)",
  "polygon(16% 25.8%, 23% 15%, 30% 18.3%, 39% 8.3%, 51% 6.7%, 60% 11.7%, 71% 7.5%, 80% 15%, 87% 23.3%, 91% 35%, 87% 44.2%, 93% 54.2%, 88% 64.2%, 92% 74.2%, 83% 82.5%, 86% 90.8%, 74% 94.2%, 64% 98.3%, 52% 95%, 42% 98.3%, 30% 91.7%, 21% 95%, 12% 84.2%, 15% 73.3%, 7% 63.3%, 11% 52.5%, 6% 41.7%, 12% 31.7%, 9% 25%, 15% 22.5%)",
  "polygon(22% 17.5%, 29% 10%, 37% 13.3%, 48% 5.8%, 59% 9.2%, 69% 5%, 78% 12.5%, 85% 20%, 89% 30.8%, 92% 42.5%, 87% 51.7%, 93% 61.7%, 87% 71.7%, 90% 80.8%, 80% 87.5%, 83% 94.2%, 70% 95.8%, 59% 99.2%, 47% 95%, 36% 98.3%, 24% 90.8%, 15% 93.3%, 10% 80.8%, 14% 70.8%, 6% 60.8%, 11% 50%, 6% 39.2%, 12% 29.2%, 10% 21.7%, 18% 18.3%)",
  "polygon(19% 20.8%, 26% 11.7%, 34% 15%, 45% 6.7%, 56% 10%, 66% 5.8%, 76% 13.3%, 84% 20.8%, 88% 31.7%, 91% 43.3%, 86% 53.3%, 92% 63.3%, 86% 73.3%, 90% 82.5%, 79% 88.3%, 82% 95%, 69% 96.7%, 58% 100%, 45% 95.8%, 34% 99.2%, 23% 91.7%, 15% 94.2%, 9% 82.5%, 13% 72.5%, 6% 62.5%, 10% 51.7%, 5% 40.8%, 11% 30.8%, 8% 23.3%, 16% 20%)",
  "polygon(14% 27.5%, 21% 16.7%, 28% 20%, 38% 9.2%, 50% 5.8%, 61% 10%, 72% 5.8%, 82% 14.2%, 88% 22.5%, 92% 34.2%, 88% 45%, 94% 55%, 88% 65%, 93% 75%, 84% 83.3%, 87% 91.7%, 74% 95%, 63% 99.2%, 49% 95.8%, 37% 99.2%, 25% 91.7%, 16% 94.2%, 9% 82.5%, 13% 71.7%, 5% 61.7%, 10% 50.8%, 5% 40%, 12% 30.8%, 8% 24.2%, 13% 22.5%)",
  "polygon(21% 18.3%, 28% 10.8%, 36% 14.2%, 47% 5.8%, 58% 8.3%, 68% 5%, 78% 11.7%, 85% 19.2%, 89% 30%, 92% 41.7%, 86% 51.7%, 93% 60.8%, 87% 70.8%, 91% 80.8%, 80% 86.7%, 84% 94.2%, 71% 96.7%, 59% 99.2%, 47% 95%, 35% 98.3%, 24% 90%, 16% 92.5%, 10% 80%, 14% 70%, 6% 60%, 11% 49.2%, 6% 38.3%, 12% 28.3%, 9% 21.7%, 17% 18.3%)",
  "polygon(17% 23.3%, 24% 13.3%, 32% 16.7%, 43% 7.5%, 54% 6.7%, 64% 10.8%, 75% 6.7%, 83% 15.8%, 88% 25%, 91% 36.7%, 86% 46.7%, 93% 56.7%, 87% 66.7%, 91% 76.7%, 82% 84.2%, 85% 91.7%, 73% 94.2%, 62% 98.3%, 49% 95%, 38% 98.3%, 27% 90.8%, 18% 93.3%, 11% 81.7%, 15% 71.7%, 7% 61.7%, 11% 50.8%, 6% 40%, 12% 30.8%, 8% 24.2%, 15% 21.7%)",
] as const

function AsteroidMesh({
  shape,
  rockId,
}: {
  shape: number
  rockId: string
}) {
  const outline = ROCK_OUTLINES[shape] ?? ROCK_OUTLINES[0]
  const cracks = ROCK_CRACKS[shape] ?? ROCK_CRACKS[0]
  const grainId = `rock-grain-${rockId}`
  const wallGrainId = `rock-wall-grain-${rockId}`
  const clipId = `rock-clip-${rockId}`
  const maskId = `rock-mask-${rockId}`

  return (
    <svg
      className="capabilities-asteroid-mesh"
      viewBox="0 0 200 240"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        {/*
          Grain must end with feComposite → SourceAlpha.
          Without that, feTurbulence/feDiffuseLighting fills the
          rectangular filter region (the bug from the last screenshot).
        */}
        <filter
          id={grainId}
          x="0"
          y="0"
          width="200"
          height="240"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.038"
            numOctaves="4"
            seed={shape + 3}
            result="noise"
          />
          <feDiffuseLighting
            in="noise"
            lightingColor="#b8a88c"
            surfaceScale="2.4"
            result="lit"
          >
            <feDistantLight azimuth="220" elevation="48" />
          </feDiffuseLighting>
          <feComposite
            in="lit"
            in2="SourceAlpha"
            operator="in"
            result="litRock"
          />
          <feBlend
            in="SourceGraphic"
            in2="litRock"
            mode="multiply"
            result="stone"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="2"
            seed={shape + 11}
            result="fine"
          />
          <feColorMatrix
            in="fine"
            type="matrix"
            values="0 0 0 0 0.14
                    0 0 0 0 0.11
                    0 0 0 0 0.08
                    0 0 0 0.28 0"
            result="grainRaw"
          />
          <feComposite
            in="grainRaw"
            in2="SourceAlpha"
            operator="in"
            result="grain"
          />
          <feBlend in="stone" in2="grain" mode="soft-light" result="textured" />
          <feComposite in="textured" in2="SourceAlpha" operator="in" />
        </filter>

        <filter
          id={wallGrainId}
          x="0"
          y="0"
          width="200"
          height="240"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="3"
            seed={shape + 7}
            result="noise"
          />
          <feDiffuseLighting
            in="noise"
            lightingColor="#8a7a62"
            surfaceScale="1.8"
            result="lit"
          >
            <feDistantLight azimuth="200" elevation="35" />
          </feDiffuseLighting>
          <feComposite in="lit" in2="SourceAlpha" operator="in" result="litRock" />
          <feBlend
            in="SourceGraphic"
            in2="litRock"
            mode="multiply"
            result="stone"
          />
          <feComposite in="stone" in2="SourceAlpha" operator="in" />
        </filter>

        <clipPath id={clipId}>
          <path d={outline} />
        </clipPath>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="200"
          height="240"
        >
          <path d={outline} fill="#fff" />
        </mask>

        <radialGradient id={`crater-bowl-${rockId}`} cx="36%" cy="30%" r="62%">
          <stop offset="0%" stopColor="#4a4034" stopOpacity="0.2" />
          <stop offset="40%" stopColor="#1a1510" stopOpacity="0.45" />
          <stop offset="78%" stopColor="#000" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#2a241c" stopOpacity="0.35" />
        </radialGradient>

        <linearGradient id={`face-lit-${rockId}`} x1="18%" y1="8%" x2="88%" y2="92%">
          <stop offset="0%" stopColor="#6a5c48" />
          <stop offset="28%" stopColor="#3a3228" />
          <stop offset="62%" stopColor="#1c1812" />
          <stop offset="100%" stopColor="#090807" />
        </linearGradient>
        <linearGradient id={`wall-lit-${rockId}`} x1="15%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#4a4032" />
          <stop offset="40%" stopColor="#241e18" />
          <stop offset="100%" stopColor="#0a0806" />
        </linearGradient>
        <radialGradient id={`catch-${rockId}`} cx="28%" cy="22%" r="55%">
          <stop offset="0%" stopColor="#e8dcc4" stopOpacity="0.42" />
          <stop offset="38%" stopColor="#c9a24a" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`limb-${rockId}`} cx="18%" cy="28%" r="42%">
          <stop offset="0%" stopColor="#f0d060" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#d4a024" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#d4a024" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`shade-${rockId}`} cx="70%" cy="78%" r="60%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`read-${rockId}`} cx="50%" cy="46%" r="42%">
          <stop offset="0%" stopColor="#0c0a08" stopOpacity="0.28" />
          <stop offset="60%" stopColor="#0c0a08" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#0c0a08" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Extruded volume */}
      <path
        d={outline}
        className="capabilities-asteroid-mesh-depth"
        fill="#050403"
        transform="translate(10 14)"
        opacity="0.88"
      />
      <path
        d={outline}
        className="capabilities-asteroid-mesh-wall"
        fill={`url(#wall-lit-${rockId})`}
        filter={`url(#${wallGrainId})`}
        transform="translate(5 7)"
      />

      {/*
        Base silhouette unfiltered (always correct shape), then
        grain layer masked to the same path — double insurance.
      */}
      <path d={outline} fill={`url(#face-lit-${rockId})`} />
      <path
        d={outline}
        fill={`url(#face-lit-${rockId})`}
        filter={`url(#${grainId})`}
        mask={`url(#${maskId})`}
        opacity="0.92"
      />

      <g clipPath={`url(#${clipId})`}>
        <ellipse cx="62" cy="58" rx="78" ry="64" fill={`url(#catch-${rockId})`} />
        <ellipse
          className="capabilities-asteroid-mesh-limb"
          cx="46"
          cy="50"
          rx="72"
          ry="60"
          fill={`url(#limb-${rockId})`}
        />
        <ellipse cx="132" cy="168" rx="86" ry="72" fill={`url(#shade-${rockId})`} />
        <ellipse cx="100" cy="220" rx="88" ry="46" fill="#c9a24a" opacity="0.14" />

        <g className="capabilities-asteroid-mesh-crater" opacity="0.9">
          <ellipse cx="52" cy="48" rx="18" ry="13" fill={`url(#crater-bowl-${rockId})`} />
          <ellipse
            cx="52"
            cy="48"
            rx="18"
            ry="13"
            fill="none"
            stroke="#d4c4a8"
            strokeWidth="1.1"
            opacity="0.28"
          />
          <ellipse
            cx="50"
            cy="46"
            rx="10"
            ry="7"
            fill="none"
            stroke="#000"
            strokeWidth="2"
            opacity="0.25"
          />
        </g>
        <g className="capabilities-asteroid-mesh-crater" opacity="0.75">
          <ellipse cx="158" cy="168" rx="12" ry="9" fill={`url(#crater-bowl-${rockId})`} />
          <ellipse
            cx="158"
            cy="168"
            rx="12"
            ry="9"
            fill="none"
            stroke="#d4c4a8"
            strokeWidth="0.9"
            opacity="0.22"
          />
        </g>
        <g className="capabilities-asteroid-mesh-crater" opacity="0.65">
          <ellipse cx="162" cy="58" rx="8" ry="6" fill={`url(#crater-bowl-${rockId})`} />
          <ellipse
            cx="162"
            cy="58"
            rx="8"
            ry="6"
            fill="none"
            stroke="#d4c4a8"
            strokeWidth="0.7"
            opacity="0.2"
          />
        </g>
        <g className="capabilities-asteroid-mesh-crater" opacity="0.55">
          <ellipse cx="44" cy="178" rx="7" ry="5.5" fill={`url(#crater-bowl-${rockId})`} />
        </g>

        {cracks.map((d) => (
          <g key={d} opacity="0.4">
            <path
              d={d}
              fill="none"
              stroke="#050403"
              strokeWidth="1.15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={d}
              fill="none"
              stroke="#cfc0a4"
              strokeWidth="0.4"
              strokeLinecap="round"
              opacity="0.35"
              transform="translate(0.5 -0.5)"
            />
          </g>
        ))}

        <ellipse cx="100" cy="112" rx="54" ry="68" fill={`url(#read-${rockId})`} />

        <circle cx="38" cy="110" r="0.9" fill="#c9b896" opacity="0.28" />
        <circle cx="168" cy="130" r="0.8" fill="#e0c070" opacity="0.22" />
        <circle cx="70" cy="36" r="0.7" fill="#c9b896" opacity="0.25" />
        <circle cx="150" cy="200" r="0.9" fill="#c9b896" opacity="0.2" />
      </g>

      <path
        d={outline}
        fill="none"
        stroke="rgba(201, 162, 74, 0.16)"
        strokeWidth="0.8"
        className="capabilities-asteroid-mesh-rim"
      />
    </svg>
  )
}

const FIELD_MOTES = [
  { x: 8, y: 22, s: 2.2, a: 0.5 },
  { x: 18, y: 68, s: 1.5, a: 0.35 },
  { x: 32, y: 40, s: 1.9, a: 0.42 },
  { x: 48, y: 14, s: 1.3, a: 0.3 },
  { x: 56, y: 76, s: 2.4, a: 0.48 },
  { x: 70, y: 28, s: 1.6, a: 0.38 },
  { x: 82, y: 58, s: 2, a: 0.44 },
  { x: 90, y: 18, s: 1.4, a: 0.32 },
  { x: 14, y: 48, s: 1.7, a: 0.36 },
  { x: 64, y: 88, s: 1.8, a: 0.4 },
  { x: 40, y: 58, s: 1.2, a: 0.28 },
  { x: 76, y: 42, s: 2.1, a: 0.46 },
] as const

/** Hard seats — desktop constellation only (%, centers). */
const BELT_SEATS = [
  { x: 10, y: 28 }, // 01 INTERFACE — upper left
  { x: 22, y: 78 }, // 02 DATA — lower left
  { x: 38, y: 14 }, // 03 LIVE — top
  { x: 50, y: 70 }, // 04 AUTH — lower mid
  { x: 64, y: 16 }, // 05 AI — top rightish
  { x: 78, y: 80 }, // 06 TEST — lower right
  { x: 91, y: 44 }, // 07 SHIP — mid far right (clear of 05 + 06)
] as const

/** Tablet/mobile use a normal stacked list — no absolute seats. */
const COMPACT_MQ = "(max-width: 1023px)"

/**
 * Capability belt — desktop constellation; tablet/mobile editorial stack.
 */
export function CapabilitiesWorkspace() {
  const prefersReducedMotion = useHydratedReducedMotion()
  const fieldRef = useRef<HTMLDivElement>(null)

  const bodies = useMemo(() => {
    const byId = new Map(skillGroups.map((g) => [g.id, g]))
    return capabilityPipelineIds
      .map((id, index) => {
        const group = byId.get(id)
        const meta = capabilityCardMeta[id]
        if (!group || !meta) return null
        return { group, meta, shape: index % ROCK_OUTLINES.length }
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
  }, [])

  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(COMPACT_MQ)
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useGSAP(
    (_context, contextSafe) => {
      const field = fieldRef.current
      if (!field || !contextSafe) return

      const nebula = field.querySelector<HTMLElement>(
        ".capabilities-belt-nebula"
      )
      const world = field.querySelector<HTMLElement>(
        ".capabilities-belt-world"
      )
      const stage = field.querySelector<HTMLElement>(
        ".capabilities-belt-stage"
      )
      const ring = field.querySelector<HTMLElement>(
        ".capabilities-belt-ring-path"
      )
      const plane = field.querySelector<HTMLElement>(
        ".capabilities-belt-plane"
      )
      const motes = gsap.utils.toArray<HTMLElement>(
        field.querySelectorAll(".capabilities-belt-mote")
      )
      const shells = gsap.utils.toArray<HTMLElement>(
        field.querySelectorAll(".capabilities-asteroid-shell")
      )
      const articles = gsap.utils.toArray<HTMLElement>(
        field.querySelectorAll(".capabilities-asteroid")
      )

      // Tablet/mobile stack — no constellation birth.
      if (compact || prefersReducedMotion) {
        gsap.set([nebula, ring, plane, ...shells, ...motes], {
          autoAlpha: 1,
          clearProps: compact ? "transform,filter" : undefined,
        })
        if (compact) {
          gsap.set(shells, { clearProps: "all" })
        } else {
          gsap.set(shells, { clearProps: "transform" })
        }
        field.classList.add("is-born")
        return
      }

      const stageRect = () =>
        (stage ?? field).getBoundingClientRect()

      const birthFromCenter = () => {
        const sRect = stageRect()
        const cx = sRect.left + sRect.width * 0.5
        const cy = sRect.top + sRect.height * 0.48
        shells.forEach((shell, i) => {
          const article = articles[i] ?? shell
          const aRect = article.getBoundingClientRect()
          const ax = aRect.left + aRect.width * 0.5
          const ay = aRect.top + aRect.height * 0.5
          gsap.set(shell, {
            x: cx - ax,
            y: cy - ay,
            scale: 0.18,
            rotation: gsap.utils.random(-28, 28),
            autoAlpha: 0,
            filter: "blur(10px)",
          })
        })
      }

      gsap.set(nebula, { autoAlpha: 0, scale: 0.35 })
      gsap.set(ring, { autoAlpha: 0, scale: 0.55 })
      gsap.set([plane, ...motes], { autoAlpha: 0 })
      birthFromCenter()

      const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches
      let detachParallax: (() => void) | undefined

      if (world && finePointer) {
        const xTo = gsap.quickTo(world, "x", {
          duration: 0.75,
          ease: "power3.out",
        })
        const yTo = gsap.quickTo(world, "y", {
          duration: 0.75,
          ease: "power3.out",
        })
        const onMove = contextSafe((event: PointerEvent) => {
          const rect = field.getBoundingClientRect()
          const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2
          const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2
          xTo(nx * 14)
          yTo(ny * 10)
        })
        const onLeave = contextSafe(() => {
          xTo(0)
          yTo(0)
        })
        field.addEventListener("pointermove", onMove)
        field.addEventListener("pointerleave", onLeave)
        detachParallax = () => {
          field.removeEventListener("pointermove", onMove)
          field.removeEventListener("pointerleave", onLeave)
        }
      }

      const startAmbient = () => {
        field.classList.add("is-born")
        shells.forEach((shell, i) => {
          const driftY = i % 2 === 0 ? 14 : -12
          const driftX = [8, -7, 5][i % 3]!
          gsap.to(shell, {
            x: `+=${driftX}`,
            y: `+=${driftY}`,
            rotation: i % 2 === 0 ? 3.2 : -3.6,
            duration: 5.5 + i * 0.55,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: i * 0.08,
          })
        })
        motes.forEach((mote, i) => {
          gsap.to(mote, {
            x: 12 + (i % 4) * 4,
            y: -14 - (i % 3) * 4,
            duration: 7 + (i % 5),
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: i * 0.08,
          })
        })
        if (nebula) {
          gsap.to(nebula, {
            scale: 1.06,
            duration: 9,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          })
        }
      }

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
        onComplete: startAmbient,
      })

      tl.to(nebula, {
        autoAlpha: 1,
        scale: 1.12,
        duration: 0.65,
        ease: "power2.out",
      })
      tl.to(nebula, { scale: 1, duration: 0.45, ease: "power2.inOut" }, "-=0.12")
      tl.to(
        ring,
        { autoAlpha: 0.55, scale: 1, duration: 0.6, ease: "power2.out" },
        "-=0.75"
      )
      tl.to(
        shells,
        {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1.05,
          stagger: { each: 0.1, from: "center" },
          ease: "power3.out",
        },
        "-=0.45"
      )
      tl.to(
        [plane, ...motes],
        { autoAlpha: 1, duration: 0.45, stagger: 0.025 },
        "-=0.5"
      )

      let born = false
      const playBirth = contextSafe(() => {
        if (born) return
        born = true
        birthFromCenter()
        tl.play(0)
      })

      const triggerEl = stage ?? field
      ScrollTrigger.create({
        trigger: triggerEl,
        start: "top 82%",
        once: true,
        invalidateOnRefresh: true,
        onEnter: playBirth,
      })

      requestAnimationFrame(() => {
        const rect = triggerEl.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.82 && rect.bottom > 40) {
          playBirth()
        }
      })

      return () => {
        detachParallax?.()
        field.classList.remove("is-born")
      }
    },
    {
      scope: fieldRef,
      dependencies: [prefersReducedMotion, compact, bodies.length],
      revertOnUpdate: true,
    }
  )

  return (
    <div className="capabilities-belt">
      <header className="capabilities-belt-intro">
        <SectionReveal className="capabilities-belt-hero">
          <div className="capabilities-belt-hero-main">
            <p className="capabilities-belt-kicker">Capabilities</p>
            <h2 className="capabilities-belt-headline">
              {capabilitiesHero.lines.map((line) => (
                <span
                  key={`${line.text}${"accent" in line ? line.accent : ""}`}
                  className="capabilities-belt-headline-line editorial-display"
                >
                  {line.text}
                  {"accent" in line && line.accent ? (
                    <span className="capabilities-belt-headline-accent">
                      {line.accent}
                    </span>
                  ) : null}
                </span>
              ))}
            </h2>
          </div>
          <div className="capabilities-belt-hero-aside">
            <p className="capabilities-belt-lead">
              {capabilitiesHero.description}
            </p>
            <p className="capabilities-belt-stance">
              {capabilitiesHero.stance}
            </p>
            <p className="capabilities-belt-count">
              Belt · {String(bodies.length).padStart(2, "0")} bodies
            </p>
          </div>
        </SectionReveal>
      </header>

      <div
        ref={fieldRef}
        className={cn(
          "capabilities-belt-field",
          prefersReducedMotion && "is-reduced",
          compact && "is-compact"
        )}
        role="region"
        aria-label={
          compact ? "Capability stages" : "Capability asteroid belt"
        }
      >
        <div className="capabilities-belt-viewport">
          <div className="capabilities-belt-world">
            <div className="capabilities-belt-nebula" aria-hidden="true">
              <span className="capabilities-belt-nebula-core" />
              <span className="capabilities-belt-nebula-haze" />
              <span className="capabilities-belt-nebula-veil" />
            </div>

            <div className="capabilities-belt-dust" aria-hidden="true">
              {FIELD_MOTES.map((mote) => (
                <span
                  key={`mote-${mote.x}-${mote.y}`}
                  className="capabilities-belt-mote"
                  style={
                    {
                      left: `${mote.x}%`,
                      top: `${mote.y}%`,
                      width: mote.s,
                      height: mote.s,
                      opacity: mote.a,
                    } as CSSProperties
                  }
                />
              ))}
            </div>

            <div className="capabilities-belt-stage">
              <div
                className="capabilities-belt-ring-path"
                aria-hidden="true"
              />

              {bodies.map(({ group, meta, shape }, index) => {
                const seat = BELT_SEATS[index] ?? BELT_SEATS[0]
                const Icon = meta.icon
                return (
                  <article
                    key={group.id}
                    id={`capability-${group.id}`}
                    data-seat={index}
                    className={cn(
                      "capabilities-asteroid",
                      `capabilities-asteroid--shape-${shape}`
                    )}
                    style={
                      {
                        ...(compact
                          ? {}
                          : { left: `${seat.x}%`, top: `${seat.y}%` }),
                        "--rock-face-clip":
                          ROCK_FACE_CLIPS[shape] ?? ROCK_FACE_CLIPS[0],
                      } as CSSProperties
                    }
                    aria-label={`${meta.stage}: ${group.title}`}
                  >
                    <div className="capabilities-asteroid-shell">
                      <AsteroidMesh shape={shape} rockId={group.id} />
                      <span
                        className="capabilities-asteroid-rim"
                        aria-hidden="true"
                      />
                      <span
                        className="capabilities-asteroid-shadow"
                        aria-hidden="true"
                      />
                      <div className="capabilities-asteroid-face">
                        <div className="capabilities-asteroid-face-head">
                          <p className="capabilities-asteroid-meta">
                            {String(index + 1).padStart(2, "0")} /{" "}
                            {String(bodies.length).padStart(2, "0")}{" "}
                            <span className="capabilities-asteroid-stage">
                              {meta.stage}
                            </span>
                          </p>
                          <Icon
                            className="capabilities-asteroid-icon"
                            aria-hidden="true"
                            strokeWidth={1.6}
                          />
                        </div>
                        <h3 className="capabilities-asteroid-title editorial-display">
                          {group.title}
                        </h3>
                        <ul
                          className="capabilities-asteroid-ore"
                          aria-label="Tools"
                        >
                          {group.skills.slice(0, 4).map((skill) => (
                              <li
                                key={skill}
                                className="capabilities-asteroid-vein"
                              >
                                {skill}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="capabilities-belt-plane" aria-hidden="true">
              <span className="capabilities-belt-plane-glow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

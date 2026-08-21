"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useMemo, useRef } from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP)

function mulberry(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildStarShadows(
  seed: number,
  count: number,
  options: {
    minAlpha: number
    maxAlpha: number
    blurMax: number
    spreadMax: number
    warm?: boolean
  }
) {
  const rand = mulberry(seed)
  const parts: string[] = []

  for (let i = 0; i < count; i++) {
    const x = rand() * 100
    const y = rand() * 100
    const alpha =
      options.minAlpha + rand() * (options.maxAlpha - options.minAlpha)
    const blur = rand() * options.blurMax
    const spread = rand() * options.spreadMax
    const color = options.warm
      ? `color-mix(in srgb, var(--primary) ${45 + Math.floor(rand() * 35)}%, white)`
      : `rgb(255 255 255 / ${alpha.toFixed(3)})`

    parts.push(
      `${x.toFixed(2)}vw ${y.toFixed(2)}vh ${blur.toFixed(2)}px ${spread.toFixed(2)}px ${color}`
    )
  }

  return parts.join(", ")
}

type Twinkle = { id: number; x: number; y: number; size: number; delay: number; dur: number }
type MeteorPath = {
  id: number
  top: number
  left: number
  rotate: number
  length: number
}

/** Percent positions; rotation is derived from the path so the nose tracks velocity. */
const FLYBY_ROUTES = [
  // Shallow cruise — left → right, slight descent
  { from: { left: "-14%", top: "16%" }, to: { left: "114%", top: "34%" } },
  // Return pass — right → left, slight descent
  { from: { left: "114%", top: "20%" }, to: { left: "-14%", top: "42%" } },
  // Low skim — left → right, almost level
  { from: { left: "-14%", top: "58%" }, to: { left: "114%", top: "64%" } },
  // Climbing cut — right → left, gentle rise
  { from: { left: "114%", top: "52%" }, to: { left: "-14%", top: "28%" } },
] as const

function parsePct(value: string) {
  return Number.parseFloat(value)
}

/** Screen-space heading so SVG nose (+x) points along travel. */
function craftHeading(
  from: { left: string; top: string },
  to: { left: string; top: string }
) {
  const dx = ((parsePct(to.left) - parsePct(from.left)) / 100) * window.innerWidth
  const dy = ((parsePct(to.top) - parsePct(from.top)) / 100) * window.innerHeight
  return (Math.atan2(dy, dx) * 180) / Math.PI
}

/**
 * Global space world: starfield + twinkles + meteors + rare gold craft flyby.
 * CSS/SVG + GSAP only — no second WebGL.
 */
export function SpaceField() {
  const prefersReducedMotion = useHydratedReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const craftRef = useRef<HTMLDivElement>(null)
  const meteorsRef = useRef<HTMLDivElement>(null)

  const layers = useMemo(
    () => ({
      far: buildStarShadows(0x51a7, 140, {
        minAlpha: 0.35,
        maxAlpha: 0.7,
        blurMax: 0.4,
        spreadMax: 0.15,
      }),
      mid: buildStarShadows(0xc0de, 95, {
        minAlpha: 0.45,
        maxAlpha: 0.85,
        blurMax: 0.8,
        spreadMax: 0.35,
      }),
      near: buildStarShadows(0xf00d, 48, {
        minAlpha: 0.65,
        maxAlpha: 0.95,
        blurMax: 1.6,
        spreadMax: 0.7,
      }),
      glow: buildStarShadows(0xab12, 18, {
        minAlpha: 0.55,
        maxAlpha: 0.9,
        blurMax: 4,
        spreadMax: 1.4,
      }),
      ember: buildStarShadows(0xe31b, 28, {
        minAlpha: 0.4,
        maxAlpha: 0.8,
        blurMax: 1.2,
        spreadMax: 0.5,
        warm: true,
      }),
    }),
    []
  )

  const twinkles = useMemo(() => {
    const rand = mulberry(0x71a1)
    return Array.from({ length: 16 }, (_, id): Twinkle => ({
      id,
      x: rand() * 100,
      y: rand() * 100,
      size: 1.4 + rand() * 2.2,
      delay: rand() * 8,
      dur: 2.4 + rand() * 3.6,
    }))
  }, [])

  const meteorSeed = useMemo(() => {
    const rand = mulberry(0x5e7e)
    return Array.from({ length: 4 }, (_, id): MeteorPath => ({
      id,
      // Start high / left so the streak can cross a long diagonal
      top: 2 + rand() * 38,
      left: -8 + rand() * 55,
      // Positive = CSS clockwise = down-right fall
      rotate: 28 + rand() * 22,
      length: 100 + rand() * 90,
    }))
  }, [])

  useGSAP(
    () => {
      if (prefersReducedMotion) return

      const craft = craftRef.current
      const meteorRoot = meteorsRef.current
      if (!craft || !meteorRoot) return

      const isCompact = window.matchMedia("(max-width: 900px)").matches
      const meteorNodes = gsap.utils.toArray<HTMLElement>(
        meteorRoot.querySelectorAll(".space-field-meteor")
      )

      gsap.set(craft, { autoAlpha: 0, left: "-12%", top: "40%" })
      meteorNodes.forEach((node, i) => {
        const seed = meteorSeed[i]
        gsap.set(node, {
          autoAlpha: 0,
          x: 0,
          y: 0,
          rotation: seed?.rotate ?? 35,
          scaleX: 0.2,
          transformOrigin: "left center",
        })
      })

      const runFlyby = () => {
        const route =
          FLYBY_ROUTES[Math.floor(Math.random() * FLYBY_ROUTES.length)] ??
          FLYBY_ROUTES[0]
        const duration = isCompact ? 4.15 : 5.54
        const heading = craftHeading(route.from, route.to)

        gsap
          .timeline()
          .set(craft, {
            autoAlpha: 0,
            left: route.from.left,
            top: route.from.top,
            rotation: heading,
            scale: isCompact ? 0.78 : 1,
            transformOrigin: "50% 50%",
          })
          .to(craft, {
            autoAlpha: 1,
            duration: 0.4,
            ease: "power1.out",
          })
          .to(
            craft,
            {
              left: route.to.left,
              top: route.to.top,
              duration,
              ease: "none",
            },
            0
          )
          .to(
            craft,
            {
              autoAlpha: 0,
              duration: 0.5,
              ease: "power1.in",
            },
            duration - 0.5
          )
      }

      const runMeteor = () => {
        const index = Math.floor(Math.random() * meteorNodes.length)
        const node = meteorNodes[index]
        const seed = meteorSeed[index]
        if (!node) return

        const angle = (seed?.rotate ?? 35) * (Math.PI / 180)
        // Travel along the streak axis so the head leads a full fly-across
        const dist =
          (isCompact ? 0.8 : 1.05) *
          Math.hypot(window.innerWidth, window.innerHeight) *
          (0.5 + Math.random() * 0.3)
        const dx = Math.cos(angle) * dist
        const dy = Math.sin(angle) * dist
        const duration = 1.45 + Math.random() * 0.5

        gsap
          .timeline()
          .set(node, {
            autoAlpha: 0,
            x: 0,
            y: 0,
            rotation: seed?.rotate ?? 35,
            scaleX: 0.25,
            transformOrigin: "left center",
          })
          .to(node, {
            autoAlpha: 1,
            scaleX: 1,
            duration: 0.2,
            ease: "power1.out",
          })
          .to(
            node,
            {
              x: dx,
              y: dy,
              duration,
              ease: "none",
            },
            0
          )
          .to(
            node,
            {
              autoAlpha: 0,
              scaleX: 0.65,
              duration: 0.32,
              ease: "power1.in",
            },
            duration - 0.32
          )
      }

      const timers: gsap.core.Tween[] = []

      timers.push(
        gsap.delayedCall(isCompact ? 3.5 : 2.2, () => {
          runMeteor()
        })
      )
      timers.push(gsap.delayedCall(isCompact ? 8 : 5.5, runFlyby))

      const scheduleCraft = () => {
        const wait = isCompact ? 26 + Math.random() * 14 : 18 + Math.random() * 16
        timers.push(
          gsap.delayedCall(wait, () => {
            runFlyby()
            scheduleCraft()
          })
        )
      }
      timers.push(
        gsap.delayedCall(isCompact ? 28 : 22, () => {
          runFlyby()
          scheduleCraft()
        })
      )

      const scheduleMeteor = () => {
        const wait = isCompact ? 9 + Math.random() * 8 : 6 + Math.random() * 7
        timers.push(
          gsap.delayedCall(wait, () => {
            runMeteor()
            scheduleMeteor()
          })
        )
      }
      timers.push(
        gsap.delayedCall(isCompact ? 11 : 8, () => {
          runMeteor()
          scheduleMeteor()
        })
      )

      return () => {
        timers.forEach((t) => t.kill())
      }
    },
    {
      scope: rootRef,
      dependencies: [prefersReducedMotion, meteorSeed],
      revertOnUpdate: true,
    }
  )

  return (
    <div
      ref={rootRef}
      className={cn("space-field", prefersReducedMotion && "is-still")}
      aria-hidden="true"
    >
      <span
        className="space-field-dots space-field-dots--far"
        style={{ boxShadow: layers.far }}
      />
      <span
        className="space-field-dots space-field-dots--mid"
        style={{ boxShadow: layers.mid }}
      />
      <span
        className="space-field-dots space-field-dots--near"
        style={{ boxShadow: layers.near }}
      />
      <span
        className="space-field-dots space-field-dots--glow"
        style={{ boxShadow: layers.glow }}
      />
      <span
        className="space-field-dots space-field-dots--ember"
        style={{ boxShadow: layers.ember }}
      />

      {!prefersReducedMotion
        ? twinkles.map((star) => (
            <span
              key={star.id}
              className="space-field-twinkle"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.dur}s`,
              }}
            />
          ))
        : null}

      {!prefersReducedMotion ? (
        <div ref={meteorsRef} className="space-field-meteors">
          {meteorSeed.map((m) => (
            <span
              key={m.id}
              className="space-field-meteor"
              style={{
                top: `${m.top}%`,
                left: `${m.left}%`,
                width: m.length,
              }}
            />
          ))}
        </div>
      ) : null}

      {!prefersReducedMotion ? (
        <div ref={craftRef} className="space-field-craft">
          <span className="space-field-craft-trail" />
          <span className="space-field-craft-glow" />
          <svg
            className="space-field-craft-svg"
            viewBox="0 0 88 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Slim dart fuselage */}
            <path
              d="M10 11 L28 7.2 H52 L68 9.2 L78 11 L68 12.8 H52 L28 14.8 Z"
              fill="url(#spaceCraftHull)"
            />
            {/* Canopy */}
            <ellipse
              cx="40"
              cy="11"
              rx="7.5"
              ry="2.2"
              fill="url(#spaceCraftCanopy)"
              opacity="0.9"
            />
            {/* Upper fin */}
            <path
              d="M22 7.4 L14 2.5 L30 7.8 Z"
              fill="color-mix(in srgb, var(--primary) 55%, #c8c8d4)"
              opacity="0.9"
            />
            {/* Lower fin */}
            <path
              d="M22 14.6 L14 19.5 L30 14.2 Z"
              fill="color-mix(in srgb, var(--primary) 55%, #c8c8d4)"
              opacity="0.9"
            />
            {/* Gold nose */}
            <path
              d="M68 9.2 L82 11 L68 12.8 Z"
              fill="url(#spaceCraftNose)"
            />
            {/* Engine bead */}
            <circle cx="12" cy="11" r="1.4" fill="var(--primary)" />
            <defs>
              <linearGradient
                id="spaceCraftHull"
                x1="10"
                y1="11"
                x2="78"
                y2="11"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#6a6a78" />
                <stop offset="0.35" stopColor="#d8d8e4" />
                <stop offset="0.75" stopColor="#b8b8c6" />
                <stop offset="1" stopColor="#e8c45a" />
              </linearGradient>
              <linearGradient
                id="spaceCraftCanopy"
                x1="33"
                y1="11"
                x2="48"
                y2="11"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2a2a36" />
                <stop offset="1" stopColor="#5a5a6a" />
              </linearGradient>
              <linearGradient
                id="spaceCraftNose"
                x1="68"
                y1="11"
                x2="82"
                y2="11"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#f0d060" />
                <stop offset="1" stopColor="#d4a024" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ) : null}
    </div>
  )
}

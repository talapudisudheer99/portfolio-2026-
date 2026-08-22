"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useMemo, useRef } from "react"

import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

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

/**
 * Slim SVG craft — diagonal flybys (not a level skim across the top).
 * Nose is +x; rotation follows the path.
 */
const FLYBY_ROUTES = [
  // Dive L → R
  { from: { left: "-14%", top: "12%" }, to: { left: "114%", top: "42%" } },
  // Climb R → L
  { from: { left: "114%", top: "48%" }, to: { left: "-14%", top: "18%" } },
  // Mid diagonal L → R
  { from: { left: "-14%", top: "28%" }, to: { left: "114%", top: "58%" } },
  // Return dive R → L
  { from: { left: "114%", top: "22%" }, to: { left: "-14%", top: "50%" } },
] as const

function parsePct(value: string) {
  return Number.parseFloat(value)
}

/** Screen-space heading so SVG nose (+x) points along travel. */
function craftHeading(
  from: { left: string; top: string },
  to: { left: string; top: string }
) {
  const dx =
    ((parsePct(to.left) - parsePct(from.left)) / 100) * window.innerWidth
  const dy =
    ((parsePct(to.top) - parsePct(from.top)) / 100) * window.innerHeight
  return (Math.atan2(dy, dx) * 180) / Math.PI
}

/** True when Sameward/product mid-frame is clear — skip sky traffic over UI. */
function upperSkyIsClear() {
  const projects = document.querySelector("#projects")
  if (!projects) return true
  const vh = window.innerHeight || 1
  const r = projects.getBoundingClientRect()
  // Tablet owns the middle band — hold meteors/craft
  return !(r.top < vh * 0.58 && r.bottom > vh * 0.22)
}

/**
 * Global space world: starfield + twinkles + meteors + rare SVG craft flyby.
 * CSS/SVG + GSAP only — WebGL props live in AmbientAtmosphere.
 */
export function SpaceField() {
  const prefersReducedMotion = useHydratedReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const craftRef = useRef<HTMLDivElement>(null)
  const meteorsRef = useRef<HTMLDivElement>(null)

  const layers = useMemo(
    () => ({
      far: buildStarShadows(0x51a7, 96, {
        minAlpha: 0.28,
        maxAlpha: 0.65,
        blurMax: 0.25,
        spreadMax: 0.08,
      }),
      mid: buildStarShadows(0xc0de, 64, {
        minAlpha: 0.4,
        maxAlpha: 0.85,
        blurMax: 0.55,
        spreadMax: 0.22,
      }),
      near: buildStarShadows(0xf00d, 32, {
        minAlpha: 0.6,
        maxAlpha: 0.98,
        blurMax: 1.1,
        spreadMax: 0.45,
      }),
      glow: buildStarShadows(0xab12, 8, {
        minAlpha: 0.5,
        maxAlpha: 0.92,
        blurMax: 2.4,
        spreadMax: 0.8,
      }),
      ember: buildStarShadows(0xe31b, 14, {
        minAlpha: 0.35,
        maxAlpha: 0.85,
        blurMax: 0.8,
        spreadMax: 0.3,
        warm: true,
      }),
    }),
    []
  )

  const twinkles = useMemo(() => {
    const rand = mulberry(0x71a1)
    return Array.from({ length: 12 }, (_, id): Twinkle => ({
      id,
      x: rand() * 100,
      y: rand() * 100,
      size: 1.3 + rand() * 2.6,
      delay: rand() * 8,
      dur: 2.1 + rand() * 3.8,
    }))
  }, [])

  const meteorSeed = useMemo(() => {
    const rand = mulberry(0x5e7e)
    // Classic gold streaks — only the top sky band (never mid-frame / tablet)
    return Array.from({ length: 4 }, (_, id): MeteorPath => {
      const fromLeft = rand() > 0.45
      return {
        id,
        // Upper 6–18% only
        top: 6 + rand() * 12,
        left: fromLeft ? -12 + rand() * 18 : 72 + rand() * 28,
        // Shallow diagonal fall — one story, not random rise/fall mix
        rotate: fromLeft ? 28 + rand() * 14 : 152 + rand() * 14,
        length: 72 + rand() * 48,
      }
    })
  }, [])

  useGSAP(
    () => {
      const root = rootRef.current
      const craft = craftRef.current
      const meteorRoot = meteorsRef.current
      if (!root || prefersReducedMotion) return
      if (!craft || !meteorRoot) return

      const isCompact = window.matchMedia("(max-width: 900px)").matches
      const meteorNodes = gsap.utils.toArray<HTMLElement>(
        meteorRoot.querySelectorAll(".space-field-meteor")
      )
      const far = root.querySelector(".space-field-parallax--far")
      const mid = root.querySelector(".space-field-parallax--mid")
      const near = root.querySelector(".space-field-parallax--near")
      const glow = root.querySelector(".space-field-parallax--glow")
      const ember = root.querySelector(".space-field-parallax--ember")
      const nebulaA = root.querySelector(".space-field-nebula--a")
      const nebulaB = root.querySelector(".space-field-nebula--b")
      const dust = root.querySelector(".space-field-dust")

      const parallax = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,
        },
      })
      if (far) parallax.to(far, { yPercent: -8, ease: "none" }, 0)
      if (mid) parallax.to(mid, { yPercent: -14, xPercent: 2, ease: "none" }, 0)
      if (near)
        parallax.to(near, { yPercent: -22, xPercent: -1.5, ease: "none" }, 0)
      if (glow) parallax.to(glow, { yPercent: -26, ease: "none" }, 0)
      if (ember) parallax.to(ember, { yPercent: -18, xPercent: 3, ease: "none" }, 0)
      if (nebulaA)
        parallax.to(nebulaA, { yPercent: -12, xPercent: 4, ease: "none" }, 0)
      if (nebulaB)
        parallax.to(nebulaB, { yPercent: -20, xPercent: -5, ease: "none" }, 0)
      if (dust) parallax.to(dust, { yPercent: -10, opacity: 0.55, ease: "none" }, 0)

      gsap.set(craft, { autoAlpha: 0, left: "-12%", top: "28%" })
      meteorNodes.forEach((node, i) => {
        const seed = meteorSeed[i]
        gsap.set(node, {
          autoAlpha: 0,
          x: 0,
          y: 0,
          rotation: seed?.rotate ?? 32,
          scaleX: 0.15,
          transformOrigin: "left center",
        })
      })

      let craftBusy = false
      let meteorBusy = false

      const runFlyby = () => {
        if (craftBusy || !upperSkyIsClear()) return
        craftBusy = true

        const route =
          FLYBY_ROUTES[Math.floor(Math.random() * FLYBY_ROUTES.length)] ??
          FLYBY_ROUTES[0]
        // Slower, readable pass — silhouette + trail stay clear
        const duration = isCompact ? 4.2 : 5.1
        const heading = craftHeading(route.from, route.to)

        gsap
          .timeline({
            onComplete: () => {
              craftBusy = false
            },
          })
          .set(craft, {
            autoAlpha: 0,
            left: route.from.left,
            top: route.from.top,
            rotation: heading,
            scale: isCompact ? 0.72 : 0.92,
            transformOrigin: "50% 50%",
          })
          .to(craft, {
            autoAlpha: 0.92,
            duration: 0.55,
            ease: "power2.out",
          })
          .to(
            craft,
            {
              left: route.to.left,
              top: route.to.top,
              duration,
              ease: "power1.inOut",
            },
            0.15
          )
          .to(
            craft,
            {
              autoAlpha: 0,
              duration: 0.65,
              ease: "power2.in",
            },
            duration - 0.35
          )
      }

      const runMeteor = () => {
        if (meteorBusy || !upperSkyIsClear()) return

        const index = Math.floor(Math.random() * meteorNodes.length)
        const node = meteorNodes[index]
        const seed = meteorSeed[index]
        if (!node || !seed) return

        meteorBusy = true
        const angle = seed.rotate * (Math.PI / 180)
        // Short, fast streak — reads as a spark, not a lingering slash
        const dist =
          (isCompact ? 0.28 : 0.36) *
          Math.hypot(window.innerWidth, window.innerHeight)
        const dx = Math.cos(angle) * dist
        const dy = Math.sin(angle) * dist
        const duration = 0.7 + Math.random() * 0.28

        gsap
          .timeline({
            onComplete: () => {
              meteorBusy = false
            },
          })
          .set(node, {
            autoAlpha: 0,
            x: 0,
            y: 0,
            rotation: seed.rotate,
            scaleX: 0.2,
            transformOrigin: "left center",
          })
          .to(node, {
            autoAlpha: 1,
            scaleX: 1,
            duration: 0.12,
            ease: "power1.out",
          })
          .to(
            node,
            {
              x: dx,
              y: dy,
              duration,
              ease: "power1.in",
            },
            0
          )
          .to(
            node,
            {
              autoAlpha: 0,
              scaleX: 0.35,
              duration: 0.22,
              ease: "power2.in",
            },
            duration - 0.18
          )
      }

      const timers: gsap.core.Tween[] = []

      const tryMeteor = () => {
        if (upperSkyIsClear()) runMeteor()
      }
      const tryFlyby = () => {
        if (upperSkyIsClear()) runFlyby()
      }

      // Hero beat — one quiet meteor, then a craft after the page settles
      timers.push(gsap.delayedCall(isCompact ? 4.5 : 3.2, tryMeteor))
      timers.push(gsap.delayedCall(isCompact ? 11 : 8.5, tryFlyby))

      const scheduleCraft = () => {
        // Rare — atmosphere accent, not traffic
        const wait = isCompact ? 36 + Math.random() * 18 : 28 + Math.random() * 16
        timers.push(
          gsap.delayedCall(wait, () => {
            tryFlyby()
            scheduleCraft()
          })
        )
      }
      timers.push(
        gsap.delayedCall(isCompact ? 40 : 32, () => {
          scheduleCraft()
        })
      )

      const scheduleMeteor = () => {
        // Occasional gold sparks — not a continuous shower
        const wait = isCompact ? 14 + Math.random() * 10 : 11 + Math.random() * 9
        timers.push(
          gsap.delayedCall(wait, () => {
            tryMeteor()
            scheduleMeteor()
          })
        )
      }
      timers.push(
        gsap.delayedCall(isCompact ? 12 : 9, () => {
          scheduleMeteor()
        })
      )

      return () => {
        timers.forEach((t) => t.kill())
        parallax.scrollTrigger?.kill()
        parallax.kill()
        gsap.killTweensOf(craft)
        meteorNodes.forEach((n) => gsap.killTweensOf(n))
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
      {/* Soft cosmic gas — entire journey, not hero-only */}
      <div className="space-field-nebula space-field-nebula--a" />
      <div className="space-field-nebula space-field-nebula--b" />
      <div className="space-field-dust" />

      <div className="space-field-parallax space-field-parallax--far">
        <span
          className="space-field-dots space-field-dots--far"
          style={{ boxShadow: layers.far }}
        />
      </div>
      <div className="space-field-parallax space-field-parallax--mid">
        <span
          className="space-field-dots space-field-dots--mid"
          style={{ boxShadow: layers.mid }}
        />
      </div>
      <div className="space-field-parallax space-field-parallax--near">
        <span
          className="space-field-dots space-field-dots--near"
          style={{ boxShadow: layers.near }}
        />
      </div>
      <div className="space-field-parallax space-field-parallax--glow">
        <span
          className="space-field-dots space-field-dots--glow"
          style={{ boxShadow: layers.glow }}
        />
      </div>
      <div className="space-field-parallax space-field-parallax--ember">
        <span
          className="space-field-dots space-field-dots--ember"
          style={{ boxShadow: layers.ember }}
        />
      </div>

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
            <path
              d="M10 11 L28 7.2 H52 L68 9.2 L78 11 L68 12.8 H52 L28 14.8 Z"
              fill="url(#spaceCraftHull)"
            />
            <ellipse
              cx="40"
              cy="11"
              rx="7.5"
              ry="2.2"
              fill="url(#spaceCraftCanopy)"
              opacity="0.9"
            />
            <path
              d="M22 7.4 L14 2.5 L30 7.8 Z"
              fill="color-mix(in srgb, var(--primary) 55%, #c8c8d4)"
              opacity="0.9"
            />
            <path
              d="M22 14.6 L14 19.5 L30 14.2 Z"
              fill="color-mix(in srgb, var(--primary) 55%, #c8c8d4)"
              opacity="0.9"
            />
            <path
              d="M68 9.2 L82 11 L68 12.8 Z"
              fill="url(#spaceCraftNose)"
            />
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

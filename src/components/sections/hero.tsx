"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { ArrowUpRight, Download, ExternalLink } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { MotionParallax } from "@/components/motion/parallax-layer"
import {
  ATMOSPHERE_WAIT_MS,
  useAtmosphereReady,
} from "@/components/shared/atmosphere-ready"
import { useHydratedReducedMotion } from "@/components/shared/motion"
import { siteConfig } from "@/data/site"
import { duration, ease } from "@/lib/motion"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

/** Soft magnetic depth — Level 3 must not overpower Level 1 atmosphere */
const REACH = 160
const PUSH = 10

export function Hero() {
  const { hero } = siteConfig
  const still = useHydratedReducedMotion()
  const stillRef = useRef(still)
  const { ready: atmosphereReady } = useAtmosphereReady()
  const [waitExpired, setWaitExpired] = useState(false)
  useEffect(() => {
    stillRef.current = still
  }, [still])
  useEffect(() => {
    if (atmosphereReady) return
    const id = window.setTimeout(
      () => setWaitExpired(true),
      ATMOSPHERE_WAIT_MS
    )
    return () => window.clearTimeout(id)
  }, [atmosphereReady])
  const moonReady = atmosphereReady || waitExpired
  const root = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    (_ctx, contextSafe) => {
      const section = root.current
      const headlineEl = headlineRef.current
      if (!section || !headlineEl || !contextSafe) return

      const contentEl = section.querySelector(
        "[data-h-content]"
      ) as HTMLElement | null
      const cueEl = section.querySelector("[data-h-cue]") as HTMLElement | null
      if (!contentEl) return

      const kickerEl = section.querySelector("[data-h-kicker]")
      const taglineEl = section.querySelector("[data-h-tagline]")
      const statusEl = section.querySelector("[data-h-status]")
      const ctaEls = gsap.utils.toArray<HTMLElement>("[data-h-cta]", section)
      const enterTargets = [
        kickerEl,
        headlineEl,
        taglineEl,
        statusEl,
        ...ctaEls,
        cueEl,
      ].filter(Boolean) as HTMLElement[]

      const revealAll = () => {
        gsap.set(enterTargets, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "none",
          clearProps: "filter",
        })
        gsap.set(headlineEl.querySelectorAll(".hero-word"), {
          autoAlpha: 1,
          y: 0,
          x: 0,
          filter: "none",
          clearProps: "filter",
        })
      }

      if (stillRef.current) {
        revealAll()
        return
      }

      // Hold hero until moon is painted (or wait budget expires)
      if (kickerEl) gsap.set(kickerEl, { autoAlpha: 0, y: 28 })
      gsap.set(headlineEl, { autoAlpha: 0, scale: 0.985 })
      if (taglineEl) gsap.set(taglineEl, { autoAlpha: 0, y: 28 })
      if (statusEl) gsap.set(statusEl, { autoAlpha: 0, y: 22 })
      if (ctaEls.length) gsap.set(ctaEls, { autoAlpha: 0, y: 18 })
      if (cueEl) gsap.set(cueEl, { autoAlpha: 0, y: 12 })

      if (!moonReady) {
        return
      }

      const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches

      let entranceComplete = false
      let magneticCleanup: (() => void) | undefined
      let split: SplitText | undefined
      let cancelled = false

      const failsafe = window.setTimeout(() => {
        if (!cancelled && !entranceComplete) revealAll()
      }, 1800)

      const tl = gsap.timeline({
        defaults: { ease: ease.reveal },
        onComplete: () => {
          entranceComplete = true
          window.clearTimeout(failsafe)
        },
      })

      if (kickerEl) {
        tl.to(
          kickerEl,
          { y: 0, autoAlpha: 1, duration: duration.copy },
          0
        )
      }

      // Absolute times — supporting copy always reveals even if SplitText fails
      if (taglineEl) {
        tl.to(
          taglineEl,
          { y: 0, autoAlpha: 1, duration: duration.copy },
          0.85
        )
      }
      if (statusEl) {
        tl.to(
          statusEl,
          { y: 0, autoAlpha: 1, duration: duration.copy },
          1.1
        )
      }
      if (ctaEls.length) {
        tl.to(
          ctaEls,
          {
            y: 0,
            autoAlpha: 1,
            duration: duration.ui,
            stagger: 0.08,
          },
          1.3
        )
      }
      if (cueEl) {
        tl.to(
          cueEl,
          { y: 0, autoAlpha: 1, duration: duration.ui },
          1.5
        )
      }

      const attachMagnetic = contextSafe(() => {
        if (!finePointer || magneticCleanup) return
        const words = gsap.utils.toArray<HTMLElement>(
          ".hero-word",
          headlineEl
        )
        if (!words.length) return

        let centers: { x: number; y: number }[] = []
        const xTo = words.map((n) =>
          gsap.quickTo(n, "x", { duration: 0.5, ease: "power3.out" })
        )
        const yTo = words.map((n) =>
          gsap.quickTo(n, "y", { duration: 0.5, ease: "power3.out" })
        )

        function cacheCenters() {
          centers = words.map((n) => {
            const b = n.getBoundingClientRect()
            return { x: b.left + b.width / 2, y: b.top + b.height / 2 }
          })
        }
        cacheCenters()

        function pullWords(px: number, py: number) {
          words.forEach((_, i) => {
            const c = centers[i]
            if (!c) return
            const dx = px - c.x
            const dy = py - c.y
            const pull = Math.max(0, 1 - Math.hypot(dx, dy) / REACH)
            xTo[i]?.((dx / REACH) * PUSH * pull)
            yTo[i]?.((dy / REACH) * PUSH * pull)
          })
        }

        function restWords() {
          xTo.forEach((t) => t(0))
          yTo.forEach((t) => t(0))
        }

        const onMove = (e: PointerEvent) => {
          pullWords(e.clientX, e.clientY)
        }
        const onLeave = () => {
          restWords()
        }

        section.addEventListener("pointermove", onMove)
        section.addEventListener("pointerleave", onLeave)
        window.addEventListener("scroll", cacheCenters, { passive: true })
        window.addEventListener("resize", cacheCenters)

        magneticCleanup = () => {
          section.removeEventListener("pointermove", onMove)
          section.removeEventListener("pointerleave", onLeave)
          window.removeEventListener("scroll", cacheCenters)
          window.removeEventListener("resize", cacheCenters)
        }
      })

      const runSplit = () => {
        if (cancelled) return
        try {
          split = SplitText.create(headlineEl, {
            type: "words",
            autoSplit: false,
            tag: "span",
            wordsClass: "hero-word",
            aria: "none",
            onSplit(self) {
              headlineEl
                .querySelectorAll("[data-accent] .hero-word")
                .forEach((el) => {
                  el.classList.add("hero-accent-word")
                })

              if (entranceComplete || tl.progress() > 0.35) {
                gsap.set(headlineEl, { autoAlpha: 1, scale: 1 })
                gsap.set(self.words, {
                  force3D: true,
                  autoAlpha: 1,
                  y: 0,
                  filter: "none",
                  clearProps: "filter",
                })
                attachMagnetic()
                return
              }

              gsap.set(headlineEl, { autoAlpha: 1 })
              gsap.set(self.words, {
                force3D: true,
                autoAlpha: 0,
                y: 52,
                filter: "blur(8px)",
              })

              const wordsTween = tl.to(
                self.words,
                {
                  y: 0,
                  autoAlpha: 1,
                  filter: "blur(0px)",
                  duration: duration.hero,
                  stagger: { each: 0.055, from: "start" },
                  ease: "power4.out",
                  onComplete: () => {
                    gsap.set(self.words, { clearProps: "filter" })
                    attachMagnetic()
                  },
                },
                0.12
              )

              tl.to(
                headlineEl,
                {
                  scale: 1,
                  duration: duration.section,
                  ease: ease.cinematic,
                },
                0.2
              )

              return wordsTween
            },
          })
        } catch {
          gsap.set(headlineEl, { autoAlpha: 1, scale: 1 })
        }
      }

      // Prefer fonts, but never block forever — race a short timeout
      const fontsReady =
        typeof document !== "undefined" && document.fonts?.ready
          ? document.fonts.ready
          : Promise.resolve()

      Promise.race([
        fontsReady,
        new Promise<void>((resolve) => {
          window.setTimeout(resolve, 400)
        }),
      ]).then(() => {
        if (!cancelled) runSplit()
      })

      // Hero exit stays with normal scroll (no portal handoff)

      return () => {
        cancelled = true
        window.clearTimeout(failsafe)
        magneticCleanup?.()
        split?.revert()
      }
    },
    { scope: root, dependencies: [moonReady], revertOnUpdate: true }
  )

  return (
    <section ref={root} id="hero" className="hero-editorial">
      <div className="hero-content" data-h-content="">
        {hero.kicker ? (
          <p data-h-kicker="" className="hero-kicker">
            <span className="hero-kicker-dot" aria-hidden="true" />
            {hero.kicker}
          </p>
        ) : null}

        <h1 ref={headlineRef} className="hero-headline">
          <span className="hero-line">
            I built <span data-accent="">Sameward</span>
          </span>
          <span className="hero-line">a live product system,</span>
          <span className="hero-line">end to end.</span>
        </h1>

        <p data-h-tagline="" className="hero-tagline">
          {Array.isArray(hero.tagline)
            ? hero.tagline.map((line, i) => (
                <span key={i}>
                  {i > 0 ? <br /> : null}
                  {line}
                </span>
              ))
            : hero.tagline}
        </p>

        <div data-h-status="" className="hero-status">
          <span className="hero-status-dot" />
          <a
            href={hero.availabilityHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-status-text"
          >
            {hero.availability}
            <ExternalLink className="size-3.5 ml-1.5 inline" />
          </a>
        </div>

        <div className="hero-actions">
          {hero.ctas.map((cta) => {
            const Icon = cta.variant === "primary" ? ArrowUpRight : Download
            return (
              <a
                key={cta.label}
                data-h-cta=""
                data-cursor={cta.variant === "primary" ? "View" : "Download"}
                href={cta.href}
                target={cta.external ? "_blank" : undefined}
                rel={cta.external ? "noopener noreferrer" : undefined}
                className={
                  cta.variant === "primary"
                    ? "hero-btn hero-btn--primary"
                    : "hero-btn hero-btn--ghost"
                }
              >
                {cta.label}
                <Icon className="size-4" aria-hidden="true" />
              </a>
            )
          })}
        </div>
      </div>

      <MotionParallax
        strength="decoration"
        className="hero-scroll-cue"
        aria-hidden="true"
      >
        <div data-h-cue="" className="hero-scroll-line" />
      </MotionParallax>
    </section>
  )
}

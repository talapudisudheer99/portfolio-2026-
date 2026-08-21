"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { ArrowUpRight, Download, ExternalLink } from "lucide-react"
import { useEffect, useRef } from "react"

import { MotionParallax } from "@/components/motion/parallax-layer"
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
  useEffect(() => {
    stillRef.current = still
  }, [still])
  const root = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const didAnimate = useRef(false)

  useGSAP(
    (_ctx, contextSafe) => {
      const section = root.current
      const headlineEl = headlineRef.current
      if (!section || !headlineEl || !contextSafe) return
      if (didAnimate.current) return
      didAnimate.current = true

      const prefersStill = stillRef.current

      const contentEl = section.querySelector("[data-h-content]") as HTMLElement
      const cueEl = section.querySelector("[data-h-cue]") as HTMLElement | null
      const allTargets =
        "[data-h-kicker], [data-h-tagline], [data-h-status], [data-h-cta]"

      if (prefersStill) {
        contentEl.style.visibility = "visible"
        return
      }

      gsap.set(allTargets, {
        autoAlpha: 0,
        y: (_i, el) => {
          if (el.matches("[data-h-tagline]")) return 28
          if (el.matches("[data-h-status]")) return 22
          return 18
        },
      })
      gsap.set(headlineEl, { autoAlpha: 1, scale: 0.985 })
      if (cueEl) gsap.set(cueEl, { autoAlpha: 0, y: 12 })
      contentEl.style.visibility = "visible"

      const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches

      // Phase 09 Task 5 — one assemble timeline, then calm
      const tl = gsap.timeline({ defaults: { ease: ease.reveal } })

      const kickerEl = section.querySelector("[data-h-kicker]")
      if (kickerEl) {
        tl.fromTo(
          kickerEl,
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: duration.copy }
        )
      }

      const split = SplitText.create(headlineEl, {
        type: "words",
        autoSplit: true,
        tag: "span",
        wordsClass: "hero-word",
        aria: "none",
        onSplit(self) {
          gsap.set(self.words, {
            force3D: true,
            autoAlpha: 0,
            y: 56,
            filter: "blur(6px)",
          })
          headlineEl
            .querySelectorAll("[data-accent] .hero-word")
            .forEach((el) => {
              el.classList.add("hero-accent-word")
            })
          tl.to(
            self.words,
            {
              y: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: duration.hero,
              stagger: { each: 0.05, from: "start" },
              ease: "power4.out",
              onComplete: () => {
                gsap.set(self.words, { clearProps: "filter" })
              },
            },
            kickerEl ? "-=0.08" : 0
          )
          tl.to(
            headlineEl,
            { scale: 1, duration: duration.section, ease: ease.cinematic },
            "<+=0.15"
          )
        },
      })

      tl.to(
        "[data-h-tagline]",
        { y: 0, autoAlpha: 1, duration: duration.copy },
        "-=0.35"
      )
        .to(
          "[data-h-status]",
          { y: 0, autoAlpha: 1, duration: duration.copy },
          "-=0.28"
        )
        .to(
          "[data-h-cta]",
          {
            y: 0,
            autoAlpha: 1,
            duration: duration.ui,
            stagger: 0.07,
          },
          "-=0.2"
        )

      if (cueEl) {
        tl.to(
          cueEl,
          { y: 0, autoAlpha: 1, duration: duration.ui },
          "-=0.05"
        )
      }

      gsap.to(headlineEl, {
        yPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.75,
        },
      })

      gsap.to("[data-h-content]", {
        autoAlpha: 0,
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "35% top",
          end: "85% top",
          scrub: 0.75,
        },
      })

      if (!finePointer) {
        return () => {
          split.revert()
        }
      }

      const words = gsap.utils.toArray<HTMLElement>(".hero-word")
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

      const onMove = contextSafe((e: PointerEvent) => {
        pullWords(e.clientX, e.clientY)
      })

      const onLeave = contextSafe(() => {
        restWords()
      })

      section.addEventListener("pointermove", onMove)
      section.addEventListener("pointerleave", onLeave)
      window.addEventListener("scroll", cacheCenters, { passive: true })
      window.addEventListener("resize", cacheCenters)

      return () => {
        section.removeEventListener("pointermove", onMove)
        section.removeEventListener("pointerleave", onLeave)
        window.removeEventListener("scroll", cacheCenters)
        window.removeEventListener("resize", cacheCenters)
        split.revert()
      }
    },
    { scope: root }
  )

  return (
    <section ref={root} id="hero" className="hero-editorial">
      <div
        className="hero-content"
        data-h-content=""
        style={{ visibility: "hidden" }}
      >
        {hero.kicker ? (
          <p data-h-kicker="" className="hero-kicker">
            <span className="hero-kicker-dot" aria-hidden="true" />
            {hero.kicker}
          </p>
        ) : null}

        <h1 ref={headlineRef} className="hero-headline">
          {hero.headline.map((seg, i) => (
            <span key={i}>
              {seg.break && <br />}
              <span
                data-accent={seg.accent ? "" : undefined}
                data-nowrap={seg.nowrap ? "" : undefined}
              >
                {seg.text}
              </span>{" "}
            </span>
          ))}
        </h1>

        <p data-h-tagline="" className="hero-tagline">
          {hero.tagline}
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

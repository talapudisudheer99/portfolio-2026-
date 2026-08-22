"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowUpRight, Download, ExternalLink } from "lucide-react"
import { useEffect, useRef } from "react"

import { MotionParallax } from "@/components/motion/parallax-layer"
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import { waitForAtmosphere } from "@/hooks/use-deferred-layer"
import { siteConfig } from "@/data/site"

gsap.registerPlugin(useGSAP)

function BootWords({
  text,
  accent = false,
}: {
  text: string
  accent?: boolean
}) {
  const words = text.split(" ")
  return (
    <>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          {i > 0 ? " " : null}
          <span className="hero-word">
            <span className={accent ? "hero-accent-word" : "hero-word-inner"}>
              {word}
            </span>
          </span>
        </span>
      ))}
    </>
  )
}

/**
 * Opacity lives on `.hero-word` (plain span). Gradient clip stays on the inner
 * fill — clip + opacity on the same node does not fade in WebKit.
 */
export function Hero() {
  const { hero } = siteConfig
  const still = useHydratedReducedMotion()
  const stillRef = useRef(still)
  useEffect(() => {
    stillRef.current = still
  }, [still])
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = root.current
      if (!section) return

      const kickerEl = section.querySelector("[data-h-kicker]")
      const lines = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll(".hero-line")
      )
      const tagWords = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll(".hero-tagline .hero-word")
      )
      const statusEl = section.querySelector("[data-h-status]")
      const ctaEls = gsap.utils.toArray<HTMLElement>("[data-h-cta]", section)
      const cueEl = section.querySelector("[data-h-cue]")
      const chrome = [statusEl, ...ctaEls, cueEl].filter(Boolean) as HTMLElement[]

      let cancelled = false
      let done = false
      let failsafe = 0
      let tl: gsap.core.Timeline | null = null

      const finish = () => {
        if (done) return
        done = true
        section.classList.add("hero-booted")
      }

      const play = () => {
        if (cancelled || done) return

        const content = section.querySelector<HTMLElement>(".hero-content")
        const headlineWords = gsap.utils.toArray<HTMLElement>(
          section.querySelectorAll(".hero-headline .hero-word")
        )

        if (stillRef.current) {
          if (content) gsap.set(content, { autoAlpha: 1 })
          gsap.set([...headlineWords, ...tagWords, kickerEl, ...chrome].filter(Boolean), {
            autoAlpha: 1,
            y: 0,
          })
          finish()
          return
        }

        gsap.set(kickerEl, { autoAlpha: 0 })
        gsap.set(headlineWords, { autoAlpha: 0, y: 8 })
        gsap.set(tagWords, { autoAlpha: 0, y: 0 })
        gsap.set(chrome, { autoAlpha: 0, y: 0 })
        section.classList.add("hero-playing")
        if (content) gsap.set(content, { autoAlpha: 1 })

        tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
        })

        if (kickerEl) {
          tl.to(kickerEl, { autoAlpha: 1, duration: 0.16 }, 0)
        }

        const wordDur = 0.14
        const wordStagger = 0.032
        const lineGap = 0.03
        let headlineT = 0

        lines.forEach((line, lineIndex) => {
          const lineWords = gsap.utils.toArray<HTMLElement>(
            line.querySelectorAll(".hero-word")
          )
          if (!lineWords.length) return
          const n = lineWords.length
          tl!.fromTo(
            lineWords,
            { autoAlpha: 0, y: 8 },
            {
              autoAlpha: 1,
              y: 0,
              duration: wordDur,
              stagger: wordStagger,
              immediateRender: lineIndex === 0,
            },
            headlineT
          )
          headlineT +=
            wordDur + wordStagger * (n - 1) + (lineIndex < lines.length - 1 ? lineGap : 0)
        })

        if (tagWords.length) {
          tl.fromTo(
            tagWords,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              duration: 0.24,
              stagger: 0.012,
              immediateRender: false,
            },
            0.72
          )
        }

        if (statusEl) {
          tl.fromTo(
            statusEl,
            { autoAlpha: 0, y: 5 },
            { autoAlpha: 1, y: 0, duration: 0.2, immediateRender: false },
            1.12
          )
        }
        if (ctaEls.length) {
          tl.fromTo(
            ctaEls,
            { autoAlpha: 0, y: 6 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.24,
              stagger: 0.06,
              immediateRender: false,
            },
            1.22
          )
        }
        if (cueEl) {
          tl.to(cueEl, { autoAlpha: 1, duration: 0.2 }, 1.42)
        }

        failsafe = window.setTimeout(finish, 10000)
        tl.eventCallback("onComplete", () => {
          window.clearTimeout(failsafe)
          finish()
        })
      }

      void waitForAtmosphere(520, () => cancelled).then(play)

      return () => {
        cancelled = true
        window.clearTimeout(failsafe)
        tl?.kill()
      }
    },
    { scope: root, dependencies: [] }
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

        <h1 className="hero-headline">
          <span className="hero-line">
            <BootWords text="I built" />{" "}
            <span data-accent="">
              <BootWords text="Sameward" accent />
            </span>
          </span>
          <span className="hero-line">
            <BootWords text="a live product system," />
          </span>
          <span className="hero-line">
            <BootWords text="end to end." />
          </span>
        </h1>

        <p data-h-tagline="" className="hero-tagline">
          {typeof hero.tagline === "string" ? (
            <BootWords text={hero.tagline} />
          ) : (
            hero.tagline.map((line, i) => (
              <span key={line}>
                {i > 0 ? <br /> : null}
                <BootWords text={line} />
              </span>
            ))
          )}
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

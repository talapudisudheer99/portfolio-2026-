"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowUpRight, Download, ExternalLink } from "lucide-react"
import { useEffect, useRef } from "react"

import { MotionParallax } from "@/components/motion/parallax-layer"
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import { siteConfig } from "@/data/site"

gsap.registerPlugin(useGSAP)

function BootWords({
  text,
  wordClass,
}: {
  text: string
  wordClass: string
}) {
  const words = text.split(" ")
  return (
    <>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          {i > 0 ? " " : null}
          <span className={wordClass}>{word}</span>
        </span>
      ))}
    </>
  )
}

/**
 * Hero boot — ISS / spacecraft HUD: words tick in, then lock.
 * No blur, rise, scale, or magnetic drag (those felt like editorial web, not ops UI).
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
      const words = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll(".hero-word")
      )
      const tagWords = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll(".hero-boot-word")
      )
      const statusEl = section.querySelector("[data-h-status]")
      const ctaEls = gsap.utils.toArray<HTMLElement>("[data-h-cta]", section)
      const cueEl = section.querySelector("[data-h-cue]")
      const chrome = [statusEl, ...ctaEls, cueEl].filter(Boolean) as HTMLElement[]

      const revealAll = () => {
        section.classList.add("hero-entered")
        gsap.set([...words, ...tagWords, kickerEl, ...chrome].filter(Boolean), {
          opacity: 1,
          visibility: "visible",
        })
      }

      if (stillRef.current) {
        revealAll()
        return
      }

      section.classList.add("hero-entered")

      if (kickerEl) gsap.set(kickerEl, { opacity: 0.14 })
      gsap.set(words, { opacity: 0.1 })
      gsap.set(tagWords, { opacity: 0.1 })
      gsap.set(chrome, { autoAlpha: 0 })

      const failsafe = window.setTimeout(revealAll, 2200)
      const tl = gsap.timeline({
        defaults: { ease: "steps(1)" },
        onComplete: () => window.clearTimeout(failsafe),
      })

      if (kickerEl) {
        tl.to(kickerEl, { opacity: 1, duration: 0.05 }, 0.06)
      }

      if (words.length) {
        tl.to(
          words,
          { opacity: 1, duration: 0.04, stagger: 0.055 },
          kickerEl ? ">" : 0.08
        )
      }

      if (tagWords.length) {
        tl.to(tagWords, { opacity: 1, duration: 0.035, stagger: 0.028 }, "+=0.08")
      }

      if (statusEl) {
        tl.to(statusEl, { autoAlpha: 1, duration: 0.06 }, "+=0.06")
      }
      if (ctaEls.length) {
        tl.to(ctaEls, { autoAlpha: 1, duration: 0.06, stagger: 0.09 }, "+=0.04")
      }
      if (cueEl) {
        tl.to(cueEl, { autoAlpha: 1, duration: 0.06 }, "+=0.04")
      }

      return () => window.clearTimeout(failsafe)
    },
    { scope: root, dependencies: [still], revertOnUpdate: true }
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
            <BootWords text="I built" wordClass="hero-word" />{" "}
            <span data-accent="">
              <BootWords text="Sameward" wordClass="hero-word hero-accent-word" />
            </span>
          </span>
          <span className="hero-line">
            <BootWords text="a live product system," wordClass="hero-word" />
          </span>
          <span className="hero-line">
            <BootWords text="end to end." wordClass="hero-word" />
          </span>
        </h1>

        <p data-h-tagline="" className="hero-tagline">
          {typeof hero.tagline === "string" ? (
            <BootWords text={hero.tagline} wordClass="hero-boot-word" />
          ) : (
            hero.tagline.map((line, i) => (
              <span key={i}>
                {i > 0 ? <br /> : null}
                <BootWords text={line} wordClass="hero-boot-word" />
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

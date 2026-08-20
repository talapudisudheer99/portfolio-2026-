"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"

import { FeaturedWorkMobileStage } from "@/components/sections/featured-work-mobile-stage"
import { FeaturedWorkTabletStage } from "@/components/sections/featured-work-tablet-stage"
import { useHydratedReducedMotion } from "@/components/shared/motion"
import { duration } from "@/lib/motion"
import type { Project } from "@/types"

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** ~6% travel — matches parallax.mid restraint */
const PARALLAX_LAG = 28

interface FeaturedWorkStageProps {
  featured: Project
  liveDemoLabel: string
}

export function FeaturedWorkStage({
  featured: _featured,
  liveDemoLabel: _liveDemoLabel,
}: Readonly<FeaturedWorkStageProps>) {
  const still = useHydratedReducedMotion()
  const stillRef = useRef(still)
  useEffect(() => {
    stillRef.current = still
  }, [still])

  const root = useRef<HTMLElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const enterRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = root.current
      const parallax = parallaxRef.current
      const enter = enterRef.current
      if (!section || !enter) return

      if (stillRef.current) {
        if (parallax) {
          gsap.set(parallax, { y: 0, clearProps: "transform" })
        }
        gsap.set(enter, { autoAlpha: 1, y: 0, clearProps: "transform" })
        return
      }

      const mmEnter = gsap.matchMedia()

      mmEnter.add("(max-width: 767px)", () => {
        gsap.set(enter, { autoAlpha: 0, y: 0 })

        gsap.to(enter, {
          autoAlpha: 1,
          duration: duration.copy,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            toggleActions: "play none none none",
            once: true,
          },
        })
      })

      mmEnter.add("(min-width: 768px)", () => {
        gsap.set(enter, { autoAlpha: 0, y: 18 })

        gsap.to(enter, {
          autoAlpha: 1,
          y: 0,
          duration: duration.copy,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            toggleActions: "play none none none",
            once: true,
          },
        })
      })

      if (!parallax) {
        return () => mmEnter.revert()
      }

      const mm = gsap.matchMedia()
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          parallax,
          { y: PARALLAX_LAG },
          {
            y: -PARALLAX_LAG,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.85,
            },
          }
        )
      })
      mm.add("(max-width: 767px)", () => {
        gsap.set(parallax, { y: 0, clearProps: "transform" })
      })

      return () => {
        mmEnter.revert()
        mm.revert()
      }
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      aria-label="Featured work"
      className="fd-section"
    >
      <div className="fd-bleed">
        <div
          ref={enterRef}
          className="fd-showcase-stages flex w-full max-w-full flex-col items-center"
        >
          <div className="fd-showcase-tablet hidden w-full max-w-full md:block">
            <FeaturedWorkTabletStage parallaxRef={parallaxRef} />
          </div>
          <div className="fd-showcase-mobile flex w-full max-w-full justify-center md:hidden">
            <FeaturedWorkMobileStage />
          </div>
        </div>
      </div>
    </section>
  )
}

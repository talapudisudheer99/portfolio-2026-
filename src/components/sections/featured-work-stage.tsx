"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"
import { SamewardPanel } from "@/components/shared/sameward-panel"
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
  stillRef.current = still

  const root = useRef<HTMLElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const enterRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = root.current
      const parallax = parallaxRef.current
      const enter = enterRef.current
      if (!section || !parallax || !enter) return

      if (stillRef.current) {
        gsap.set([parallax, enter], { autoAlpha: 1, y: 0, clearProps: "transform" })
        return
      }

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
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      aria-label="Featured work"
      className="fd-section"
    >
      {/* <header className="fd-showcase-head">
        <p className="section-kicker text-muted-foreground">Flagship product</p>
        <h2 className="fd-showcase-title">{_featured.title}</h2>
        {_featured.subtitle ? (
          <p className="fd-showcase-thesis">{_featured.subtitle}</p>
        ) : null}
      </header> */}

      <div className="fd-bleed">
        <div ref={parallaxRef} className="fd-tablet-parallax">
          <div className="fd-tablet-stage">
            <div ref={enterRef} className="fd-tablet-body">
              <div className="fd-tablet-chassis">
                <div className="fd-tablet-screen">
                  <SamewardPanel embedded />
                </div>
              </div>
              <div className="fd-tablet-ground" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

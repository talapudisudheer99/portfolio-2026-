"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"

import { FeaturedWorkMobileStage } from "@/components/sections/featured-work-mobile-stage"
import { FeaturedWorkTabletStage } from "@/components/sections/featured-work-tablet-stage"
import { useHydratedReducedMotion } from "@/components/shared/motion"
import { duration, parallax, rise } from "@/lib/motion"
import type { Project } from "@/types"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface FeaturedWorkStageProps {
  featured: Project
  liveDemoLabel: string
}

/**
 * Phase 09 Task 6 — Sameward as a physical object: enter depth + scrub + tilt.
 * Product UI unchanged.
 */
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
    (_ctx, contextSafe) => {
      const section = root.current
      const stage = parallaxRef.current
      const enter = enterRef.current
      if (!section || !enter || !contextSafe) return

      if (stillRef.current) {
        if (stage) {
          gsap.set(stage, { y: 0, clearProps: "transform" })
        }
        gsap.set(enter, { autoAlpha: 1, y: 0, scale: 1, clearProps: "transform" })
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
        gsap.set(enter, {
          autoAlpha: 0,
          y: rise.lg,
          scale: 0.965,
          filter: "brightness(0.92)",
        })

        gsap.to(enter, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "brightness(1)",
          duration: duration.cinematic,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 84%",
            toggleActions: "play none none none",
            once: true,
          },
        })
      })

      const mm = gsap.matchMedia()
      if (stage) {
        mm.add("(min-width: 1024px)", () => {
          gsap.fromTo(
            stage,
            { y: parallax.stageLag },
            {
              y: -parallax.stageLag,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.7,
              },
            }
          )
        })
        mm.add("(max-width: 1023px)", () => {
          gsap.set(stage, { y: 0, clearProps: "transform" })
        })
      }

      // Pointer depth on chassis — desktop only (tablet keeps mock fully in frame)
      const chassis = section.querySelector(
        ".fd-tablet-chassis"
      ) as HTMLElement | null
      const stageShell = section.querySelector(
        ".fd-tablet-stage"
      ) as HTMLElement | null
      const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches
      const desktopLayout = window.matchMedia("(min-width: 1024px)").matches

      let detachTilt: (() => void) | undefined

      if (chassis && stageShell && finePointer && desktopLayout) {
        gsap.set(stageShell, { perspective: 1200 })
        gsap.set(chassis, {
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        })

        const tilt = parallax.stageTilt
        const xTo = gsap.quickTo(chassis, "x", {
          duration: 0.55,
          ease: "power3.out",
        })
        const yTo = gsap.quickTo(chassis, "y", {
          duration: 0.55,
          ease: "power3.out",
        })
        const rxTo = gsap.quickTo(chassis, "rotationX", {
          duration: 0.55,
          ease: "power3.out",
        })
        const ryTo = gsap.quickTo(chassis, "rotationY", {
          duration: 0.55,
          ease: "power3.out",
        })

        const onMove = contextSafe((e: PointerEvent) => {
          const rect = chassis.getBoundingClientRect()
          const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
          const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
          xTo(nx * tilt.x)
          yTo(ny * tilt.y)
          ryTo(nx * tilt.rotateY)
          rxTo(-ny * tilt.rotateX)
        })

        const onLeave = contextSafe(() => {
          xTo(0)
          yTo(0)
          rxTo(0)
          ryTo(0)
        })

        chassis.addEventListener("pointermove", onMove)
        chassis.addEventListener("pointerleave", onLeave)
        detachTilt = () => {
          chassis.removeEventListener("pointermove", onMove)
          chassis.removeEventListener("pointerleave", onLeave)
          gsap.set(chassis, { clearProps: "transform,transformStyle" })
        }
      }

      return () => {
        mmEnter.revert()
        mm.revert()
        detachTilt?.()
      }
    },
    { scope: root }
  )

  return (
    <section ref={root} aria-label="Featured work" className="fd-section">
      <div className="fd-bleed">
        <div
          ref={enterRef}
          className="fd-showcase-stages flex w-full max-w-full flex-col items-center"
        >
          <div className="fd-showcase-tablet hidden w-full max-w-full lg:block">
            <FeaturedWorkTabletStage parallaxRef={parallaxRef} />
          </div>
          <div className="fd-showcase-mobile flex w-full max-w-full justify-center lg:hidden">
            <FeaturedWorkMobileStage />
          </div>
        </div>
      </div>
    </section>
  )
}

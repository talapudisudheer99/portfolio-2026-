"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef, type ElementType, type ReactNode } from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"
import { depth } from "@/lib/motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export type ParallaxStrength = "bg" | "decoration" | "visual"

interface MotionParallaxProps {
  children?: ReactNode
  className?: string
  strength?: ParallaxStrength
  /** Keep SSR/client tag identical — use span for decorative auroras */
  as?: "div" | "span"
  "aria-hidden"?: boolean | "true" | "false"
}

/**
 * Phase 08 Task 7 — GSAP ScrollTrigger parallax for decoration / visuals.
 * Do not wrap primary content. Mobile: no travel.
 */
export function MotionParallax({
  children,
  className,
  strength = "decoration",
  as = "div",
  "aria-hidden": ariaHidden,
}: Readonly<MotionParallaxProps>) {
  const ref = useRef<HTMLElement | null>(null)
  const still = useHydratedReducedMotion()
  const travel = depth[strength]
  const Tag = as as ElementType

  useGSAP(
    () => {
      const el = ref.current
      if (!el || still) return

      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          el,
          { y: travel },
          {
            y: -travel,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.65,
            },
          }
        )
      })

      mm.add("(max-width: 767px)", () => {
        gsap.set(el, { y: 0, clearProps: "transform" })
      })

      return () => mm.revert()
    },
    { dependencies: [still, travel], revertOnUpdate: true }
  )

  return (
    <Tag ref={ref} className={cn(className)} aria-hidden={ariaHidden}>
      {children}
    </Tag>
  )
}

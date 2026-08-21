"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef, type ReactNode } from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"
import { duration, ease, rise } from "@/lib/motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export type RevealVariant = "label" | "body" | "visual"

const variantConfig: Record<
  RevealVariant,
  { y: number; duration: number }
> = {
  label: { y: rise.sm, duration: duration.copy },
  body: { y: rise.md, duration: duration.section },
  visual: { y: rise.md, duration: duration.section },
}

interface SectionRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  variant?: RevealVariant
}

/**
 * Phase 09 — one GSAP ScrollTrigger reveal language.
 * opacity + transform only. Prefer over inventing per-section Framer enters.
 */
export function SectionReveal({
  children,
  className,
  delay = 0,
  y,
  variant = "body",
}: Readonly<SectionRevealProps>) {
  const ref = useRef<HTMLDivElement>(null)
  const still = useHydratedReducedMotion()
  const config = variantConfig[variant]
  const travel = y ?? config.y

  useGSAP(
    () => {
      const el = ref.current
      if (!el || still) return

      const mm = gsap.matchMedia()

      mm.add("(max-width: 767px)", () => {
        // Task 17 — shorter, simpler mobile reveals
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: Math.min(travel, 18) },
          {
            autoAlpha: 1,
            y: 0,
            duration: duration.copy,
            delay,
            ease: ease.reveal,
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        )
      })

      mm.add("(min-width: 768px)", () => {
        const from: gsap.TweenVars = { autoAlpha: 0, y: travel }
        if (variant === "visual") {
          from.scale = 0.97
        }

        gsap.set(el, from)

        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: config.duration,
          delay,
          ease: ease.reveal,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
            once: true,
          },
        })
      })

      return () => mm.revert()
    },
    { dependencies: [still, delay, travel, variant] as const, revertOnUpdate: true }
  )

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}

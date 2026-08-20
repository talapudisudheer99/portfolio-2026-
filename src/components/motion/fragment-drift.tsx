"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef, type ReactNode } from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"
import { duration, ease } from "@/lib/motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface FragmentDriftProps {
  children: ReactNode
  className?: string
  /** Selector for children that should drift (default: direct children) */
  itemSelector?: string
}

/**
 * Phase 08 Task 10 — content-driven problem motion.
 * Existing Talk / Plan / Ask nodes drift apart on enter, then settle together.
 * Typography/transform only — no new UI.
 */
export function FragmentDrift({
  children,
  className,
  itemSelector,
}: Readonly<FragmentDriftProps>) {
  const ref = useRef<HTMLDivElement>(null)
  const still = useHydratedReducedMotion()

  useGSAP(
    () => {
      const root = ref.current
      if (!root || still) return

      const items = itemSelector
        ? gsap.utils.toArray<HTMLElement>(root.querySelectorAll(itemSelector))
        : (Array.from(root.children) as HTMLElement[])

      if (items.length < 2) return

      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px)", () => {
        const offsets = items.map((_, i) => {
          const mid = (items.length - 1) / 2
          return (i - mid) * 18
        })

        gsap.set(items, {
          x: (i) => offsets[i] ?? 0,
          autoAlpha: 0.55,
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "top 35%",
            scrub: 0.85,
          },
        })

        tl.to(items, {
          x: 0,
          autoAlpha: 1,
          duration: duration.section,
          ease: ease.cinematic,
          stagger: { each: 0.04, from: "center" },
        })
      })

      mm.add("(max-width: 767px)", () => {
        gsap.set(items, { x: 0, autoAlpha: 1, clearProps: "transform" })
      })

      return () => mm.revert()
    },
    { dependencies: [still, itemSelector], revertOnUpdate: true }
  )

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}

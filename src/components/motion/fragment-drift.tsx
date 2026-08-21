"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef, type ReactNode } from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"
import { ease } from "@/lib/motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface FragmentDriftProps {
  children: ReactNode
  className?: string
  /** Selector for children that should drift (default: direct children) */
  itemSelector?: string
}

/**
 * Phase 09 Task 7 — fragmentation → unification (content-driven).
 * Talk / Plan / Ask drift apart, then converge as scroll resolves context.
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
        const mid = (items.length - 1) / 2
        const offsets = items.map((_, i) => (i - mid) * 44)

        gsap.set(items, {
          x: (i) => offsets[i] ?? 0,
          y: (i) => ((i - mid) % 2 === 0 ? -10 : 12),
          autoAlpha: 0.42,
          filter: "blur(1.5px)",
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            end: "top 28%",
            scrub: 0.95,
          },
        })

        // Peak fragmentation mid-scroll, then unify
        tl.to(items, {
          x: (i) => (offsets[i] ?? 0) * 1.15,
          y: (i) => (((i - mid) % 2 === 0 ? -10 : 12) * 1.2),
          autoAlpha: 0.55,
          filter: "blur(2px)",
          ease: "none",
          duration: 0.35,
        }).to(items, {
          x: 0,
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          ease: ease.cinematic,
          stagger: { each: 0.03, from: "center" },
          duration: 0.65,
        })
      })

      mm.add("(max-width: 767px)", () => {
        gsap.set(items, {
          x: 0,
          y: 0,
          autoAlpha: 1,
          filter: "none",
          clearProps: "transform,filter",
        })
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

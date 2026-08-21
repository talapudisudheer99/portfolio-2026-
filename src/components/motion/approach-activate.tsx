"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef, type ReactNode } from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface ApproachActivateProps {
  children: ReactNode
  className?: string
}

/**
 * Phase 09 Task 8 — scroll through three engineering decisions.
 * Active step brightens; previous settle; next waits. Scrub-linked.
 */
export function ApproachActivate({
  children,
  className,
}: Readonly<ApproachActivateProps>) {
  const ref = useRef<HTMLDivElement>(null)
  const still = useHydratedReducedMotion()

  useGSAP(
    () => {
      const root = ref.current
      if (!root || still) return

      const steps = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".projects-flow-step--approach")
      )
      if (!steps.length) return

      const nums = steps.map((s) => s.querySelector(".projects-flow-num"))
      const titles = steps.map((s) => s.querySelector(".projects-flow-title"))
      const details = steps.map((s) =>
        s.querySelector(".projects-flow-detail")
      )
      const rule = root.querySelector(".projects-approach-activate-rule")

      const mm = gsap.matchMedia()

      mm.add("(max-width: 767px)", () => {
        gsap.set(nums, { autoAlpha: 1 })
        gsap.set(titles, { autoAlpha: 1 })
        gsap.set(details, { autoAlpha: 1, y: 0 })
        gsap.set(steps, { autoAlpha: 1 })
        if (rule) gsap.set(rule, { scaleX: 1, clearProps: "transform" })
      })

      mm.add("(min-width: 768px)", () => {
        gsap.set(steps, { autoAlpha: 0.35 })
        gsap.set(nums, { autoAlpha: 0.3 })
        gsap.set(titles, { autoAlpha: 0.35 })
        gsap.set(details, { autoAlpha: 0, y: 14 })
        if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 72%",
            end: "bottom 45%",
            scrub: 0.85,
          },
        })

        if (rule) {
          tl.to(rule, {
            scaleX: 1,
            duration: 0.2,
            ease: "none",
          })
        }

        steps.forEach((step, i) => {
          const at = i === 0 ? (rule ? ">" : 0) : ">"

          // Activate current
          tl.to(
            step,
            { autoAlpha: 1, duration: 0.18, ease: "none" },
            at
          )
            .to(
              nums[i],
              { autoAlpha: 1, duration: 0.12, ease: "none" },
              "<"
            )
            .to(
              titles[i],
              { autoAlpha: 1, duration: 0.14, ease: "none" },
              "<+=0.02"
            )
            .to(
              details[i],
              { autoAlpha: 1, y: 0, duration: 0.18, ease: "none" },
              "<+=0.03"
            )

          // Settle previous steps (still readable, quieter)
          if (i > 0) {
            tl.to(
              steps[i - 1],
              { autoAlpha: 0.55, duration: 0.12, ease: "none" },
              "<"
            )
          }
        })

        // Hold final clarity
        tl.to({}, { duration: 0.15 })
      })

      return () => mm.revert()
    },
    { dependencies: [still], revertOnUpdate: true }
  )

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}

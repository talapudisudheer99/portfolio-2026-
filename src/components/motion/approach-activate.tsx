"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef, type ReactNode } from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"
import { duration, ease, gap } from "@/lib/motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface ApproachActivateProps {
  children: ReactNode
  className?: string
}

/**
 * Phase 08 Task 11 — technical approach step activation.
 * Number → title → detail. Uses existing markup only.
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

      // Task 17 — mobile: settle to final state, no scrub/sequence cost
      mm.add("(max-width: 767px)", () => {
        gsap.set(nums, { autoAlpha: 1 })
        gsap.set(titles, { autoAlpha: 1 })
        gsap.set(details, { autoAlpha: 1, y: 0 })
        if (rule) gsap.set(rule, { scaleX: 1, clearProps: "transform" })
      })

      mm.add("(min-width: 768px)", () => {
        gsap.set(nums, { autoAlpha: 0.35 })
        gsap.set(titles, { autoAlpha: 0.4 })
        gsap.set(details, { autoAlpha: 0, y: 10 })
        if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            toggleActions: "play none none none",
            once: true,
          },
        })

        if (rule) {
          tl.to(rule, {
            scaleX: 1,
            duration: duration.trace,
            ease: ease.reveal,
          })
        }

        steps.forEach((_, i) => {
          tl.to(
            nums[i],
            {
              autoAlpha: 1,
              duration: duration.micro,
              ease: ease.reveal,
            },
            i === 0 ? (rule ? "-=0.05" : 0) : `+=${gap.nodes}`
          )
            .to(
              titles[i],
              {
                autoAlpha: 1,
                duration: duration.trace,
                ease: ease.reveal,
              },
              "<+=0.04"
            )
            .to(
              details[i],
              {
                autoAlpha: 1,
                y: 0,
                duration: duration.copy,
                ease: ease.reveal,
              },
              "<+=0.05"
            )
        })
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

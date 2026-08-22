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
 * Scroll-linked activate for approach cards (no separator rule).
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

      const mm = gsap.matchMedia()

      mm.add("(max-width: 767px)", () => {
        gsap.set(steps, { autoAlpha: 1, y: 0 })
      })

      mm.add("(min-width: 768px)", () => {
        gsap.set(steps, { autoAlpha: 0.4, y: 18 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 72%",
            end: "bottom 45%",
            scrub: 0.85,
          },
        })

        steps.forEach((step, i) => {
          tl.to(
            step,
            { autoAlpha: 1, y: 0, duration: 0.22, ease: "none" },
            i === 0 ? 0 : ">"
          )
          if (i > 0) {
            tl.to(
              steps[i - 1],
              { autoAlpha: 0.7, duration: 0.12, ease: "none" },
              "<"
            )
          }
        })

        tl.to({}, { duration: 0.12 })
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

"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef, type ReactNode } from "react"

import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface ApproachActivateProps {
  children: ReactNode
  className?: string
}

/** Approach cards lock in one after another — play once, no scrub. */
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

      gsap.set(steps, { opacity: 0.16 })
      gsap.to(steps, {
        opacity: 1,
        duration: 0.08,
        ease: "steps(1)",
        stagger: 0.16,
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          once: true,
          toggleActions: "play none none none",
        },
      })
    },
    { dependencies: [still], revertOnUpdate: true }
  )

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}

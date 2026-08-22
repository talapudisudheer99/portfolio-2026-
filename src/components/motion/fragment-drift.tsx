"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef, type ReactNode } from "react"

import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface FragmentDriftProps {
  children: ReactNode
  className?: string
  itemSelector?: string
}

/**
 * Talk / Plan / Ask — sequential HUD lock, not scrubbed drift.
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

      gsap.set(items, { opacity: 0.18 })
      gsap.to(items, {
        opacity: 1,
        duration: 0.06,
        ease: "steps(1)",
        stagger: 0.12,
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
          once: true,
          toggleActions: "play none none none",
        },
      })
    },
    { dependencies: [still, itemSelector], revertOnUpdate: true }
  )

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}

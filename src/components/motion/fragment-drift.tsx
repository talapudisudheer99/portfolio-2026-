"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef, type ReactNode } from "react"

import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import { hudLock, revealStart } from "@/lib/motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface FragmentDriftProps {
  children: ReactNode
  className?: string
  itemSelector?: string
}

/**
 * Talk / Share / Ask — sequential HUD lock, not scrubbed drift.
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

      gsap.set(items, { opacity: hudLock.dim })
      gsap.to(items, {
        opacity: 1,
        duration: hudLock.step,
        ease: "steps(1)",
        stagger: hudLock.itemStagger,
        scrollTrigger: {
          trigger: root,
          start: revealStart,
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

"use client"

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import {
  Children,
  isValidElement,
  useRef,
  type ReactElement,
  type ReactNode,
} from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"
import { parallax } from "@/lib/motion"
import { cn } from "@/lib/utils"

/** Eyebrow on each rising drawer sheet (hero is the base layer). */
const DRAWER_CHAPTERS = [
  "01 · Featured work",
  "02 · Capabilities",
  "03 · Experience",
  "04 · Profile",
  "05 · Contact",
] as const

interface ScrollDrawerStackProps {
  children: ReactNode
}

/**
 * Drawer stack: hero pins; each next chapter slides up over it (Lenis-safe).
 * Motion stays off the sticky node — transforms live on inner wrappers only.
 */
export function ScrollDrawerStack({
  children,
}: Readonly<ScrollDrawerStackProps>) {
  const prefersReducedMotion = useHydratedReducedMotion()
  const items = Children.toArray(children)

  if (prefersReducedMotion) {
    return <div className="scroll-drawer-fallback">{children}</div>
  }

  return (
    <div className="scroll-drawer-stack">
      {items.map((child, index) => {
        if (!isValidElement(child)) {
          return child
        }

        return (
          <ScrollDrawerSlot key={child.key ?? index} index={index}>
            {child}
          </ScrollDrawerSlot>
        )
      })}
    </div>
  )
}

interface ScrollDrawerSlotProps {
  index: number
  children: ReactElement
}

function ScrollDrawerSlot({
  index,
  children,
}: Readonly<ScrollDrawerSlotProps>) {
  const slotRef = useRef<HTMLDivElement>(null)
  const isBase = index === 0
  const chapter = DRAWER_CHAPTERS[index - 1]

  const { scrollYProgress: enterProgress } = useScroll({
    target: slotRef,
    offset: ["start end", "start start"],
  })

  const { scrollYProgress: leaveProgress } = useScroll({
    target: slotRef,
    offset: ["start start", "end start"],
  })

  const smoothEnter = useSpring(enterProgress, parallax.drawerSpring)
  const smoothLeave = useSpring(leaveProgress, parallax.drawerSpring)
  const sheetY = useTransform(smoothEnter, [0, 0.75, 1], ["100vh", "8vh", "0vh"])
  const lipOpacity = useTransform(smoothEnter, [0.48, 0.85], [0, 1])
  const baseScale = useTransform(smoothLeave, [0, 0.32, 0.62], [1, 0.994, 0.986])
  const baseDimOpacity = useTransform(smoothLeave, [0, 0.4, 0.68], [0, 0.08, 0.14])

  if (isBase) {
    return (
      <div ref={slotRef} className="scroll-drawer-slot">
        <div
          className="scroll-drawer-panel scroll-drawer-panel--base"
          style={{ zIndex: 10 + index }}
        >
          <motion.div
            style={{ scale: baseScale }}
            className="scroll-drawer-body relative min-h-[inherit]"
          >
            {children}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-black"
              style={{ opacity: baseDimOpacity }}
            />
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div ref={slotRef} className="scroll-drawer-slot scroll-drawer-slot--cover">
      <div
        className={cn(
          "scroll-drawer-panel scroll-drawer-panel--cover scroll-drawer-panel--sheet"
        )}
        style={{ zIndex: 10 + index }}
      >
        <motion.div style={{ y: sheetY }} className="scroll-drawer-sheet-motion">
          <motion.div
            aria-hidden="true"
            style={{ opacity: lipOpacity }}
            className="scroll-drawer-lip"
          >
            {chapter ? (
              <p className="scroll-drawer-chapter">{chapter}</p>
            ) : null}
            <span className="scroll-drawer-handle" />
          </motion.div>
          <div className="scroll-drawer-body">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}

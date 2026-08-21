"use client"

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"
import type { PointerEvent as ReactPointerEvent } from "react"

import { SamewardPanel } from "@/components/shared/sameward-panel"
import { parallax } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface SamewardProductVisualProps {
  progress: MotionValue<number>
  still?: boolean
  className?: string
}

const REST_X = 7
const REST_Y = -9

/** Browser-framed Sameward, staged as a numbered product plate. */
export function SamewardProductVisual({
  progress,
  still = false,
  className,
}: Readonly<SamewardProductVisualProps>) {
  const smoothProgress = useSpring(progress, parallax.drawerSpring)
  const panelY = useTransform(
    smoothProgress,
    [0, 1],
    [parallax.product.panelY[0], parallax.product.panelY[1]]
  )
  const panelScale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [...parallax.product.panelScale]
  )
  const glowY = useTransform(
    smoothProgress,
    [0, 1],
    [parallax.product.glowY[0], parallax.product.glowY[1]]
  )

  const tiltX = useMotionValue(still ? 0 : REST_X)
  const tiltY = useMotionValue(still ? 0 : REST_Y)
  const rotateX = useSpring(tiltX, { stiffness: 140, damping: 22, restDelta: 0.001 })
  const rotateY = useSpring(tiltY, { stiffness: 140, damping: 22, restDelta: 0.001 })

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (still || event.pointerType !== "mouse") return

    const bounds = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - bounds.left) / bounds.width - 0.5
    const py = (event.clientY - bounds.top) / bounds.height - 0.5
    tiltX.set(REST_X - py * 8)
    tiltY.set(REST_Y + px * 10)
  }

  function handlePointerLeave() {
    if (still) return
    tiltX.set(REST_X)
    tiltY.set(REST_Y)
  }

  const chrome = (
    <div className="product-chrome-shell">
      <div className="product-chrome-bar">
        <span className="product-chrome-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="product-chrome-url">sameward.com</span>
        <span className="type-micro inline-flex items-center gap-1.5 text-primary">
          <span className="size-1.5 rounded-full bg-primary" />
          <span>Live</span>
        </span>
      </div>
      <SamewardPanel embedded />
    </div>
  )

  const plate = (
    <div className="product-plate">
      <div className="product-plate-stage">{chrome}</div>
    </div>
  )

  if (still) {
    return (
      <div
        className={cn(
          "relative mx-auto w-full max-w-[26rem] lg:ml-auto lg:max-w-none",
          className
        )}
      >
        {plate}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[26rem] lg:ml-auto lg:max-w-none",
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        aria-hidden="true"
        style={{ y: glowY }}
        className="product-chrome-glow pointer-events-none absolute -inset-8 -z-10 rounded-[2rem]"
      />
      <span className="product-plate-ground" aria-hidden="true" />

      <motion.div
        style={{
          y: panelY,
          scale: panelScale,
          rotateX,
          rotateY,
          transformPerspective: 1400,
        }}
        className="relative will-change-transform"
      >
        {plate}
      </motion.div>
    </div>
  )
}

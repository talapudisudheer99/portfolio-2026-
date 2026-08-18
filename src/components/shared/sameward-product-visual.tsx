"use client"

import {
  motion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"

import { SamewardPanel } from "@/components/shared/sameward-panel"
import { parallax } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface SamewardProductVisualProps {
  progress: MotionValue<number>
  still?: boolean
  className?: string
}

/** Browser-framed Sameward surface with scroll-linked depth (no clip-path). */
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
  const panelX = useTransform(
    smoothProgress,
    [0, 1],
    [parallax.product.panelX[0], parallax.product.panelX[1]]
  )
  const panelScale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [...parallax.product.panelScale]
  )
  const panelRotate = useTransform(
    smoothProgress,
    [0, 1],
    [parallax.product.panelRotate[0], parallax.product.panelRotate[1]]
  )
  const glowY = useTransform(
    smoothProgress,
    [0, 1],
    [parallax.product.glowY[0], parallax.product.glowY[1]]
  )

  const chrome = (
    <div className="product-chrome-shell">
      <div className="product-chrome-bar">
        <span className="product-chrome-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="product-chrome-url">sameward.com</span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.12em] text-sameward-ink uppercase">
          <span className="size-1.5 rounded-full bg-sameward-ink" />
          <span>Live</span>
        </span>
      </div>
      <SamewardPanel embedded />
    </div>
  )

  if (still) {
    return (
      <div
        className={cn(
          "relative mx-auto w-full max-w-[24rem] lg:ml-auto lg:max-w-104",
          className
        )}
      >
        {chrome}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[24rem] lg:ml-auto lg:max-w-104",
        className
      )}
    >
      <motion.div
        aria-hidden="true"
        style={{ y: glowY }}
        className="product-chrome-glow pointer-events-none absolute -inset-6 -z-10 rounded-[1.75rem]"
      />

      <motion.div
        style={{
          y: panelY,
          x: panelX,
          scale: panelScale,
          rotate: panelRotate,
        }}
        className="relative will-change-transform"
      >
        {chrome}
      </motion.div>
    </div>
  )
}

"use client"

import type { RefObject } from "react"

import { SamewardWindow } from "@/components/shared/sameward-window"

interface FeaturedWorkWindowStageProps {
  parallaxRef?: RefObject<HTMLDivElement | null>
}

/** Desktop (lg+) Sameward showcase — floating glass window. */
export function FeaturedWorkTabletStage({
  parallaxRef,
}: Readonly<FeaturedWorkWindowStageProps>) {
  return (
    <div ref={parallaxRef} className="fd-tablet-parallax" data-cursor="View">
      <div className="fd-window-stage">
        <SamewardWindow />
      </div>
    </div>
  )
}

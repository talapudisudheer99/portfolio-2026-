"use client"

import type { Ref, RefObject } from "react"

import { SamewardPanel } from "@/components/shared/sameward-panel"

interface FeaturedWorkTabletStageProps {
  parallaxRef?: RefObject<HTMLDivElement | null>
  stageRef?: Ref<HTMLDivElement | null>
}

/**
 * Sameward on an iPad Pro–style tablet, landscape.
 * Proportions follow the 13" iPad Pro: uniform ~2.6% bezel, rounded display,
 * front camera centred on the top long edge, thin metal frame with buttons.
 * No desktop window chrome — a tablet has none.
 */
export function FeaturedWorkTabletStage({
  parallaxRef,
  stageRef,
}: Readonly<FeaturedWorkTabletStageProps>) {
  return (
    <div ref={parallaxRef} className="fd-tablet-parallax" data-cursor="View">
      <div ref={stageRef} className="fd-tablet-stage">
        <div className="fd-tablet-body">
          <div className="fd-tablet-chassis">
            <span className="fd-tablet-button fd-tablet-button--top" aria-hidden="true" />
            <span className="fd-tablet-button fd-tablet-button--vol-up" aria-hidden="true" />
            <span className="fd-tablet-button fd-tablet-button--vol-down" aria-hidden="true" />
            <span className="fd-tablet-camera" aria-hidden="true" />
            <div className="fd-tablet-screen">
              <SamewardPanel embedded />
              {/* Display "off" layer — fades out as the tablet lands */}
              <span className="fd-tablet-power" aria-hidden="true" />
              {/* Glass glare — position driven by the landing scroll */}
              <span className="fd-tablet-glare" aria-hidden="true" />
            </div>
          </div>
          <span className="fd-tablet-ground" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

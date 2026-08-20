"use client"

import type { RefObject } from "react"

import { SamewardPanel } from "@/components/shared/sameward-panel"

interface FeaturedWorkTabletStageProps {
  parallaxRef?: RefObject<HTMLDivElement | null>
}

export function FeaturedWorkTabletStage({
  parallaxRef,
}: Readonly<FeaturedWorkTabletStageProps>) {
  return (
    <div ref={parallaxRef} className="fd-tablet-parallax">
      <div className="fd-tablet-stage">
        <div className="fd-tablet-body">
          <div className="fd-tablet-chassis">
            <div className="fd-tablet-chrome" aria-hidden="true">
              <span className="fd-tablet-dots">
                <span className="fd-tablet-dot fd-tablet-dot--close" />
                <span className="fd-tablet-dot fd-tablet-dot--min" />
                <span className="fd-tablet-dot fd-tablet-dot--max" />
              </span>
              <span className="fd-tablet-camera" />
            </div>
            <div className="fd-tablet-screen">
              <SamewardPanel embedded />
            </div>
          </div>
          <div className="fd-tablet-ground" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

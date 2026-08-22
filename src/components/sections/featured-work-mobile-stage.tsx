"use client"

import type { Ref } from "react"

import { SamewardMobilePanel } from "@/components/shared/sameward-mobile-panel"

interface FeaturedWorkMobileStageProps {
  stageRef?: Ref<HTMLDivElement | null>
}

export function FeaturedWorkMobileStage({
  stageRef,
}: Readonly<FeaturedWorkMobileStageProps>) {
  return (
    <div ref={stageRef} className="fd-phone-stage">
      <div className="fd-phone-body">
        <div className="fd-phone-chassis">
          <div className="fd-phone-notch" aria-hidden="true" />
          <div className="fd-phone-screen">
            <SamewardMobilePanel />
          </div>
        </div>
      </div>
    </div>
  )
}

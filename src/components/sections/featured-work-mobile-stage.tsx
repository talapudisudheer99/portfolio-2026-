"use client"

import { SamewardMobilePanel } from "@/components/shared/sameward-mobile-panel"

export function FeaturedWorkMobileStage() {
  return (
    <div className="fd-phone-stage">
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

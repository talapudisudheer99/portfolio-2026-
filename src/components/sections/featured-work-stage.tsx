import { SamewardPanel } from "@/components/shared/sameward-panel"
import type { Project } from "@/types"

interface FeaturedWorkStageProps {
  featured: Project
  liveDemoLabel: string
}

export function FeaturedWorkStage({
  featured: _featured,
  liveDemoLabel: _liveDemoLabel,
}: Readonly<FeaturedWorkStageProps>) {
  return (
    <section
      aria-label="Featured work"
      className="fd-section"
    >
      {/* <header className="fd-showcase-head">
        <p className="section-kicker text-muted-foreground">Flagship product</p>
        <h2 className="fd-showcase-title">{_featured.title}</h2>
        {_featured.subtitle ? (
          <p className="fd-showcase-thesis">{_featured.subtitle}</p>
        ) : null}
      </header> */}

      <div className="fd-bleed">
        <div className="fd-tablet-stage">
          <div className="fd-tablet-body">
            <div className="fd-tablet-chassis">
              <div className="fd-tablet-screen">
                <SamewardPanel embedded />
              </div>
            </div>
            <div className="fd-tablet-ground" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}

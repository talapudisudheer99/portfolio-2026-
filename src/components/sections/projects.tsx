import { ArrowRight, ArrowUpRight } from "lucide-react"

import { ArchitectureDiagram } from "@/components/shared/architecture-diagram"
import { FeaturedWorkStage } from "@/components/sections/featured-work-stage"
import {
  FadeIn,
  MaskedLine,
  ScrollWordReveal,
  TraceNode,
  TraceRule,
  TraceRow,
  TraceSequence,
} from "@/components/shared/motion"
import {
  ScrollEmergence,
} from "@/components/shared/parallax"
import { ContentRail, SectionShell } from "@/components/shared/section-wrapper"
import { projects } from "@/data/projects"
import { projectActions } from "@/data/sections"
import { gap } from "@/lib/motion"

export function Projects() {
  const featured = projects.find((project) => project.featured) ?? projects[0]

  if (!featured) return null

  return (
    <SectionShell id="projects">
      <div className="projects-sameward-showcase">
        <ContentRail className="projects-featured-space">
          <FeaturedWorkStage
            featured={featured}
            liveDemoLabel={projectActions.liveDemo}
          />
        </ContentRail>

        <div className="projects-inside-sync">
          <ContentRail className="projects-inside-rail">
            <div className="projects-inside-block">
              <FadeIn className="projects-inside-kicker">
                <p className="section-kicker text-muted-foreground">
                  Inside the product
                </p>
                <span className="mt-2 inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-sameward-ink uppercase">
                  <span className="size-1.5 rounded-full bg-sameward-ink" />
                  <span>Live</span>
                </span>
              </FadeIn>

              <ScrollEmergence className="projects-inside-heading">
                <TraceSequence
                  className="projects-inside-steps grid gap-6 sm:grid-cols-3 sm:gap-8"
                  gap={gap.nodes}
                  delayChildren={0.1}
                >
                  {[
                    ["01", "Talk", "Realtime channels"],
                    ["02", "Plan", "Shared team context"],
                    ["03", "Ask", "Grounded Channel AI"],
                  ].map(([number, action, detail]) => (
                    <TraceNode
                      key={number}
                      className="projects-flow-step group"
                    >
                      <div className="projects-flow-meta">
                        <span className="projects-flow-num">
                          {number}
                        </span>
                      </div>
                      <p className="projects-flow-title">
                        {action}
                      </p>
                      <p className="projects-flow-detail">
                        {detail}
                      </p>
                      <ArrowRight
                        className="projects-flow-arrow size-4 text-sameward-ink"
                        aria-hidden="true"
                      />
                    </TraceNode>
                  ))}
                </TraceSequence>
              </ScrollEmergence>
            </div>
          </ContentRail>
        </div>
      </div>

      <ContentRail className="section-space">
        <div className="content-grid gap-y-16">
          <FadeIn className="col-span-12 md:col-span-3">
            <p className="section-kicker text-primary">The problem</p>
          </FadeIn>
          <ScrollWordReveal
            text={featured.problem ?? ""}
            className="editorial-display col-span-12 text-[clamp(2.25rem,4.5vw,4.75rem)] leading-[1.02] font-medium text-foreground md:col-span-8 md:col-start-5"
          />

          <div className="col-span-12 mt-8 md:col-span-3">
            <TraceRule className="mb-8 bg-border" />
            <p className="section-kicker text-primary">Key choices</p>
          </div>
          <TraceSequence
            as="ol"
            className="col-span-12 mt-8 md:col-span-8 md:col-start-5"
            gap={gap.rows}
          >
            {featured.decisions?.map((decision, index) => (
              <TraceRow
                key={decision}
                as="li"
                className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-border py-6 first:border-t-0 first:pt-0"
              >
                <span className="font-mono text-xs text-primary">
                  0{index + 1}
                </span>
                <p className="text-base leading-relaxed text-foreground-secondary md:text-lg">
                  {decision}
                </p>
              </TraceRow>
            ))}
          </TraceSequence>
        </div>
      </ContentRail>

      <div className="border-y border-border">
        <ContentRail className="section-space">
          <div className="content-grid gap-y-12">
            <div className="col-span-12 lg:col-span-4">
              <FadeIn>
                <p className="section-kicker text-sameward-ink">How it works</p>
              </FadeIn>
              <ScrollEmergence>
                <MaskedLine display delay={0.08}>
                  <h3 className="editorial-display mt-5 max-w-[8ch] text-[clamp(3rem,5vw,5.5rem)] leading-[0.9] font-medium">
                    Built for fast updates.
                  </h3>
                </MaskedLine>
              </ScrollEmergence>
            </div>
            <ScrollEmergence className="col-span-12 lg:col-span-7 lg:col-start-6">
              <ArchitectureDiagram />
            </ScrollEmergence>
          </div>
        </ContentRail>
      </div>

      <ContentRail className="section-space">
        <div className="content-grid gap-y-12">
          <FadeIn className="col-span-12 md:col-span-3">
            <p className="section-kicker text-primary">What shipped</p>
          </FadeIn>
          <TraceSequence
            as="ul"
            className="col-span-12 grid gap-x-10 sm:grid-cols-2 md:col-span-9"
            gap={gap.facts}
          >
            {featured.buildList?.map((item, index) => (
              <TraceRow
                key={item}
                as="li"
                className="grid grid-cols-[2rem_1fr] gap-3 border-t border-border py-5"
              >
                <span className="font-mono text-[10px] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed text-foreground-secondary">
                  {item}
                </span>
              </TraceRow>
            ))}
          </TraceSequence>

          <div className="col-span-12 mt-8 md:col-span-9 md:col-start-4">
            <TraceRule className="mb-8 bg-border" />
            <FadeIn>
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="section-kicker text-muted-foreground">
                    Live product
                  </p>
                  <p className="editorial-display mt-3 text-4xl leading-none md:text-6xl">
                    Live at sameward.com
                  </p>
                </div>
                {featured.liveUrl ? (
                  <a
                    href={featured.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm font-bold text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    Open the product
                    <ArrowUpRight
                      className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                ) : null}
              </div>
            </FadeIn>
          </div>
        </div>
      </ContentRail>
    </SectionShell>
  )
}

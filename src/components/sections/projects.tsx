// import { ArrowUpRight } from "lucide-react"

import { FeaturedWorkStage } from "@/components/sections/featured-work-stage"
import {
  EditorialWordReveal,
  FadeIn,
  MaskedLine,
  TraceNode,
  TraceRule,
  TraceSequence,
} from "@/components/shared/motion"
import {
  ScrollEmergence,
} from "@/components/shared/parallax"
// import { ShippedFlow } from "@/components/shared/shipped-flow"
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
        <ContentRail className="projects-sameward-rail">
          <FeaturedWorkStage
            featured={featured}
            liveDemoLabel={projectActions.liveDemo}
          />

          <div className="projects-inside-sync">
            <div className="projects-inside-block content-grid">
              <FadeIn className="projects-inside-kicker col-span-12">
                <p className="section-kicker text-muted-foreground">
                  Inside the product
                </p>
                <p className="projects-inside-live">
                  <span className="projects-inside-live-dot" aria-hidden="true" />
                  <span>Live</span>
                </p>
              </FadeIn>

              <ScrollEmergence className="projects-inside-heading col-span-12">
                <TraceSequence
                  className="projects-inside-steps grid grid-cols-1 gap-0 sm:grid-cols-3"
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
                      className="projects-flow-step projects-flow-step--inside group"
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
                    </TraceNode>
                  ))}
                </TraceSequence>
              </ScrollEmergence>
            </div>
          </div>
        </ContentRail>
      </div>

      <ContentRail className="projects-case-section projects-case-section--problem">
        <div className="content-grid gap-y-10 md:gap-y-12">
          <FadeIn className="projects-case-kicker col-span-12 md:col-span-3 md:self-start">
            <TraceRule className="projects-section-rule projects-section-rule--kicker mb-6 bg-border" />
            <p className="section-kicker text-primary">The problem</p>
          </FadeIn>

          <EditorialWordReveal
            className="projects-problem-statement col-span-12 md:col-span-8 md:col-start-5"
            lines={
              featured.problemLines ??
              featured.problem?.match(/[^.!?]+[.!?]+/g)?.map((line) => line.trim()) ??
              []
            }
          />
        </div>
      </ContentRail>

      <ContentRail className="projects-case-section projects-case-section--approach">
        <div className="content-grid gap-y-10 md:gap-y-12">
          <FadeIn className="projects-case-kicker col-span-12 md:col-span-3 md:self-start">
            <TraceRule className="projects-section-rule projects-section-rule--kicker mb-6 bg-border" />
            <p className="section-kicker text-sameward-ink">The approach</p>
            {featured.approachHeadline ? (
              <MaskedLine display delay={0.06}>
                <h3 className="projects-approach-headline editorial-display mt-5">
                  {featured.approachHeadline}
                </h3>
              </MaskedLine>
            ) : null}
            {featured.approachLead ? (
              <p className="projects-approach-lead mt-4 text-sm leading-relaxed text-muted-foreground md:max-w-[20ch] md:text-base">
                {featured.approachLead}
              </p>
            ) : null}
          </FadeIn>

          <ScrollEmergence className="projects-approach-body col-span-12 md:col-span-8 md:col-start-5">
            <p className="projects-approach-sync font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              <span className="text-sameward-ink">Problem</span>
              <span aria-hidden="true" className="mx-2 opacity-60">
                ·
              </span>
              System
            </p>
            <TraceSequence
              className="projects-approach-steps grid gap-0 sm:grid-cols-3 sm:gap-6 lg:gap-8"
              gap={gap.nodes}
              delayChildren={0.12}
            >
              {(featured.approachSteps ?? []).map((step, index) => (
                <TraceNode
                  key={step.title}
                  className="projects-flow-step projects-flow-step--approach group"
                >
                  <div className="projects-flow-meta">
                    <span className="projects-flow-num">0{index + 1}</span>
                  </div>
                  <p
                    className={
                      index === (featured.approachSteps?.length ?? 0) - 1
                        ? "projects-flow-title projects-flow-title--accent"
                        : "projects-flow-title"
                    }
                  >
                    {step.title}
                  </p>
                  <p className="projects-flow-detail projects-flow-detail--approach">
                    {step.detail}
                  </p>
                </TraceNode>
              ))}
            </TraceSequence>
          </ScrollEmergence>
        </div>
      </ContentRail>

      {/* What shipped — temporarily hidden */}
      {/*
      <ContentRail className="projects-case-section projects-shipped-stage">
        <div className="projects-shipped-stage-header">
          <FadeIn>
            <TraceRule className="projects-section-rule projects-section-rule--kicker mb-6 bg-border" />
            <p className="section-kicker text-primary">What shipped</p>
          </FadeIn>
        </div>

        <ScrollEmergence className="projects-shipped-stage-main">
          {featured.shippedFlowHub && featured.shippedFlow ? (
            <ShippedFlow
              hub={featured.shippedFlowHub}
              nodes={featured.shippedFlow}
            />
          ) : null}
        </ScrollEmergence>

        <div className="projects-shipped-stage-footer">
          <TraceRule className="projects-section-rule mb-6 bg-border" />
          <FadeIn>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-kicker text-muted-foreground">Live product</p>
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
      </ContentRail>
      */}
    </SectionShell>
  )
}

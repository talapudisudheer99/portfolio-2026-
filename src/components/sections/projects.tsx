// import { ArrowUpRight } from "lucide-react"

import { FeaturedWorkStage } from "@/components/sections/featured-work-stage"
import { FragmentDrift } from "@/components/motion/fragment-drift"
import { ApproachActivate } from "@/components/motion/approach-activate"
import { SectionReveal } from "@/components/motion/section-reveal"
import {
  EditorialWordReveal,
  MaskedLine,
  TraceRule,
} from "@/components/shared/motion"
import { ContentRail, SectionShell } from "@/components/shared/section-wrapper"
import { projects } from "@/data/projects"
import { projectActions } from "@/data/sections"

export function Projects() {
  const featured = projects.find((project) => project.featured) ?? projects[0]

  if (!featured) return null

  return (
    <SectionShell id="projects">
      <div className="projects-sameward-showcase">
        <div className="projects-sameward-stage">
          <ContentRail className="projects-sameward-rail">
            <FeaturedWorkStage
              featured={featured}
              liveDemoLabel={projectActions.liveDemo}
            />

            <div className="projects-inside-sync">
              <div className="projects-inside-block content-grid">
                <SectionReveal
                  variant="label"
                  className="projects-inside-kicker col-span-12"
                >
                  <p className="section-kicker text-muted-foreground">
                    Inside the product
                  </p>
                  <p className="projects-inside-live">
                    <span className="projects-inside-live-dot" aria-hidden="true" />
                    <span>Live</span>
                  </p>
                </SectionReveal>

                <div className="projects-inside-heading col-span-12">
                  <FragmentDrift
                    className="projects-inside-steps grid grid-cols-1 gap-0 sm:grid-cols-3"
                    itemSelector=".projects-flow-step--inside"
                  >
                    {[
                      ["01", "Talk", "Realtime channels"],
                      ["02", "Plan", "Shared team context"],
                      ["03", "Ask", "Grounded Channel AI"],
                    ].map(([number, action, detail]) => (
                      <div
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
                      </div>
                    ))}
                  </FragmentDrift>
                </div>
              </div>
            </div>
          </ContentRail>
        </div>
      </div>

      <ContentRail className="projects-case-section projects-case-section--problem">
        <div className="content-grid gap-y-10 md:gap-y-12">
          <SectionReveal
            variant="label"
            className="projects-case-kicker col-span-12 md:col-span-3 md:self-start"
          >
            <TraceRule className="projects-section-rule projects-section-rule--kicker mb-6 bg-border" />
            <p className="section-kicker text-primary">The problem</p>
          </SectionReveal>

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
          <SectionReveal
            variant="label"
            className="projects-case-kicker col-span-12 md:col-span-3 md:self-start"
          >
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
              <p className="projects-approach-lead type-lead mt-4 text-muted-foreground md:max-w-[20ch]">
                {featured.approachLead}
              </p>
            ) : null}
          </SectionReveal>

          <div className="projects-approach-body col-span-12 md:col-span-8 md:col-start-5">
            <p className="projects-approach-sync type-meta text-muted-foreground">
              <span className="text-sameward-ink">Problem</span>
              <span aria-hidden="true" className="mx-2 opacity-60">
                ·
              </span>
              System
            </p>
            <ApproachActivate>
              <span
                className="projects-approach-activate-rule"
                aria-hidden="true"
              />
              <div className="projects-approach-steps grid gap-0 sm:grid-cols-3 sm:gap-6 lg:gap-8">
                {(featured.approachSteps ?? []).map((step, index) => (
                  <div
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
                  </div>
                ))}
              </div>
            </ApproachActivate>
          </div>
        </div>
      </ContentRail>
    </SectionShell>
  )
}

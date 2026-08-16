import { ArrowRight, ArrowUpRight } from "lucide-react"

import { ArchitectureDiagram } from "@/components/shared/architecture-diagram"
import { FadeIn } from "@/components/shared/motion"
import { ContentRail, SectionShell } from "@/components/shared/section-wrapper"
import { projects } from "@/data/projects"
import { projectActions } from "@/data/sections"

export function Projects() {
  const featured = projects.find((project) => project.featured) ?? projects[0]

  if (!featured) return null

  return (
    <SectionShell id="projects" className="section-rule">
      <ContentRail className="section-space">
        <FadeIn className="content-grid gap-y-10">
          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[10px] tracking-[0.18em] text-primary uppercase">
              01 · Featured work
            </p>
          </div>

          <div className="col-span-12 md:col-span-9">
            <h2 className="editorial-display max-w-[10ch] text-[clamp(3.8rem,8.5vw,8rem)] leading-[0.86] font-medium">
              <span className="block">One product,</span>
              <span className="block text-primary italic">end to end.</span>
            </h2>
          </div>

          <div className="col-span-12 mt-5 grid gap-8 border-t border-border pt-8 md:col-span-9 md:col-start-4 md:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                {featured.title} · Live product
              </p>
              <h3 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] md:text-4xl">
                {featured.subtitle}
              </h3>
            </div>
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {featured.description}
              </p>
              {featured.liveUrl ? (
                <a
                  href={featured.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-6 inline-flex items-center gap-2 border-b border-primary pb-1 text-sm font-bold text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  {projectActions.liveDemo}
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              ) : null}
            </div>
          </div>
        </FadeIn>
      </ContentRail>

      <FadeIn className="border-y border-border">
        <ContentRail className="py-10 sm:py-14 lg:py-16">
          <div className="content-grid gap-y-10">
            <div className="col-span-12 flex items-center justify-between md:col-span-3 md:block">
              <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                Product surface
              </p>
              <span className="mt-0 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-sameward-ink uppercase md:mt-5">
                <span className="size-1.5 rounded-full bg-sameward-ink" />
                <span>Live</span>
              </span>
            </div>

            <div className="col-span-12 md:col-span-9">
              <p className="editorial-display text-[clamp(4.5rem,12vw,11rem)] leading-[0.72] font-medium tracking-[-0.07em] text-foreground">
                Sameward
              </p>

              <div className="mt-12 grid border-t border-border sm:grid-cols-3">
                {[
                  ["01", "Talk", "Realtime channels"],
                  ["02", "Plan", "Shared team context"],
                  ["03", "Ask", "Grounded Channel AI"],
                ].map(([number, action, detail]) => (
                  <div
                    key={number}
                    className="group border-b border-border py-5 sm:border-r sm:border-b-0 sm:px-5 sm:first:pl-0 sm:last:border-r-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {number}
                      </span>
                      <ArrowRight
                        className="size-4 text-sameward-ink transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-7 text-2xl font-extrabold tracking-[-0.04em]">
                      {action}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ContentRail>
      </FadeIn>

      <ContentRail className="section-space">
        <div className="content-grid gap-y-16">
          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[10px] tracking-[0.18em] text-primary uppercase">
              The problem
            </p>
          </div>
          <FadeIn className="col-span-12 md:col-span-8 md:col-start-5">
            <p className="editorial-display text-[clamp(2.25rem,4.5vw,4.75rem)] leading-[1.02] font-medium text-foreground">
              {featured.problem}
            </p>
          </FadeIn>

          <div className="col-span-12 mt-8 border-t border-border pt-8 md:col-span-3">
            <p className="font-mono text-[10px] tracking-[0.18em] text-primary uppercase">
              Decisions, not badges
            </p>
          </div>
          <div className="col-span-12 mt-8 md:col-span-8 md:col-start-5">
            <ol>
              {featured.decisions?.map((decision, index) => (
                <li
                  key={decision}
                  className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-border py-6 first:border-t-0 first:pt-0"
                >
                  <span className="font-mono text-xs text-primary">
                    0{index + 1}
                  </span>
                  <p className="text-base leading-relaxed text-foreground-secondary md:text-lg">
                    {decision}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </ContentRail>

      <div className="border-y border-border bg-background-secondary">
        <ContentRail className="section-space">
          <div className="content-grid gap-y-12">
            <div className="col-span-12 lg:col-span-4">
              <p className="font-mono text-[10px] tracking-[0.18em] text-sameward-ink uppercase">
                Architecture
              </p>
              <h3 className="editorial-display mt-5 max-w-[8ch] text-[clamp(3rem,5vw,5.5rem)] leading-[0.9] font-medium">
                Built to stay responsive.
              </h3>
            </div>
            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <ArchitectureDiagram />
            </div>
          </div>
        </ContentRail>
      </div>

      <ContentRail className="section-space">
        <div className="content-grid gap-y-12">
          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[10px] tracking-[0.18em] text-primary uppercase">
              What shipped
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <ul className="grid gap-x-10 sm:grid-cols-2">
              {featured.buildList?.map((item, index) => (
                <li
                  key={item}
                  className="grid grid-cols-[2rem_1fr] gap-3 border-t border-border py-5"
                >
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground-secondary">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 mt-8 border-t border-border pt-8 md:col-span-9 md:col-start-4">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                  Proof, not promise
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
          </div>
        </div>
      </ContentRail>
    </SectionShell>
  )
}

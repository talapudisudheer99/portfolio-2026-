import { ArrowUpRight, PlayCircle } from "lucide-react"

import { SectionReveal } from "@/components/motion/section-reveal"
import { GitHubIcon } from "@/components/shared/brand-icons"
import { TraceRule } from "@/components/shared/motion"
import { ContentRail } from "@/components/shared/section-wrapper"
import { projects } from "@/data/projects"

/** Smaller shipped work under the Sameward case study. */
export function MoreProjects() {
  const others = projects.filter((project) => !project.featured)
  if (!others.length) return null

  return (
    <ContentRail className="projects-case-section projects-more">
      <div className="content-grid gap-y-10 md:gap-y-12">
        <SectionReveal
          variant="label"
          className="projects-case-kicker col-span-12 lg:col-span-3 lg:self-start"
        >
          <TraceRule className="projects-section-rule projects-section-rule--kicker mb-6 bg-border" />
          <p className="section-kicker text-primary">Also shipped</p>
        </SectionReveal>

        <div className="col-span-12 flex flex-col gap-6 lg:col-span-8 lg:col-start-5">
          {others.map((project) => (
            <SectionReveal key={project.id} variant="body">
              <article className="projects-more-card">
                <header className="projects-more-head">
                  {project.period ? (
                    <p className="type-meta text-muted-foreground">{project.period}</p>
                  ) : null}
                  <h3 className="projects-more-title editorial-display">
                    {project.title}
                  </h3>
                  {project.subtitle ? (
                    <p className="projects-more-subtitle">{project.subtitle}</p>
                  ) : null}
                </header>

                <p className="projects-more-desc text-muted-foreground">
                  {project.description}
                </p>

                {project.highlights?.length ? (
                  <ul className="projects-more-list">
                    {project.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}

                {project.stack?.length ? (
                  <ul className="projects-more-stack" aria-label="Stack">
                    {project.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}

                <div className="projects-more-links">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="projects-more-link projects-more-link--primary"
                      data-cursor="View"
                    >
                      Live app
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  ) : null}
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="projects-more-link"
                    >
                      <GitHubIcon className="size-4" aria-hidden="true" />
                      Code
                    </a>
                  ) : null}
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="projects-more-link"
                    >
                      <PlayCircle className="size-4" aria-hidden="true" />
                      Demo video
                    </a>
                  ) : null}
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </ContentRail>
  )
}

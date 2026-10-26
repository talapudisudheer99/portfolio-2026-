import { ArrowRight, ArrowUpRight } from "lucide-react"

import { SectionReveal } from "@/components/motion/section-reveal"
import { ContentRail, SectionShell } from "@/components/shared/section-wrapper"
import { selectedWork } from "@/data/selected-work"

const isExternal = (href: string) => href.startsWith("http")

/** First-scroll proof: the three pieces of work, each one link deep. */
export function SelectedWork() {
  return (
    <SectionShell id="work" aria-labelledby="work-title" className="work-strip">
      <ContentRail>
        <SectionReveal variant="label">
          <p id="work-title" className="section-kicker text-primary">
            Selected work
          </p>
        </SectionReveal>

        <ol className="work-strip-grid">
          {selectedWork.map((item, index) => (
            <li key={item.id} className="work-strip-item">
              <SectionReveal variant="body" delay={index * 0.1} className="h-full">
                <article className="work-card">
                  <p className="work-card-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="work-card-name">{item.name}</h2>
                  <p className="work-card-context">{item.context}</p>
                  <p className="work-card-summary">{item.summary}</p>
                  <ul className="work-card-tags" aria-label="Stack">
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <div className="work-card-links">
                    <a
                      href={item.href}
                      className="work-card-link work-card-link--primary"
                      {...(isExternal(item.href)
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {item.cta}
                      {isExternal(item.href) ? (
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      ) : (
                        <ArrowRight className="size-4" aria-hidden="true" />
                      )}
                    </a>
                    {item.secondary ? (
                      <a
                        href={item.secondary.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="work-card-link"
                      >
                        {item.secondary.label}
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </article>
              </SectionReveal>
            </li>
          ))}
        </ol>
      </ContentRail>
    </SectionShell>
  )
}

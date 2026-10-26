"use client"

import { SectionReveal } from "@/components/motion/section-reveal"
import { TraceNode, TraceSequence } from "@/components/shared/motion"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { aboutContent } from "@/data/about"
import { gap } from "@/lib/motion"

/**
 * Profile — two columns from 900px:
 * left = header + how I work (facts)
 * right = proof numbers + availability
 */
export function About() {
  const { kicker, headline, section, featureCards, impact, availability } =
    aboutContent

  const lead = (section.description ?? "").replace(/\n/g, " ")

  return (
    <SectionWrapper id="about" className="about-section section-rule">
      <div className="about-brief">
        <div className="about-brief-main">
          <SectionReveal
            variant="body"
            delay={0.1}
            className="about-brief-header"
          >
            <p className="about-brief-kicker">{kicker}</p>
            <h2 className="about-brief-headline">
              <span className="about-brief-headline-line editorial-display">
                {headline.lead}
              </span>
              <span className="about-brief-headline-line editorial-display about-brief-headline-line--accent">
                {headline.accent}
              </span>
            </h2>
            <p className="about-brief-lead">{lead}</p>
          </SectionReveal>

          <TraceSequence className="about-channel-list" gap={gap.facts}>
            {featureCards.map((card, index) => {
              const Icon = card.icon
              return (
                <TraceNode key={card.title}>
                  <article
                    className="about-channel"
                    data-accent={card.accent}
                  >
                    <span className="about-channel-icon" aria-hidden="true">
                      <Icon className="size-[1.05rem]" strokeWidth={1.5} />
                    </span>
                    <div className="about-channel-copy">
                      <span
                        className="about-channel-index"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="about-channel-title">{card.title}</h3>
                      <p className="about-channel-detail">
                        {card.detail.replace(/\n/g, " ")}
                      </p>
                    </div>
                  </article>
                </TraceNode>
              )
            })}
          </TraceSequence>
        </div>

        <SectionReveal
          variant="visual"
          delay={0.2}
          y={18}
          className="about-hud"
        >
          <h3 className="sr-only">{impact.title}</h3>

          <ul className="about-proof">
            {impact.stats.map((stat) => (
              <li key={stat.label} className="about-proof-card">
                <span className="about-proof-value">{stat.value}</span>
                <span className="about-proof-label">{stat.label}</span>
                <span className="about-proof-detail">{stat.detail}</span>
              </li>
            ))}
          </ul>

          <p className="about-proof-availability">
            <span className="about-proof-dot" aria-hidden="true" />
            {availability}
          </p>
        </SectionReveal>
      </div>
    </SectionWrapper>
  )
}

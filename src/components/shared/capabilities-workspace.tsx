"use client"

import { ArrowRight, Rocket } from "lucide-react"
import Link from "next/link"

import { FadeIn, TraceNode, TraceSequence } from "@/components/shared/motion"
import {
  capabilitiesCta,
  capabilitiesHero,
  capabilityCardMeta,
  layerDisplayNames,
  layerAccents,
  layerIcons,
  workingRangeIntro,
} from "@/data/capabilities-ui"
import { skillGroups, workingRange } from "@/data/skills"
import { gap } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { SkillGroup } from "@/types"

export function CapabilitiesWorkspace() {
  return (
    <div className="capabilities-workspace">
      <span className="capabilities-workspace-aurora" aria-hidden="true" />

      <div className="capabilities-workspace-intro">
        <p className="capabilities-workspace-section-kicker">Capabilities</p>

        <FadeIn className="capabilities-workspace-hero">
          <div className="capabilities-workspace-hero-copy">
            <h2 className="capabilities-workspace-headline">
              {capabilitiesHero.lines.map((line) => (
                <span
                  key={`${line.text}${"accent" in line ? line.accent : ""}`}
                  className="capabilities-workspace-headline-line editorial-display"
                >
                  {line.text}
                  {"accent" in line && line.accent ? (
                    <span className="capabilities-workspace-headline-line--gradient">
                      {line.accent}
                    </span>
                  ) : null}
                </span>
              ))}
            </h2>
          </div>
          <div className="capabilities-workspace-hero-aside">
            <p className="capabilities-workspace-hero-description">
              {capabilitiesHero.description}
            </p>
          </div>
        </FadeIn>
      </div>

      <div className="capabilities-workspace-main">
        <aside className="capabilities-workspace-sidebar">
          <div className="capabilities-workspace-sidebar-panel">
            <p className="capabilities-workspace-sidebar-kicker">Working range</p>

            <ul className="capabilities-workspace-range-list">
              {workingRangeIntro.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.title} className="capabilities-workspace-range-row">
                    <div className="capabilities-workspace-range-item">
                      <span
                        className="capabilities-workspace-range-icon"
                        data-accent={item.accent}
                        aria-hidden="true"
                      >
                        <Icon className="size-[1.05rem]" strokeWidth={1.5} />
                      </span>
                      <span className="capabilities-workspace-range-copy">
                        <span className="capabilities-workspace-range-label">
                          {item.title}
                        </span>
                        <span className="capabilities-workspace-range-detail">
                          {item.detail}
                        </span>
                      </span>
                    </div>
                  </li>
                )
              })}

              {workingRange.layers.map((row) => {
                const Icon = layerIcons[row.layer]
                const accent = layerAccents[row.layer]
                const label = layerDisplayNames[row.layer] ?? row.layer

                return (
                  <li key={row.layer} className="capabilities-workspace-range-row">
                    <div className="capabilities-workspace-range-item">
                      <span
                        className="capabilities-workspace-range-icon"
                        data-accent={accent}
                        aria-hidden="true"
                      >
                        {Icon ? (
                          <Icon className="size-[1.05rem]" strokeWidth={1.5} />
                        ) : null}
                      </span>
                      <span className="capabilities-workspace-range-copy">
                        <span className="capabilities-workspace-range-label">
                          {label}
                        </span>
                        <span className="capabilities-workspace-range-detail">
                          {row.detail}
                        </span>
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>

        <div className="capabilities-workspace-board">
          <TraceSequence
            className="capabilities-workspace-grid"
            gap={gap.nodes}
            delayChildren={0.05}
          >
            {skillGroups.map((group, index) => (
              <CapabilityCard key={group.id} group={group} index={index} />
            ))}
          </TraceSequence>
        </div>
      </div>

      <FadeIn className="capabilities-workspace-cta">
        <div className="capabilities-workspace-cta-lead">
          <div className="capabilities-workspace-cta-icon" aria-hidden="true">
            <Rocket className="size-4" strokeWidth={1.75} />
          </div>
          <div className="capabilities-workspace-cta-head">
            <p className="capabilities-workspace-cta-kicker">
              {capabilitiesCta.kicker}
            </p>
            <p className="capabilities-workspace-cta-sub">{capabilitiesCta.sub}</p>
          </div>
        </div>
        <div className="capabilities-workspace-cta-divider" aria-hidden="true" />
        <p className="capabilities-workspace-cta-text">{capabilitiesCta.copy}</p>
        <Link href={capabilitiesCta.href} className="capabilities-workspace-cta-button">
          {capabilitiesCta.action}
          <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </Link>
      </FadeIn>
    </div>
  )
}

function CapabilityCard({ group, index }: { group: SkillGroup; index: number }) {
  const meta = capabilityCardMeta[group.id]
  if (!meta) return null

  const Icon = meta.icon

  return (
    <TraceNode
      className={cn(
        "capabilities-workspace-card",
        meta.fullWidth && "capabilities-workspace-card--full"
      )}
    >
      <article
        id={`capability-${group.id}`}
        aria-labelledby={`capability-title-${group.id}`}
        className={cn(
          "capabilities-workspace-card-inner",
          meta.fullWidth && "capabilities-workspace-card-inner--wide"
        )}
        data-accent={meta.accent}
      >
        <span className="capabilities-workspace-card-num">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="capabilities-workspace-card-body">
          <div className="capabilities-workspace-card-top">
            <span className="capabilities-workspace-card-icon" aria-hidden="true">
              <Icon className="size-[1.15rem]" strokeWidth={1.5} />
            </span>
            <div className="capabilities-workspace-card-copy">
              <h3
                id={`capability-title-${group.id}`}
                className="capabilities-workspace-card-title"
              >
                {group.title}
              </h3>
              <p className="capabilities-workspace-card-summary">{group.summary}</p>
            </div>
          </div>

          <ul className="capabilities-workspace-card-pills">
            {group.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </article>
    </TraceNode>
  )
}

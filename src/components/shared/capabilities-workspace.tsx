"use client"

import { ArrowRight, Rocket } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { SectionReveal } from "@/components/motion/section-reveal"
import { MotionParallax } from "@/components/motion/parallax-layer"
import { TraceNode, TraceSequence } from "@/components/shared/motion"
import {
  capabilitiesCta,
  capabilitiesHero,
  capabilityCardMeta,
  layerAccents,
  layerDisplayNames,
  layerIcons,
  layerToCapabilityId,
  workingRangeIntro,
} from "@/data/capabilities-ui"
import { skillGroups, workingRange } from "@/data/skills"
import { gap } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { SkillGroup } from "@/types"

export function CapabilitiesWorkspace() {
  const [focusId, setFocusId] = useState<string | null>(null)

  const capabilityByLayer = useMemo(() => {
    const map = new Map<string, string>()
    for (const [layer, id] of Object.entries(layerToCapabilityId)) {
      map.set(layer, id)
    }
    return map
  }, [])

  const setFocusFromLayer = (layer: string | null) => {
    if (!layer) {
      setFocusId(null)
      return
    }
    setFocusId(capabilityByLayer.get(layer) ?? null)
  }

  const isDimmed = (id: string) => focusId !== null && focusId !== id
  const isHighlighted = (id: string) => focusId === id

  return (
    <div className="capabilities-workspace">
      <MotionParallax
        as="span"
        strength="decoration"
        className="capabilities-workspace-aurora"
        aria-hidden="true"
      />

      <div className="capabilities-workspace-intro">
        <p className="capabilities-workspace-section-kicker">Capabilities</p>

        <SectionReveal className="capabilities-workspace-hero">
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
        </SectionReveal>
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
                    <div className="capabilities-workspace-range-item is-static">
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
                const capabilityId = capabilityByLayer.get(row.layer)
                const Icon = layerIcons[row.layer]
                const accent = layerAccents[row.layer]
                const active = capabilityId ? isHighlighted(capabilityId) : false
                const dimmed = capabilityId ? isDimmed(capabilityId) : false
                const label = layerDisplayNames[row.layer] ?? row.layer

                return (
                  <li key={row.layer} className="capabilities-workspace-range-row">
                    <button
                      type="button"
                      className={cn(
                        "capabilities-workspace-range-item",
                        active && "is-active",
                        dimmed && "is-dimmed"
                      )}
                      data-accent={accent}
                      onMouseEnter={() => setFocusFromLayer(row.layer)}
                      onMouseLeave={() => setFocusId(null)}
                      onFocus={() => setFocusFromLayer(row.layer)}
                      onBlur={() => setFocusId(null)}
                      onClick={() =>
                        capabilityId &&
                        document
                          .getElementById(`capability-${capabilityId}`)
                          ?.scrollIntoView({ behavior: "smooth", block: "center" })
                      }
                    >
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
                    </button>
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
              <CapabilityCard
                key={group.id}
                group={group}
                index={index}
                dimmed={isDimmed(group.id)}
                highlighted={isHighlighted(group.id)}
                onHover={(hovered) => setFocusId(hovered ? group.id : null)}
              />
            ))}
          </TraceSequence>
        </div>
      </div>

      <SectionReveal variant="body" className="capabilities-workspace-cta">
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
      </SectionReveal>
    </div>
  )
}

function CapabilityCard({
  group,
  index,
  dimmed,
  highlighted,
  onHover,
}: {
  group: SkillGroup
  index: number
  dimmed: boolean
  highlighted: boolean
  onHover: (hovered: boolean) => void
}) {
  const meta = capabilityCardMeta[group.id]
  if (!meta) return null

  const Icon = meta.icon

  return (
    <TraceNode
      className={cn(
        "capabilities-workspace-card",
        meta.fullWidth && "capabilities-workspace-card--full",
        dimmed && "is-dimmed",
        highlighted && "is-highlighted"
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
        tabIndex={0}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onFocus={() => onHover(true)}
        onBlur={() => onHover(false)}
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

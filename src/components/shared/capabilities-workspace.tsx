"use client"

import { useMemo } from "react"

import { SectionReveal } from "@/components/motion/section-reveal"
import {
  capabilitiesHero,
  capabilityCardMeta,
  capabilityPipelineIds,
} from "@/data/capabilities-ui"
import { skillGroups } from "@/data/skills"

/**
 * Capabilities — flat editorial grid (no asteroid depth field).
 * Keeps the section clear of local 3D so global cinematic parallax can own depth.
 */
export function CapabilitiesWorkspace() {
  const bodies = useMemo(() => {
    const byId = new Map(skillGroups.map((g) => [g.id, g]))
    return capabilityPipelineIds
      .map((id) => {
        const group = byId.get(id)
        const meta = capabilityCardMeta[id]
        if (!group || !meta) return null
        return { group, meta }
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
  }, [])

  return (
    <div className="capabilities-belt">
      <header className="capabilities-belt-intro">
        <SectionReveal className="capabilities-belt-hero">
          <div className="capabilities-belt-hero-main">
            <p className="capabilities-belt-kicker">Capabilities</p>
            <h2 className="capabilities-belt-headline">
              {capabilitiesHero.lines.map((line) => (
                <span
                  key={`${line.text}${"accent" in line ? line.accent : ""}`}
                  className="capabilities-belt-headline-line editorial-display"
                >
                  {line.text}
                  {"accent" in line && line.accent ? (
                    <span className="capabilities-belt-headline-accent">
                      {line.accent}
                    </span>
                  ) : null}
                </span>
              ))}
            </h2>
          </div>
          <div className="capabilities-belt-hero-aside">
            <p className="capabilities-belt-lead">
              {capabilitiesHero.description}
            </p>
            <p className="capabilities-belt-stance">
              {capabilitiesHero.stance}
            </p>
            <p className="capabilities-belt-count">
              Pipeline · {String(bodies.length).padStart(2, "0")} stages
            </p>
          </div>
        </SectionReveal>
      </header>

      <div
        className="capabilities-grid"
        role="list"
        aria-label="Capability stages"
      >
        {bodies.map(({ group, meta }, index) => {
          const Icon = meta.icon
          return (
            <SectionReveal
              key={group.id}
              className="capabilities-grid-item"
              variant="body"
              delay={Math.min(index * 0.04, 0.2)}
            >
              <article
                id={`capability-${group.id}`}
                className="capabilities-card"
                role="listitem"
                aria-label={`${meta.stage}: ${group.title}`}
              >
                <div className="capabilities-card-head">
                  <p className="capabilities-card-meta">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(bodies.length).padStart(2, "0")}{" "}
                    <span className="capabilities-card-stage">{meta.stage}</span>
                  </p>
                  <Icon
                    className="capabilities-card-icon"
                    aria-hidden="true"
                    strokeWidth={1.6}
                  />
                </div>
                <h3 className="capabilities-card-title editorial-display">
                  {group.title}
                </h3>
                <ul className="capabilities-card-skills" aria-label="Tools">
                  {group.skills.slice(0, 4).map((skill) => (
                    <li key={skill} className="capabilities-card-skill">
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            </SectionReveal>
          )
        })}
      </div>
    </div>
  )
}

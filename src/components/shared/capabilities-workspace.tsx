"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react"

import { SectionReveal } from "@/components/motion/section-reveal"
import {
  capabilitiesHero,
  capabilityCardMeta,
  capabilityPipelineIds,
} from "@/data/capabilities-ui"
import { skillGroups } from "@/data/skills"
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import { duration, easeOut } from "@/lib/motion"
import { cn } from "@/lib/utils"

/**
 * Capabilities as a release pipeline: seven stages from interface to launch.
 * Pick a stage (click or arrow keys) and the panel shows the tools
 * AND where each was used in real work — skills tied to proof.
 */
export function CapabilitiesWorkspace() {
  const still = useHydratedReducedMotion()
  const baseId = useId()
  const stages = useMemo(() => {
    const byId = new Map(skillGroups.map((g) => [g.id, g]))
    return capabilityPipelineIds
      .map((id) => {
        const group = byId.get(id)
        const meta = capabilityCardMeta[id]
        return group && meta ? { group, meta } : null
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
  }, [])

  const [index, setIndex] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const active = stages[index]!
  const panelId = `${baseId}-panel`
  const progress = stages.length > 1 ? index / (stages.length - 1) : 0

  function select(next: number, focus = false) {
    const clamped = (next + stages.length) % stages.length
    setIndex(clamped)
    if (focus) tabRefs.current[clamped]?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const map: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: stages.length - 1,
    }
    if (!(event.key in map)) return
    event.preventDefault()
    select(map[event.key]!, true)
  }

  const ActiveIcon = active.meta.icon

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
            <p className="capabilities-belt-lead">{capabilitiesHero.description}</p>
            <p className="capabilities-belt-stance">{capabilitiesHero.stance}</p>
            <p className="capabilities-belt-count">
              Pipeline · {String(stages.length).padStart(2, "0")} stages · pick one
            </p>
          </div>
        </SectionReveal>
      </header>

      <SectionReveal variant="visual" delay={0.05}>
        {/* Stage rail */}
        <div
          className="cap-rail"
          role="tablist"
          aria-label="Capability stages"
          onKeyDown={onKeyDown}
          style={{ "--cap-progress": progress } as React.CSSProperties}
        >
          <span className="cap-rail-track" aria-hidden="true">
            <span className="cap-rail-fill" />
          </span>
          {stages.map(({ group, meta }, i) => {
            const Icon = meta.icon
            const selected = i === index
            return (
              <button
                key={group.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${group.id}`}
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                className={cn("cap-stage", selected && "is-active", i < index && "is-done")}
              >
                <span className="cap-stage-node" aria-hidden="true">
                  <Icon className="size-4" strokeWidth={1.8} />
                </span>
                <span className="cap-stage-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="cap-stage-label">{meta.stage}</span>
              </button>
            )
          })}
        </div>

        {/* Stage detail */}
        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active.group.id}`}
          className="cap-panel"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.group.id}
              className="cap-panel-grid"
              initial={still ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={still ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: duration.ui, ease: easeOut }}
            >
              <div>
                <p className="cap-panel-kicker">
                  <ActiveIcon className="size-3.5" strokeWidth={2} aria-hidden="true" />
                  Stage {String(index + 1).padStart(2, "0")} · {active.meta.layer}
                </p>
                <h3 className="cap-panel-title editorial-display">{active.group.title}</h3>
                <p className="cap-panel-summary">{active.group.summary}</p>
                <ul className="cap-skills" aria-label="Tools">
                  {active.group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>

              <div className="cap-proof">
                <p className="cap-proof-label">Where I used it</p>
                <ul>
                  {active.group.proof.map((item) => (
                    <li key={item.where + item.text} className="cap-proof-item">
                      <span className="cap-proof-where">{item.where}</span>
                      <span className="cap-proof-text">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </SectionReveal>
    </div>
  )
}

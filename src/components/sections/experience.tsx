"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useId, useRef, useState, type KeyboardEvent } from "react"

import { SectionReveal } from "@/components/motion/section-reveal"
import { MaskedLine } from "@/components/shared/motion"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import { defaultExperienceId, experience } from "@/data/experience"
import { sections } from "@/data/sections"
import { duration, easeOut } from "@/lib/motion"
import { cn } from "@/lib/utils"

const isCurrent = (period: string) => /present/i.test(period)

/**
 * Experience as a "mission log": every role on one screen. Pick a mission
 * on the left (click or arrow keys); the panel on the right shows a one-line
 * summary, three tagged highlights and the stack. Phones get a swipeable
 * row of mission pills above the panel.
 */
export function Experience() {
  const { experience: content } = sections
  const still = useHydratedReducedMotion()
  const baseId = useId()
  const [activeId, setActiveId] = useState(defaultExperienceId)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const activeIndex = Math.max(
    0,
    experience.findIndex((role) => role.id === activeId)
  )
  const active = experience[activeIndex]!

  const professional = experience.filter((role) => role.kind === "role")
  const since = Math.min(
    ...professional.flatMap((role) =>
      (role.period.match(/\d{4}/g) ?? []).map(Number)
    )
  )
  const currentCount = experience.filter((r) => isCurrent(r.period)).length

  const tabId = (id: string) => `${baseId}-tab-${id}`
  const panelId = `${baseId}-panel`

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"]
    if (!keys.includes(event.key)) return
    event.preventDefault()
    const last = experience.length - 1
    let next = activeIndex
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = activeIndex === last ? 0 : activeIndex + 1
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = activeIndex === 0 ? last : activeIndex - 1
    if (event.key === "Home") next = 0
    if (event.key === "End") next = last
    const role = experience[next]!
    setActiveId(role.id)
    tabRefs.current[next]?.focus()
  }

  return (
    <SectionWrapper id="experience" className="section-rule">
      <div className="xp-head">
        <div>
          <MaskedLine display className="mt-0">
            <h2 className="editorial-display type-title text-foreground">
              {content.title}
            </h2>
          </MaskedLine>
          <SectionReveal variant="body" delay={0.1}>
            <p className="type-lead mt-5 max-w-md text-muted-foreground">
              {content.description}
            </p>
          </SectionReveal>
        </div>

        <SectionReveal variant="label" delay={0.15}>
          <dl className="xp-stats">
            <div>
              <dt>Since</dt>
              <dd>{since}</dd>
            </div>
            <div>
              <dt>Roles</dt>
              <dd>{String(professional.length).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt>Current</dt>
              <dd className="is-accent">{String(currentCount).padStart(2, "0")}</dd>
            </div>
          </dl>
        </SectionReveal>
      </div>

      <SectionReveal variant="visual" delay={0.1} className="xp-log">
        {/* Mission list */}
        <div
          className="xp-tabs"
          role="tablist"
          aria-label="Roles"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
        >
          {experience.map((role, index) => {
            const selected = role.id === activeId
            const current = isCurrent(role.period)
            return (
              <button
                key={role.id}
                ref={(el) => {
                  tabRefs.current[index] = el
                }}
                id={tabId(role.id)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(role.id)}
                className={cn(
                  "xp-tab",
                  selected && "is-active",
                  role.kind === "training" && "is-training"
                )}
              >
                <span className="xp-tab-orbit" aria-hidden="true" />
                <span className="xp-tab-meta">
                  <span>
                    {role.kind === "training"
                      ? "Training"
                      : `Mission ${String(professional.length - professional.indexOf(role)).padStart(2, "0")}`}
                  </span>
                  {current ? <span className="xp-tab-now">Now</span> : null}
                </span>
                <span className="xp-tab-company">{role.company}</span>
                <span className="xp-tab-period">{role.period}</span>
              </button>
            )
          })}
        </div>

        {/* Selected mission */}
        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(active.id)}
          className="xp-panel"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={still ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={still ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: duration.ui, ease: easeOut }}
            >
              <p className="xp-panel-meta">
                <span>{active.period}</span>
                {active.context ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{active.context}</span>
                  </>
                ) : null}
              </p>
              <h3 className="xp-panel-company editorial-display">{active.company}</h3>
              <p className="xp-panel-role">{active.role}</p>
              <p className="xp-panel-summary">{active.summary}</p>

              <ul className="xp-highlights">
                {active.highlights.map((item) => (
                  <li key={item.tag} className="xp-highlight">
                    <span className="xp-highlight-tag">{item.tag}</span>
                    <p>{item.text}</p>
                  </li>
                ))}
              </ul>

              <ul className="xp-stack" aria-label="Stack">
                {active.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </SectionReveal>
    </SectionWrapper>
  )
}

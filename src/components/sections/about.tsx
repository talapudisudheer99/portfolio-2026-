"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

import { SectionReveal } from "@/components/motion/section-reveal"
import {
  TraceNode,
  TraceSequence,
  useHydratedReducedMotion,
} from "@/components/shared/motion"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { aboutContent } from "@/data/about"
import { easeOut, gap } from "@/lib/motion"
import type { AboutRadarAxis } from "@/types"

function ProfileRadar({ axes }: { axes: AboutRadarAxis[] }) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10%" })
  const still = useHydratedReducedMotion()

  const cx = 160
  const cy = 160
  const r = 92
  const n = axes.length
  const angleStep = (2 * Math.PI) / n
  const offset = -Math.PI / 2

  function point(i: number, scale: number) {
    const angle = offset + i * angleStep
    return {
      x: cx + r * scale * Math.cos(angle),
      y: cy + r * scale * Math.sin(angle),
    }
  }

  const gridLevels = [0.25, 0.5, 0.75, 1]
  const dataPoints = axes.map((axis, i) => point(i, axis.value))
  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
    " Z"

  return (
    <svg
      ref={ref}
      viewBox="0 0 320 320"
      className="about-hud-radar"
      aria-label="Engineering impact radar"
    >
      {gridLevels.map((level) => {
        const pts = Array.from({ length: n }, (_, i) => point(i, level))
        const d =
          pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
          " Z"
        return (
          <path
            key={level}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.16}
            strokeWidth="0.85"
          />
        )
      })}

      {axes.map((axis, i) => {
        const p = point(i, 1)
        return (
          <line
            key={axis.label}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth="0.85"
          />
        )
      })}

      {still || !inView ? (
        <path d={dataPath} className="about-hud-radar-shape" />
      ) : (
        <motion.path
          d={dataPath}
          className="about-hud-radar-shape"
          initial={{ pathLength: 0, opacity: 0.4 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: easeOut }}
        />
      )}

      {axes.map((axis, i) => {
        const labelPoint = point(i, 1.2)
        let anchor: "start" | "middle" | "end" = "middle"
        if (i !== 0) {
          anchor = labelPoint.x > cx ? "start" : "end"
        }
        return (
          <text
            key={axis.label}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor={anchor}
            dominantBaseline="central"
            className="about-hud-radar-label"
          >
            {axis.label}
          </text>
        )
      })}

      {dataPoints.map((p, i) => (
        <circle
          key={`node-${axes[i]?.label ?? i}`}
          cx={p.x}
          cy={p.y}
          r="4"
          className="about-hud-radar-node"
        />
      ))}
    </svg>
  )
}

/**
 * Profile — two columns from 900px:
 * left = header + feature list
 * right = Engineering Impact
 */
export function About() {
  const { kicker, headline, section, featureCards, impact, radarAxes } =
    aboutContent

  const lead = (section.description ?? "").replace(/\n/g, " ")

  return (
    <SectionWrapper id="about" className="about-section section-rule">
      <div className="about-brief">
        <div className="about-brief-main">
          <SectionReveal
            variant="body"
            delay={0.18}
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
          delay={0.22}
          y={18}
          className="about-hud"
        >
          <h3 className="sr-only">{impact.title}</h3>

          <div className="about-hud-radar-wrap">
            <ProfileRadar axes={radarAxes} />
          </div>

          <div className="about-hud-stats" role="list">
            {impact.stats.map((stat) => (
              <div key={stat.label} className="about-hud-stat" role="listitem">
                <span
                  className={
                    stat.value.length <= 2
                      ? "about-hud-stat-value about-hud-stat-value--symbol"
                      : "about-hud-stat-value"
                  }
                >
                  {stat.value}
                </span>
                <span className="about-hud-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </SectionWrapper>
  )
}

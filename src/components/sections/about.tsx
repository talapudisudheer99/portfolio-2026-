"use client"

import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
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
      className="about-impact-radar"
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
        <path d={dataPath} className="about-impact-radar-shape" />
      ) : (
        <motion.path
          d={dataPath}
          className="about-impact-radar-shape"
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
            className="about-impact-radar-label"
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
          className="about-impact-radar-node"
        />
      ))}
    </svg>
  )
}

export function About() {
  const { kicker, headline, section, featureCards, impact, radarAxes } =
    aboutContent

  return (
    <SectionWrapper id="about" className="about-section section-rule">
      <div className="about-workspace">
        <span
          className="about-workspace-aurora about-workspace-aurora--left"
          aria-hidden="true"
        />
        <span
          className="about-workspace-aurora about-workspace-aurora--right"
          aria-hidden="true"
        />
        <span
          className="about-workspace-aurora about-workspace-aurora--mid"
          aria-hidden="true"
        />

        <div className="about-workspace-layout">
          <SectionReveal variant="body" className="about-workspace-copy-header">
            <p className="about-workspace-kicker">{kicker}</p>
            <h2 className="about-workspace-headline">
              <span className="about-workspace-headline-line editorial-display">
                {headline.lead}
              </span>
              <span className="about-workspace-headline-line editorial-display about-workspace-headline-line--gradient">
                {headline.accent}
              </span>
            </h2>
          </SectionReveal>

          <div className="about-workspace-aside-kicker">
            <span className="about-impact-float-badge">{impact.floatBadge}</span>
          </div>

          <div className="about-workspace-copy-body">
            <span
              className="about-workspace-copy-aurora"
              aria-hidden="true"
            />

            <SectionReveal variant="body" className="about-workspace-intro">
              <p className="about-workspace-lead">
                {(section.description ?? "").split("\n").map((line) => (
                  <span key={line} className="about-workspace-lead-line">
                    {line}
                  </span>
                ))}
              </p>
              <span className="about-workspace-rule" aria-hidden="true" />
            </SectionReveal>

            <TraceSequence className="about-feature-list" gap={gap.facts}>
              {featureCards.map((card) => {
                const Icon = card.icon
                return (
                  <TraceNode key={card.title}>
                    <article
                      className="about-feature-card"
                      data-accent={card.accent}
                    >
                      <span className="about-feature-icon" aria-hidden="true">
                        <Icon className="size-[1.05rem]" strokeWidth={1.5} />
                      </span>
                      <div className="about-feature-copy">
                        <h3 className="about-feature-title">{card.title}</h3>
                        <p className="about-feature-detail">
                          {card.detail.split("\n").map((line) => (
                            <span
                              key={`${card.title}-${line}`}
                              className="about-feature-detail-line"
                            >
                              {line}
                            </span>
                          ))}
                        </p>
                      </div>
                      <span
                        className="about-feature-arrow-wrap"
                        aria-hidden="true"
                      >
                        <ArrowRight
                          className="about-feature-arrow"
                          strokeWidth={1.75}
                        />
                      </span>
                    </article>
                  </TraceNode>
                )
              })}
            </TraceSequence>
          </div>

          <aside className="about-workspace-aside">
            <SectionReveal variant="visual" className="about-impact-card">
              <header className="about-impact-header">
                <h3 className="about-impact-title">{impact.title}</h3>
                <span className="about-impact-live">{impact.liveBadge}</span>
              </header>

              <div className="about-impact-radar-wrap">
                <ProfileRadar axes={radarAxes} />
              </div>

              <div className="about-impact-stats">
                {impact.stats.map((stat) => (
                  <div key={stat.label} className="about-impact-stat">
                    <span
                      className={
                        stat.value.length <= 2
                          ? "about-impact-stat-value about-impact-stat-value--symbol"
                          : "about-impact-stat-value"
                      }
                    >
                      {stat.value}
                    </span>
                    <span className="about-impact-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </aside>
        </div>
      </div>
    </SectionWrapper>
  )
}

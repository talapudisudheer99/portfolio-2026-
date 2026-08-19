"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

import {
  FadeIn,
  MaskedLine,
  TraceNode,
  TraceRule,
  TraceSequence,
  useHydratedReducedMotion,
} from "@/components/shared/motion"
import { ParallaxLayer, ScrollEmergence } from "@/components/shared/parallax"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { aboutContent } from "@/data/about"
import { easeOut, gap, parallax } from "@/lib/motion"

const PROFILE_AXES = [
  { label: "Engineering", value: 0.95 },
  { label: "Product", value: 0.8 },
  { label: "Performance", value: 0.85 },
  { label: "UX", value: 0.75 },
  { label: "Systems", value: 0.9 },
]

function ProfileRadar() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10%" })
  const still = useHydratedReducedMotion()

  const cx = 120
  const cy = 120
  const r = 90
  const n = PROFILE_AXES.length
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
  const dataPoints = PROFILE_AXES.map((a, i) => point(i, a.value))
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z"

  return (
    <svg
      ref={ref}
      viewBox="0 0 240 240"
      className="profile-radar mx-auto w-full max-w-[240px]"
      aria-label="Profile strengths radar"
    >
      {gridLevels.map((level) => {
        const pts = Array.from({ length: n }, (_, i) => point(i, level))
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z"
        return <path key={level} d={d} fill="none" stroke="var(--foreground)" strokeOpacity={0.1} strokeWidth="0.5" />
      })}

      {PROFILE_AXES.map((_, i) => {
        const p = point(i, 1)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--foreground)" strokeOpacity={0.08} strokeWidth="0.5" />
      })}

      {still || !inView ? (
        <path d={dataPath} fill="var(--primary)" fillOpacity={0.15} stroke="var(--primary)" strokeWidth="1.5" />
      ) : (
        <motion.path
          d={dataPath}
          fill="var(--primary)"
          fillOpacity={0.15}
          stroke="var(--primary)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, fillOpacity: 0 }}
          animate={{ pathLength: 1, fillOpacity: 0.15 }}
          transition={{ duration: 1.2, ease: easeOut }}
        />
      )}

      {PROFILE_AXES.map((axis, i) => {
        const labelPoint = point(i, 1.22)
        const anchor = i === 0 ? "middle" : labelPoint.x > cx ? "start" : "end"
        return (
          <text
            key={axis.label}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor={anchor}
            dominantBaseline="central"
            className="fill-current text-[7px] font-bold uppercase tracking-[0.12em]"
            style={{ fill: "color-mix(in srgb, var(--foreground) 40%, transparent)" }}
          >
            {axis.label}
          </text>
        )
      })}

      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--primary)" />
      ))}
    </svg>
  )
}

export function About() {
  const { section, paragraphs, highlights } = aboutContent

  return (
    <SectionWrapper id="about" className="section-rule min-h-svh">
      <div className="content-grid gap-y-12">
        <ScrollEmergence className="col-span-12 md:col-span-9">
          <ParallaxLayer speed={parallax.mid}>
            <MaskedLine display>
              <h2 className="editorial-display max-w-[11ch] text-[clamp(3.5rem,7.5vw,7rem)] leading-[0.88] font-medium text-foreground">
                {section.title}
                <span style={{ background: 'linear-gradient(135deg, #00d4ff, #c850c0, #ff4040)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>.</span>
              </h2>
            </MaskedLine>
          </ParallaxLayer>
          <FadeIn delay={0.12}>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {section.description}
            </p>
          </FadeIn>
        </ScrollEmergence>

        <div className="col-span-12 mt-6 md:col-span-9 md:col-start-4">
          <TraceRule className="mb-8 bg-border" />
          <div className="grid gap-8 md:grid-cols-3">
            <TraceSequence className="space-y-5 md:col-span-2" gap={gap.facts}>
              {paragraphs.map((paragraph) => (
                <TraceNode key={paragraph}>
                  <p className="text-sm leading-relaxed text-foreground-secondary md:text-base">
                    {paragraph}
                  </p>
                </TraceNode>
              ))}
            </TraceSequence>

            <div className="flex flex-col gap-8">
              <ProfileRadar />
              <TraceSequence
                as="dl"
                className="grid grid-cols-2 gap-x-6 gap-y-6"
                gap={gap.facts}
                delayChildren={0.1}
              >
                {highlights.map((item) => (
                  <TraceNode key={item.label}>
                    <dt className="font-mono text-[9px] tracking-[0.16em] text-muted-foreground uppercase">
                      {item.label}
                    </dt>
                    <dd className="mt-2 text-sm font-bold text-foreground">
                      {item.value}
                    </dd>
                  </TraceNode>
                ))}
              </TraceSequence>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

"use client"

import { ArrowUpRight } from "lucide-react"
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react"
import { useCallback, useRef, useState } from "react"

import { HeroStage } from "@/components/shared/hero-stage"
import { LocalTime } from "@/components/shared/local-time"
import { MaskedLine, useMountReveal } from "@/components/shared/motion"
import { SkillMarquee } from "@/components/shared/skill-marquee"
import { SectionShell } from "@/components/shared/section-wrapper"
import { siteConfig } from "@/data/site"
import { cn } from "@/lib/utils"

function padCoord(value: number) {
  return String(Math.round(value * 1000)).padStart(4, "0")
}

export function Hero() {
  const { hero } = siteConfig
  const [coord, setCoord] = useState({ x: 0, y: 0 })
  const frame = useRef(0)
  const next = useRef({ x: 0, y: 0 })
  const entered = useMountReveal()

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType !== "mouse") return

      const bounds = event.currentTarget.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width
      const y = (event.clientY - bounds.top) / bounds.height

      next.current = { x, y }

      if (frame.current) return
      frame.current = requestAnimationFrame(() => {
        frame.current = 0
        setCoord(next.current)
      })
    },
    []
  )

  return (
    <SectionShell
      id="hero"
      className="hero-shell relative overflow-hidden"
      onPointerMove={handlePointerMove}
    >
      <HeroStage />

      <div className="relative z-10 flex min-h-[calc(100svh-4.5rem)] w-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border/60 px-5 py-4 sm:px-8 lg:px-12">
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase sm:text-xs">
            {hero.badge}
          </p>
          <p className="flex items-center gap-4 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase sm:text-xs">
            <span className="tabular-nums" aria-hidden="true">
              {padCoord(coord.x)} × {padCoord(coord.y)}
            </span>
            <LocalTime />
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="flex flex-col items-center gap-4 px-5 text-center sm:px-8 lg:px-12">
            <span
              aria-hidden="true"
              className={cn(
                "hero-mark block h-px w-11 bg-primary/70",
                entered && "is-revealed"
              )}
              style={{ "--hero-delay": "0.06s" } as CSSProperties}
            />
            <p
              className={cn(
                "hero-kicker section-kicker text-muted-foreground",
                entered && "is-revealed"
              )}
              style={{ "--hero-delay": "0.16s" } as CSSProperties}
            >
              {hero.kicker}
            </p>

            <h1 className="mx-auto max-w-[18ch] text-[clamp(3.4rem,12vw,8.75rem)] leading-[1.08] font-semibold tracking-[-0.06em] text-foreground">
              {hero.headline.map((line, index) => (
                <MaskedLine
                  key={line.text}
                  as="span"
                  onMount
                  display
                  ink
                  durationSec={line.accent ? 0.92 : 0.76}
                  delay={0.2 + index * 0.14}
                  className={cn(
                    "block",
                    line.accent &&
                      "hero-accent-line editorial-display py-[0.04em] font-medium tracking-[-0.02em] text-primary italic [font-variation-settings:'SOFT'_50,'WONK'_0]"
                  )}
                >
                  {line.text}
                </MaskedLine>
              ))}
            </h1>

            <a
              href={hero.availabilityHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "hero-live group inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.16em] text-primary uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                entered && "is-revealed"
              )}
              style={{ "--hero-delay": "1.18s" } as CSSProperties}
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 animation-duration-[2.6s] motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              <span className="border-b border-transparent transition-colors group-hover:border-primary">
                {hero.availability}
              </span>
              <ArrowUpRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>

          <SkillMarquee className="mt-6 border-t border-border/70" duration={72} />
        </div>
      </div>
    </SectionShell>
  )
}

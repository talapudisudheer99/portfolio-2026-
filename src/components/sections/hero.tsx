"use client"

import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import type { PointerEvent as ReactPointerEvent } from "react"
import { useCallback, useRef } from "react"

import { FadeIn, TraceRule, WordReveal } from "@/components/shared/motion"
import { ContentRail, SectionShell } from "@/components/shared/section-wrapper"
import { SocialLinks } from "@/components/shared/social-links"
import { siteConfig } from "@/data/site"
import { rise } from "@/lib/motion"

/** Pointer drift is deliberately tiny — presence, not a parallax effect. */
const POINTER_SHIFT_X = 12
const POINTER_SHIFT_Y = 7
const pointerSpring = { stiffness: 55, damping: 20, mass: 0.7 }

export function Hero() {
  const { hero } = siteConfig
  const [statement, counterpoint] = hero.greeting.split(". ")

  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const driftX = useSpring(pointerX, pointerSpring)
  const driftY = useSpring(pointerY, pointerSpring)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const scrollLift = useTransform(scrollYProgress, [0, 1], [0, -90])
  const scrollFade = useTransform(scrollYProgress, [0, 0.85], [1, 0.3])
  const headlineY = useTransform(
    [driftY, scrollLift],
    ([drift, lift]: number[]) => drift + lift
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (prefersReducedMotion || event.pointerType !== "mouse") return

      const bounds = event.currentTarget.getBoundingClientRect()
      const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5
      const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5

      pointerX.set(normalizedX * POINTER_SHIFT_X * 2)
      pointerY.set(normalizedY * POINTER_SHIFT_Y * 2)
    },
    [prefersReducedMotion, pointerX, pointerY]
  )

  const handlePointerLeave = useCallback(() => {
    pointerX.set(0)
    pointerY.set(0)
  }, [pointerX, pointerY])

  return (
    <SectionShell
      id="hero"
      ref={sectionRef}
      className="overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <ContentRail className="flex min-h-[calc(100svh-4.5rem)] flex-col border-x border-border/60">
        <div className="px-4 sm:px-6 lg:px-8">
          <TraceRule onMount className="bg-border/60" delay={0.02} />
          <FadeIn
            onMount
            y={rise.sm}
            delay={0.06}
            className="flex items-center justify-between py-4"
          >
            <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase sm:text-xs">
              {hero.badge}
            </p>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 text-xs font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Selected work
              <ArrowDownRight className="size-4" aria-hidden="true" />
            </a>
          </FadeIn>
        </div>

        <div className="content-grid flex-1 items-center px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <motion.h1
            style={
              prefersReducedMotion
                ? undefined
                : { x: driftX, y: headlineY, opacity: scrollFade }
            }
            className="col-span-12 max-w-[11ch] text-[clamp(3.9rem,10.5vw,9.5rem)] leading-[0.82] font-semibold tracking-[-0.075em] text-foreground"
          >
            <WordReveal
              onMount
              delay={0.12}
              text={`${statement}.`}
              className="block"
            />
            <WordReveal
              onMount
              delay={0.5}
              text={counterpoint ?? ""}
              className="editorial-display mt-2 block font-medium text-primary italic"
            />
          </motion.h1>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          <TraceRule onMount className="bg-border/60" delay={0.38} />
          <FadeIn
            onMount
            y={rise.sm}
            delay={0.44}
            className="content-grid gap-y-8 py-7"
          >
            <div className="col-span-12 md:col-span-3">
              <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                Focus
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {hero.role}
              </p>
            </div>

            <p className="col-span-12 max-w-xl text-sm leading-relaxed text-muted-foreground md:col-span-5 md:text-base">
              {hero.tagline}
            </p>

            <div className="col-span-12 flex flex-col gap-4 md:col-span-4 md:items-end">
              <div className="flex flex-wrap gap-x-5 gap-y-3">
                {hero.ctas.map((cta) => {
                  const external = cta.external ?? cta.href.startsWith("http")
                  const primary = cta.variant === "primary"

                  return (
                    <a
                      key={cta.href}
                      href={cta.href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={
                        primary
                          ? "group inline-flex items-center gap-2 border-b border-primary pb-1 text-sm font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                          : "group inline-flex items-center gap-2 border-b border-border pb-1 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                      }
                    >
                      {cta.label}
                      <ArrowUpRight
                        className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  )
                })}
              </div>
              <SocialLinks links={siteConfig.socialLinks} compact />
            </div>
          </FadeIn>
        </div>
      </ContentRail>
    </SectionShell>
  )
}

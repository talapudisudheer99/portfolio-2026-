"use client"

import { ArrowUpRight } from "lucide-react"
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import type { PointerEvent as ReactPointerEvent } from "react"
import { useCallback, useRef } from "react"

import { LocalTime } from "@/components/shared/local-time"
import {
  FadeIn,
  TraceRule,
  useHydratedReducedMotion,
  WordReveal,
} from "@/components/shared/motion"
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
  const prefersReducedMotion = useHydratedReducedMotion()

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
        {/* Masthead */}
        <div className="px-4 sm:px-6 lg:px-8">
          <TraceRule onMount className="bg-border/60" delay={0.02} />
          <FadeIn
            onMount
            y={rise.sm}
            delay={0.06}
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4"
          >
            <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase sm:text-xs">
              {hero.badge}
            </p>
            <LocalTime className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase sm:text-xs" />
          </FadeIn>
        </div>

        <div className="content-grid flex-1 items-center gap-y-12 px-4 py-10 sm:px-6 md:py-12 lg:px-8">
          <motion.div
            style={
              prefersReducedMotion
                ? undefined
                : { x: driftX, y: headlineY, opacity: scrollFade }
            }
            className="col-span-12 md:col-span-8"
          >
            <h1 className="max-w-[10ch] text-[clamp(3.4rem,9vw,8.75rem)] leading-[0.84] font-semibold tracking-[-0.075em] text-foreground">
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
            </h1>

            <FadeIn onMount y={rise.sm} delay={0.86}>
              <p className="mt-10 inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.16em] text-primary uppercase">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 [animation-duration:2.6s] motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                {hero.availability}
              </p>
            </FadeIn>
          </motion.div>

          {/* Working range — the span a hiring reader is actually checking for. */}
          <FadeIn
            onMount
            delay={0.6}
            className="col-span-12 md:col-span-4 md:col-start-9"
          >
            <p className="section-kicker text-muted-foreground">
              Working range
            </p>
            <p className="editorial-display mt-2 text-xl leading-tight font-medium text-foreground">
              {hero.role}
            </p>

            <dl className="mt-6">
              {hero.stack.map((row) => (
                <div
                  key={row.layer}
                  className="group flex items-baseline justify-between gap-4 border-t border-border/70 py-2.5"
                >
                  <dt className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase transition-colors group-hover:text-primary">
                    {row.layer}
                  </dt>
                  <dd className="text-right text-xs leading-snug font-semibold text-foreground">
                    {row.detail}
                  </dd>
                </div>
              ))}
              <div className="border-t border-border/70" />
            </dl>

            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              {hero.stackNote}
            </p>
          </FadeIn>
        </div>

        {/* Colophon */}
        <div className="px-4 sm:px-6 lg:px-8">
          <TraceRule onMount className="bg-border/60" delay={0.38} />
          <FadeIn
            onMount
            y={rise.sm}
            delay={0.44}
            className="content-grid gap-y-8 py-7"
          >
            <p className="col-span-12 max-w-xl text-sm leading-relaxed text-muted-foreground md:col-span-6 md:text-base">
              {hero.tagline}
            </p>

            <div className="col-span-12 flex flex-col gap-4 md:col-span-6 md:items-end">
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

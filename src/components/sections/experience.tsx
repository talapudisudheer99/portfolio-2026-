"use client"

import { useGSAP } from "@gsap/react"
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef, useState } from "react"

import { SectionReveal } from "@/components/motion/section-reveal"
import { MaskedLine, useHydratedReducedMotion } from "@/components/shared/motion"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { experience } from "@/data/experience"
import { sections } from "@/data/sections"
import { duration, easeOut, rise } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { Experience as Role } from "@/types"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const isCurrent = (period: string) => /present/i.test(period)

const rowViewport = { once: true, margin: "0px 0px -20% 0px" } as const

const rowSequence = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}

const rowPart = {
  hidden: { opacity: 0, y: rise.sm },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.trace, ease: easeOut },
  },
}

const rowLead = {
  hidden: { opacity: 0, y: rise.md },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.copy, ease: easeOut },
  },
}

const rowNode = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { duration: duration.micro, ease: easeOut },
  },
}

const nodePulse = {
  hidden: { scale: 1, opacity: 0 },
  visible: {
    scale: 3,
    opacity: [0.5, 0],
    transition: { duration: 1.1, ease: easeOut },
  },
}

interface CountUpProps {
  value: number
  pad: number
}

function CountUp({ value, pad }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const prefersReducedMotion = useHydratedReducedMotion()
  const count = useMotionValue(0)
  const text = useTransform(count, (latest) =>
    String(Math.round(latest)).padStart(pad, "0")
  )

  useEffect(() => {
    if (!inView || prefersReducedMotion) return

    const controls = animate(count, value, { duration: 1.1, ease: easeOut })
    return () => controls.stop()
  }, [count, inView, prefersReducedMotion, value])

  if (prefersReducedMotion) {
    return <span>{String(value).padStart(pad, "0")}</span>
  }

  return <motion.span ref={ref}>{text}</motion.span>
}

/**
 * Phase 09 Task 10 + 15 — progression via illumination;
 * scroll rail owned by GSAP ScrollTrigger (not Framer useScroll).
 */
export function Experience() {
  const { experience: content } = sections
  const railRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const prefersReducedMotion = useHydratedReducedMotion()
  const [activeId, setActiveId] = useState<string | null>(
    experience.find((r) => isCurrent(r.period))?.id ?? experience[0]?.id ?? null
  )

  useGSAP(
    () => {
      const rail = railRef.current
      const bar = progressRef.current
      if (!rail || !bar || prefersReducedMotion) return

      gsap.set(bar, { scaleY: 0, transformOrigin: "top center" })

      gsap.to(bar, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: rail,
          start: "top 70%",
          end: "bottom 70%",
          scrub: 0.45,
        },
      })
    },
    { dependencies: [prefersReducedMotion], revertOnUpdate: true }
  )

  const years = experience
    .flatMap((role) => role.period.match(/\d{4}/g) ?? [])
    .map(Number)
  const currentCount = experience.filter((r) => isCurrent(r.period)).length

  return (
    <SectionWrapper id="experience" className="section-rule">
      <div className="content-grid gap-y-16">
        <div className="col-span-12 md:sticky md:top-24 md:col-span-4 md:self-start">
          <MaskedLine display className="mt-0">
            <h2 className="editorial-display type-title text-foreground">
              {content.title}
            </h2>
          </MaskedLine>

          <SectionReveal variant="body" delay={0.1}>
            <p className="type-lead mt-6 max-w-xs text-muted-foreground">
              {content.description}
            </p>

            <dl className="mt-10 grid max-w-xs grid-cols-3 gap-4 border-t border-border pt-6">
              <div>
                <dt className="type-meta text-muted-foreground">Since</dt>
                <dd className="editorial-display type-section mt-2 leading-none font-medium text-foreground">
                  {Math.min(...years)}
                </dd>
              </div>
              <div>
                <dt className="type-meta text-muted-foreground">Roles</dt>
                <dd className="editorial-display type-section mt-2 leading-none font-medium text-foreground">
                  <CountUp value={experience.length} pad={2} />
                </dd>
              </div>
              <div>
                <dt className="type-meta text-muted-foreground">Current</dt>
                <dd className="editorial-display type-section mt-2 leading-none font-medium text-primary">
                  <CountUp value={currentCount} pad={2} />
                </dd>
              </div>
            </dl>
          </SectionReveal>
        </div>

        <div
          ref={railRef}
          className="relative col-span-12 md:col-span-7 md:col-start-6"
        >
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-0 left-0 w-px bg-border"
          />
          {prefersReducedMotion ? null : (
            <span
              ref={progressRef}
              aria-hidden="true"
              className="absolute top-2 bottom-0 left-0 w-px origin-top bg-primary"
            />
          )}

          <ol>
            {experience.map((role, index) => (
              <ExperienceRow
                key={role.id}
                role={role}
                index={index}
                illuminated={activeId === role.id}
                muted={activeId !== null && activeId !== role.id}
                setActiveId={setActiveId}
              />
            ))}
          </ol>
        </div>
      </div>
    </SectionWrapper>
  )
}

interface ExperienceRowProps {
  role: Role
  index: number
  illuminated: boolean
  muted: boolean
  setActiveId: (id: string) => void
}

function ExperienceRow({
  role,
  index,
  illuminated,
  muted,
  setActiveId,
}: ExperienceRowProps) {
  const prefersReducedMotion = useHydratedReducedMotion()
  const current = isCurrent(role.period)
  const rowRef = useRef<HTMLLIElement>(null)
  const inFocus = useInView(rowRef, {
    margin: "-40% 0px -40% 0px",
    amount: 0.35,
  })

  useEffect(() => {
    if (inFocus) setActiveId(role.id)
  }, [inFocus, role.id, setActiveId])

  const meta = (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <span className="type-meta text-muted-foreground">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="type-meta text-muted-foreground">{role.period}</span>
      {current ? (
        <span className="type-meta inline-flex items-center gap-1.5 text-primary">
          <span className="size-1.5 rounded-full bg-primary" />
          Now
        </span>
      ) : null}
    </div>
  )

  const company = (
    <h3 className="editorial-display type-section mt-3 font-medium text-foreground transition-colors group-hover:text-primary">
      {role.company}
    </h3>
  )

  const title = (
    <p className="type-lead mt-2 font-semibold text-foreground-secondary">
      {role.role}
    </p>
  )

  const rowClass = cn(
    "group relative pb-14 pl-8 last:pb-0 sm:pl-12 experience-row",
    illuminated && "is-illuminated",
    muted && "is-muted",
    current && "is-flagship"
  )
  const dotClass = cn(
    "absolute top-2 left-0 size-2.5 -translate-x-1/2 rounded-full border-2 border-background",
    current || illuminated ? "bg-primary" : "bg-border"
  )

  if (prefersReducedMotion) {
    return (
      <li ref={rowRef} className={rowClass}>
        <span aria-hidden="true" className={dotClass} />
        {meta}
        {company}
        {title}
        <ul className="mt-5 space-y-2.5">
          {role.bullets.map((bullet) => (
            <li
              key={bullet}
              className="type-ui relative pl-4 text-muted-foreground"
            >
              <span
                aria-hidden="true"
                className="absolute top-[0.55em] left-0 size-1.5 rounded-full bg-muted-foreground/70"
              />
              {bullet}
            </li>
          ))}
        </ul>
      </li>
    )
  }

  return (
    <motion.li
      ref={rowRef}
      variants={rowSequence}
      initial="hidden"
      whileInView="visible"
      viewport={rowViewport}
      className={cn("reduce-show", rowClass)}
    >
      <motion.span aria-hidden="true" variants={rowNode} className={dotClass} />
      {current ? (
        <motion.span
          aria-hidden="true"
          variants={nodePulse}
          className="absolute top-2 left-0 size-2.5 -translate-x-1/2 rounded-full bg-primary"
        />
      ) : null}

      <motion.div variants={rowPart}>{meta}</motion.div>
      <motion.div variants={rowLead}>{company}</motion.div>
      <motion.div variants={rowPart}>{title}</motion.div>

      <motion.ul variants={rowSequence} className="mt-5 space-y-2.5">
        {role.bullets.map((bullet) => (
          <motion.li
            key={bullet}
            variants={rowPart}
            className="type-ui relative pl-4 text-muted-foreground"
          >
            <span
              aria-hidden="true"
              className="absolute top-[0.55em] left-0 size-1.5 rounded-full bg-muted-foreground/70"
            />
            {bullet}
          </motion.li>
        ))}
      </motion.ul>
    </motion.li>
  )
}

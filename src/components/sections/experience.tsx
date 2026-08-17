"use client"

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import { useEffect, useRef } from "react"

import { FadeIn, MaskedLine } from "@/components/shared/motion"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { experience } from "@/data/experience"
import { sections } from "@/data/sections"
import { duration, easeOut } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { Experience as Role } from "@/types"

const isCurrent = (period: string) => /present/i.test(period)

/**
 * Each row owns its trigger. A single parent stagger would fire every row the
 * moment the list top entered view, so the lower roles would have finished
 * animating long before the reader reached them.
 */
const rowViewport = { once: true, margin: "0px 0px -20% 0px" } as const

const rowSequence = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}

const rowPart = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.trace, ease: easeOut },
  },
}

const rowLead = {
  hidden: { opacity: 0, y: 24 },
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

/** Settles a figure rather than printing it, on the row's own entrance. */
function CountUp({ value, pad }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const prefersReducedMotion = useReducedMotion()
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

export function Experience() {
  const { experience: content } = sections
  const railRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.7", "end 0.7"],
  })
  const railScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  const years = experience
    .flatMap((role) => role.period.match(/\d{4}/g) ?? [])
    .map(Number)
  const currentCount = experience.filter((r) => isCurrent(r.period)).length

  return (
    <SectionWrapper id="experience" className="section-rule">
      <div className="content-grid gap-y-16">
        {/* Sticky so the heading and career summary stay with the list. */}
        <div className="col-span-12 md:sticky md:top-24 md:col-span-4 md:self-start">
          <FadeIn>
            <p className="section-kicker text-primary">03 · Experience</p>
          </FadeIn>

          <MaskedLine display className="mt-6">
            <h2 className="editorial-display text-[clamp(2.6rem,4.6vw,4.25rem)] leading-[0.9] font-medium text-foreground">
              {content.title}
            </h2>
          </MaskedLine>

          <FadeIn delay={0.1}>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {content.description}
            </p>

            <dl className="mt-10 grid max-w-xs grid-cols-3 gap-4 border-t border-border pt-6">
              <div>
                <dt className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                  Since
                </dt>
                <dd className="editorial-display mt-2 text-3xl leading-none font-medium text-foreground">
                  {Math.min(...years)}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                  Roles
                </dt>
                <dd className="editorial-display mt-2 text-3xl leading-none font-medium text-foreground">
                  <CountUp value={experience.length} pad={2} />
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                  Current
                </dt>
                <dd className="editorial-display mt-2 text-3xl leading-none font-medium text-primary">
                  <CountUp value={currentCount} pad={2} />
                </dd>
              </div>
            </dl>
          </FadeIn>
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
            <motion.span
              aria-hidden="true"
              style={{ scaleY: railScale }}
              className="absolute top-2 bottom-0 left-0 w-px origin-top bg-primary"
            />
          )}

          <ol>
            {experience.map((role, index) => (
              <ExperienceRow key={role.id} role={role} index={index} />
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
}

function ExperienceRow({ role, index }: ExperienceRowProps) {
  const prefersReducedMotion = useReducedMotion()
  const current = isCurrent(role.period)

  const meta = (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <span className="font-mono text-[10px] text-muted-foreground">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
        {role.period}
      </span>
      {current ? (
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-primary uppercase">
          <span className="size-1.5 rounded-full bg-primary" />
          Now
        </span>
      ) : null}
    </div>
  )

  const company = (
    <h3 className="editorial-display mt-3 text-[clamp(1.9rem,3.2vw,2.9rem)] leading-[0.95] font-medium text-foreground transition-colors group-hover:text-primary">
      {role.company}
    </h3>
  )

  const title = (
    <p className="mt-2 text-base font-semibold tracking-[-0.02em] text-foreground-secondary md:text-lg">
      {role.role}
    </p>
  )

  const rowClass = "group relative pb-14 pl-8 last:pb-0 sm:pl-12"
  const dotClass = cn(
    "absolute top-2 left-0 size-2.5 -translate-x-1/2 rounded-full border-2 border-background",
    current ? "bg-primary" : "bg-border"
  )

  if (prefersReducedMotion) {
    return (
      <li className={rowClass}>
        <span aria-hidden="true" className={dotClass} />
        {meta}
        {company}
        {title}
        <ul className="mt-5 space-y-2.5">
          {role.bullets.slice(0, 3).map((bullet) => (
            <li
              key={bullet}
              className="relative pl-4 text-sm leading-relaxed text-muted-foreground"
            >
              <span
                aria-hidden="true"
                className="absolute top-[0.6em] left-0 size-1 rounded-full bg-border"
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
      variants={rowSequence}
      initial="hidden"
      whileInView="visible"
      viewport={rowViewport}
      className={rowClass}
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
        {role.bullets.slice(0, 3).map((bullet) => (
          <motion.li
            key={bullet}
            variants={rowPart}
            className="relative pl-4 text-sm leading-relaxed text-muted-foreground"
          >
            <span
              aria-hidden="true"
              className="absolute top-[0.6em] left-0 size-1 rounded-full bg-border"
            />
            {bullet}
          </motion.li>
        ))}
      </motion.ul>
    </motion.li>
  )
}

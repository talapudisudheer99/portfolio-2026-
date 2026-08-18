"use client"

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useRef } from "react"

import {
  FadeIn,
  MaskedLine,
  TraceRule,
  useHydratedReducedMotion,
} from "@/components/shared/motion"
import { SamewardProductVisual } from "@/components/shared/sameward-product-visual"
import { parallax } from "@/lib/motion"
import type { Project } from "@/types"

interface FeaturedWorkStageProps {
  featured: Project
  liveDemoLabel: string
}

function HeadlineColumn({
  progress,
  still,
}: Readonly<{ progress: MotionValue<number>; still: boolean }>) {
  const y = useTransform(
    progress,
    [0, 1],
    [parallax.product.headlineY[0], parallax.product.headlineY[1]]
  )

  const headline = (
    <h2 className="editorial-display max-w-[11ch] text-[clamp(3.2rem,7.5vw,7.5rem)] leading-[0.88] font-medium lg:max-w-[10ch] lg:text-[clamp(3.8rem,8.5vw,8rem)] lg:leading-[0.86]">
      <MaskedLine display>
        <span className="block">One product,</span>
      </MaskedLine>
      <MaskedLine display delay={0.1}>
        <span className="block text-primary italic">end to end.</span>
      </MaskedLine>
    </h2>
  )

  if (still) {
    return <div className="pt-2 lg:pt-4">{headline}</div>
  }

  return (
    <motion.div style={{ y }} className="pt-2 lg:pt-4">
      {headline}
    </motion.div>
  )
}

/**
 * Featured work opener: headline left, live Sameward surface right,
 * product copy on its own row below (no sticky overlap).
 */
export function FeaturedWorkStage({
  featured,
  liveDemoLabel,
}: FeaturedWorkStageProps) {
  const sceneRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useHydratedReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start 0.85", "end 0.45"],
  })

  return (
    <section
      ref={sceneRef}
      aria-label="Featured work"
      className="featured-work-stage relative"
    >
      <div className="content-grid items-start gap-y-12">
        {/* Row 1 — headline + panel; min-height keeps copy row below the mock */}
        <div className="featured-work-hero-row col-span-12">
          <div className="content-grid items-start gap-y-10 lg:gap-y-0">
            <div className="col-span-12 lg:col-span-7">
              <HeadlineColumn
                progress={scrollYProgress}
                still={prefersReducedMotion}
              />
            </div>

            <div className="col-span-12 lg:col-span-5 lg:col-start-8">
              <SamewardProductVisual
                progress={scrollYProgress}
                still={prefersReducedMotion}
              />
            </div>
          </div>
        </div>

        {/* Row 2 — product copy; always below hero row */}
        <FadeIn className="col-span-12 lg:col-span-9 lg:col-start-4">
          <TraceRule className="mb-8 bg-border" />
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="section-kicker text-muted-foreground">
                {featured.title} · Live product
              </p>
              <h3 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] md:text-4xl">
                {featured.subtitle}
              </h3>
            </div>
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {featured.description}
              </p>
              {featured.liveUrl ? (
                <a
                  href={featured.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-6 inline-flex items-center gap-2 border-b border-primary pb-1 text-sm font-bold text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  {liveDemoLabel}
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              ) : null}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"

import {
  FadeIn,
  TraceNode,
  TraceRule,
  TraceSequence,
  useHydratedReducedMotion,
} from "@/components/shared/motion"
import { easeOut, gap } from "@/lib/motion"

const services = [
  ["MongoDB", "Workspaces, members, roles"],
  ["AWS S3", "Profile images and files"],
  ["Resend", "Account and product email"],
  ["OpenAI", "AI help using channel context"],
] as const

function FlowConnector() {
  const still = useHydratedReducedMotion()

  return (
    <svg
      className="arch-connector"
      viewBox="0 0 400 40"
      fill="none"
      aria-hidden="true"
    >
      <line
        x1="50"
        y1="20"
        x2="350"
        y2="20"
        stroke="var(--border)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <line
        x1="200"
        y1="0"
        x2="200"
        y2="40"
        stroke="var(--border)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      {!still && (
        <>
          <circle r="3" fill="var(--sameward)">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path="M 50,20 L 200,20"
            />
          </circle>
          <circle r="3" fill="var(--sameward)">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path="M 350,20 L 200,20"
              begin="1.5s"
            />
          </circle>
        </>
      )}
    </svg>
  )
}

const nodeVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
}

export function ArchitectureDiagram() {
  return (
    <figure aria-labelledby="architecture-title" className="text-foreground">
      <FadeIn>
        <figcaption
          id="architecture-title"
          className="mb-10 max-w-2xl text-sm leading-relaxed text-muted-foreground"
        >
          Sameward uses a web app and a separate realtime service. This keeps
          messaging fast while the web app handles pages, data, and product
          actions.
        </figcaption>
      </FadeIn>

      <TraceSequence className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
        <TraceNode className="arch-node border-t border-border pt-4">
          <span className="mb-5 block size-2.5 rounded-full bg-sameward-ink" />
          <p className="text-xl font-bold">Next.js web</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pages · APIs · product data
          </p>
        </TraceNode>
        <TraceNode className="arch-node border-t border-border pt-4">
          <span className="mb-5 block size-2.5 rounded-full bg-sameward-ink" />
          <p className="text-xl font-bold">Socket.IO realtime</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Messages · typing · presence
          </p>
        </TraceNode>
      </TraceSequence>

      <FlowConnector />

      <div className="my-6 flex items-center gap-4" aria-hidden="true">
        <TraceRule className="flex-1 bg-border" delay={0.05} />
        <span className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          Shared services
        </span>
        <TraceRule className="flex-1 bg-border" delay={0.12} origin="right" />
      </div>

      <TraceSequence
        className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4"
        gap={gap.facts}
        delayChildren={0.15}
      >
        {services.map(([label, detail], index) => (
          <TraceNode key={label}>
            <motion.div
              className="arch-service-node"
              variants={nodeVariants}
            >
              <p className="font-mono text-[10px] tracking-[0.15em] text-sameward-ink uppercase">
                0{index + 1}
              </p>
              <p className="mt-3 font-bold">{label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
            </motion.div>
          </TraceNode>
        ))}
      </TraceSequence>

      <div className="mt-12">
        <TraceRule className="mb-5 bg-border" />
        <FadeIn delay={0.08}>
          <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            Live on Railway at sameward.com
          </p>
        </FadeIn>
      </div>
    </figure>
  )
}

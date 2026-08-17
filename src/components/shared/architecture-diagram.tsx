"use client"

import {
  FadeIn,
  TraceNode,
  TraceRule,
  TraceSequence,
} from "@/components/shared/motion"
import { gap } from "@/lib/motion"

const services = [
  ["MongoDB", "Workspaces, members, roles"],
  ["AWS S3", "Profile images and files"],
  ["Resend", "Account and product email"],
  ["OpenAI", "AI help using channel context"],
] as const

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
        <TraceNode className="border-t border-border pt-4">
          <span className="mb-5 block size-2 rounded-full bg-sameward-ink" />
          <p className="text-xl font-bold">Next.js web</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pages · APIs · product data
          </p>
        </TraceNode>
        <TraceNode className="border-t border-border pt-4">
          <span className="mb-5 block size-2 rounded-full bg-sameward-ink" />
          <p className="text-xl font-bold">Socket.IO realtime</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Messages · typing · presence
          </p>
        </TraceNode>
      </TraceSequence>

      <div className="my-12 flex items-center gap-4" aria-hidden="true">
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
            <p className="font-mono text-[10px] tracking-[0.15em] text-sameward-ink uppercase">
              0{index + 1}
            </p>
            <p className="mt-3 font-bold">{label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
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

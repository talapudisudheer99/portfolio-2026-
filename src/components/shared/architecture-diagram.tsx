"use client"

import {
  FadeIn,
  TraceNode,
  TraceRule,
  TraceSequence,
} from "@/components/shared/motion"
import { gap } from "@/lib/motion"

const services = [
  ["MongoDB", "Multi-tenant workspaces"],
  ["AWS S3", "Presigned uploads"],
  ["Resend", "Transactional email"],
  ["OpenAI", "Grounded Channel AI"],
] as const

export function ArchitectureDiagram() {
  return (
    <figure aria-labelledby="architecture-title" className="text-foreground">
      <FadeIn>
        <figcaption
          id="architecture-title"
          className="mb-10 max-w-2xl text-sm leading-relaxed text-muted-foreground"
        >
          Two independently deployable services, one shared product context.
          Realtime stays responsive without forcing long-lived connections into
          the web process.
        </figcaption>
      </FadeIn>

      <TraceSequence className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
        <TraceNode className="border-t border-border pt-4">
          <span className="mb-5 block size-2 rounded-full bg-sameward-ink" />
          <p className="text-xl font-bold">Next.js web</p>
          <p className="mt-1 text-sm text-muted-foreground">
            App Router · Route Handlers · RTK Query
          </p>
        </TraceNode>
        <TraceNode className="border-t border-border pt-4">
          <span className="mb-5 block size-2 rounded-full bg-sameward-ink" />
          <p className="text-xl font-bold">Socket.IO realtime</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Handshake auth · channel rooms · presence
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
            Railway · sameward.com · Web + realtime deploys
          </p>
        </FadeIn>
      </div>
    </figure>
  )
}

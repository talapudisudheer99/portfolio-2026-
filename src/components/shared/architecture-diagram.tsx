const services = [
  ["MongoDB", "Multi-tenant workspaces"],
  ["AWS S3", "Presigned uploads"],
  ["Resend", "Transactional email"],
  ["OpenAI", "Grounded Channel AI"],
] as const

export function ArchitectureDiagram() {
  return (
    <figure aria-labelledby="architecture-title" className="text-foreground">
      <figcaption
        id="architecture-title"
        className="mb-10 max-w-2xl text-sm leading-relaxed text-muted-foreground"
      >
        Two independently deployable services, one shared product context.
        Realtime stays responsive without forcing long-lived connections into
        the web process.
      </figcaption>

      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
        <div className="border-t border-border pt-4">
          <span className="mb-5 block size-2 rounded-full bg-sameward-ink" />
          <p className="text-xl font-bold">Next.js web</p>
          <p className="mt-1 text-sm text-muted-foreground">
            App Router · Route Handlers · RTK Query
          </p>
        </div>
        <div className="border-t border-border pt-4">
          <span className="mb-5 block size-2 rounded-full bg-sameward-ink" />
          <p className="text-xl font-bold">Socket.IO realtime</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Handshake auth · channel rooms · presence
          </p>
        </div>
      </div>

      <div className="my-12 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          Shared services
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(([label, detail], index) => (
          <div key={label}>
            <p className="font-mono text-[10px] tracking-[0.15em] text-sameward-ink uppercase">
              0{index + 1}
            </p>
            <p className="mt-3 font-bold">{label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>

      <p className="mt-12 border-t border-border pt-5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
        Railway · sameward.com · Web + realtime deploys
      </p>
    </figure>
  )
}

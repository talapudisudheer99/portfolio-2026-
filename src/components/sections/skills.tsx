import { FadeIn, TraceNode, TraceSequence } from "@/components/shared/motion"
import { ScrollEmergence } from "@/components/shared/parallax"
import { SectionHeader } from "@/components/shared/section-header"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { sections } from "@/data/sections"
import { skillGroups, workingRange } from "@/data/skills"
import { gap } from "@/lib/motion"

export function Skills() {
  const { skills } = sections

  return (
    <SectionWrapper
      id="skills"
      className="section-rule"
      railClassName="section-space"
    >
      <ScrollEmergence>
        <SectionHeader title={skills.title} description={skills.description} />
      </ScrollEmergence>

      {/* The interface-through-infrastructure span, before the detail below. */}
      <FadeIn className="mb-14">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="section-kicker text-muted-foreground">Working range</p>
          <p className="editorial-display text-lg leading-tight font-medium text-foreground">
            {workingRange.role}
          </p>
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {workingRange.layers.map((row) => (
            <div
              key={row.layer}
              className="group flex items-baseline justify-between gap-4 border-t border-border py-2.5"
            >
              <dt className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase transition-colors group-hover:text-primary">
                {row.layer}
              </dt>
              <dd className="text-right text-xs leading-snug font-semibold text-foreground">
                {row.detail}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {workingRange.note}
        </p>
      </FadeIn>

      <TraceSequence className="content-grid gap-y-10" gap={gap.nodes}>
        {skillGroups.map((group, index) => (
          <TraceNode
            key={group.id}
            className="col-span-12 sm:col-span-6 lg:col-span-4"
          >
            <section
              aria-labelledby={`capability-${group.id}`}
              className="border-t border-border pt-5"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3
                  id={`capability-${group.id}`}
                  className="text-base font-extrabold tracking-[-0.025em] text-foreground"
                >
                  {group.title}
                </h3>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground-secondary">
                {group.summary}
              </p>
              <p className="mt-5 font-mono text-[11px] leading-6 tracking-[0.03em] text-muted-foreground">
                {group.skills.join(" · ")}
              </p>
            </section>
          </TraceNode>
        ))}
      </TraceSequence>
    </SectionWrapper>
  )
}

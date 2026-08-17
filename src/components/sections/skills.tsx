import { FadeIn, TraceNode, TraceSequence } from "@/components/shared/motion"
import { SectionHeader } from "@/components/shared/section-header"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { sections } from "@/data/sections"
import { skillGroups } from "@/data/skills"
import { gap } from "@/lib/motion"

export function Skills() {
  const { skills } = sections

  return (
    <SectionWrapper
      id="skills"
      className="bg-background-secondary"
      railClassName="section-space"
    >
      <FadeIn>
        <p className="section-kicker mb-8 text-primary">02 · Capabilities</p>
      </FadeIn>
      <SectionHeader title={skills.title} description={skills.description} />

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

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

      <TraceSequence className="content-grid gap-y-12" gap={gap.nodes}>
        {skillGroups.map((group, index) => (
          <TraceNode
            key={group.id}
            className="col-span-12 sm:col-span-6 lg:col-span-4"
          >
            <section aria-labelledby={`capability-${group.id}`}>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3
                  id={`capability-${group.id}`}
                  className="text-sm font-extrabold tracking-[-0.02em] text-foreground"
                >
                  {group.title}
                </h3>
              </div>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                {group.skills.join(" · ")}
              </p>
            </section>
          </TraceNode>
        ))}
      </TraceSequence>
    </SectionWrapper>
  )
}

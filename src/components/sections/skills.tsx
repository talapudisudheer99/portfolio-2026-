import { FadeIn } from "@/components/shared/motion"
import { SectionHeader } from "@/components/shared/section-header"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { sections } from "@/data/sections"
import { skillGroups } from "@/data/skills"

export function Skills() {
  const { skills } = sections

  return (
    <SectionWrapper
      id="skills"
      className="bg-background-secondary"
      railClassName="section-space"
    >
      <p className="mb-8 font-mono text-[10px] tracking-[0.18em] text-primary uppercase">
        02 · Capabilities
      </p>
      <SectionHeader title={skills.title} description={skills.description} />

      <FadeIn>
        <div className="content-grid gap-y-12">
          {skillGroups.map((group, index) => (
            <section
              key={group.id}
              aria-labelledby={`capability-${group.id}`}
              className="col-span-12 sm:col-span-6 lg:col-span-4"
            >
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
          ))}
        </div>
      </FadeIn>
    </SectionWrapper>
  )
}

import { MotionCard, StaggerContainer, StaggerItem } from "@/components/shared/motion"
import { SectionHeader } from "@/components/shared/section-header"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Badge } from "@/components/ui/badge"
import { sections } from "@/data/sections"
import { skillGroups } from "@/data/skills"

export function Skills() {
  const { skills } = sections

  return (
    <SectionWrapper id="skills">
      <SectionHeader title={skills.title} description={skills.description} />

      <StaggerContainer className="grid gap-6 md:grid-cols-2">
        {skillGroups.map((group) => (
          <StaggerItem key={group.id}>
            <MotionCard className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold text-foreground">
                {group.title}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="h-8 rounded-full px-3 text-[13px] font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </MotionCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  )
}

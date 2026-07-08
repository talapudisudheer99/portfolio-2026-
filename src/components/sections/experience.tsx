import { ExperienceCard } from "@/components/shared/experience-card"
import { StaggerContainer, StaggerItem } from "@/components/shared/motion"
import { SectionHeader } from "@/components/shared/section-header"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { experience } from "@/data/experience"
import { sections } from "@/data/sections"

export function Experience() {
  const { experience: experienceSection } = sections

  return (
    <SectionWrapper id="experience" className="bg-background-secondary/50">
      <SectionHeader
        title={experienceSection.title}
        description={experienceSection.description}
      />

      <StaggerContainer className="relative space-y-6">
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-4 hidden w-px bg-gradient-to-b from-primary/40 via-border to-transparent md:block"
        />
        {experience.map((item) => (
          <StaggerItem key={item.id} className="relative md:pl-10">
            <span
              aria-hidden="true"
              className="absolute top-8 left-[13px] hidden size-2.5 rounded-full border-2 border-primary bg-background md:block"
            />
            <ExperienceCard experience={item} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  )
}

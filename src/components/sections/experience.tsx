import { ExperienceCard } from "@/components/shared/experience-card"
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

      <div className="space-y-6">
        {experience.map((item) => (
          <ExperienceCard key={item.id} experience={item} />
        ))}
      </div>
    </SectionWrapper>
  )
}

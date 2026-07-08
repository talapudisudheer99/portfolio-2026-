import { StaggerContainer, StaggerItem } from "@/components/shared/motion"
import { ProjectCard } from "@/components/shared/project-card"
import { SectionHeader } from "@/components/shared/section-header"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { projects } from "@/data/projects"
import { sections } from "@/data/sections"

export function Projects() {
  const { projects: projectsSection } = sections

  return (
    <SectionWrapper id="projects">
      <SectionHeader
        title={projectsSection.title}
        description={projectsSection.description}
      />

      <StaggerContainer className="grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <StaggerItem key={project.id} className="h-full">
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  )
}

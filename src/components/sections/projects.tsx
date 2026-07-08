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

      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </SectionWrapper>
  )
}

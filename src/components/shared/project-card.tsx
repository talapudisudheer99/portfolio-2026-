import { ExternalLink } from "lucide-react"

import { GitHubIcon } from "@/components/shared/brand-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { projectActions } from "@/data/sections"
import type { Project } from "@/types"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex h-full flex-col rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          {project.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="h-8 rounded-full px-3 text-[13px] font-medium"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      {(project.liveUrl || project.githubUrl) && (
        <CardFooter className="gap-3 border-t border-border/60 bg-transparent">
          {project.liveUrl ? (
            <Button
              variant="default"
              size="sm"
              className="h-10 rounded-[10px] px-4"
              render={
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              {projectActions.liveDemo}
            </Button>
          ) : null}
          {project.githubUrl ? (
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-[10px] px-4"
              render={
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
            >
              <GitHubIcon className="size-4" aria-hidden="true" />
              {projectActions.github}
            </Button>
          ) : null}
        </CardFooter>
      )}
    </Card>
  )
}

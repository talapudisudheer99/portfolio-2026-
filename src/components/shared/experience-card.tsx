import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Experience } from "@/types"

interface ExperienceCardProps {
  experience: Experience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="gap-2 border-b border-border/60 pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {experience.role}
            </CardTitle>
            <p className="mt-1 text-sm font-medium text-primary">
              {experience.company}
            </p>
          </div>
          <p className="shrink-0 text-sm text-muted-foreground">
            {experience.period}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          {experience.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

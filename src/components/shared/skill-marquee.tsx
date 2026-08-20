"use client"

import { marqueeSkills } from "@/data/skills"

/**
 * One readable ticker. Skills live here only — not as a giant background field.
 */
export function SkillMarquee({
  duration = 90,
  className,
}: Readonly<{ duration?: number; className?: string }>) {
  const track = [...marqueeSkills, ...marqueeSkills]

  return (
    <div className={className}>
      <p className="sr-only">Working stack: {marqueeSkills.join(", ")}</p>
      <div className="skill-marquee" aria-hidden="true">
        <div
          className="skill-marquee-track"
          style={{ animationDuration: `${duration}s` }}
        >
          {track.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="flex shrink-0 items-center gap-6 pl-6"
            >
              <span className="type-meta text-foreground">
                {skill}
              </span>
              <span className="text-primary">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

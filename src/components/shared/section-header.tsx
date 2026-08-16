"use client"

import { FadeIn } from "@/components/shared/motion"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
  align?: "left" | "center"
}

export function SectionHeader({
  title,
  description,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <FadeIn
      className={cn(
        "mb-12 grid gap-5 md:mb-16 md:grid-cols-12",
        align === "center" && "text-center",
        className
      )}
    >
      <h2
        className={cn(
          "editorial-display text-[clamp(3rem,7vw,6.75rem)] leading-[0.88] font-medium text-foreground md:col-span-7",
          align === "center" && "md:col-span-12"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "max-w-md self-end text-sm leading-relaxed text-muted-foreground md:col-span-4 md:col-start-9 md:text-base",
            align === "center" && "mx-auto md:col-span-8 md:col-start-3"
          )}
        >
          {description}
        </p>
      ) : null}
    </FadeIn>
  )
}

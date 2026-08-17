"use client"

import { FadeIn, MaskedLine } from "@/components/shared/motion"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
  align?: "left" | "center"
}

/** No outer FadeIn — callers own labels; title uses a masked line. */
export function SectionHeader({
  title,
  description,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 grid gap-5 md:mb-16 md:grid-cols-12",
        align === "center" && "text-center",
        className
      )}
    >
      <MaskedLine
        display
        className={cn("md:col-span-7", align === "center" && "md:col-span-12")}
      >
        <h2 className="editorial-display text-[clamp(3rem,7vw,6.75rem)] leading-[0.88] font-medium text-foreground">
          {title}
        </h2>
      </MaskedLine>
      {description ? (
        <FadeIn
          delay={0.1}
          className={cn(
            "max-w-md self-end md:col-span-4 md:col-start-9",
            align === "center" && "mx-auto md:col-span-8 md:col-start-3"
          )}
        >
          <p
            className={cn(
              "text-sm leading-relaxed text-muted-foreground md:text-base",
              align === "center" && "text-center"
            )}
          >
            {description}
          </p>
        </FadeIn>
      ) : null}
    </div>
  )
}

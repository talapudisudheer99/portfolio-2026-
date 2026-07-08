import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface SectionWrapperProps {
  id?: string
  children: ReactNode
  className?: string
}

export function SectionWrapper({ id, children, className }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8",
        className
      )}
    >
      {children}
    </section>
  )
}

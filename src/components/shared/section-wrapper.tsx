import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface SectionShellProps {
  id?: string
  children: ReactNode
  className?: string
}

export function SectionShell({ id, children, className }: SectionShellProps) {
  return (
    <section id={id} className={cn("relative w-full", className)}>
      {children}
    </section>
  )
}

interface ContentRailProps {
  children: ReactNode
  className?: string
}

export function ContentRail({ children, className }: ContentRailProps) {
  return <div className={cn("content-rail", className)}>{children}</div>
}

interface SectionWrapperProps extends SectionShellProps {
  railClassName?: string
}

/** Convenience wrapper for standard editorial sections. */
export function SectionWrapper({
  id,
  children,
  className,
  railClassName,
}: SectionWrapperProps) {
  return (
    <SectionShell id={id} className={className}>
      <ContentRail className={cn("section-space", railClassName)}>
        {children}
      </ContentRail>
    </SectionShell>
  )
}

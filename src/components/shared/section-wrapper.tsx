import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react"

import { cn } from "@/lib/utils"

interface SectionShellProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode
  ref?: Ref<HTMLElement>
}

export function SectionShell({
  children,
  className,
  ref,
  ...props
}: SectionShellProps) {
  return (
    <section ref={ref} className={cn("relative w-full", className)} {...props}>
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
  children,
  className,
  railClassName,
  ...props
}: SectionWrapperProps) {
  return (
    <SectionShell className={className} {...props}>
      <ContentRail className={cn("section-space", railClassName)}>
        {children}
      </ContentRail>
    </SectionShell>
  )
}

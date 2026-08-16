import { Mail, Phone } from "lucide-react"

import { GitHubIcon, LinkedInIcon } from "@/components/shared/brand-icons"
import type { SocialLink } from "@/types"
import { cn } from "@/lib/utils"

const iconMap = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  email: Mail,
  phone: Phone,
} as const

interface SocialLinksProps {
  links: SocialLink[]
  className?: string
  iconSize?: "sm" | "md"
  compact?: boolean
}

export function SocialLinks({
  links,
  className,
  iconSize = "md",
  compact = false,
}: SocialLinksProps) {
  const iconClassName = iconSize === "sm" ? "size-4" : "size-5"

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {links.map((link) => {
        const Icon = iconMap[link.icon]

        return (
          <a
            key={link.href}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={
              link.href.startsWith("http") ? "noopener noreferrer" : undefined
            }
            aria-label={link.label}
            className={cn(
              "inline-flex items-center justify-center text-muted-foreground transition-colors duration-200 ease-out hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              compact
                ? "size-7"
                : "size-10 rounded-full border border-border hover:border-primary/40"
            )}
          >
            <Icon className={iconClassName} aria-hidden="true" />
          </a>
        )
      })}
    </div>
  )
}

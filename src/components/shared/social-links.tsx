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
}

export function SocialLinks({
  links,
  className,
  iconSize = "md",
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
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={link.label}
            className="inline-flex size-10 items-center justify-center rounded-[10px] border border-border text-muted-foreground transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/30 hover:text-foreground hover:shadow-md"
          >
            <Icon className={iconClassName} aria-hidden="true" />
          </a>
        )
      })}
    </div>
  )
}

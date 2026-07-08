import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ResumeConfig } from "@/types"
import { cn } from "@/lib/utils"

interface ResumeButtonProps {
  resume: ResumeConfig
  className?: string
  size?: "default" | "sm" | "lg"
}

export function ResumeButton({
  resume,
  className,
  size = "default",
}: ResumeButtonProps) {
  return (
    <Button
      size={size}
      className={cn(
        "h-11 rounded-[10px] px-5 text-sm font-medium tracking-tight",
        className
      )}
      render={
        <a href={resume.href} target="_blank" rel="noopener noreferrer" />
      }
      nativeButton={false}
    >
      <Download className="size-4" aria-hidden="true" />
      {resume.label}
    </Button>
  )
}

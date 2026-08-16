import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { ContentRail, SectionShell } from "@/components/shared/section-wrapper"
import { SocialLinks } from "@/components/shared/social-links"
import { siteConfig } from "@/data/site"

export function Hero() {
  const { hero } = siteConfig
  const [statement, counterpoint] = hero.greeting.split(". ")

  return (
    <SectionShell id="hero" className="overflow-hidden">
      <ContentRail className="flex min-h-[calc(100svh-4.5rem)] flex-col border-x border-border/60">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase sm:text-xs">
            {hero.badge}
          </p>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Selected work
            <ArrowDownRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <div className="content-grid flex-1 items-center px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <h1 className="col-span-12 max-w-[11ch] text-[clamp(3.9rem,10.5vw,9.5rem)] leading-[0.82] font-semibold tracking-[-0.075em] text-foreground">
            {statement}.
            <span className="editorial-display mt-2 block font-medium text-primary italic">
              {counterpoint}
            </span>
          </h1>
        </div>

        <div className="content-grid gap-y-8 border-t border-border/60 px-4 py-7 sm:px-6 lg:px-8">
          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              Focus
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {hero.role}
            </p>
          </div>

          <p className="col-span-12 max-w-xl text-sm leading-relaxed text-muted-foreground md:col-span-5 md:text-base">
            {hero.tagline}
          </p>

          <div className="col-span-12 flex flex-col gap-4 md:col-span-4 md:items-end">
            <div className="flex flex-wrap gap-x-5 gap-y-3">
              {hero.ctas.map((cta) => {
                const external = cta.external ?? cta.href.startsWith("http")
                const primary = cta.variant === "primary"

                return (
                  <a
                    key={cta.href}
                    href={cta.href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={
                      primary
                        ? "group inline-flex items-center gap-2 border-b border-primary pb-1 text-sm font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                        : "group inline-flex items-center gap-2 border-b border-border pb-1 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    }
                  >
                    {cta.label}
                    <ArrowUpRight
                      className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                )
              })}
            </div>
            <SocialLinks links={siteConfig.socialLinks} compact />
          </div>
        </div>
      </ContentRail>
    </SectionShell>
  )
}

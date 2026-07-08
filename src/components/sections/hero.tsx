"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  HeroBackground,
  HeroItem,
  HeroStagger,
} from "@/components/shared/hero-effects"
import { ResumeButton } from "@/components/shared/resume-button"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { SocialLinks } from "@/components/shared/social-links"
import { siteConfig } from "@/data/site"

export function Hero() {
  const { hero } = siteConfig

  return (
    <SectionWrapper
      id="hero"
      className="relative overflow-hidden pb-20 pt-12 md:pb-28 md:pt-20"
    >
      <HeroBackground />

      <HeroStagger className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <HeroItem>
          <Badge
            variant="secondary"
            className="mb-6 h-8 rounded-full border border-border bg-background-secondary px-4 text-[13px] font-medium tracking-wide uppercase"
          >
            {hero.badge}
          </Badge>
        </HeroItem>

        <HeroItem>
          <h1 className="text-[2.5rem] font-bold tracking-[-0.04em] text-foreground md:text-[3.5rem] md:leading-[1.05] lg:text-[4rem]">
            {hero.greeting}
          </h1>
        </HeroItem>

        <HeroItem>
          <p className="mt-4 text-lg font-medium tracking-tight text-primary md:text-xl">
            {hero.role}
          </p>
        </HeroItem>

        <HeroItem>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg md:leading-[1.7]">
            {hero.tagline}
          </p>
        </HeroItem>

        <HeroItem className="mt-10 w-full">
          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
            {hero.ctas.map((cta) => {
              if (cta.variant === "primary") {
                return (
                  <ResumeButton
                    key={cta.href}
                    resume={{ label: cta.label, href: cta.href }}
                    size="lg"
                  />
                )
              }

              const isExternal = cta.external ?? cta.href.startsWith("http")

              return (
                <Button
                  key={cta.href}
                  variant={cta.variant === "outline" ? "outline" : "ghost"}
                  size="lg"
                  className="h-11 rounded-[10px] px-5 text-sm font-medium"
                  render={
                    <a
                      href={cta.href}
                      {...(isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    />
                  }
                  nativeButton={false}
                >
                  {cta.label}
                </Button>
              )
            })}
          </div>
        </HeroItem>

        <HeroItem>
          <SocialLinks
            links={siteConfig.socialLinks}
            className="mt-6 justify-center"
          />
        </HeroItem>
      </HeroStagger>
    </SectionWrapper>
  )
}

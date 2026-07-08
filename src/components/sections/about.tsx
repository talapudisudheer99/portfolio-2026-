import { FadeIn, MotionCard, StaggerContainer, StaggerItem } from "@/components/shared/motion"
import { SectionHeader } from "@/components/shared/section-header"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { aboutContent } from "@/data/about"

export function About() {
  const { section, paragraphs, highlights } = aboutContent

  return (
    <SectionWrapper id="about" className="bg-background-secondary/50">
      <SectionHeader title={section.title} description={section.description} />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
        <FadeIn delay={0.1}>
          <div className="space-y-5">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-relaxed text-muted-foreground md:text-lg md:leading-[1.7]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2">
          {highlights.map((item) => (
            <StaggerItem key={item.label}>
              <MotionCard className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {item.value}
                </p>
              </MotionCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </SectionWrapper>
  )
}

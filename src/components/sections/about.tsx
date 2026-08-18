import {
  FadeIn,
  MaskedLine,
  TraceNode,
  TraceRule,
  TraceSequence,
} from "@/components/shared/motion"
import { ParallaxLayer, ScrollEmergence } from "@/components/shared/parallax"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { aboutContent } from "@/data/about"
import { gap, parallax } from "@/lib/motion"

export function About() {
  const { section, paragraphs, highlights } = aboutContent

  return (
    <SectionWrapper id="about" className="section-ink min-h-svh">
      <div className="content-grid gap-y-12">
        <ScrollEmergence className="col-span-12 md:col-span-9">
          <ParallaxLayer speed={parallax.mid}>
            <MaskedLine display>
              <h2 className="editorial-display max-w-[11ch] text-[clamp(3.5rem,7.5vw,7rem)] leading-[0.88] font-medium text-background">
                {section.title}
                <span className="text-primary-inverted">.</span>
              </h2>
            </MaskedLine>
          </ParallaxLayer>
          <FadeIn delay={0.12}>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-background/65 md:text-base">
              {section.description}
            </p>
          </FadeIn>
        </ScrollEmergence>

        <div className="col-span-12 mt-6 md:col-span-9 md:col-start-4">
          <TraceRule className="mb-8 bg-background/20" />
          <div className="grid gap-8 md:grid-cols-2">
            <TraceSequence className="space-y-5" gap={gap.facts}>
              {paragraphs.map((paragraph) => (
                <TraceNode key={paragraph}>
                  <p className="text-sm leading-relaxed text-background/70 md:text-base">
                    {paragraph}
                  </p>
                </TraceNode>
              ))}
            </TraceSequence>

            <TraceSequence
              as="dl"
              className="grid grid-cols-2 gap-x-6 gap-y-8 self-start"
              gap={gap.facts}
              delayChildren={0.1}
            >
              {highlights.map((item) => (
                <TraceNode key={item.label}>
                  <dt className="font-mono text-[9px] tracking-[0.16em] text-background/45 uppercase">
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-sm font-bold text-background">
                    {item.value}
                  </dd>
                </TraceNode>
              ))}
            </TraceSequence>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

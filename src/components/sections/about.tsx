import { FadeIn } from "@/components/shared/motion"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { aboutContent } from "@/data/about"

export function About() {
  const { section, paragraphs, highlights } = aboutContent

  return (
    <SectionWrapper id="about" className="bg-foreground text-background">
      <div className="content-grid gap-y-12">
        <div className="col-span-12 md:col-span-3">
          <p className="font-mono text-[10px] tracking-[0.18em] text-primary uppercase">
            04 · Profile
          </p>
        </div>

        <FadeIn className="col-span-12 md:col-span-9">
          <h2 className="editorial-display max-w-[11ch] text-[clamp(3.5rem,7.5vw,7rem)] leading-[0.88] font-medium text-background">
            {section.title}
            <span className="text-primary">.</span>
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-background/65 md:text-base">
            {section.description}
          </p>
        </FadeIn>

        <div className="col-span-12 mt-6 grid gap-8 border-t border-background/20 pt-8 md:col-span-9 md:col-start-4 md:grid-cols-2">
          <div className="space-y-5">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-sm leading-relaxed text-background/70 md:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 self-start">
            {highlights.map((item) => (
              <div key={item.label}>
                <dt className="font-mono text-[9px] tracking-[0.16em] text-background/45 uppercase">
                  {item.label}
                </dt>
                <dd className="mt-2 text-sm font-bold text-background">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </SectionWrapper>
  )
}

import { FadeIn } from "@/components/shared/motion"
import { SectionHeader } from "@/components/shared/section-header"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { experience } from "@/data/experience"
import { sections } from "@/data/sections"

export function Experience() {
  const { experience: content } = sections

  return (
    <SectionWrapper id="experience" className="section-rule">
      <p className="mb-8 font-mono text-[10px] tracking-[0.18em] text-primary uppercase">
        03 · Experience
      </p>
      <SectionHeader title={content.title} description={content.description} />

      <FadeIn>
        <ol className="border-t border-border">
          {experience.map((item, index) => (
            <li
              key={item.id}
              className="content-grid gap-y-5 border-b border-border py-8 md:py-10"
            >
              <div className="col-span-12 md:col-span-3">
                <p className="font-mono text-[10px] text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-sm font-bold text-foreground">
                  {item.company}
                </p>
                <p className="mt-1 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                  {item.period}
                </p>
              </div>

              <div className="col-span-12 md:col-span-4">
                <h3 className="text-xl font-extrabold tracking-[-0.035em] text-foreground md:text-2xl">
                  {item.role}
                </h3>
              </div>

              <ul className="col-span-12 space-y-3 md:col-span-5">
                {item.bullets.slice(0, 3).map((bullet) => (
                  <li
                    key={bullet}
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </FadeIn>
    </SectionWrapper>
  )
}

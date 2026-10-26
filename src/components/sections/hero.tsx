import { ArrowUpRight, Download, ExternalLink } from "lucide-react"
import type { CSSProperties } from "react"

import { MotionParallax } from "@/components/motion/parallax-layer"
import { siteConfig } from "@/data/site"

type IndexStyle = CSSProperties & { "--i": number }

interface WordsProps {
  text: string
  /** Global word index the stagger starts from */
  start: number
  accent?: boolean
}

/**
 * Words animate in with pure CSS (`--i` drives the stagger), so the hero
 * starts revealing on first paint — it never waits for JS, WebGL or images.
 * Opacity lives on `.hero-word`; the gradient clip stays on the inner fill
 * (clip + opacity on one node does not fade in WebKit).
 */
function Words({ text, start, accent = false }: WordsProps) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`}>
          {i > 0 ? " " : null}
          <span className="hero-word" style={{ "--i": start + i } as IndexStyle}>
            <span className={accent ? "hero-accent-word" : "hero-word-inner"}>
              {word}
            </span>
          </span>
        </span>
      ))}
    </>
  )
}

const countWords = (text: string) => text.split(" ").length

export function Hero() {
  const { hero } = siteConfig
  const taglineLines =
    typeof hero.tagline === "string" ? [hero.tagline] : hero.tagline

  // Headline words, counted so every word gets its own stagger slot.
  const line1a = "I built"
  const line1b = "Sameward"
  const line2 = "a live product system,"
  const line3 = "end to end."
  const i1b = countWords(line1a)
  const i2 = i1b + countWords(line1b)
  const i3 = i2 + countWords(line2)

  const taglineStarts = taglineLines.map((_, i) =>
    taglineLines.slice(0, i).reduce((sum, line) => sum + countWords(line), 0)
  )

  return (
    <section id="hero" className="hero-editorial">
      <div className="hero-content" data-h-content="">
        {hero.kicker ? (
          <p data-h-kicker="" className="hero-kicker hero-enter hero-enter--kicker">
            <span className="hero-kicker-dot" aria-hidden="true" />
            {hero.kicker}
          </p>
        ) : null}

        <h1 className="hero-headline">
          <span className="hero-line">
            <Words text={line1a} start={0} />{" "}
            <span data-accent="">
              <Words text={line1b} start={i1b} accent />
            </span>
          </span>
          <span className="hero-line">
            <Words text={line2} start={i2} />
          </span>
          <span className="hero-line">
            <Words text={line3} start={i3} />
          </span>
        </h1>

        <p data-h-tagline="" className="hero-tagline">
          {taglineLines.map((line, i) => (
            <span key={line} className="hero-tagline-line">
              {i > 0 ? <br /> : null}
              <Words text={line} start={taglineStarts[i] ?? 0} />
            </span>
          ))}
        </p>

        <div data-h-status="" className="hero-status hero-enter hero-enter--status">
          <span className="hero-status-dot" />
          {hero.availabilityHref?.startsWith("http") ? (
            <a
              href={hero.availabilityHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-status-text"
            >
              {hero.availability}
              <ExternalLink className="ml-1.5 inline size-3.5" aria-hidden="true" />
            </a>
          ) : (
            <a href={hero.availabilityHref ?? "#contact"} className="hero-status-text">
              {hero.availability}
            </a>
          )}
        </div>

        <div className="hero-actions">
          {hero.ctas.map((cta, i) => {
            const Icon = cta.variant === "primary" ? ArrowUpRight : Download
            return (
              <a
                key={cta.label}
                data-h-cta=""
                data-cursor={cta.variant === "primary" ? "View" : "Download"}
                href={cta.href}
                target={cta.external ? "_blank" : undefined}
                rel={cta.external ? "noopener noreferrer" : undefined}
                style={{ "--i": i } as IndexStyle}
                className={
                  cta.variant === "primary"
                    ? "hero-btn hero-btn--primary hero-enter hero-enter--cta"
                    : "hero-btn hero-btn--ghost hero-enter hero-enter--cta"
                }
              >
                {cta.label}
                <Icon className="size-4" aria-hidden="true" />
              </a>
            )
          })}
        </div>
      </div>

      <MotionParallax
        strength="decoration"
        className="hero-scroll-cue hero-enter hero-enter--cue"
        aria-hidden="true"
      >
        <div data-h-cue="" className="hero-scroll-line" />
      </MotionParallax>
    </section>
  )
}

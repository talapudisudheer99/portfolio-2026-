"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface HudWordRevealProps {
  lines: string[]
  className?: string
  accentWords?: string[]
}

function isAccentWord(word: string, accentWords: string[]) {
  const bare = word.replace(/[^a-zA-Z0-9]/g, "")
  return accentWords.some(
    (accent) =>
      bare.toLowerCase() === accent.toLowerCase() ||
      bare.toLowerCase().startsWith(accent.toLowerCase())
  )
}

/**
 * Space-ops readout: words tick in once, left-to-right.
 * Not scroll-scrubbed — that fought Lenis and felt like the line could not decide.
 */
export function HudWordReveal({
  lines,
  className,
  accentWords = ["Sameward", "context", "AI", "workspace"],
}: Readonly<HudWordRevealProps>) {
  const ref = useRef<HTMLDivElement>(null)
  const still = useHydratedReducedMotion()

  useGSAP(
    () => {
      const root = ref.current
      if (!root || still) return

      const words = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".hud-word")
      )
      const caret = root.querySelector<HTMLElement>(".hud-caret")
      if (!words.length) return

      gsap.set(words, { opacity: 0.12 })
      if (caret) gsap.set(caret, { autoAlpha: 1 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 84%",
          once: true,
          toggleActions: "play none none none",
        },
      })

      tl.to(words, {
        opacity: 1,
        duration: 0.04,
        ease: "steps(1)",
        stagger: 0.038,
      })

      if (caret) {
        tl.to(caret, { autoAlpha: 0, duration: 0.2, ease: "none" }, "+=0.35")
      }
    },
    { scope: ref, dependencies: [still], revertOnUpdate: true }
  )

  return (
    <div ref={ref} className={cn("hud-readout", className)}>
      {lines.map((line, lineIndex) => {
        const words = line.split(" ")
        const isResolution = lineIndex === lines.length - 1

        return (
          <p
            key={line}
            className={
              isResolution
                ? "projects-problem-line projects-problem-line--resolution editorial-display"
                : "projects-problem-line editorial-display"
            }
          >
            {words.map((word, wordIndex) => (
              <span key={`${word}-${wordIndex}`}>
                {wordIndex > 0 ? " " : null}
                <span
                  className={cn(
                    "hud-word",
                    isAccentWord(word, accentWords) && "hud-word--accent"
                  )}
                >
                  {word}
                </span>
              </span>
            ))}
            {isResolution ? (
              <span className="hud-caret" aria-hidden="true" />
            ) : null}
          </p>
        )
      })}
    </div>
  )
}

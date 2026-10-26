"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"

import { FeaturedWorkMobileStage } from "@/components/sections/featured-work-mobile-stage"
import { FeaturedWorkTabletStage } from "@/components/sections/featured-work-tablet-stage"
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import { parallax } from "@/lib/motion"

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Sameward showcase — glass window rises out of depth with scroll, floating
 * AI cards fly in from nearer depths; then light parallax + pointer depth.
 */
export function FeaturedWorkStage() {
  const still = useHydratedReducedMotion()
  const stillRef = useRef(still)
  useEffect(() => {
    stillRef.current = still
  }, [still])

  const root = useRef<HTMLElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const enterRef = useRef<HTMLDivElement>(null)

  useGSAP(
    (_ctx, contextSafe) => {
      const section = root.current
      const stage = parallaxRef.current
      const enter = enterRef.current
      if (!section || !enter || !contextSafe) return

      if (stillRef.current) {
        if (stage) {
          gsap.set(stage, { y: 0, clearProps: "transform" })
        }
        gsap.set(enter, { autoAlpha: 1, clearProps: "transform" })
        return
      }

      const mmEnter = gsap.matchMedia()

      // Phone mock (below lg) — soft rise, scrubbed
      mmEnter.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          enter,
          { autoAlpha: 0.2, y: 48, scale: 0.94, transformOrigin: "50% 90%" },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 95%",
              end: "top 45%",
              scrub: true,
            },
          }
        )
      })

      // Desktop (lg+) — the glass window rises out of depth and tilts up to
      // face you; then the Channel AI card and the drafted reply float in
      // from nearer depths, and the messages settle. Scrubbed 1:1.
      mmEnter.add("(min-width: 1024px)", () => {
        const q = (sel: string) => section.querySelector<HTMLElement>(sel)
        const win = q('[data-sw-layer="window"]')
        const ai = q('[data-sw-layer="ai"]')
        const draft = q('[data-sw-layer="draft"]')
        const aura = q(".sw-aura")
        const msgs = gsap.utils.toArray<HTMLElement>("[data-sw-msg]", section)
        if (!win) return

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top 15%",
            scrub: true,
          },
        })

        tl.fromTo(
          win,
          { rotateX: 32, y: 120, scale: 0.88, autoAlpha: 0.35, transformOrigin: "50% 100%" },
          { rotateX: 0, y: 0, scale: 1, autoAlpha: 1, ease: "power2.out", duration: 1 },
          0
        )
        if (aura) {
          tl.fromTo(aura, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.9 }, 0.1)
        }
        if (msgs.length) {
          tl.fromTo(
            msgs,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.25, ease: "power2.out" },
            0.45
          )
        }
        if (ai) {
          tl.fromTo(
            ai,
            { x: 90, y: 50, rotateY: -16, autoAlpha: 0 },
            { x: 0, y: 0, rotateY: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" },
            0.55
          )
        }
        if (draft) {
          tl.fromTo(
            draft,
            { x: -70, y: 60, rotateY: 14, autoAlpha: 0 },
            { x: 0, y: 0, rotateY: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" },
            0.7
          )
        }
      })

      const mm = gsap.matchMedia()
      if (stage) {
        mm.add("(min-width: 1024px)", () => {
          gsap.fromTo(
            stage,
            { y: parallax.stageLag * 0.45 },
            {
              y: -parallax.stageLag * 0.45,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 40%",
                end: "bottom top",
                scrub: true,
              },
            }
          )
        })
        mm.add("(max-width: 1023px)", () => {
          gsap.set(stage, { y: 0, clearProps: "transform" })
        })
      }

      // Pointer depth: the window tilts a little, floating cards move more
      // (they are nearer), so the shot reads as real 3D layers.
      const scene = section.querySelector<HTMLElement>(".sw-scene")
      const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches
      const desktopLayout = window.matchMedia("(min-width: 1024px)").matches
      let detachTilt: (() => void) | undefined

      if (scene && finePointer && desktopLayout) {
        const tilt = parallax.stageTilt
        const layers = [
          { el: scene.querySelector<HTMLElement>('[data-sw-layer="window"]'), depth: 1 },
          { el: scene.querySelector<HTMLElement>('[data-sw-layer="ai"]'), depth: 2.4 },
          { el: scene.querySelector<HTMLElement>('[data-sw-layer="draft"]'), depth: 2 },
        ]
        // Tilt the whole scene; translate layers by depth (separate props so
        // they never fight the scroll timeline's x/y on the same element).
        const rx = gsap.quickTo(scene, "rotationX", { duration: 0.6, ease: "power3.out" })
        const ry = gsap.quickTo(scene, "rotationY", { duration: 0.6, ease: "power3.out" })
        const movers = layers
          .filter((l): l is { el: HTMLElement; depth: number } => Boolean(l.el))
          .map(({ el, depth }) => ({
            depth,
            x: gsap.quickTo(el, "xPercent", { duration: 0.7, ease: "power3.out" }),
            y: gsap.quickTo(el, "yPercent", { duration: 0.7, ease: "power3.out" }),
          }))

        const onMove = contextSafe((e: PointerEvent) => {
          const rect = scene.getBoundingClientRect()
          const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
          const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
          ry(nx * tilt.rotateY)
          rx(-ny * tilt.rotateX)
          for (const m of movers) {
            m.x(nx * 0.6 * m.depth)
            m.y(ny * 0.6 * m.depth)
          }
        })
        const onLeave = contextSafe(() => {
          rx(0)
          ry(0)
          for (const m of movers) {
            m.x(0)
            m.y(0)
          }
        })

        section.addEventListener("pointermove", onMove)
        section.addEventListener("pointerleave", onLeave)
        detachTilt = () => {
          section.removeEventListener("pointermove", onMove)
          section.removeEventListener("pointerleave", onLeave)
          gsap.set(scene, { clearProps: "transform" })
        }
      }

      return () => {
        mmEnter.revert()
        mm.revert()
        detachTilt?.()
      }
    },
    { scope: root }
  )

  return (
    <section ref={root} aria-label="Featured work" className="fd-section">
      <div className="fd-bleed">
        <div
          ref={enterRef}
          className="fd-showcase-stages flex w-full max-w-full flex-col items-center"
        >
          <div className="fd-showcase-tablet hidden w-full max-w-full lg:block">
            <FeaturedWorkTabletStage parallaxRef={parallaxRef} />
          </div>
          <div className="fd-showcase-mobile flex w-full max-w-full justify-center lg:hidden">
            <FeaturedWorkMobileStage />
          </div>
        </div>
      </div>
    </section>
  )
}

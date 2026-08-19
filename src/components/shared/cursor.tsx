"use client"

import gsap from "gsap"
import { useEffect, useRef } from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"

export function CursorInteraction() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const still = useHydratedReducedMotion()

  useEffect(() => {
    if (still) return

    const isFine = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches
    if (!isFine) return

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 })
    gsap.set(label, { autoAlpha: 0, scale: 0.8 })

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" })
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" })
    const ringX = gsap.quickTo(ring, "x", {
      duration: 0.38,
      ease: "power3.out",
    })
    const ringY = gsap.quickTo(ring, "y", {
      duration: 0.38,
      ease: "power3.out",
    })

    let currentLabel = ""

    function onMove(e: PointerEvent) {
      const { clientX: x, clientY: y } = e
      dotX(x)
      dotY(y)
      ringX(x)
      ringY(y)
      gsap.set([dot, ring], { autoAlpha: 1 })

      const target = e.target
      if (!(target instanceof Element)) return

      const interactive = target.closest("a, button, [data-cursor]")
      const hovering = Boolean(interactive)
      const newLabel =
        (interactive instanceof HTMLElement ? interactive.dataset.cursor : null) ?? ""

      gsap.to(ring, {
        scale: hovering ? 2.4 : 1,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      })

      if (newLabel !== currentLabel) {
        currentLabel = newLabel
        if (newLabel && label) {
          label.textContent = newLabel
          gsap.to(label, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.2,
            ease: "power3.out",
          })
        } else {
          gsap.to(label, {
            autoAlpha: 0,
            scale: 0.8,
            duration: 0.15,
            ease: "power3.out",
          })
        }
      }
    }

    function onLeave() {
      gsap.set([dot, ring], { autoAlpha: 0 })
      gsap.set(label, { autoAlpha: 0 })
      currentLabel = ""
    }

    document.documentElement.classList.add("cursor-live")
    document.addEventListener("pointermove", onMove)
    document.addEventListener("pointerleave", onLeave)

    return () => {
      document.documentElement.classList.remove("cursor-live")
      document.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
    }
  }, [still])

  if (still) return null

  return (
    <>
      <div ref={dotRef} className="global-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="global-cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="global-cursor-label" />
      </div>
    </>
  )
}

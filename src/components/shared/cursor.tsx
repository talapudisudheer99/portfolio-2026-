"use client"

import gsap from "gsap"
import { useEffect, useRef, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"

import { useHydratedReducedMotion } from "@/components/shared/motion"
import { duration, ease } from "@/lib/motion"

/**
 * Phase 08 Task 5 — desktop custom cursor: small dot + ring + soft light.
 * No mobile. No reduced-motion. Refs only — no React state on pointermove.
 */
export function CursorInteraction() {
  const lightRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const still = useHydratedReducedMotion()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  useEffect(() => {
    if (still || !mounted) return

    const isFine = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches
    if (!isFine) return

    const lightNode = lightRef.current as HTMLDivElement | null
    const ringNode = ringRef.current as HTMLDivElement | null
    const dotNode = dotRef.current as HTMLDivElement | null
    if (!lightNode || !ringNode || !dotNode) return

    const lightEl: HTMLDivElement = lightNode
    const ringEl: HTMLDivElement = ringNode
    const dotEl: HTMLDivElement = dotNode

    const root = document.documentElement
    root.classList.add("cursor-live")

    gsap.set([lightEl, ringEl, dotEl], {
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
    })

    const lightX = gsap.quickTo(lightEl, "x", {
      duration: 0.55,
      ease: "power3.out",
    })
    const lightY = gsap.quickTo(lightEl, "y", {
      duration: 0.55,
      ease: "power3.out",
    })
    const ringX = gsap.quickTo(ringEl, "x", {
      duration: 0.22,
      ease: "power3.out",
    })
    const ringY = gsap.quickTo(ringEl, "y", {
      duration: 0.22,
      ease: "power3.out",
    })
    const dotX = gsap.quickTo(dotEl, "x", { duration: 0.08, ease: "power3.out" })
    const dotY = gsap.quickTo(dotEl, "y", { duration: 0.08, ease: "power3.out" })

    let hovering = false
    let visible = false

    function setHoverState(next: boolean) {
      if (next === hovering) return
      hovering = next

      gsap.to(ringEl, {
        scale: next ? 1.55 : 1,
        opacity: next ? 0.9 : 0.55,
        duration: duration.ui,
        ease: ease.hover,
        overwrite: "auto",
      })
      gsap.to(dotEl, {
        scale: next ? 0.65 : 1,
        duration: duration.micro,
        ease: ease.hover,
        overwrite: "auto",
      })
      gsap.to(lightEl, {
        opacity: next ? 0.22 : 0.12,
        scale: next ? 1.15 : 1,
        duration: duration.ui,
        ease: ease.hover,
        overwrite: "auto",
      })

      ringEl.classList.toggle("is-hover", next)
      dotEl.classList.toggle("is-hover", next)
    }

    function showCursor(x: number, y: number) {
      lightX(x)
      lightY(y)
      ringX(x)
      ringY(y)
      dotX(x)
      dotY(y)

      if (!visible) {
        visible = true
        lightEl.classList.add("is-visible")
        ringEl.classList.add("is-visible")
        dotEl.classList.add("is-visible")
      }
    }

    function hideCursor() {
      if (!visible) return
      visible = false
      lightEl.classList.remove("is-visible")
      ringEl.classList.remove("is-visible")
      dotEl.classList.remove("is-visible")
      setHoverState(false)
    }

    function onMove(e: PointerEvent) {
      showCursor(e.clientX, e.clientY)

      const target = e.target
      if (!(target instanceof Element)) return

      const interactive = target.closest(
        "a, button, [role='button'], [data-cursor], input, textarea, select"
      )
      setHoverState(Boolean(interactive))
    }

    function onLeaveWindow(e: MouseEvent) {
      if (e.relatedTarget !== null) return
      hideCursor()
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    document.documentElement.addEventListener("mouseleave", onLeaveWindow)

    return () => {
      root.classList.remove("cursor-live")
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow)
      lightEl.classList.remove("is-visible", "is-hover")
      ringEl.classList.remove("is-visible", "is-hover")
      dotEl.classList.remove("is-visible", "is-hover")
    }
  }, [still, mounted])

  if (still || !mounted) return null

  return createPortal(
    <div className="global-cursor-root" aria-hidden="true">
      <div ref={lightRef} className="global-cursor-light" />
      <div ref={ringRef} className="global-cursor-ring" />
      <div ref={dotRef} className="global-cursor-dot" />
    </div>,
    document.body
  )
}

/** Alias for Phase 08 motion barrel */
export const GlobalCursor = CursorInteraction

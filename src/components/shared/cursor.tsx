"use client"

import gsap from "gsap"
import { useEffect, useRef, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"

import { useHydratedReducedMotion } from "@/components/shared/motion"
import { duration, ease } from "@/lib/motion"

/**
 * Desktop cursor — small stellar reticle (nebula bloom + orbit + star).
 * Labels from data-cursor. Off on mobile / reduced-motion.
 */
export function CursorInteraction() {
  const lightRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
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

    const lightNode = lightRef.current
    const pointerNode = pointerRef.current
    const orbitNode = orbitRef.current
    const labelNode = labelRef.current
    if (!lightNode || !pointerNode || !orbitNode || !labelNode) return

    const lightEl: HTMLDivElement = lightNode
    const pointerEl: HTMLDivElement = pointerNode
    const orbitEl: HTMLDivElement = orbitNode
    const labelEl: HTMLDivElement = labelNode

    const root = document.documentElement
    root.classList.add("cursor-live")

    gsap.set([lightEl, pointerEl, labelEl], {
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      scale: 1,
      transformOrigin: "50% 50%",
    })
    gsap.set(orbitEl, { rotation: 0, transformOrigin: "50% 50%" })
    gsap.set(labelEl, { yPercent: 0, autoAlpha: 0 })

    const lightX = gsap.quickTo(lightEl, "x", {
      duration: 0.55,
      ease: "power3.out",
    })
    const lightY = gsap.quickTo(lightEl, "y", {
      duration: 0.55,
      ease: "power3.out",
    })
    const pointerX = gsap.quickTo(pointerEl, "x", {
      duration: 0.12,
      ease: "power3.out",
    })
    const pointerY = gsap.quickTo(pointerEl, "y", {
      duration: 0.12,
      ease: "power3.out",
    })
    const labelX = gsap.quickTo(labelEl, "x", {
      duration: 0.28,
      ease: "power3.out",
    })
    const labelY = gsap.quickTo(labelEl, "y", {
      duration: 0.28,
      ease: "power3.out",
    })

    let hovering = false
    let visible = false
    let labelText = ""
    let orbitTween: gsap.core.Tween | null = null

    function setLabel(next: string) {
      if (next === labelText) return
      labelText = next
      if (next) {
        labelEl.textContent = next
        gsap.to(labelEl, {
          autoAlpha: 1,
          duration: duration.micro,
          ease: ease.hover,
          overwrite: "auto",
        })
      } else {
        gsap.to(labelEl, {
          autoAlpha: 0,
          duration: duration.micro,
          ease: ease.hover,
          overwrite: "auto",
        })
      }
    }

    function setHoverState(next: boolean, label = "") {
      const wasHovering = hovering
      hovering = next

      gsap.to(pointerEl, {
        scale: next ? 1.2 : 1,
        duration: duration.ui,
        ease: ease.hover,
        overwrite: "auto",
      })
      gsap.to(lightEl, {
        opacity: next ? 0.22 : 0.1,
        scale: next ? 1.15 : 1,
        duration: duration.ui,
        ease: ease.hover,
        overwrite: "auto",
      })

      pointerEl.classList.toggle("is-hover", next)

      if (next && !wasHovering) {
        orbitTween?.kill()
        orbitTween = gsap.to(orbitEl, {
          rotation: "+=360",
          duration: 8,
          ease: "none",
          repeat: -1,
        })
      } else if (!next && wasHovering) {
        orbitTween?.kill()
        orbitTween = null
        gsap.to(orbitEl, {
          rotation: 0,
          duration: duration.ui,
          ease: ease.hover,
          overwrite: "auto",
        })
      }

      setLabel(next ? label : "")
    }

    function showCursor(x: number, y: number) {
      lightX(x)
      lightY(y)
      pointerX(x)
      pointerY(y)
      labelX(x + 18)
      labelY(y + 20)

      if (!visible) {
        visible = true
        lightEl.classList.add("is-visible")
        pointerEl.classList.add("is-visible")
      }
    }

    function hideCursor() {
      if (!visible) return
      visible = false
      lightEl.classList.remove("is-visible")
      pointerEl.classList.remove("is-visible")
      setHoverState(false)
    }

    function resolveLabel(el: Element): string {
      const tagged = el.closest("[data-cursor]")
      if (tagged instanceof HTMLElement && tagged.dataset.cursor) {
        return tagged.dataset.cursor
      }
      const link = el.closest("a")
      if (link instanceof HTMLAnchorElement) {
        if (link.target === "_blank") return "→"
        if (link.getAttribute("href")?.startsWith("mailto:")) return "Write"
        return "View"
      }
      if (el.closest("button, [role='button']")) return "Go"
      return ""
    }

    function onMove(e: PointerEvent) {
      showCursor(e.clientX, e.clientY)

      const target = e.target
      if (!(target instanceof Element)) return

      const interactive = target.closest(
        "a, button, [role='button'], [data-cursor], input, textarea, select"
      )
      if (!interactive) {
        if (hovering) setHoverState(false)
        return
      }

      if (
        interactive.matches("input, textarea, select, [contenteditable='true']")
      ) {
        if (hovering) setHoverState(false)
        return
      }

      setHoverState(true, resolveLabel(interactive))
    }

    function onLeaveWindow(e: MouseEvent) {
      if (e.relatedTarget !== null) return
      hideCursor()
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    document.documentElement.addEventListener("mouseleave", onLeaveWindow)

    return () => {
      orbitTween?.kill()
      root.classList.remove("cursor-live")
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow)
      lightEl.classList.remove("is-visible")
      pointerEl.classList.remove("is-visible", "is-hover")
    }
  }, [still, mounted])

  if (still || !mounted) return null

  return createPortal(
    <div className="global-cursor-root" aria-hidden="true">
      <div ref={lightRef} className="global-cursor-light" />
      <div ref={pointerRef} className="global-cursor-pointer">
        <div ref={orbitRef} className="global-cursor-orbit-wrap">
          <svg
            className="global-cursor-reticle"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              className="global-cursor-orbit"
              cx="18"
              cy="18"
              r="13.5"
              strokeWidth="1"
            />
            <circle
              className="global-cursor-orbit-soft"
              cx="18"
              cy="18"
              r="9.5"
              strokeWidth="0.6"
              strokeDasharray="1.2 3"
            />
            <path
              className="global-cursor-ticks"
              d="M18 3v3.5M18 29.5V33M3 18h3.5M29.5 18H33"
              strokeWidth="1.15"
              strokeLinecap="round"
            />
            <circle className="global-cursor-bead" cx="18" cy="4.5" r="1" />
          </svg>
        </div>
        <svg
          className="global-cursor-star"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M6 0.9 6.85 5.15 11.1 6 6.85 6.85 6 11.1 5.15 6.85 0.9 6 5.15 5.15Z"
            fill="currentColor"
          />
          <circle cx="6" cy="6" r="1.05" fill="white" opacity="0.95" />
        </svg>
      </div>
      <div ref={labelRef} className="global-cursor-label" />
    </div>,
    document.body
  )
}

/** Alias for Phase 08 motion barrel */
export const GlobalCursor = CursorInteraction

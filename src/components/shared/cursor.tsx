"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"

import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"

/**
 * Desktop cursor — hotspot is 1:1 with the OS pointer (set in pointermove).
 * Only the glow trails. Never lerp the reticle; that is what felt sticky.
 */
export function CursorInteraction() {
  const lightRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<HTMLDivElement>(null)
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
    const labelNode = labelRef.current
    if (!lightNode || !pointerNode || !labelNode) return

    const lightEl: HTMLDivElement = lightNode
    const pointerEl: HTMLDivElement = pointerNode
    const labelEl: HTMLDivElement = labelNode

    const root = document.documentElement
    root.classList.add("cursor-live")

    const mouse = { x: 0, y: 0 }
    const light = { x: 0, y: 0 }
    let hovering = false
    let visible = false
    let labelText = ""
    let frame = 0
    let lastHoverKey = ""

    function setLabel(next: string) {
      if (next === labelText) return
      labelText = next
      labelEl.textContent = next
      labelEl.classList.toggle("is-visible", Boolean(next))
    }

    function setHoverState(next: boolean, label = "") {
      if (hovering === next && (!next || label === labelText)) return
      hovering = next
      pointerEl.classList.toggle("is-hover", next)
      lightEl.classList.toggle("is-hover", next)
      setLabel(next ? label : "")
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

    function placeHotspot(x: number, y: number) {
      pointerEl.style.transform = `translate3d(${x - 18}px, ${y - 18}px, 0)`
      if (labelText) {
        labelEl.style.transform = `translate3d(${x + 16}px, ${y + 18}px, 0)`
      }
    }

    function onMove(e: PointerEvent) {
      const x = e.clientX
      const y = e.clientY
      mouse.x = x
      mouse.y = y
      placeHotspot(x, y)

      if (!visible) {
        visible = true
        light.x = x
        light.y = y
        lightEl.style.transform = `translate3d(${x - 44}px, ${y - 44}px, 0)`
        lightEl.classList.add("is-visible")
        pointerEl.classList.add("is-visible")
      }

      const target = e.target
      if (!(target instanceof Element)) return
      const key = `${target.tagName}:${target.className}`
      if (key === lastHoverKey) return
      lastHoverKey = key

      const interactive = target.closest(
        "a, button, [role='button'], [data-cursor], input, textarea, select"
      )
      if (!interactive) {
        setHoverState(false)
        return
      }
      if (
        interactive.matches("input, textarea, select, [contenteditable='true']")
      ) {
        setHoverState(false)
        return
      }
      setHoverState(true, resolveLabel(interactive))
    }

    function onLeaveWindow(e: MouseEvent) {
      if (e.relatedTarget !== null) return
      visible = false
      lastHoverKey = ""
      lightEl.classList.remove("is-visible")
      pointerEl.classList.remove("is-visible")
      setHoverState(false)
    }

    function tick() {
      frame = requestAnimationFrame(tick)
      if (!visible) return
      light.x += (mouse.x - light.x) * 0.22
      light.y += (mouse.y - light.y) * 0.22
      lightEl.style.transform = `translate3d(${light.x - 44}px, ${light.y - 44}px, 0)`
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    document.documentElement.addEventListener("mouseleave", onLeaveWindow)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      root.classList.remove("cursor-live")
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow)
      lightEl.classList.remove("is-visible", "is-hover")
      pointerEl.classList.remove("is-visible", "is-hover")
    }
  }, [still, mounted])

  if (still || !mounted) return null

  return createPortal(
    <div className="global-cursor-root" aria-hidden="true">
      <div ref={lightRef} className="global-cursor-light" />
      <div ref={pointerRef} className="global-cursor-pointer">
        <div className="global-cursor-orbit-wrap">
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

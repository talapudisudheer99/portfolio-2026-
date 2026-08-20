"use client"

import gsap from "gsap"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { useHydratedReducedMotion } from "@/components/shared/motion"

export function CursorInteraction() {
  const blobRef = useRef<HTMLDivElement>(null)
  const auraRef = useRef<HTMLDivElement>(null)
  const still = useHydratedReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (still || !mounted) return

    const isFine = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches
    if (!isFine) return

    const blobEl = blobRef.current
    const auraEl = auraRef.current
    if (!blobEl || !auraEl) return

    const blobNode = blobEl
    const auraNode = auraEl

    const root = document.documentElement
    root.classList.add("cursor-live")

    gsap.set(blobNode, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 1 })
    gsap.set(auraNode, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 1, opacity: 0.78 })

    blobNode.classList.remove("is-visible")
    auraNode.classList.remove("is-visible")

    const blobX = gsap.quickTo(blobNode, "x", { duration: 0.14, ease: "power3.out" })
    const blobY = gsap.quickTo(blobNode, "y", { duration: 0.14, ease: "power3.out" })
    const auraX = gsap.quickTo(auraNode, "x", { duration: 0.42, ease: "power3.out" })
    const auraY = gsap.quickTo(auraNode, "y", { duration: 0.42, ease: "power3.out" })

    let hovering = false
    let visible = false

    function setHoverState(next: boolean) {
      if (next === hovering) return
      hovering = next

      gsap.to(blobNode, {
        scale: next ? 1.28 : 1,
        duration: 0.32,
        ease: "power3.out",
        overwrite: "auto",
      })

      gsap.to(auraNode, {
        scale: next ? 1.85 : 1,
        opacity: next ? 0.95 : 0.78,
        duration: 0.36,
        ease: "power3.out",
        overwrite: "auto",
      })

      blobNode.classList.toggle("is-hover", next)
      auraNode.classList.toggle("is-hover", next)
    }

    function showCursor(x: number, y: number) {
      blobX(x)
      blobY(y)
      auraX(x)
      auraY(y)

      if (!visible) {
        visible = true
        blobNode.classList.add("is-visible")
        auraNode.classList.add("is-visible")
      }
    }

    function hideCursor() {
      if (!visible) return
      visible = false
      blobNode.classList.remove("is-visible")
      auraNode.classList.remove("is-visible")
      setHoverState(false)
    }

    function onMove(e: PointerEvent) {
      showCursor(e.clientX, e.clientY)

      const target = e.target
      if (!(target instanceof Element)) return

      const interactive = target.closest("a, button, [data-cursor]")
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
      blobNode.classList.remove("is-visible", "is-hover")
      auraNode.classList.remove("is-visible", "is-hover")
    }
  }, [still, mounted])

  if (still || !mounted) return null

  return createPortal(
    <div className="global-cursor-root" aria-hidden="true">
      <div ref={auraRef} className="global-cursor-aura" />
      <div ref={blobRef} className="global-cursor-blob">
        <span className="global-cursor-body" />
        <span className="global-cursor-core" />
      </div>
    </div>,
    document.body
  )
}

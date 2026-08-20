import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type Lenis from "lenis"

gsap.registerPlugin(ScrollTrigger)

/**
 * Wire one Lenis instance to GSAP ScrollTrigger.
 * Call once from SmoothScroll. Returns cleanup.
 *
 * Lenis owns scroll feel; GSAP ticker drives Lenis.raf (single raf path).
 */
export function bindLenisToScrollTrigger(lenis: Lenis) {
  const onScroll = () => {
    ScrollTrigger.update()
  }

  lenis.on("scroll", onScroll)

  const tick = (time: number) => {
    lenis.raf(time * 1000)
  }

  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  const refresh = () => ScrollTrigger.refresh()
  refresh()
  window.addEventListener("resize", refresh)
  window.addEventListener("load", refresh)

  return () => {
    lenis.off("scroll", onScroll)
    gsap.ticker.remove(tick)
    window.removeEventListener("resize", refresh)
    window.removeEventListener("load", refresh)
  }
}

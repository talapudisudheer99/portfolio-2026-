# Motion system — Engineering Trace

> Local experiment on `temp-branch`. Visual redesign v2 stays locked. Motion
> makes the page feel like a product system assembling itself — not a generic
> stagger demo.

| Phase                               | Name                         | Status                     |
| ----------------------------------- | ---------------------------- | -------------------------- |
| [A](./A-motion-system/README.md)    | Shared motion language       | ✅ Superseded by Trace     |
| [B](./B-hero-signature/README.md)   | Hero signature choreography  | ✅ Retained + masked lines |
| [C](./C-scroll-narrative/README.md) | Per-section scroll narrative | ✅ Replaced by Trace       |
| [D](./D-micro-polish/README.md)     | Micro-interactions + QA      | ✅ Retained                |
| **E**                               | **Engineering Trace**        | ✅ Implemented             |

## Concept

One language across the site:

| Primitive                    | Job                                                  |
| ---------------------------- | ---------------------------------------------------- |
| `MaskedLine`                 | Editorial headings rise through a true overflow mask |
| `TraceRule`                  | Hairlines draw with `scaleX` (`aria-hidden`)         |
| `TraceNode`                  | System nodes activate (Talk/Plan/Ask, architecture)  |
| `TraceRow` / `TraceSequence` | Decisions, shipped list, experience chronology       |
| `FadeIn`                     | Supporting copy only                                 |

Tokens live in `src/lib/motion.ts` with distinct `hero` / `trace` / `micro` /
`copy` durations. Animate `opacity` + `transform` only. Full
`useReducedMotion()` static path on every primitive.

### MaskedLine is CSS-driven

The mask rise is `translateY(110%)` — a percentage of the line's own height, so
it works at any type size. Framer Motion leaves percentage transforms pinned at
their start value, which left every editorial heading invisible behind its mask.
The transition therefore lives in `.mask-line-inner` in `globals.css`; the
component only toggles `is-revealed` (via `useInView`, or hydration for
`onMount`) and passes duration/delay as custom properties. Reduced motion is
handled by the stylesheet rather than the hook so server and client markup stay
identical, and `@media (scripting: none)` keeps headings readable without JS.

## Explicitly rejected

WebGL, GSAP, Lenis, custom cursors, magnetic buttons, pinned scroll hijacking,
character scramble, animate-everything equal fade.

## Sources

- Codrops R—K ’26 / Spitzer / Bernadou — presence, one reveal language
- CSS scroll-driven animation guides 2026 — compositor properties + reduced motion
- Award portfolio craft notes — protect one signature; cut competing motion

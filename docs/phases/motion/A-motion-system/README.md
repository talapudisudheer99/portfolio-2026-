# Phase A — Shared motion language

**Goal:** One motion system every section can reuse. No section-specific
choreography yet.  
**Status:** ✅ Done

## Deliverables

- [x] Expand `src/lib/motion.ts` with duration tokens, stagger defaults, and
  shared variants (`fadeRise`, `staggerParent`, `staggerChild`)
- [x] Extend `src/components/shared/motion.tsx` with:
  - `FadeIn` (existing — keep API stable; added `onMount`)
  - `Stagger` + `StaggerItem` — parent + children for lists/columns
  - `Reveal` — overflow clip wrapper for display type (no scramble)
- [x] Every primitive honors `useReducedMotion()` by rendering static markup
- [x] Document usage in this README briefly
- [x] Typecheck / lint clean; no visual change required beyond existing FadeIn

## Usage

```tsx
import { FadeIn, Reveal, Stagger, StaggerItem } from "@/components/shared/motion"

<FadeIn>…</FadeIn>
<Reveal display onMount>…</Reveal>
<Stagger>
  <StaggerItem>…</StaggerItem>
</Stagger>
```

## Done when

Sections can import shared primitives instead of inventing per-file timing.
Hero and scroll phases can build on this without rewriting the foundation.

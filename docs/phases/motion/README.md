# Motion system — Engineering Trace (vocabulary) + Phase 08 (orchestration)

> **UI is frozen.** Do not redesign sections.  
> **Complete:** [Phase 08 — Global Motion + Interaction System](../08-global-motion-system/README.md).  
> Phase 07 token cleanup is **superseded** by Phase 08.

| Track | Role | Status |
|-------|------|--------|
| Engineering Trace | Reveal vocabulary (`MaskedLine`, `TraceNode`, …) | ✅ Implemented |
| [07](../07-motion-unification/README.md) | Token alignment / double-enter cleanup | ⚠️ Superseded |
| **[08](../08-global-motion-system/README.md)** | **Global motion + atmosphere + scroll** | ✅ Done |

## Concept

The existing UI is the product. Motion is the layer that makes it feel alive.

| Owner | Job |
|-------|-----|
| Lenis | Physical smooth scrolling (one instance) |
| GSAP + ScrollTrigger | Scroll choreography, parallax, section timelines |
| Three.js | ONE global fluid atmosphere behind the UI |
| Framer Motion | Micro UI only (menus, buttons, mock internals) |
| CSS | Hovers, gradients, lightweight transitions |

Do not animate the same element with GSAP + Framer + Three.

## Trace primitives (still valid for Framer micro / copy)

| Primitive | Job |
|-----------|-----|
| `MaskedLine` | Editorial headings (CSS mask rise) |
| `TraceRule` | Hairlines |
| `TraceNode` / `TraceSequence` | Lists / nodes |
| `FadeIn` / `SectionArrive` | Supporting copy / blocks |

Tokens: `src/lib/motion.ts`. Phase 08 may expand durations (micro / UI /
section / cinematic) without inventing a second token file.

## Explicitly rejected

- Redesigning locked UI
- Per-section Three.js scenes
- Solar system / cube clusters / giant 3D products
- Magnetic systems that fight the cursor
- “Every section has a different cool animation”
- Installing another animation library

## References (study, don’t clone)

ITom · Valentin Gassend · Hon Tran · HYDRA · Zera Studio · Hafsa (Next/GSAP/Lenis)

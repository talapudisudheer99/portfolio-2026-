# Phase 03 — Lightweight interaction system

**Goal:** Make the editorial layout feel alive without letting animation become
the product.  
**Status:** ⬜ Blocked on Phase 02

## Decision

Remove WebGL. The previous dot cloud and architecture graph were both
implementation-led and duplicated clearer HTML content. The v2 site uses CSS
and limited Framer Motion only.

## Deliverables

- [ ] Hero typography reveal using transform/opacity only
- [ ] Sameward media reveal and optional sticky progress indicator
- [ ] One purposeful interaction for project evidence (for example, screenshot
  crossfade or chapter progress), driven by content rather than pointer novelty
- [ ] Restrained link/button micro-interactions
- [ ] Shared `prefers-reduced-motion` path that renders all final states
- [ ] Motion implementation uses one observer strategy; no per-item listener
  sprawl
- [ ] Delete obsolete Three.js and GSAP code/dependencies if not removed in
  Phase 01

## Motion budget

- Maximum three motion patterns across the entire site.
- No entrance animation on the LCP headline if it delays first paint.
- No smooth-scroll hijacking.
- No parallax on body copy.
- No hover motion required to reveal essential information.
- Mobile gets shorter or no motion, not a reduced desktop spectacle.

## Done when

The site remains visually strong with JavaScript disabled and reduced motion
enabled; animation adds pacing but does not explain content that HTML cannot.

## Archived lesson

The first v1 scene used 64 points forming a wing; the second used labeled 3D
architecture nodes. Both were technically valid but visually unnecessary.
Editorial judgment—not available rendering technology—is the constraint for v2.

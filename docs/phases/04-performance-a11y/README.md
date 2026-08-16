# Phase 04 — Responsive, performance & accessibility

**Goal:** Validate the rebuilt experience on real constraints, not only a wide
desktop screenshot.  
**Status:** ⬜ Blocked on Phase 03

## Preserve from v1

- Visible focus indicators
- Skip-to-content link
- Contact error `aria-describedby`
- Logical heading hierarchy
- Reduced-motion CSS
- Intrinsic media dimensions and lazy loading below the fold

## Deliverables

- [ ] Test layout at 320, 375, 768, 1024, 1440, and ultra-wide widths
- [ ] Verify no editorial overlap/crop hides content at browser zoom 200%
- [ ] Keyboard-test nav, Sameward CTA, resume, social links, form, and theme
- [ ] Verify screen-reader reading order matches the visual grid
- [ ] Remove or make configurable the single-key `d` theme shortcut (WCAG 2.1
  SC 2.1.4)
- [ ] Verify light/dark contrast for body, muted copy, accent links, controls,
  focus rings, and errors
- [ ] Verify all motion paths under `prefers-reduced-motion`
- [ ] Replace fake preview assets with optimized AVIF/WebP screenshots where
  real media is available
- [ ] Audit initial JS after removing Three/R3F/GSAP
- [ ] Run Lighthouse mobile against a production build; record LCP, INP, CLS,
  accessibility, and performance
- [ ] Check contact form failure/success announcements

## Performance targets

- LCP ≤ 2.5 s on Lighthouse mobile
- CLS ≤ 0.1
- INP ≤ 200 ms
- No heavy client-only library in initial route without a demonstrated need
- No animation-induced layout changes

## Done when

The portfolio is readable, navigable, and visually intentional across themes,
screen sizes, keyboard use, reduced motion, and slow mobile conditions.

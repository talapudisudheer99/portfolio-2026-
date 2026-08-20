# Phase 07 — Motion Unification (superseded)

**Status:** ⚠️ **Superseded by [Phase 08 — Global Motion + Interaction System](../08-global-motion-system/README.md)**  
**Why:** This pass mostly aligned tokens and removed double enters. The live
site still felt the same because Lenis feel, hero GSAP, Framer Trace, and the
blob look were not rebuilt into a cinematic global layer.

Keep this file as historical checklist only. **Do not continue Phase 07 tasks.**
All new motion work follows Phase 08 Tasks 0–19.

---

## What landed (kept as baseline)

- Motion contract tokens in `src/lib/motion.ts`
- Lenis ↔ ScrollTrigger sync in `smooth-scroll.tsx`
- Removed live `ScrollEmergence` doubles on projects / experience / contact
- `SectionArrive` alias; blob pause when `document.hidden`
- Sameward stage scrub tokenized (`parallax.stageLag`)

## What did *not* land (now Phase 08)

- Noticeably different scroll physics
- Global section-aware WebGL atmosphere
- Unified GSAP reveal language sitewide
- Cursor light + refined desktop cursor
- Cohesive parallax depth system
- Section-by-section motion polish without UI redesign

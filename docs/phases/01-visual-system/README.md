# Phase 01 — Editorial direction reset

**Goal:** Replace the cool SaaS/dashboard language with a distinctive editorial
system before rebuilding sections.  
**Status:** ⬜ Ready to start

## Confirmed root cause (code audit)

The boxed look is structural, not only a color problem:

1. `src/components/shared/section-wrapper.tsx` combines `max-w-6xl` and section
   backgrounds on the same element, so backgrounds stop at ~1152px and float as
   centered slabs.
2. Nested media frames: hero empty `rounded-xl border` placeholders, `.hero-plane`,
   browser chrome around Sameward preview, bordered 3D canvas, nested architecture
   cells, bordered contact form, bordered social icons.
3. Hairline `border-t` / `border-l` everywhere, plus uniform `py-16 md:py-24`,
   creates a dashboard of panels.
4. Hero reserves a vacant media column that never earned its space.

## Remove first

- [ ] Split or replace `section-wrapper.tsx` so backgrounds can be full-bleed and
  width constraints apply only to content rails
- [ ] Delete hero nested placeholders and `.hero-plane` in
  `src/components/sections/hero.tsx` and `src/components/shared/hero-effects.tsx`
- [ ] Remove `src/components/three/*` and all canvas integration from
  `src/components/sections/projects.tsx`
- [ ] Uninstall `three`, `@react-three/fiber`, `@react-three/drei`, and `gsap`
- [ ] Remove large per-section background rectangles on capped wrappers
  (`skills.tsx`, `contact.tsx`, similar patterns)
- [ ] Flatten decorative borders: architecture diagram, contact form shell,
  social icon boxes, fake browser chrome
- [ ] Gut unused UI that invites regression: `src/components/ui/card.tsx`,
  `badge.tsx`, `separator.tsx` if still unused; dead exports in `motion.tsx`
  (`MotionCard`, `StaggerContainer`, `StaggerItem`)

## Establish the new system

- [ ] Implement bone / blue-black theme tokens with one oxblood accent
- [ ] Keep Sameward Ocean Blue scoped to project media only
- [ ] Default theme should not force dark; keep toggle, prefer system or light
  for first paint unless product decision says otherwise
- [ ] Replace current heading font with an expressive variable serif; retain a
  readable sans body face and lightweight mono metadata face
- [ ] Use fluid type (`clamp`) for hero and section headings
- [ ] Add layout primitives:
  - `SectionShell` — full-bleed `<section>` (optional subtle band, never a floating panel)
  - `ContentRail` — `max-w-*` + padding only for text/CTA columns
  - `MediaBleed` — full-bleed or breakout media
  - optional 12-column grid helper for asymmetric desktop compositions
- [ ] Align nav/footer to the same rail tokens
- [ ] Define spacing rhythm: compact labels, generous editorial section gaps,
  hairline dividers only where they help scanning
- [ ] Define button/link/focus styles without card-like chrome
- [ ] Update OG image colors to warm editorial identity (can finalize in Phase 05)

## Visual acceptance criteria

- No section resembles a rounded or square panel placed on another background.
- Backgrounds are always on the shell; width constraints only on content.
- Borders exist only for interactive controls or true media crops.
- Hero hierarchy remains compelling with images disabled and no animation.
- Light and dark themes both feel warm and authored, not inverted blue-gray UI.
- Accent is functional punctuation, not a background wash.
- Mobile source order remains logical without visual-grid hacks.

## Out of scope

- Final Sameward long-form composition (Phase 02)
- Scroll choreography beyond a simple proof of motion tokens (Phase 03)

## Done when

A static page shell with sample type, rules, actions, and media demonstrates the
new identity in both themes—and the rejected visual language plus WebGL deps are
removed.

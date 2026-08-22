# Portfolio redesign v2 — editorial reset

> The first visual implementation was rejected on 17 Aug 2026. It produced
> large rectangular section backgrounds, an empty-box hero, and a WebGL
> architecture scene that added complexity without making the portfolio more
> persuasive. Preserve the content work; replace the presentation.

Execute **one phase at a time**. Do not ship until the new visual direction has
been reviewed in both light and dark themes.

Full product context: [CONTEXT-SAMEWARD-HANDOFF.md](../CONTEXT-SAMEWARD-HANDOFF.md)  
Ops / env / deploy: [PORTFOLIO.md](../PORTFOLIO.md)

| Phase | Name | Status |
|-------|------|--------|
| [00](./00-content-positioning/README.md) | Content foundation | ✅ Keep |
| [01](./01-visual-system/README.md) | Editorial direction reset | ✅ Done |
| [02](./02-sameward-case-study/README.md) | Homepage + Sameward narrative | ✅ Done |
| [03](./03-scroll-3d/README.md) | Lightweight interaction system | ✅ Done |
| [04](./04-performance-a11y/README.md) | Responsive, performance & accessibility | ✅ Done |
| [05](./05-ship/README.md) | Content QA and ship | ✅ Done |
| [06](./06-typography-system/README.md) | Typography system | ✅ Done |
| [07](./07-motion-unification/README.md) | Motion unification (token pass) | ⚠️ Superseded |
| [08](./08-global-motion-system/README.md) | **Global motion + interaction system** | ✅ Done |
| [09](./09-motion-calibration/README.md) | **Motion calibration + cinematic polish** | ✅ Done |

**UI is locked** for layout, copy, and product mocks. Typography families:
**Michroma** (display / HUD) · **Inter** (body/UI) · **JetBrains Mono** (meta).

**Motion track:** [docs/phases/09-motion-calibration/README.md](./09-motion-calibration/README.md)
— Phase 09 complete. Production follow-ups: content-first hero (do not gate type
on 4K moon), 1:1 custom cursor hotspot, progressive moon textures.

Engineering Trace reveal primitives remain in
[docs/phases/motion/README.md](./motion/README.md) as vocabulary notes only.

## Why the first direction failed

- Nearly every section became a bounded rectangle. The page read as stacked
  slides instead of one authored composition.
- The hero reserved half the screen for nested placeholder boxes. Empty space
  is useful only when it creates hierarchy; this looked unfinished.
- Cool blue-gray tokens made the portfolio resemble a B2B SaaS dashboard.
- Small type, centered containers, repeated labels, and evenly weighted rows
  removed visual tension.
- The 3D feature was implementation-led. Even after becoming a literal
  architecture graph, it duplicated information already explained more clearly
  in HTML.

Code audit confirmed the structural cause: `SectionWrapper` owned both
background and `max-w-6xl` content width, so every band became a floating slab;
nested `rounded-xl border` shells (hero placeholders, browser frame, 3D canvas,
architecture cells, contact form) reinforced the box language. Preserve
`src/data/*` and plumbing; redesign shells first.

## Research-backed direction

Current portfolio work is moving toward editorial composition: expressive
typography, asymmetric 12-column grids, progressive disclosure, real project
imagery, and restrained motion. Strong portfolios make the standard obvious in
the first screen and put the best project immediately after it.

Sources:

- [Codrops — R—K ’26 portfolio process](https://tympanus.net/codrops/2026/04/07/r-k-26-the-thinking-and-code-behind-a-portfolio-led-by-presence/):
  deliberate 12-column composition, presence, and magazine-like project pages.
- [Awwwards 2026 pattern analysis](https://roughworks.ca/blog/awwwards-2026-patterns/):
  editorial judgment matters more than adding available technology.
- [Portfolio: dashboard to editorial](https://abdulkadersafi.com/blog/i-redesigned-my-portfolio-from-tech-dashboard-to-editorial):
  warm canvas, one accent, magazine rows, no endless cards or gradient hero.
- [2026 typography guidance](https://madegooddesigns.com/web-typography-trends-2026/):
  fluid type with `clamp()`; this portfolio uses geometric space display
  (Space Grotesk) rather than editorial serif to match the cinematic dark world.
- [Recruiter scan guidance](https://showproof.io/guides/how-recruiters-read-developer-portfolios/):
  role/value proposition and strongest project must be obvious immediately.

## Design concept: “Editorial systems”

The site should feel like a well-designed engineering journal, not a product
dashboard.

### Visual language

- Bone light canvas: `#F2F1ED`; blue-black dark canvas: `#101117`.
- Ink: `#14151A`; dark-theme paper text: `#ECEAE5`.
- One portfolio accent only: oxblood `#8E2B3A` light / `#CF5C63` dark.
- Sameward Ocean Blue appears only inside Sameward media/diagrams. It is product
  content, not the portfolio chrome.
- Geometric space display (**Michroma**) for large statements; Inter for body/UI;
  mono only for technical metadata (12px floor on page chrome).
- Full type scale and section assignments: [Phase 06](./06-typography-system/README.md).
- Hairline rules, large whitespace, crop/overlap, and typographic scale create
  depth. No decorative card shadows, glass panels, or boxed sections.

### Layout rules

- Continuous page canvas; section wrappers must not paint large rectangular
  backgrounds.
- 12-column desktop grid with deliberate asymmetry; simple single-column mobile
  source order.
- Full-bleed media can break the content grid.
- Use a box only when the object is actually bounded: form control, browser
  frame, diagram node, or button.
- Every section gets a distinct composition, but shared type, rules, and spacing
  make the page coherent.

### Information architecture (current homepage)

`src/app/page.tsx` section order:

1. **Hero** (`#hero`) — positioning statement, tagline, availability, CTAs.
2. **Sameward / Projects** (`#projects`) — flagship case study: featured stage,
   problem, approach, shipped flow, live product link.
3. **Capabilities** (`#skills`) — glass workspace proof grid (not skill cards).
4. **Experience** (`#experience`) — chronology with selective bullets + stats.
5. **Profile / About** (`#about`) — personal story, highlights, dark climax band.
6. **Contact** (`#contact`) — closing statement, email, Web3Forms form.

Global chrome: navbar, footer, NASA moon atmosphere (`blob-scene.tsx`),
space field, Lenis, custom cursor (hotspot tracks the OS pointer 1:1).

Typography spec: [Phase 06](./06-typography-system/README.md).

### Interaction rules

- One Three.js atmosphere (NASA moon + delayed space props). No second WebGL canvas.
- Lenis + GSAP/ScrollTrigger for scroll; Framer for micro UI only.
- Hero copy is LCP — never wait on 4K textures. Moon paints 1K first, then upgrades.
- Motion uses transform/opacity, never blocks reading, and has a complete
  reduced-motion path.
- Custom cursor hotspot is unsmoothed; only the glow may trail.

## Preserve

- Sameward-first positioning and honest architecture/decision content.
- Phrontier confidential framing.
- `src/data/*` as the user-facing content source.
- Web3Forms, resume download, metadata/OG plumbing, theme support, and existing
  accessibility fixes.

## Agent starter

```text
You are working in portfolio-2026 only.
Read docs/CONTEXT-SAMEWARD-HANDOFF.md and docs/phases/README.md.
This is redesign v2: cinematic dark world, Sameward-first, UI locked.
Motion: Lenis + GSAP + one Three atmosphere. Hero must not wait on moon textures.
Execute the first incomplete phase only. Preserve src/data content and plumbing.
Do not edit Sameward/teamhub-ai. Stop after the phase checklist is complete.
```

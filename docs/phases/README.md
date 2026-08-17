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
| [05](./05-ship/README.md) | Content QA and ship | ✅ Code complete (deploy pending) |

**Motion track (local experiment):** [docs/phases/motion/README.md](./motion/README.md) —
Engineering Trace (masked lines, drawing rules, activating nodes). No WebGL /
GSAP / custom cursors.

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
  expressive serif display type, neutral sans body, fluid type with `clamp()`.
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
- Expressive variable serif for large statements; neutral sans for body/UI;
  mono only for tiny technical metadata.
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

### Information architecture

1. Hero — oversized positioning statement, concise proof, primary action.
2. Sameward — strongest work immediately; visual-first editorial story.
3. Capabilities — grouped proof, not a skill-card grid.
4. Experience — clean chronology with selective bullets.
5. Profile — condensed personal story and factual signals.
6. Contact — large, direct closing statement and frictionless email/resume.

### Interaction rules

- Remove Three.js/R3F/drei/GSAP unless a later measured need justifies them.
- Use CSS and limited Framer Motion only: headline reveal, project media reveal,
  and one sticky/progress interaction.
- Motion uses transform/opacity, never blocks reading, and has a complete
  reduced-motion path.
- No cursor gimmicks, smooth-scroll hijacking, free-roam 3D, or animation on
  every element.

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
This is redesign v2: warm editorial, no boxed sections, no WebGL by default.
Execute the first incomplete phase only. Preserve src/data content and plumbing.
Do not edit Sameward/teamhub-ai. Stop after the phase checklist is complete.
```

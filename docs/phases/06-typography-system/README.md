# Phase 06 — Typography system

**Goal:** Replace fragmented per-component font sizes with a serif-led editorial
type system aligned to the bone / blue-black / oxblood theme.  
**Status:** 🔄 In progress  
**Prerequisite:** Phases 00–05 shipped to `main` (stable baseline).

Full ops context: [PORTFOLIO.md](../../PORTFOLIO.md) · Phase index:
[README.md](../README.md)

---

## Why this phase exists

The site is visually stable, but typography still reads as **assembled**, not
**authored**:

1. **Hierarchy inversion** — docs say Fraunces owns large statements, but the hero
   headline uses Manrope 800; Fraunces appears only on accent words.
2. **Scale fragmentation** — `globals.css` contains dozens of one-off sizes
   (`0.62rem`, `9px`, `10px`, bespoke `clamp()` per block) instead of tokens.
3. **Kicker inconsistency** — hero kicker uses sans uppercase; section kickers
   use mono uppercase; capabilities kickers sit at 10px.
4. **Dashboard density** — metadata labels below 12px conflict with Phase 01’s
   rejection of small-type SaaS patterns.

This phase does **not** change copy, palette behaviour, or layout shells. It
unifies font roles, sizes, and line heights across the live homepage sections.

---

## Current homepage sections (source of truth)

`src/app/page.tsx` composes:

| Order | Section | Component | `#id` | Typography surfaces |
| ----- | ------- | --------- | ----- | ------------------- |
| 1 | Hero | `sections/hero.tsx` | `#hero` | kicker, display headline, tagline, status, CTAs |
| 2 | Sameward / Projects | `sections/projects.tsx` + `featured-work-stage.tsx` | `#projects` | section kickers, problem/approach/shipped copy, tablet mockup chrome |
| 3 | Capabilities | `sections/skills.tsx` → `capabilities-workspace.tsx` | `#skills` | gradient kickers, multi-line display headline, card titles, marquee |
| 4 | Experience | `sections/experience.tsx` | `#experience` | display title, stat labels, job titles, body bullets |
| 5 | Profile / About | `sections/about.tsx` | `#about` | kicker, two-line headline, body, highlight cards |
| 6 | Contact | `sections/contact.tsx` | `#contact` | kicker, closing display, email link, form labels |

**Global chrome:** `layout/navbar.tsx`, `layout/footer.tsx`, `layout/palette-select.tsx`.

**Shared typography helpers:** `shared/section-header.tsx`, `shared/motion.tsx`
(`MaskedLine`, problem lines), `shared/skill-marquee.tsx`, `shared/parallax.tsx`.

**Mockup-only type** (does not use page scale): `shared/sameward-panel.tsx`,
`sameward-product-visual.tsx`, `shipped-flow.tsx` — use `--text-micro` only
inside product frames.

---

## New typography system (locked spec)

### Font stack (unchanged families, stricter roles)

| Token | Family | Role |
| ----- | ------ | ---- |
| `--font-display` | **Fraunces** (+ Georgia fallback) | Hero headline, section titles, job titles, stat numbers, accent display lines |
| `--font-heading` / `--font-sans` | **Manrope** | Body copy, taglines, nav, buttons, form fields, UI labels |
| `--font-mono` | **JetBrains Mono** | Kickers, dates, indices, tech metadata, mockup chrome labels |

**Rules:**

- Serif leads **presence** (H1, H2, H3 display moments).
- Sans leads **function** (paragraphs, nav, CTAs, form controls).
- Mono leads **metadata only** — all kickers/eyebrows use mono, including hero.
- Do **not** tie font family to palette picker; palette affects colour tokens only.
- Fraunces variable axes: `"SOFT" 50`, `"WONK" 1` on `.editorial-display` and
  display headlines.

### Type scale (CSS custom properties)

| Token | Size | Line height | Tracking | Use |
| ----- | ---- | ----------- | -------- | --- |
| `--text-display` | `clamp(2.75rem, 7vw, 5.5rem)` | `--leading-display` `0.92` | `--tracking-display` `-0.04em` | Hero H1 |
| `--text-title` | `clamp(2rem, 4.2vw, 3.75rem)` | `--leading-title` `0.94` | `--tracking-title` `-0.04em` | Section H2 (Contact, Experience sidebar) |
| `--text-section` | `clamp(1.75rem, 3.2vw, 2.75rem)` | `0.95` | `-0.035em` | Job titles, approach headlines, card display |
| `--text-lead` | `clamp(1.0625rem, 1.35vw, 1.1875rem)` | `--leading-body` `1.65` | `0` | Taglines, intro paragraphs, hero aside |
| `--text-body` | `1rem` (16px floor) | `1.65` | `0.01em` | Default body, form inputs |
| `--text-ui` | `0.875rem` | `1.4` | `-0.01em` | Nav links, footer, buttons |
| `--text-meta` | `0.75rem` (12px floor) | `1.4` | `0.14em` uppercase | All kickers, dates, stat labels |
| `--text-micro` | `0.6875rem` (11px) | `1.35` | `0.12em` uppercase | Sameward tablet UI only |

### Utility classes (`globals.css`)

| Class | Applies |
| ----- | ------- |
| `.editorial-display` | Fraunces + variable axes + display tracking (base serif hook) |
| `.type-display` | Display size/leading — hero + largest moments |
| `.type-title` | Section H2 scale |
| `.type-section` | Subsection / job title scale |
| `.type-lead` | Manrope lead body |
| `.type-body` | Manrope 16px body |
| `.type-ui` | Manrope UI chrome |
| `.type-meta` | Mono kicker/metadata |
| `.type-micro` | Mono mockup labels |
| `.type-accent` | Gradient italic accent words (hero + gradient headline lines) |
| `.section-kicker` | Extends `.type-meta` — shared eyebrow |

### Accent typography

- Hero accent segments and gradient headline lines use `var(--ember-gradient)` via
  `.type-accent` / `.hero-accent-word` / `*--gradient` modifiers.
- One gradient accent moment per section maximum (already the pattern).
- Dark canvas: body copy uses `font-weight: 450` equivalent (`500` on Manrope) for
  readability over the Fluid Blob background.

### Section-by-section assignment

#### Hero (`#hero`)

- Kicker → `.section-kicker` / `.type-meta` (mono, not sans)
- Headline → `.type-display.editorial-display` (Fraunces primary)
- Accent words → `.type-accent` (italic gradient)
- Tagline → `.type-lead`
- Status → `.type-meta`
- CTAs → `.type-ui` + existing button weights

#### Projects / Sameward (`#projects`)

- All kickers → `.section-kicker`
- Problem lines → `.editorial-display.type-section` (via `.projects-problem-line`)
- Approach headline → `.editorial-display` + section CSS size token
- Shipped footer display → `.type-title`
- Sync labels → `.type-meta`

#### Capabilities (`#skills`)

- Section/sidebar kickers → `.type-meta` at 12px (not 10px)
- Headline lines → `.editorial-display` + `--text-title` clamp
- Hero description → `.type-lead`
- Card titles → Manrope semibold `.type-ui`
- Card summary → `.type-body` at `--text-ui` size
- Marquee labels → `.type-meta`

#### Experience (`#experience`)

- Section title → `.type-title.editorial-display`
- Stat labels → `.type-meta`
- Stat values → `.editorial-display.type-section`
- Job title → `.type-section.editorial-display`
- Company line → Manrope semibold `.type-lead`
- Bullets → `.type-body` via `--text-ui` for density

#### About (`#about`)

- Kicker → `.type-meta` + gradient clip
- Headline lines → `.editorial-display` + `--text-title` clamp
- Body → `.type-lead` / `.type-body`

#### Contact (`#contact`)

- Kicker → `.section-kicker`
- Closing headline → `.type-title.editorial-display`
- Email link → `.type-section` weight on sans (functional, not serif)
- Form labels → `.type-meta`

#### Navbar / Footer

- Logo → Manrope 800 (UI mark, not editorial)
- Nav links → `.type-ui`
- Nav index → `.type-meta`
- Footer → `.type-ui` / `.type-body`

---

## Implementation tasks (execute in order)

### Task 1 — Documentation ✅

- [x] Create this file
- [x] Update `docs/phases/README.md` (phase table + IA)
- [x] Update `docs/PORTFOLIO.md` typography + architecture sections
- [x] Mark Phase 01 typography items as superseded by Phase 06

### Task 2 — `src/app/globals.css` tokens & utilities

- [x] Add `--text-*`, `--leading-*`, `--tracking-*` to `@theme inline`
- [x] Add `.type-*` utility classes in `@layer utilities`
- [x] Extend `.editorial-display` to consume display tracking token
- [x] Unify `.section-kicker` with `.type-meta`
- [x] Dark-theme body weight/tracking tweak in `@layer base`

### Task 3 — `globals.css` section blocks

- [x] Hero (`.hero-kicker`, `.hero-headline`, `.hero-tagline`, `.hero-status`)
- [x] Projects (problem, approach, shipped, inside-sync)
- [x] Capabilities workspace (kickers, headline, cards, CTA)
- [x] About workspace
- [x] Experience (component-level; no dedicated globals block)
- [x] Contact (component-level)
- [x] Navbar / footer
- [x] Replace page-chrome `9px` / `10px` with `--text-meta`; mockup UI uses `--text-micro`

### Task 4 — Components (remove inline typography)

- [x] `shared/section-header.tsx`
- [x] `sections/experience.tsx`
- [x] `sections/projects.tsx`
- [x] `sections/contact.tsx`
- [x] `sections/about.tsx` (class hooks only if needed)
- [x] `shared/capabilities-workspace.tsx`
- [x] `shared/skill-marquee.tsx`
- [x] `shared/parallax.tsx`
- [x] `shared/sameward-product-visual.tsx` (micro only)
- [x] `shared/sameward-panel.tsx` (micro only)
- [x] `layout/footer.tsx`
- [x] `app/opengraph-image.tsx` (align OG type with display token)

### Task 5 — Verify

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] Visual check: 375 / 768 / 1440 — hero, Sameward, capabilities, experience, about, contact
- [ ] Reduced-motion path unchanged
- [ ] Palette picker still updates accent gradient only

---

## Acceptance criteria

- Hero headline is **Fraunces-led**; accent words remain gradient italic.
- Every kicker/eyebrow on the page uses **mono at 12px minimum**.
- Body copy never renders below **16px** outside mockup frames.
- Section titles pull from **`--text-title`** or **`--text-display`**, not ad-hoc
  `clamp()` in TSX.
- No new font files; Fraunces + Manrope + JetBrains Mono only.
- Typography feels like an **engineering journal**, not a SaaS dashboard.

## Out of scope

- Changing font families (Instrument Serif A/B is a future experiment branch).
- Palette-driven font swapping.
- Sameward tablet interior layout redesign.
- Light theme reintroduction (site is dark-first with forced dark theme).

## Done when

Task checklists above are complete, lint/typecheck pass, and typography matches
this spec across all six homepage sections plus nav/footer.

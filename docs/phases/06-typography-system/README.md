# Phase 06 — Typography system

**Goal:** Unified type scale for the cinematic space portfolio — geometric
display + neutral body + mono metadata, aligned to the dark gold universe.  
**Status:** ✅ Complete (families updated for space theme)  
**Prerequisite:** Phases 00–05 shipped to `main` (stable baseline).

Full ops context: [PORTFOLIO.md](../../PORTFOLIO.md) · Phase index:
[README.md](../README.md)

---

## Why this phase exists

Typography must feel like one authored system, not assembled scraps — and it
must match the **space / mission-control visual world** (not an editorial
magazine).

Historical issues this phase solved:

1. **Hierarchy inversion** — display type not owning large statements.
2. **Scale fragmentation** — one-off sizes instead of tokens.
3. **Kicker inconsistency** — mixed sans/mono eyebrows.
4. **Dashboard density** — metadata below 12px.
5. **Theme mismatch (2026 update)** — soft serif (Fraunces) fought the
   cinematic starfield / craft / atmosphere language. Replaced with geometric
   space grotesk.

This phase does **not** change copy, palette behaviour, or layout shells. It
owns font families, roles, sizes, and line heights.

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

## Typography system (locked spec)

### Font stack

Loaded in `src/app/layout.tsx` via `next/font/google`.

| Token | Family | CSS var | Role |
| ----- | ------ | ------- | ---- |
| `--font-display` / `--font-heading` | **Space Grotesk** | `--font-space-grotesk` | Hero headline, section titles, job titles, stat numbers, accent display lines, logo mark |
| `--font-sans` | **Inter** | `--font-inter` | Body copy, taglines, nav links, buttons, form fields, UI labels |
| `--font-mono` | **JetBrains Mono** | `--font-jetbrains` | Kickers, dates, indices, tech metadata, mockup chrome labels |

**Why these families (research summary):**

- Modern cosmic / dark product UIs favor **geometric grotesks** over costume
  sci-fi display faces (Orbitron / Audiowide) and soft editorial serifs.
- **Space Grotesk** — geometric with mono DNA; common on tech portfolios and
  dark-mode brand systems; reads “space / engineered” without HUD costume.
- **Inter** — screen-optimized neutral body for long reading on dark canvas.
- **JetBrains Mono** — retained for mission-style metadata (already on-theme).
- Avoided as primary display: Orbitron, Audiowide, full-page monospace HUD.

**Rules:**

- Space Grotesk leads **presence** (H1, H2, H3 display moments).
- Inter leads **function** (paragraphs, nav, CTAs, form controls).
- Mono leads **metadata only** — all kickers/eyebrows use mono, including hero.
- Do **not** tie font family to palette picker; palette affects colour tokens only.
- No Fraunces axes (`SOFT` / `WONK`). Space Grotesk has no true italic — accent
  words use **weight 600 + ember gradient**, not faux italic.

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
| `.editorial-display` | Space Grotesk display hook + tracking (class name kept for stability) |
| `.type-display` | Display size/leading — hero + largest moments |
| `.type-title` | Section H2 scale |
| `.type-section` | Subsection / job title scale |
| `.type-lead` | Inter lead body |
| `.type-body` | Inter 16px body |
| `.type-ui` | Inter UI chrome |
| `.type-meta` | Mono kicker/metadata |
| `.type-micro` | Mono mockup labels |
| `.type-accent` | Gradient semibold accent words (hero + gradient headline lines) |
| `.section-kicker` | Extends `.type-meta` — shared eyebrow |

### Accent typography

- Hero accent segments and gradient headline lines use `var(--ember-gradient)` via
  `.type-accent` / `.hero-accent-word` / `*--gradient` modifiers.
- Accents are **semibold Space Grotesk + gradient**, not italic serif.
- One gradient accent moment per section maximum (already the pattern).
- Dark canvas: body uses Inter `font-weight: 400` for readability over atmosphere.

### Section-by-section assignment

#### Hero (`#hero`)

- Kicker → `.section-kicker` / `.type-meta` (mono)
- Headline → `.type-display.editorial-display` (Space Grotesk)
- Accent words → `.type-accent` (semibold gradient)
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
- Card / rock titles → Space Grotesk via `.editorial-display` or Inter semibold `.type-ui`
- Card summary → `.type-body` at `--text-ui` size
- Marquee labels → `.type-meta`

#### Experience (`#experience`)

- Section title → `.type-title.editorial-display`
- Stat labels → `.type-meta`
- Stat values → `.editorial-display.type-section`
- Job title → `.type-section.editorial-display`
- Company line → Inter semibold `.type-lead`
- Bullets → `.type-body` via `--text-ui` for density

#### About (`#about`)

- Kicker → `.type-meta` + gradient clip
- Headline lines → `.editorial-display` + `--text-title` clamp
- Body → `.type-lead` / `.type-body`

#### Contact (`#contact`)

- Kicker → `.section-kicker`
- Closing headline → `.type-title.editorial-display`
- Email link → `.type-section` weight on Inter (functional)
- Form labels → `.type-meta`

#### Navbar / Footer

- Logo → Space Grotesk 800 (UI mark)
- Nav links → `.type-ui` (Inter)
- Nav index → `.type-meta`
- Footer → `.type-ui` / `.type-body`

---

## Implementation tasks

### Task 1 — Documentation ✅

- [x] Create this file
- [x] Update `docs/phases/README.md` (phase table + IA)
- [x] Update `docs/PORTFOLIO.md` typography + architecture sections
- [x] Mark Phase 01 typography items as superseded by Phase 06
- [x] Space-theme family swap documented (Space Grotesk + Inter + JetBrains Mono)

### Task 2 — `src/app/globals.css` tokens & utilities ✅

- [x] Add `--text-*`, `--leading-*`, `--tracking-*` to `@theme inline`
- [x] Add `.type-*` utility classes in `@layer utilities`
- [x] `.editorial-display` consumes display tracking (no serif axes)
- [x] Unify `.section-kicker` with `.type-meta`
- [x] Dark-theme body weight/tracking tweak in `@layer base`

### Task 3 — `globals.css` section blocks ✅

- [x] Hero, Projects, Capabilities, About, Experience, Contact, Navbar / footer
- [x] Replace page-chrome `9px` / `10px` with `--text-meta`; mockup UI uses `--text-micro`

### Task 4 — Components ✅

- [x] Section + shared components hooked to type utilities
- [x] `layout.tsx` loads Space Grotesk + Inter + JetBrains Mono

### Task 5 — Verify

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] Visual check: 375 / 768 / 1440 — hero, Sameward, capabilities, experience, about, contact
- [ ] Reduced-motion path unchanged
- [ ] Palette picker still updates accent gradient only

---

## Acceptance criteria

- Hero headline is **Space Grotesk–led**; accent words are **semibold + ember gradient** (no italic serif).
- Every kicker/eyebrow on the page uses **mono at 12px minimum**.
- Body copy never renders below **16px** outside mockup frames.
- Section titles pull from **`--text-title`** or **`--text-display`**, not ad-hoc
  `clamp()` in TSX.
- Font families: **Space Grotesk + Inter + JetBrains Mono** only (via `next/font`).
- Typography feels like a **cinematic space product system**, not a magazine editorial or SaaS dashboard.

## Out of scope

- Costume sci-fi display faces (Orbitron, Audiowide) as primary type.
- Palette-driven font swapping.
- Sameward tablet interior layout redesign.
- Light theme reintroduction (site is dark-first with forced dark theme).

## Done when

Task checklists above are complete, lint/typecheck pass, and typography matches
this spec across all six homepage sections plus nav/footer.

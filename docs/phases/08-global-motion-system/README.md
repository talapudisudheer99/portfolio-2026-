# Phase 08 — Global Motion + Interaction System

**Status:** ✅ Complete — Tasks 0–19  
**Prerequisite:** Portfolio UI is **LOCKED** (deployed). This is **not** a redesign.

> Supersedes the incomplete “Phase 07 Motion Unification” pass. Phase 07 mostly
> aligned tokens and removed double enters — it did **not** deliver a visible
> cinematic motion layer. This phase owns the full global motion system.

## North star

Editorial portfolio + cinematic motion + smooth scroll + subtle parallax +
ambient lighting + one controlled WebGL atmosphere + meaningful micro-interactions.

**One coherent interactive world** around the existing UI — not a different
effect per section, not a Three.js demo, not a cyberpunk/game site.

## Locked (never change)

CONTENT · LAYOUT · TYPOGRAPHY · BRAND COLORS · SECTION ORDER · RESPONSIVE UI ·
SAMEWARD PRODUCT MOCK · CAPABILITIES UI · EXPERIENCE COPY · PROFILE · CONTACT
FORM LOGIC · NAV DESIGN · ROUTES · LINKS · EXISTING FUNCTIONALITY

Only add: motion · parallax · smooth scroll · global atmosphere · lighting ·
micro-interactions · scroll choreography.

## Stack ownership (do not add libraries)

| Tech | Job |
|------|-----|
| **Lenis** | One global smooth scroll |
| **GSAP + ScrollTrigger** | Scroll choreography, parallax, timelines, section transitions |
| **@gsap/react** | React-safe GSAP lifecycle |
| **Three.js** | ONE global ambient WebGL atmosphere |
| **Framer Motion** | Small UI: menus, buttons, local interactions |
| **CSS** | Hovers, gradients, lighting, simple transitions |

**Rule:** Do not let GSAP, Framer, and Three animate the same element.

## References (study — do not clone)

1. ITom — global motion language  
2. Valentin Gassend — developer portfolio + WebGL  
3. Hon Tran — typography + GSAP/WebGL  
4. HYDRA — art direction + storytelling  
5. Zera Studio — global fluid/WebGL atmosphere  
6. Hafsa Mumtaz — Next.js + Three + GSAP + Lenis implementation discipline  

Restraint of ITom/Hon Tran + WebGL quality of Valentin/Zera + Hafsa’s stack
discipline. Still must feel like Sudheer’s portfolio + Sameward’s story.

## Existing section order (locked)

1. Hero  
2. Sameward / product showcase (inside Projects)  
3. Problem / Approach (inside Projects case narrative)  
4. Capabilities (Skills)  
5. Experience  
6. Profile / About  
7. Contact / Form  
8. Footer  

## Architecture principle

```
CONTENT COMPONENTS  → existing sections (frozen)
MOTION SYSTEM       → reusable motion layer
WEBGL SYSTEM        → one global atmosphere
```

Prefer adapting existing files over blind new folders. Suggested homes when
building (Task 1+):

| Concern | Likely existing / target |
|---------|--------------------------|
| Smooth scroll | `src/components/smooth-scroll.tsx` |
| Cursor | `src/components/shared/cursor.tsx` |
| Atmosphere | `src/components/shared/blob-scene.tsx` → evolve into global atmosphere |
| Reveals | `src/components/shared/motion.tsx` + GSAP wrappers as needed |
| Parallax | `src/components/shared/parallax.tsx` → GSAP-first where scroll-driven |
| Tokens | `src/lib/motion.ts` (expand; do not invent a second token source) |

Optional later split (`src/components/motion/`, `src/lib/motion/`, `src/three/`)
only if files grow past clarity — not required for Task 1.

---

## Implementation order — do not skip

After **each** task: implement only that task → run app → console check →
typecheck when appropriate → fix → then next. **Never** dump Tasks 1–19 at once.

| Task | Name | Status |
|------|------|--------|
| **0** | Full repository audit | ✅ Done |
| **1** | Global motion architecture (no visual effects yet) | ✅ Done |
| **2** | Lenis + ScrollTrigger integration (test scroll feel) | ✅ Done |
| **3** | Motion tokens + reusable reveal (test on **one** section) | ✅ Done |
| **4** | Global Three.js atmosphere (lifecycle + perf) | ✅ Done |
| **5** | Global cursor + cursor light (desktop only) | ✅ Done |
| **6** | Global typography / section reveal system | ✅ Done |
| **7** | Global parallax system (selected layers) | ✅ Done |
| **8** | Hero motion polish (no redesign) | ✅ Done |
| **9** | Sameward product motion (no redesign) | ✅ Done |
| **10** | Problem section content-driven motion | ✅ Done |
| **11** | Approach section motion | ✅ Done |
| **12** | Capabilities interaction polish | ✅ Done |
| **13** | Experience timeline motion | ✅ Done |
| **14** | Profile / skills subtle motion | ✅ Done |
| **15** | Contact / form micro-interactions | ✅ Done |
| **16** | Global section atmosphere transitions | ✅ Done |
| **17** | Mobile / reduced-motion pass | ✅ Done |
| **18** | Performance audit | ✅ Done |
| **19** | typecheck / lint / build | ✅ Done |

### Batch progress (Tasks 16–19)

| Task | What shipped |
|------|----------------|
| 16 | Section mood uniforms (`uMoodColor`/`uMoodMix`/`uSpeed`/`uIntensity`) + IntersectionObserver lerp |
| 17 | Mobile: lower DPR/segments, no pointer influence, no parallax/drift scrub, approach settles static; RM freezes sim + skips Lenis/cursor |
| 18 | One Lenis↔GSAP ticker path; one Three raf; pause on `visibilitychange`; `forceContextLoss` on dispose |
| 19 | `typecheck` / `lint` / `build` green |

### Batch progress (Tasks 1–5)

| Task | What shipped |
|------|----------------|
| 1 | `MotionRoot` + `src/components/motion/*` barrel; layout wires through it |
| 2 | Lenis `autoRaf: false` + GSAP ticker; snappier `duration: 0.88`; `bindLenisToScrollTrigger` |
| 3 | Expanded tokens (`micro`/`ui`/`section`/`cinematic`); `SectionReveal` on Capabilities intro |
| 4 | Softer→restored intensity `AmbientAtmosphere` (palette colors readable again) |
| 5 | Dot + ring + soft cursor light (desktop only) |

### Batch progress (Tasks 6–10)

| Task | What shipped |
|------|----------------|
| 6 | `SectionReveal` variants sitewide (projects / experience / contact / about / capabilities) |
| 7 | `MotionParallax` + `depth` tokens; capabilities aurora parallax |
| 8 | Hero assemble timeline uses motion tokens; softer scrub + magnetic |
| 9 | Sameward enter scale 0.97→1; scrub lag + timing polished |
| 10 | `FragmentDrift` on Talk/Plan/Ask — drift apart then converge |

### Batch progress (Tasks 11–15)

| Task | What shipped |
|------|----------------|
| 11 | `ApproachActivate` — rule draw + number/title/detail sequence |
| 12 | Capabilities hover: lift, icon glow, accent light (one system) |
| 13 | Experience scroll illumination; Sameward flagship strongest; muted peers |
| 14 | Profile calm `SectionReveal` on intro + impact card |
| 15 | Contact focus glow + submit hover/icon micro-motion |

---

## Task briefs (summary)

### Task 0 — Audit
See **Audit report** at bottom of this file. No code changes.

### Task 1 — Architecture
Central motion layer wiring only. No new carnival effects. Map owners; avoid
duplicate raf loops.

### Task 2 — Lenis
One instance wrapping the page. Sync ScrollTrigger. Physical, not slow.
Test wheel / trackpad / keyboard / touch / anchors.

### Task 3 — Tokens
MICRO 150–250ms · UI 250–400ms · SECTION 500–900ms · CINEMATIC 800–1400ms  
(tune to brand; keep one source of truth). One reveal test section only.

### Task 4–6 — Atmosphere
ONE Canvas, mount once. Near-black studio fluid: deep violet / blue / subtle
cyan / coral. Behind UI. No solar system / cubes / giant 3D products. Section
**influences** only (color, intensity, speed) — not eight scenes.

### Task 5 — Cursor
Desktop: small dot + subtle ring + soft cursor light. No mobile / reduced
motion. Minimal hover labels if used.

### Task 6–7 — Reveals + parallax
One reveal language (GSAP ScrollTrigger). Masked headlines. Depth layers via
transform only. Subtle.

### Tasks 8–15 — Section polish
Motion only on existing UI. Content-driven where possible; skip forced gimmicks.

### Task 16 — Atmosphere scroll transitions
Gradual section color/intensity shifts via the **same** WebGL system.

### Tasks 17–19 — Mobile, a11y, perf, build
Degrade gracefully. One Lenis loop, one Three loop, no WebGL leaks.

---

## Atmosphere section moods (Task 4 / 16)

| Section | Mood |
|---------|------|
| Hero | dark, violet/blue, calm |
| Sameward | stronger, coral + subtle cyan |
| Problem | deeper red/coral, slower |
| Approach | blue/cyan, technical |
| Capabilities | violet/cyan/green subtle |
| Experience | dark blue/violet |
| Profile | very subtle |
| Contact | warm subtle coral |

---

## Why Phase 07 felt like “nothing changed”

Phase 07 adjusted tokens, removed some double enters, tweaked Sameward scrub
by a few px, and paused the blob when the tab is hidden. **Lenis duration,
hero GSAP, Framer Trace enters, and the visible blob look were largely
unchanged.** A user scrolling the live site would not notice a new motion
language. Phase 08 is the intentional cinematic layer.

---

## Task 0 — Audit report (2026-08-20)

### 1. Current animation architecture

Split across three owners with overlapping jobs:

| Layer | Location | Role today |
|-------|----------|------------|
| Lenis | `smooth-scroll.tsx` | Root smooth scroll; disabled on reduced motion |
| GSAP | `hero.tsx`, `featured-work-stage.tsx`, `cursor.tsx` | Hero timeline + SplitText; Sameward enter/scrub; cursor follow |
| Framer | `motion.tsx`, sections, mock, nav, experience rail | Trace reveals, FadeIn, MaskedLine, mock micro, drawer, scroll progress |
| CSS | `globals.css` | Mask rises, hovers, Lenis CSS, cursor styles |
| Three | `blob-scene.tsx` | One fixed canvas fluid blob |

There is **no single orchestrator**. Sections own their own Framer/GSAP enters.
Scroll-driven work is mixed: Framer `useScroll` (parallax, experience rail,
scroll progress) **and** GSAP ScrollTrigger (hero scrub, Sameward stage).

### 2. Current WebGL architecture

- **One** canvas: `BlobScene` in root layout inside `SmoothScroll`.
- Imperative Three in `useEffect`: `WebGLRenderer` on existing `<canvas>`,
  shader sphere + glow mesh, mouse/scroll uniforms, palette updates via refs.
- Lifecycle: dispose on unmount; pause render when `document.hidden`; freeze
  sim updates on reduced motion (still mounts canvas).
- **No** R3F / `useFrame` / per-section canvases found.
- Risk areas: high sphere tessellation (128²); window `scroll` + `mousemove`
  listeners; palette remount is color-only (good). Historical context leaks
  were from earlier multi-canvas / probe patterns — **do not reintroduce**.

### 3. Current Lenis status

- Single `ReactLenis` `root` with `autoRaf: true`.
- Options: `duration: 1.05`, `wheelMultiplier: 0.92` — smooth but not a new
  “physical” feel vs native; easy to perceive as “same scroll.”
- `LenisGsapSync`: `useLenis` → `ScrollTrigger.update()`; refresh on resize/load.
- Gap: Framer `useScroll` consumers are **not** explicitly tied to Lenis scroll
  object (usually OK with root Lenis updating window scroll, but worth verifying
  in Task 2).

### 4. Current GSAP status

| File | Usage |
|------|--------|
| `hero.tsx` | SplitText word reveal, timeline, scroll scrub, pointer quickTo |
| `featured-work-stage.tsx` | Enter fade/rise + tablet scrub parallax |
| `cursor.tsx` | quickTo follow + hover scale |
| `smooth-scroll.tsx` | Plugin register + ST sync only |

GSAP is **not** the sitewide section-reveal engine yet. Most section arrives
are Framer Trace.

### 5. Existing reusable utilities

| Module | Exports / tokens |
|--------|------------------|
| `src/lib/motion.ts` | `duration`, `rise`, `gap`, `parallax`, `fadeRise`, Trace variants |
| `src/components/shared/motion.tsx` | `FadeIn`/`SectionArrive`, `MaskedLine`, `Trace*`, `HoverLift`, reduced-motion hooks |
| `src/components/shared/parallax.tsx` | `ParallaxFloat/Layer`, deprecated `ScrollEmergence`, `ParallaxFooter`, `ScrollGrain`, `ScrollCue` |
| `src/data/blob-palettes.ts` | Blob color sets for palette switcher |

### 6. Potential conflicts

1. **Framer vs GSAP scroll** — both drive scroll-linked motion (experience rail,
   product visual, grain vs ST scrub).
2. **Double enters** — largely cleaned; `ScrollEmergence` deprecated but still
   in codebase / commented shipped block.
3. **Multiple raf loops** — Lenis `autoRaf` + Three `requestAnimationFrame` +
   Framer springs + shipped-flow geometry raf (if re-enabled).
4. **Cursor vs blob** — both track pointer (DOM cursor + shader `uMouse`); fine
   if roles stay separate; Task 5/8 cursor light must not fight blob.
5. **Hero SplitText vs MaskedLine** — two typographic reveal languages.
6. **Sameward** — GSAP stage scrub + Framer mock internals (OK if layers differ).
7. **Visible impact gap** — token-only Phase 07 explains “looking the same.”

### 7. Recommended files for the new global motion layer

| Priority | File | Role in Phase 08 |
|----------|------|------------------|
| Core | `src/lib/motion.ts` | Expand tokens (micro/UI/section/cinematic + atmosphere) |
| Core | `src/components/smooth-scroll.tsx` | Task 2 — Lenis feel + ST sync hardening |
| Core | `src/components/shared/blob-scene.tsx` | Task 4/16 — evolve into section-aware atmosphere |
| Core | `src/components/shared/cursor.tsx` | Task 5 — refine to dot/ring + light |
| Core | `src/components/shared/motion.tsx` | Keep Framer micro; add GSAP reveal helpers carefully |
| Core | `src/components/shared/parallax.tsx` | Migrate scroll parallax toward GSAP ST |
| Wire | `src/app/layout.tsx` | Mount order: cursor / Lenis / atmosphere / UI |
| Polish | `hero.tsx`, `featured-work-stage.tsx`, `experience.tsx`, `capabilities-workspace.tsx`, `contact.tsx` | Tasks 8–15 motion-only |
| Tokens CSS | `src/app/globals.css` | `--motion-*` already started; extend for light |

**Do not** add a second Three canvas. **Do not** install another animation lib.

---

## Agent starter (next turn)

```text
UI is LOCKED. Execute docs/phases/08-global-motion-system/README.md.
Complete Task 16 ONLY (global section atmosphere transitions) unless the user batches further.
Do not redesign sections. Do not edit teamhub-ai.
```

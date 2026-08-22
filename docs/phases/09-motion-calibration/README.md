# Phase 09 — Motion Calibration + Cinematic Polish

**Status:** ✅ Complete — Tasks 1–19  
**Prerequisite:** Phase 08 Tasks 0–19 shipped to production. UI remains **LOCKED**.

> This is **not** a redesign and **not** a new animation architecture.  
> We calibrate **perceived motion** so the live site feels like one cinematic
> interactive world — not “excellent static editorial + subtle animations.”

**Live site under audit:** https://sudheer-talapudi.vercel.app/

## North star (unchanged)

Editorial portfolio + cinematic motion + smooth scroll + subtle parallax +
ambient lighting + one controlled WebGL atmosphere + meaningful micro-interactions.

**Success:** same UI, more meaningful / perceptible / cohesive motion.  
**Failure mode to avoid:** more animation count without more storytelling.

## Locked (never change)

CONTENT · COPY · TYPOGRAPHY · LAYOUT · SPACING · SECTION ORDER · RESPONSIVE UI ·
SAMEWARD PRODUCT MOCK · CAPABILITIES UI · EXPERIENCE COPY · PROFILE · CONTACT
FORM · NAV · LINKS · BRAND COLORS · FUNCTIONALITY

No solar systems, cubes, giant 3D objects, particle storms, or new animation libs.

## Motion hierarchy (calibration guide)

| Level | Owns |
|-------|------|
| **1 Global world** | Lenis, WebGL atmosphere, cursor light, global bg movement |
| **2 Section** | Transitions, parallax bands, reveals, mood |
| **3 Content** | Typography, cards, product UI, diagrams |
| **4 Micro** | Buttons, icons, hover, cursor states |

Lower levels must never visually overpower higher levels.

## Implementation order — do not skip

| Task | Name | Status |
|------|------|--------|
| **1** | Live-site motion audit (no code) | ✅ Done |
| **2** | Scroll feel calibration (Lenis + ST) | ✅ Done |
| **3** | Global atmosphere calibration | ✅ Done |
| **4** | Global parallax calibration | ✅ Done |
| **5** | Hero cinematic timing | ✅ Done |
| **6** | Sameward depth | ✅ Done |
| **7** | Problem storytelling motion | ✅ Done |
| **8** | Approach storytelling motion | ✅ Done |
| **9** | Capabilities interaction polish | ✅ Done |
| **10** | Experience progression | ✅ Done |
| **11** | Profile breathing motion | ✅ Done |
| **12** | Contact micro-interactions | ✅ Done |
| **13** | Global section transitions | ✅ Done |
| **14** | Cursor refinement | ✅ Done |
| **15** | Motion ownership cleanup (GSAP vs Framer vs CSS) | ✅ Done |
| **16** | Desktop performance audit | ✅ Done |
| **17** | Tablet / mobile / reduced-motion audit | ✅ Done |
| **18** | Final visual polish | ✅ Done |
| **19** | typecheck + lint + build | ✅ Done |

### Batch progress (Tasks 2–6)

| Task | What shipped |
|------|----------------|
| 2 | `scrollFeel` tokens; Lenis `0.92` / wheel `0.94` — authored, not laggy |
| 3 | Stronger mood mix (0.34), glow, scroll orbit, mouse influence; clearer section deltas |
| 4 | Depth bands raised; tablet half-travel; parallax on hero cue, about auroras, tablet ground |
| 5 | Hero assemble timeline (blur→clear words, longer stagger); softer magnetic PUSH |
| 6 | Sameward enter scale/Y/brightness + stageLag 52 + tiny chassis tilt |

### Batch progress (Tasks 7–11)

| Task | What shipped |
|------|----------------|
| 7 | FragmentDrift: ±44px + blur peak → converge (fragmentation story) |
| 8 | Approach scrub activation: step brightens, previous settles |
| 9 | Capabilities quieter dim / stronger lift+glow; `data-cursor="Explore"` |
| 10 | Experience mute/illuminate stronger; GSAP rail progress |
| 11 | Profile calmer delayed reveals + existing parallax breath |

### Batch progress (Tasks 12–19)

| Task | What shipped |
|------|----------------|
| 12 | Contact focus ring glow + submit lift |
| 13 | `data-section-mood` + denser IO thresholds for journey continuity |
| 14 | Cursor labels (View / Explore / Send / →) |
| 15 | Experience rail → GSAP ScrollTrigger (Framer exit for scroll rail) |
| 16 | Kept one Lenis ticker + one Three raf; forceContextLoss retained |
| 17 | Mobile: simpler SectionReveal; drift/approach/parallax already degraded |
| 18 | Hierarchy polish across batch (no UI redesign) |
| 19 | typecheck / lint (0 errors) / build green |

---

## Complete

Phase 09 calibration finished. UI unchanged — motion more perceptible and cohesive.

**Production UX (post-09):** hero type starts on hydrate. Atmosphere loads
`/moon/color-1k.jpg` first (~136KB), then upgrades to 2K/4K. Cursor hotspot is
set in `pointermove` (no lerp). `AtmosphereReadyProvider` was removed so moon
ready no longer re-renders the whole tree.

After each task (historical process): implement only that task → run app → inspect → fix → then next.

---

## Task 1 — Live-site motion audit (2026-08-20)

### Method

1. Confirmed production deploy at https://sudheer-talapudi.vercel.app/ (full page
   content, section order, Sameward mock, capabilities, experience, profile,
   contact all present).
2. Evaluated **perceived** motion against Phase 08 north star — not “does the
   function exist.”
3. Cross-checked with **deployed magnitudes** in this repo (what production is
   actually running): travel distances, durations, mood mix, parallax wiring,
   cursor affordances, dual scroll owners.
4. Incorporated the live-experience verdict that the site still reads closer to
   **static editorial + subtle animation** than **one continuous cinematic world**.

> Interactive feel (wheel vs trackpad inertia) cannot be fully simulated from
> HTML fetch alone; Lenis/scroll judgments below combine production options
> (`duration: 0.88`, `wheelMultiplier: 1`) with the live “near-native” report.

### Overall verdict

**Technically complete. Experientially incomplete.**

The site is a strong editorial portfolio with competent micro-motion. It does
**not** yet feel like one living environment. Motion exists as many small
independent events (fade-ins, soft hovers, a quiet blob) rather than a continuous
journey with clear depth hierarchy.

### Scorecard (perceived)

| Area | Rating | Notes |
|------|--------|-------|
| First 3s / load | Too subtle | Hero word stagger exists; reads as polite fade, not “assemble.” Atmosphere does not announce itself. |
| Lenis scroll | Near-native | Present but not intentional enough to register as a designed scroll feel. |
| Cursor | Too subtle / incomplete | Dot+ring+light work; no contextual VIEW / EXPLORE / arrow states. Rarely remembered after leave. |
| WebGL atmosphere | Wallpaper-adjacent | Visible if you look for it; mood shifts (~20% mix) too quiet to connect sections. |
| Hero | Good bones / not cinematic | SplitText + timeline ship; travel (10–36px) and overlaps make it finish fast. Magnetic words (PUSH 22) are clever but local — not whole-hero depth. Product settle not in the entrance beat. |
| Sameward stage | Too subtle | Enter scale 0.97→1 + 28px scrub lag — physicality barely registers. |
| Problem / FragmentDrift | Imperceptible storytelling | ±18px drift on desktop only — concept (fragment → unify) does not read. |
| Approach activate | Too subtle | Sequence exists once; steps don’t feel like progressing decisions. |
| Capabilities | Already good (keep) | Hover language is the clearest Level-4 win; still needs quieter default / clearer selected. |
| Experience | Partial | Illumination (opacity 0.42 muted) helps; Framer rail + GSAP reveals compete. Not “progression.” |
| Profile | Quiet (good intent) | Correct breathing zone — don’t amp; ensure it isn’t another identical fade. |
| Contact | Micro only | Focus/submit polish present; not a warm destination beat yet. |
| Section transitions | Disconnected | Stack of sections; atmosphere doesn’t glue the journey. |
| Parallax depth | Mostly missing | `MotionParallax` wired **once** (capabilities aurora). No sitewide depth bands. |
| Typography reveals | Mixed | MaskedLine on some titles; many blocks are generic `SectionReveal` fade+24px. |

### Why Phase 08 feels weak (root causes)

1. **Magnitudes sit below perception thresholds**  
   - Reveal rise: 12–24px (sm/md) — reads as CSS fade.  
   - FragmentDrift: ±18px.  
   - Sameward scrub: ±28px.  
   - Depth tokens exist (`bg 28` / `decoration 42` / `visual 56`) but almost unused.

2. **Global world (Level 1) is too quiet to carry the page**  
   - Mood mix ~0.12–0.22 into palette — tint changes won’t read as section storytelling.  
   - Glow opacity ~0.07 — secondary light barely felt.  
   - Atmosphere motion is slow + low-contrast → wallpaper.

3. **Parallax is not a system yet**  
   Only capabilities aurora uses `MotionParallax`. Without background/mid/visual layers
   across Hero → Sameward → later sections, there is no depth continuum.

4. **Reveals are uniform, not hierarchical**  
   Same `SectionReveal` language on many blocks → every section “does the same
   fade.” Major titles don’t feel more important than body cards.

5. **Scroll feel is competent, not authored**  
   Lenis `0.88` / multiplier `1` is close to native. Users won’t notice “premium scroll.”

6. **Dual ownership (Framer + GSAP) on scroll**  
   Experience rail / word scrolls / older parallax helpers still Framer `useScroll`
   while Hero / Sameward / ST reveals are GSAP. Feels slightly inconsistent, not
   one choreography.

7. **Storytelling motions under-communicate**  
   Problem drift and Approach activation exist but don’t say “fragmentation” or
   “three engineering decisions” loudly enough to notice without looking for them.

8. **Empty / static stretches**  
   Long reading zones (case copy, experience bullets, profile) have little Level-1/2
   motion between events → page feels paused between fades.

### What is already good (keep / protect)

- Editorial UI, typography, and Sameward mock as the flagship asset  
- One WebGL canvas architecture (do not replace)  
- Lenis + single GSAP ticker sync path (tune, don’t rewrite)  
- Capabilities hover direction (lift / accent / focus dimming)  
- Experience “current / muted” illumination idea (Sameward strongest)  
- Reduced-motion and mobile cursor-off discipline  
- Hero SplitText infrastructure (calibrate timing, don’t reinvent)

### What feels excessive or redundant

- Multiple stacked fades on the same enter (MaskedLine + SectionReveal + Trace
  children) in some sections — competes, doesn’t deepen.  
- Hero magnetic word PUSH can feel gimmicky relative to weak global atmosphere
  (hierarchy inversion: Level 3 outshining Level 1).  
- Continuous micro-pulses inside the product mock (typing dots etc.) are fine
  locally but do not substitute for page-level cinema.

### Top 8 calibration priorities (ranked)

1. **Atmosphere perceptibility + scroll-linked mood** (Task 3 / 13) — make Level 1 felt  
2. **Lenis scroll authorship** (Task 2) — intentional without lag  
3. **Sitewide parallax depth bands** (Task 4) — depth continuum, not one aurora  
4. **Hero assemble timing + calm settle** (Task 5) — highest-priority first impression  
5. **Sameward physical depth** (Task 6) — flagship object must feel real  
6. **Problem drift + Approach sequence perception** (Tasks 7–8) — content-driven story  
7. **Section transition continuity via mood/parallax** (Task 13) — one journey  
8. **Ownership cleanup GSAP vs Framer** (Task 15) — one scroll choreographer  

Cursor labels (Task 14), experience progression (Task 10), contact warmth (Task 12),
and profile restraint (Task 11) follow after the world feels connected.

### Explicit non-goals for Phase 09

- Do not add more effect types “for coverage”  
- Do not raise every duration blindly  
- Do not brighten the blob into a neon wash  
- Do not redesign any section  

**Rule for every later task:** if it exists but is imperceptible → calibrate;  
if it adds noise → reduce; if it communicates story → strengthen carefully.

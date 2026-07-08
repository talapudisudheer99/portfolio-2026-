# Portfolio 2026 — Documentation

> Full documentation for Sudheer Talapudi's portfolio site.

## 1. Project Overview

| Item | Detail |
|------|--------|
| **Stack** | Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui (Nova / Base UI) |
| **Purpose** | Single-page portfolio showcasing frontend engineering experience |
| **GitHub** | [Sudheer-webDeveloper/portfolio-2026-](https://github.com/Sudheer-webDeveloper/portfolio-2026-) |
| **Deploy URL** | Set `NEXT_PUBLIC_SITE_URL` in Vercel after first deploy |

## 2. Local Development

```bash
npm install
cp .env.example .env.local   # add your keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build      # production build
npm run start      # run production build locally
npm run typecheck  # TypeScript only
npm run lint       # ESLint
```

## 3. Environment Variables

| Variable | Required | Purpose | Where to get |
|----------|----------|---------|--------------|
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Yes (contact form) | Sends contact form to your email | [web3forms.com](https://web3forms.com) dashboard |
| `NEXT_PUBLIC_SITE_URL` | After deploy | Canonical URL for SEO, OG tags, social previews | Your Vercel URL (e.g. `https://portfolio-2026.vercel.app`) |

**Local `.env.local` example:**

```env
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Never commit `.env.local`.** Only `.env.example` goes in git.

## 4. Contact Form Setup (Web3Forms)

1. Sign up at [web3forms.com](https://web3forms.com) with `sudheertalaudi@gmail.com`
2. Create a form → domain: `localhost` for dev
3. Copy the **Access Key** → paste in `.env.local`
4. Restart `npm run dev`
5. Submit test message → check Gmail inbox (and spam)

**After Vercel deploy:**

1. Add your Vercel domain in Web3Forms form settings (e.g. `your-app.vercel.app`)
2. Add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in Vercel → Settings → Environment Variables
3. Redeploy

**Where messages appear:** Gmail inbox + Web3Forms dashboard. Not inside the app.

## 5. Resume Setup (important — do after Vercel deploy)

The site links to `/resume.pdf` from the navbar, hero, and footer.

### Before uploading `public/resume.pdf`

1. Deploy to Vercel first and copy your live URL
2. **Edit your resume PDF** and set the portfolio URL to your Vercel link, for example:
   - `https://portfolio-2026.vercel.app`
   - or your custom domain later
3. Export/save the PDF as `resume.pdf`
4. Place it at `public/resume.pdf` in this repo
5. Commit and push → Vercel auto-redeploys

**Do not upload the resume until the Vercel URL is final** — otherwise the link inside the PDF will be wrong.

### Resume link in code

All resume buttons read from `src/data/site.ts`:

```ts
resume: {
  label: "Download Resume",
  href: "/resume.pdf",  // served from public/resume.pdf
}
```

## 6. Metadata & Favicon

| Asset | Location | Purpose |
|-------|----------|---------|
| Page metadata | `src/lib/metadata.ts` + `src/data/site.ts` | Title, description, OG, Twitter cards |
| Favicon | `public/favicon.svg` | Browser tab icon (ST monogram) |
| Apple icon | `public/apple-icon.svg` | iOS home screen |
| OG image | `src/app/opengraph-image.tsx` | Auto-generated social preview (1200×630) |
| Site URL helper | `src/lib/site-url.ts` | Resolves `NEXT_PUBLIC_SITE_URL` or Vercel URL |

**After deploy:** set `NEXT_PUBLIC_SITE_URL` so link previews and canonical URLs use your production domain.

**Verify metadata:**

- View page source → check `<title>`, `<meta name="description">`, `og:*` tags
- Test OG preview: [https://www.opengraph.xyz](https://www.opengraph.xyz)

## 7. Content Update Guide

| What to change | File |
|----------------|------|
| Contact, nav, social, hero, footer, metadata copy | `src/data/site.ts` |
| Section titles (About, Skills, etc.) | `src/data/sections.ts` |
| About paragraphs & highlights | `src/data/about.ts` |
| Experience jobs | `src/data/experience.ts` |
| Projects | `src/data/projects.ts` |
| Skills groups | `src/data/skills.ts` |
| Contact form labels & toast messages | `src/data/contact.ts` |

**Rule:** All user-facing copy lives in `src/data/*.ts`. Components should not hardcode text.

## 8. Architecture Guide

```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata, navbar, footer, toaster
│   ├── page.tsx            # Composes all sections
│   ├── globals.css         # Design tokens & theme variables
│   └── opengraph-image.tsx # Dynamic OG image
├── components/
│   ├── layout/             # navbar, footer
│   ├── sections/           # hero, about, skills, experience, projects, contact
│   ├── shared/             # reusable wrappers (not shadcn primitives)
│   └── ui/                 # shadcn components
├── data/                   # SINGLE SOURCE OF TRUTH for content
├── hooks/                  # use-contact-form.ts
├── lib/                    # utils, metadata, site-url
└── types/                  # TypeScript interfaces
```

**Data flow:** `src/data/*.ts` → section components → `page.tsx`

**Reusable shared components:**

- `SectionWrapper` — consistent max-width & padding
- `SectionHeader` — title + description
- `SocialLinks` — GitHub, LinkedIn, email icons
- `ResumeButton` — resume CTA
- `ExperienceCard` / `ProjectCard` — data-driven cards

## 9. Responsive Breakpoints

Mobile-first Tailwind breakpoints used across the site:

| Breakpoint | Min width | Typical layout changes |
|------------|-----------|------------------------|
| `base` | 0px | Single column, stacked hero CTAs, mobile nav sheet |
| `sm:` | 640px | Hero buttons inline |
| `md:` | 768px | Desktop navbar links, skills 2-column grid |
| `lg:` | 1024px | About/contact 2-column split, projects 2-column grid |
| `xl:` | 1280px | Max content width capped at `max-w-6xl` (1152px) |

Test at: **375px**, **768px**, **1024px**, **1440px**.

## 10. Deploy to Vercel

1. Push repo to GitHub (`Sudheer-webDeveloper/portfolio-2026-`)
2. [vercel.com](https://vercel.com) → **Add New Project** → import repo
3. Framework preset: **Next.js** (auto-detected)
4. Add environment variables:
   - `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-app.vercel.app`
5. Deploy
6. Add Vercel domain to Web3Forms allowed domains
7. Update resume PDF with live URL → add `public/resume.pdf` → push

## 11. Confidentiality Checklist

- [ ] Do NOT expose internal product names
- [ ] Do NOT publish staging URLs or unreleased features
- [ ] Frame employer work as "enterprise platform under active development"
- [ ] Focus on frontend engineering decisions, not product marketing
- [ ] All public copy must be interview-defensible

## 12. Debug Guide

### Contact form shows error / nothing in Gmail

| Check | Fix |
|-------|-----|
| `.env.local` missing key | Add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` |
| Dev server not restarted after env change | `Ctrl+C` then `npm run dev` |
| Domain not allowed in Web3Forms | Add `localhost` (dev) or Vercel URL (prod) |
| Key wrong | Copy fresh key from Web3Forms dashboard |

### Contact form crashes on submit

- Fixed: `theme-provider.tsx` now guards `event.key` being undefined when typing in form fields.

### Resume button 404

- `public/resume.pdf` does not exist yet — add after Vercel deploy (see Section 5).

### Wrong favicon / old tab title

- Hard refresh: `Cmd+Shift+R`
- Favicon: `public/favicon.svg`
- Metadata: `src/data/site.ts` + `src/lib/metadata.ts`

### OG image / social preview wrong

- Set `NEXT_PUBLIC_SITE_URL` to production URL
- Redeploy Vercel
- Test at [opengraph.xyz](https://www.opengraph.xyz)
- OG image route: `/opengraph-image`

### Git shows 10,000+ changes in Cursor

- Cursor opened parent folder instead of `portfolio-2026`
- **Fix:** Open folder `portfolio-2026` directly, or pick that repo in Source Control dropdown
- Do NOT commit from home-directory git repo (`~/`)

### `npm run build` fails

```bash
npm run typecheck   # find TS errors
npm run lint        # find lint errors
```

Common fixes: missing env at build time is OK for static pages; fix any TypeScript `any` or import errors.

### Dark mode toggle not working

- Use sun/moon button in navbar, or press `d` (when not typing in a form)
- Theme stored via `next-themes` in `class` on `<html>`

### Push to GitHub fails (auth)

- Use SSH key added to `Sudheer-webDeveloper` account, or HTTPS + Personal Access Token
- Personal git identity for this repo:
  ```bash
  git config user.name "Sudheer Talapudi"
  git config user.email "sudheertalaudi@gmail.com"
  ```

## 13. Known Issues / TODO

- [ ] Deploy to Vercel and set `NEXT_PUBLIC_SITE_URL`
- [ ] Add `public/resume.pdf` with updated portfolio URL inside PDF
- [ ] Add Vercel domain to Web3Forms
- [ ] Optional: custom domain
- [ ] Optional: Google Analytics / Vercel Analytics

## 14. Folder Map

| Path | Purpose |
|------|---------|
| `public/` | Static files (`favicon.svg`, `resume.pdf` later) |
| `docs/PORTFOLIO.md` | This file — project & debug documentation |
| `src/app/` | Next.js App Router entry, layout, global styles |
| `src/components/layout/` | Navbar, footer |
| `src/components/sections/` | Page sections (hero → contact) |
| `src/components/shared/` | Reusable layout/content wrappers |
| `src/components/ui/` | shadcn/ui primitives |
| `src/data/` | All portfolio copy & config |
| `src/hooks/` | `use-contact-form` (Web3Forms) |
| `src/lib/` | Utilities, metadata builder, site URL |
| `src/types/` | Shared TypeScript interfaces |
| `.env.example` | Documented env var template |
| `.env.local` | Your secrets (gitignored) |

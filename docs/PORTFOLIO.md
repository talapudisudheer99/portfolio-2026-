# Portfolio 2026 — Documentation

> Full documentation for Sudheer Talapudi's portfolio site.

## 1. Project Overview

| Item | Detail |
|------|--------|
| **Stack** | Next.js (App Router), TypeScript, Tailwind CSS v4, shadcn/ui (Nova / Base UI) |
| **Purpose** | Single-page portfolio showcasing frontend engineering experience |
| **Deploy URL** | _TODO: add after Vercel deployment_ |

## 2. Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 3. Environment Variables

| Variable | Purpose | Where to get |
|----------|---------|--------------|
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Web3Forms access key for contact form | [web3forms.com](https://web3forms.com) dashboard |

## 4. Contact Form Setup

_TODO: step-by-step Web3Forms setup (step 10)_

## 5. Content Update Guide

| Section | File to edit |
|---------|--------------|
| Contact, nav, social, hero, footer | `src/data/site.ts` |
| Experience | `src/data/experience.ts` |
| Projects | `src/data/projects.ts` |
| Skills | `src/data/skills.ts` |

## 6. Architecture Guide

_TODO: folder map, reusable components, data flow (step 10)_

## 7. Responsive Breakpoints

_TODO: Tailwind breakpoint reference (step 10)_

## 8. Deploy to Vercel

_TODO: repo connect, env vars, custom domain (step 10)_

## 9. Confidentiality Checklist

- [ ] Do NOT expose internal product names
- [ ] Do NOT publish staging URLs or unreleased features
- [ ] Frame employer work as "enterprise platform under active development"
- [ ] Focus on frontend engineering decisions, not product marketing
- [ ] All public copy must be interview-defensible

## 10. Known Issues / TODO

- [ ] Add `public/resume.pdf`
- [ ] Complete remaining sections (About, Skills, Experience, Projects, Contact)
- [ ] Wire contact form to Web3Forms
- [ ] Add `og:image`
- [ ] Deploy to Vercel

## 11. Folder Map

_TODO: complete directory reference (step 10)_

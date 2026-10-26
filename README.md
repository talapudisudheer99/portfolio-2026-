# Sudheer Talapudi — Portfolio

Frontend engineer portfolio, live at [sudheer-talapudi.vercel.app](https://sudheer-talapudi.vercel.app/).
Flagship case study: [Sameward](https://sameward.com/), a realtime team workspace I built and launched.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
GSAP + ScrollTrigger on Lenis (scroll motion) · three.js (moon and props, one WebGL layer) ·
Framer Motion (small UI transitions)

```bash
npm install
cp .env.example .env.local   # Web3Forms key for the contact form
npm run dev
```

- Content lives in `src/data/*.ts` (experience, skills, projects, site copy).
- Motion tokens live in `src/lib/motion.ts`; the depth field and hero cast in
  `src/components/shared/blob-scene.tsx` and `src/lib/space-props-3d.ts`.
- Respects `prefers-reduced-motion`.

More: [docs/PORTFOLIO.md](./docs/PORTFOLIO.md)

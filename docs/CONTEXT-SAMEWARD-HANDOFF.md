# Sameward → Portfolio handoff context

> For Agent chats opened on **portfolio-2026** only.  
> Source product repo: `teamhub-ai` (Sameward). Do not edit that repo from portfolio work.

## Product

- Brand: **Sameward** · Domain: **sameward.com** · Live: https://sameward.com/
- Pitch: one workspace for teams to talk, plan, and get AI help — channels, realtime, profiles, Channel AI
- Not a Slack/Notion clone; borrows problems, ships a calm Ocean Blue product

## What Sudheer actually built (interview proof)

Use this for the flagship case study — decisions and systems, not buzzwords.

| Area | Shipped |
|------|---------|
| Frontend | Next.js App Router, TypeScript, RTK Query, shadcn/Base UI, design system, adaptive sidebar, marketing + app shell |
| Auth | Session cookies, Google OAuth, email verification, password reset, logout-all |
| Backend | Next.js Route Handlers, MongoDB/Mongoose multi-tenant workspaces/members/roles |
| Realtime | Separate Socket.IO service, handshake auth, channel rooms, typing/presence patterns |
| Storage | AWS S3 presigned uploads (avatars/attachments); existing bucket names kept stable |
| Email | Resend; production domain `sameward.com` verified; `EMAIL_FROM=Sameward <no-reply@sameward.com>`; links via `APP_URL` |
| AI | Channel AI (summarize, catch-up, ask, draft, etc.) + link-aware context on public URLs |
| Deploy | Railway (Next web + realtime); production `APP_URL=https://sameward.com` |
| Product craft | Rebrand TeamHub → Sameward (UI/copy/logo); **intentionally kept** Mongo `dbName`, S3 bucket, secrets stable |

## Infrastructure policy (do not mis-sell)

User-facing = Sameward. Legacy internal IDs may still say `teamhub` — that is intentional. Portfolio should praise **judgment** (when not to migrate), not claim every string was renamed.

## Portfolio requirements (from planning chat)

1. Warm editorial portfolio — expressive typography, asymmetric composition,
   full-bleed product media, and restrained CSS/Framer motion. WebGL was tested
   and rejected after review because it duplicated clearer HTML content.
2. Highlight **only Sameward** as the modern flagship project; beautiful, impactful case study
3. Update skills/experience to include backend + infra learned on Sameward
4. Keep employer enterprise work confidential (“enterprise platform under active development”)
5. Reuse portfolio architecture: `src/data/*` content model, Web3Forms contact, resume.pdf, Vercel
6. Visual direction: engineered / calm — avoid generic indigo-violet SaaS cliché; align with Sameward Ocean Blue where it helps
7. Recruiters: proof + architecture decisions > skill badge grids

## Suggested case study chapters

1. Problem — chat / docs / AI fragmented  
2. Product — live Sameward  
3. Architecture — Next · Socket.IO · Mongo · S3 · Resend · OpenAI  
4. Decisions — dual services, grounded AI, infra stability  
5. End-to-end build list  
6. Proof — live URL, screenshots/clip, stack

## Out of scope for portfolio chat

- Migrating Sameward Mongo/S3/secrets for branding  
- Editing TeamHub/Sameward application code  
- Building a free-roam 3D “world explorer” as the whole site  

## Phases

Execute `docs/phases/README.md` in order.

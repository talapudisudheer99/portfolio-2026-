# Phase 00 — Content foundation

**Goal:** Preserve the useful product story while redesigning the presentation.  
**Status:** ✅ Keep

## Validated content to retain

- [x] Frontend-strong positioning and end-to-end product signal
- [x] Sameward as the sole flagship project
- [x] Sameward architecture, product scope, and trade-off content
- [x] Capability groups: UI, API/data, realtime, auth, AI, ship/ops
- [x] Phrontier confidential framing
- [x] Web3Forms, resume, contact, SEO, and social data

## Copy QA required before ship

- [ ] Remove internal job-search language from public copy, including
  “targeting Frontend Engineer II and Senior Frontend roles”
- [ ] Reduce repeated phrases (“frontend-strong”, “end-to-end”, “flagship”)
- [ ] Replace unsupported marketing claims with factual proof
- [ ] Keep paragraphs short enough for editorial layouts
- [ ] Confirm dates, experience totals, contact details, URLs, and resume match

## Locked principle

`src/data/*` remains the source of truth. Visual components may recompose or
shorten data, but must not hardcode user-facing portfolio copy.

## Done when

The content remains accurate and useful after the v2 visual reset, with final
copy QA completed in Phase 05.

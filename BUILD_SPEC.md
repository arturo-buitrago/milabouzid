# Build Spec — Mila Bouzid Website

Execute in phases. **See `CLAUDE.md`** for stack, design tokens, content model, seed content,
and guardrails. Golden rule: **nothing user-facing is hardcoded** — every bit of copy, every
event, every link routes through a CMS collection.

---

## Phase 0 — Scaffold
- Init Astro (TypeScript, minimal template), static output.
- Set `astro.config.mjs` `site` = `https://milabouzid.com`; no `base` (root domain).
- Create `src/styles/tokens.css` with the color + font CSS vars from CLAUDE.md; import globally.
- Drop the logotype + flower SVGs into `src/assets/`.
- Wire Google Fonts placeholders for `--font-display` / `--font-body`.

**Done when:** `npm run dev` serves a blank, themed page and tokens are available site-wide.

## Phase 1 — Content layer first (bind UI to real data)
- Define Astro content collections (typed schemas) matching the model: `settings`, `events/`,
  `videos/`, `bio`, `booking`.
- Seed with the known content from CLAUDE.md (tagline, booking email, the two events, the video ID,
  lorem bio + booking blurb).
- Components must read from these collections, never from literals.

**Done when:** content files exist and are schema-typed; a scratch loop can render the event titles from content.

## Phase 2 — Sections (single page, anchor-scroll)
Build components, each bound to content, in this order:
1. **Layout + sticky Nav** — Home / Listen / Live events / Booking / Bio, smooth scroll.
2. **Hero** — logotype, tagline strip, BOOKING + LISTEN buttons, social icon row
   (icons from Simple Icons/Lucide; hrefs from `settings`).
3. **Listen** — carousel over `videos` (embed YouTube by ID, prev/next arrows) + repertoire download (from `settings`).
4. **Live events** — cards over `events` (title / date / venue / location / more-info),
   `sold_out` badge, + "Follow on bandsintown" button (`settings.bandsintown_url`).
5. **Bio** — from `bio` (heading, body, photo) + presskit download + Booking button.
6. **Booking** — from `booking` (heading, blurb, `mailto:` email).

**Done when:** structure matches the mockup, all text/links come from content, and editing a content
file visibly changes the page.

## Phase 3 — Visual polish (the hard part — budget time here)
- Recreate the radial glow gradients (layered), color-blocked sections, neon-on-dark look.
- Pill buttons + hover states; place the flower motif (yellow + white variants).
- Mobile-first responsive pass — glows must not tank layout or performance on phones.
- Optimize all imagery with Astro's `<Image>`.

**Done when:** a side-by-side with the PDF mockup is a close match, and it holds up from 375px width upward.

## Phase 4 — CMS (`/admin`)
- Add `public/admin/index.html` that loads Sveltia CMS from its CDN.
- Write `public/admin/config.yml`:
  - `backend`: `name: github`, `repo: arturo-buitrago/milabouzid`, `branch: main`, `base_url: {{WORKER_URL}}`
  - `media_folder` / `public_folder` for image + PDF uploads (repertoire, presskit)
  - the collections, with **Mila-friendly labels**, help text on event fields, a date-picker widget
    for `events.date`, and image widgets for logo/photos.

**Done when:** `/admin` loads; after the owner wires the Worker (CLAUDE.md), login works and an edit
produces a commit → rebuild → visible change.

## Phase 5 — Deploy
- Add `.github/workflows/deploy.yml` using the official Astro → GitHub Pages workflow.
- Add `public/CNAME` containing `milabouzid.com`.
- Confirm a clean deploy with seed content **before** DNS is wired.

**Done when:** pushing to `main` publishes the site to GitHub Pages.

---

## Handoff checklist (owner, after the build)
- [ ] Create Mila's dedicated GitHub account and add it as a repo collaborator with write access.
- [ ] Wire CMS auth: deploy `sveltia-cms-auth` Worker, register GitHub OAuth app, set Worker env
      vars, put `base_url` in `config.yml` (steps in CLAUDE.md).
- [ ] Register/add `milabouzid.com` in Cloudflare, then point DNS → GitHub Pages (grey cloud first for the cert).
- [ ] Fill the `{{...}}` blanks: font names, social links, bandsintown URL, worker/OAuth values.
- [ ] Replace lorem bio + booking blurb with real copy; upload real repertoire + presskit PDFs.
- [ ] (Later) swap placeholder video/channel for the real ones.
- [ ] Sit with Mila once while she drives `/admin` end-to-end, and fix anything confusing before she's solo.
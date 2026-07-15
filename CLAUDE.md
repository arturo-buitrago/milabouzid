# CLAUDE.md — Mila Bouzid Website

Project memory for Claude Code. **Read this first every session.**

## What this is
A single-page website for **Mila Bouzid** — singer, voice actress, content creator.
Built so **Mila can edit all content herself** through a no-code admin panel, while the
**owner handles deploy/infra**. That split is the whole point of the architecture — respect it.

## Core stack (decided — do not swap without asking)
- **Astro** — static output, TypeScript, no SSR.
- **Sveltia CMS** — git-based, browser-only, mounted at `/admin`.
- **GitHub Pages** — deployed via GitHub Actions on push to `main`.
- **Repo:** `github.com/arturo-buitrago/milabouzid` (owner: `arturo-buitrago`, name: `milabouzid`).
- **Cloudflare** — DNS + TLS + `sveltia-cms-auth` Worker (OAuth relay for CMS login).
- **Two GitHub accounts:** the owner's, plus a **dedicated editing account for Mila** added as a
  collaborator with write access (so her CMS edits are commits attributed to her).

## Guardrails (non-negotiable)
- **All user-facing content lives in CMS collections** (markdown/JSON in the repo), never hardcoded
  in components. If you're about to hardcode copy, an event, or a link — put it in content instead.
- **Fonts are placeholders.** Use CSS vars `--font-display` and `--font-body` wired to Google Fonts
  stand-ins. Real Canva fonts are swapped in later — keep that a two-line change.
- **Use Mila's custom SVGs only for the logotype and the flower/asterisk motif.** All social icons
  come from an icon set (Simple Icons or Lucide) — do NOT use her exported social-logo SVGs.
- **Booking is a `mailto:` link, not a form.** Do not add a form backend.
- Site is static — no browser storage APIs beyond what Astro needs.
- **Mobile-first.** The glow-heavy design must degrade gracefully and stay fast on phones.

## Design tokens (extracted from the Canva mockup — real values)
Define as CSS custom properties in `src/styles/tokens.css`:
| Token | Value | Use |
|---|---|---|
| `--yellow` | `#f7f83e` | primary brand |
| `--yellow-neon` | `#edff06` | accent / glow |
| `--yellow-pure` | `#fffc00` | buttons / highlights |
| `--black` | `#000000` | base |
| `--black-warm` | `#1d1b0c` | background tint |
| `--purple` | `#894685` | events panel, gradient glows |
| `--pink` | `#f878cd` | accent |
| `--white` | `#ffffff` | text on dark |

Fonts (PLACEHOLDERS):
- `--font-display`: serif stand-in (e.g. "Playfair Display")  /* {{FONT_DISPLAY}} — real name TBD */
- `--font-body`: sans stand-in (e.g. "Inter")                  /* {{FONT_BODY}} — real name TBD */
- Display serif = the logo wordmark look; sans = everything else.

Motifs:
- Radial "glow" gradients behind sections (green, warm orange/red, blue).
- Color-blocked full-bleed sections; neon-on-dark aesthetic.
- Pill-shaped buttons.
- Flower/asterisk motif reused in yellow and white.

Assets (saved locally, named by Canva ID, e.g. `MAGzZ1EkGgw.svg`, in `src/assets/`):
- **Logotype wordmark** ("MILA BOUZID", decorative M, flower as the O) — custom SVG, use as-is, do NOT rebuild in CSS.
- **Flower/asterisk motif** — custom SVG, make it a reusable component.
- (Any other exported SVGs are social brand icons — ignore them, use the icon set.)

## Site structure (single page, anchor-scroll)
Sticky nav repeating these anchors: **Home · Listen · Live events · Booking · Bio**
1. **Home / hero** — full-bleed portrait, logotype, tagline strip, BOOKING + LISTEN buttons, social icon row.
2. **Listen** — YouTube video carousel (prev/next arrows) + "Download repertoire list" button.
3. **Live events** — event cards + "Follow on bandsintown" button.
4. **Bio** — heading, bio text, portrait, "Download artist profile & presskit" button, Booking button.
5. **Booking** — "Booking inquiry" / "Private events, collabs, studio work" + blurb + booking email (mailto).

## Content model (Sveltia collections in `public/admin/config.yml`)
- **settings** (singleton): logo, hero_image, tagline, social links {tiktok, instagram, snapchat, youtube, threads}, booking_email, repertoire_pdf, presskit_pdf, bandsintown_url
- **events** (folder): title, date, venue, location, more_info_url, sold_out (bool)
- **videos** (folder): youtube_url, title, order
- **bio** (singleton): body (markdown), photo
- **booking** (singleton): heading, blurb, email

Mirror this with Astro **content collections** (typed schemas) so components read from content, not literals.

## Known content (seed with this)
- **Tagline:** `Singer · Voice Actress · Content Creator`
- **Booking email:** `booking@milabouzid.com`
- **Events (seed):**
  - Mzansi International Music Festival 2027 — 28 March 2027 — Cedar Rock Convention Centre
  - Elevate Symphonic Rivermond 2027 — 15 April 2027 — Rivermond Arena
- **Listen video (placeholder, keep for now):** YouTube `5xVSUAo7bhU`; channel `UCPbEcJyVcETaWrubYOg4UTw`
- **Bio + booking blurb:** lorem ipsum placeholder — leave as placeholder; Mila supplies real copy.

## Blanks to fill (grep for `{{`)
- `{{FONT_DISPLAY}}`, `{{FONT_BODY}}` — real Canva font names
- `{{BANDSINTOWN_URL}}`
- `{{SOCIAL_TIKTOK}}`, `{{SOCIAL_INSTAGRAM}}`, `{{SOCIAL_SNAPCHAT}}`, `{{SOCIAL_YOUTUBE}}`, `{{SOCIAL_THREADS}}`
- `{{WORKER_URL}}`, `{{GITHUB_CLIENT_ID}}`, `{{GITHUB_CLIENT_SECRET}}`

## Commands
- Dev: `npm run dev`
- Build: `npm run build`  (static output to `dist/`)
- Preview: `npm run preview`

## Target repo layout
```
/
├─ CLAUDE.md
├─ astro.config.mjs         # set `site` = https://milabouzid.com ; no `base` (root domain)
├─ public/
│  ├─ admin/
│  │  ├─ index.html         # loads Sveltia CMS from CDN
│  │  └─ config.yml         # backend + collections
│  └─ CNAME                 # milabouzid.com
├─ src/
│  ├─ assets/               # logotype + flower SVGs
│  ├─ components/           # Nav, Hero, VideoCarousel, EventCard, BioSection, Booking, Flower
│  ├─ layouts/
│  ├─ pages/index.astro
│  └─ styles/tokens.css     # color + font CSS vars
├─ content/                 # CMS-managed: settings, events/, videos/, bio, booking
└─ .github/workflows/deploy.yml
```

## Deploy
- GitHub Actions: build Astro, publish to Pages on push to `main` (use the official Astro → Pages workflow).
- **Domain `milabouzid.com` is new — not yet registered/configured.** Set it up fresh in Cloudflare
  (register or add the zone), then point the GitHub Pages DNS records at Pages. Set those records to
  **DNS-only (grey cloud) first** so GitHub can issue the TLS cert; enable the proxy afterward if wanted.
- `public/CNAME` must contain `milabouzid.com`.

## CMS auth setup (owner does these by hand — dashboards, not code)
Two accounts ⇒ **add Mila's editing account as a repo collaborator with write access** (GitHub → repo →
Settings → Collaborators). She logs in with her own account. Use OAuth "Login with GitHub" for the nicest UX:
1. Deploy the `sveltia-cms-auth` Worker to Cloudflare → copy the worker URL
   (`https://sveltia-cms-auth.<subdomain>.workers.dev`).
2. GitHub → Settings → Developer settings → OAuth Apps → register an app.
   **Authorization callback URL = the Worker URL.** Copy the **Client ID** and **Client Secret**.
3. In Cloudflare, set the Worker env vars: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`.
   Optionally set `ALLOWED_DOMAINS` = `milabouzid.com` to lock the worker to this site.
4. In `public/admin/config.yml`, set `backend.base_url` = the Worker URL.

**Quick-test alternative (owner only):** skip 1–4 and click "Sign In with Token" using a GitHub
personal access token. Note PATs expire (~90 days), so it's fine for testing but not for ongoing use.
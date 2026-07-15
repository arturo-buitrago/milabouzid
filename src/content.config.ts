import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/*
 * Content collections — the typed mirror of the Sveltia CMS model (CLAUDE.md).
 * Every user-facing string/link/image routes through here; components read these,
 * never literals. Content files live in the repo-root `content/` dir so Mila's
 * CMS edits and these typed reads point at exactly the same files.
 *
 * Image/PDF fields are optional strings for now: no portrait/PDF assets exist yet,
 * and the CMS will write upload paths as strings. We move to Astro's <Image> in Phase 3.
 */

// settings (singleton) — file() with a parser that gives the single object a stable id.
const settings = defineCollection({
  loader: file('content/settings.json', {
    parser: (text) => [{ id: 'settings', ...JSON.parse(text) }],
  }),
  schema: z.object({
    id: z.string(),
    logo: z.string().optional(), // logo is font-based; optional image override only
    hero_image: z.string().optional(),
    tagline: z.string(),
    social: z.object({
      tiktok: z.string().optional(),
      instagram: z.string().optional(),
      snapchat: z.string().optional(),
      youtube: z.string().optional(),
      threads: z.string().optional(),
    }),
    booking_email: z.string().email(),
    repertoire_pdf: z.string().optional(),
    presskit_pdf: z.string().optional(),
    bandsintown_url: z.string().optional(),
  }),
});

// events (folder) — one markdown file per show, frontmatter only.
const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    venue: z.string(),
    location: z.string().optional(),
    more_info_url: z.string().optional(),
    sold_out: z.boolean().default(false),
  }),
});

// videos (folder) — one markdown file per video, frontmatter only.
const videos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/videos' }),
  schema: z.object({
    title: z.string(),
    youtube_url: z.string(),
    order: z.number().default(0),
  }),
});

// bio (singleton) — markdown file: `photo` in frontmatter, bio copy in the body.
const bio = defineCollection({
  loader: glob({ pattern: 'bio.md', base: './content' }),
  schema: z.object({
    photo: z.string().optional(),
  }),
});

// booking (singleton) — file() with parser, mirrors settings.
const booking = defineCollection({
  loader: file('content/booking.json', {
    parser: (text) => [{ id: 'booking', ...JSON.parse(text) }],
  }),
  schema: z.object({
    id: z.string(),
    heading: z.string(),
    blurb: z.string(),
    email: z.string().email(),
  }),
});

export const collections = { settings, events, videos, bio, booking };

# TRAX — Next.js Rebuild

Rebuilt from the ground up in Next.js 14 (App Router). Migrated from Vite + React. Deployed on Vercel.

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables
cp .env.local.example .env.local
# Edit .env.local — add your Aptabase App Key (already set if migrating from Vite)

# 3. Run development server
npm run dev
# Open http://localhost:3000
```

### Environment Variables

| Variable | Value | Source |
|----------|-------|--------|
| `NEXT_PUBLIC_APTABASE_KEY` | `A-EU-3317515012` | Existing Vite project (no new Aptabase project needed) |

---

## Build

```bash
npm run build
npm start
```

---

## Project Structure

```
app/                        # Next.js App Router pages
  layout.tsx                # Root layout — fonts, Aptabase, Navigation, Footer
  page.tsx                  # Home page (/)
  experiences/page.tsx      # Experiences index (/experiences)
  dobrogea-calling/page.tsx # Dobrogea Calling (/dobrogea-calling)
  carpathian-ridge/page.tsx # Carpathian Ridge (/carpathian-ridge)
  the-ground/page.tsx       # The Ground (/the-ground)
  long-way-in/page.tsx      # The Long Way In (/long-way-in)
  out-there/page.tsx        # Out There (/out-there)
  manifesto/page.tsx        # Manifesto (/manifesto)
  about/page.tsx            # About (/about)
  field-notes/page.tsx      # Field Notes index (/field-notes)
  field-notes/[slug]/       # Individual dispatch (/field-notes/slug)
  not-found.tsx             # 404 page
  sitemap.ts                # Auto-generated sitemap.xml
  robots.ts                 # robots.txt

components/                 # Shared components
  Analytics.tsx             # Aptabase page_visit tracking
  Navigation.tsx            # Fixed top-right nav (client)
  Footer.tsx                # Footer with CTA and socials (client)
  ExperiencesClient.tsx     # Experiences page (client — tracking)
  ExperiencesPreviewClient.tsx # Home experiences preview (client)
  DobrogeaCallingCTA.tsx    # CTA button (client — tracking)
  WhatsAppCTA.tsx           # Reusable WhatsApp CTA button (client)
  CopyLinkButton.tsx        # Copy link for Manifesto (client)
  ui/
    Button.tsx              # Bordered button component
    Container.tsx           # Max-width wrapper + Spacer
    Logo.tsx                # TRAX wordmark
    Typography.tsx          # Headline, SubHeadline, Body, MonoLabel, Divider

content/
  field-notes/              # MDX dispatch files
    dimineata-de-dupa-dobrogea.mdx
    ce-ramane-dupa-carpathian-ridge.mdx

lib/
  field-notes.ts            # MDX reading utilities (gray-matter)

public/
  assets/                   # All images (copied from Vite /public/assets/)
  android-chrome-*.png      # Favicons
  apple-touch-icon.png
  favicon*.png / favicon.ico
  site.webmanifest
```

---

## Vercel Deployment — Framework Migration

**Changing from Vite to Next.js on the same Vercel project:**

1. Push the new Next.js codebase to the same GitHub repo (replace Vite files)
2. In Vercel Dashboard → Project Settings → General:
   - **Framework Preset:** Change from `Vite` to `Next.js`
   - **Build Command:** `next build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install`
3. Set environment variable `NEXT_PUBLIC_APTABASE_KEY` =  in Vercel project settings
4. Redeploy

**No URL redirects needed** — all Vite routes used HTML5 history API (no hash routing), and all URLs are preserved exactly in the Next.js file structure.

---

## Adding New Field Notes

Create a new `.mdx` file in `content/field-notes/`:

```yaml
---
title: "Titlul dispatșului"
location: "Dobrogea, România"
date: "2025-04"
excerpt: "O propoziție care nu explică tot."
coverImage: "/images/field-notes/slug-cover.jpg"
published: true
---

Body copy in Markdown/MDX...
```

The dispatch will appear automatically in `/field-notes` (reverse chronological order by `date`) and generate a static page at `/field-notes/[slug]`.

---

## Visual Verification Checklist

Before shipping, verify each page matches the Vite original screenshots in `/migration/screenshots/`:

- [ ] `/` — Hero image, headline, all home sections visible
- [ ] `/experiences` — Grid layout, Dobrogea active, rest locked/dimmed
- [ ] `/dobrogea-calling` — Hero, details grid, CTA section
- [ ] `/carpathian-ridge` — Hero, all content sections
- [ ] `/the-ground` — Hero, practical frame section
- [ ] `/long-way-in` — Full long-form page
- [ ] `/out-there` — Full long-form page
- [ ] `/manifesto` — Full-screen, centered, dark
- [ ] `/about` — Identity statement, Ce nu suntem, Ce protejăm, email link
- [ ] `/field-notes` — Grid of dispatch cards
- [ ] `/field-notes/[slug]` — MDX rendered correctly
- [ ] 404 — Romanian copy, link to /experiences
- [ ] Navigation — Fixed, top-right, mix-blend-difference
- [ ] Footer — WhatsApp CTA, socials, copyright
- [ ] Global watermark — tyre-mark image, 6% opacity, fixed

---

## Design Tokens (Tailwind)

| Token | Value | Usage |
|-------|-------|-------|
| `trax-black` | `#0E0F11` | Background |
| `trax-white` | `#F4F3EF` | Foreground / headings |
| `trax-red` | `#8C1D18` | Accent / CTA / brand |
| `trax-grey` | `#8E9196` | Secondary text / muted |
| `font-sans` | IBM Plex Sans | Headlines, UI |
| `font-body` | Inter | Body copy |
| `font-mono` | IBM Plex Mono | Labels, tags |
| `tracking-trax-wide` | `0.05em` | Letter spacing |
| `.trax-image` | CSS filter | Desaturated image treatment |

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server (binds to 0.0.0.0)
npm run build        # Production build → dist/
npm run preview      # Preview the production build locally
npm run type-check   # TypeScript type checking (no emit)
```

Deploy is via Cloudflare Workers/Pages using `wrangler` — `wrangler deploy` triggers `npm run build` and publishes `dist/` as static assets.

## Architecture

This is a **static React SPA** that acts as a re-skin of a Blogger-hosted astrology site. There is no backend or API — all content is baked directly into the source.

### Content model

All pages and their HTML are stored in a single data file: [src/data/pages.ts](src/data/pages.ts).

- `pages` array — one entry per route, each with `path`, `title`, and `html` (raw HTML string scraped/migrated from the original Blogger blog).
- `navItems` — the ordered list used to render the top nav.
- `labelPages` — category landing pages reached via `/search/label/:label` routes (e.g. Nakshatras, Planets, Vastu, Muhurtha).

**To add a new article:** append an entry to the `pages` array in [src/data/pages.ts](src/data/pages.ts) and add an `<a>` card to the `/p/articles.html` page entry's HTML string.

### Routing

The app uses `HashRouter` (from `react-router-dom`), so URLs look like `/#/2026/01/article-slug.html`. This is important because the site is deployed as static files on Cloudflare — hash routing avoids 404s on direct navigation.

Routes are generated dynamically from the `pages` array plus two pattern routes for label pages:
- `/search/label/:label` and `/search/label/:label.html`

The catch-all `*` route renders the home page content.

### Internal link interception

`PageView` in [src/App.tsx](src/App.tsx) intercepts clicks on anchor tags within page content (`dangerouslySetInnerHTML` blocks). If the `href` matches a known internal path or a label URL, it uses `navigate()` instead of a full page reload — this keeps the SPA experience intact for links embedded in the raw HTML content.

### Content styling

Each article's `html` string typically includes its own `<style>` block with scoped CSS classes (using Cinzel/Georgia fonts, a dark maroon/gold colour scheme). Global layout styles are in [src/styles.css](src/styles.css). Google Fonts (`Cinzel`, `Cinzel Decorative`) are loaded via `<link>` tags embedded inside the per-page HTML strings.

### Deployment

Configured in [wrangler.jsonc](wrangler.jsonc) — project name `valabhiastrology`, serves the `dist/` directory as static assets on Cloudflare Workers.

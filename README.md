# Andy Woodruff

Personal site for [andywoodruff.net](https://andywoodruff.net). Built with Astro, deployed via Cloudflare Pages.

## Local Development

```bash
bun install         # install deps (one-time)
bun run dev         # local dev server with hot reload at http://localhost:4321
bun run build       # production build to ./dist
bun run preview     # serve the production build locally
bun run typecheck   # astro check (type errors in .astro files + content schemas)
```

## Project Structure

```
src/
  content.config.ts          # Zod schemas for each content collection
  content/                   # markdown / mdx — one folder per collection
    projects/
    predictions/
    ideas/
    curation/
  layouts/
    Base.astro               # shell: head, nav, footer
    PostLayout.astro         # individual post wrapper
  pages/
    index.astro              # home
    about.astro
    archives.astro
    rss.xml.ts               # RSS feed for all collections
    {collection}/index.astro       # listing page
    {collection}/[...slug].astro   # dynamic single-post page
  styles/global.css
  components/
public/
  images/                    # static assets served at /images/*
```

## Adding Content

Drop a markdown file into `src/content/{collection}/`. Frontmatter is type-checked at build time per the schemas in `src/content.config.ts`. Required: `title`. Optional: `date`, `description`, `tags` (max 5 per [TAGS.md](TAGS.md)), `cover`, `draft`.

## Deploy (Cloudflare Pages)

The repo is connected to Cloudflare Pages. Push to `main` deploys production; push to any other branch creates a preview deployment at `<branch>.<project>.pages.dev`.

**Build settings (configured in CF Pages dashboard):**

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `bun run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node version (env var `NODE_VERSION`) | `22` or higher |

If CF Pages does not natively support `bun`, set the build command to `npm install -g bun && bun install && bun run build`.

## Content Guidelines

- YAML frontmatter (`---`) only, never TOML.
- See [TAGS.md](TAGS.md) for tagging rules and approved tags (max 5 per file).
- Anything smaller than an `h3` looks too small.

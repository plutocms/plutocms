# Pluto CMS documentation

The documentation site of [Pluto CMS](https://github.com/plutocms/pluto). It uses
[Nuxt UI](https://ui.nuxt.com) and [Nuxt Content](https://content.nuxt.com).

## Setup

```bash
bun install
```

## Development

```bash
bun run dev
```

## Production

```bash
bun run build
bun run preview
```

The pages are Markdown files in the `content/` folder.

## The CMS

The pages are edited in the Pluto admin at `/admin`. The site uses the layer
[@plutocms/nuxt-content](https://github.com/plutocms/nuxt-content). In development, the admin
reads and writes the local `content/` folder, and you are signed in as a local user. In
production, it uses the GitHub repository. Copy `.env.example` to `.env` and fill the secrets of
the GitHub App.

Until the layer and Pluto 0.19 are on npm, run the site with local checkouts:

```bash
PLUTO_PLUTO_PATH=../pluto PLUTO_NUXT_CONTENT_PATH=../nuxt-content bun run dev
```

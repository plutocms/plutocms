# Pluto documentation

The documentation site of [Pluto](https://github.com/plutocms/pluto). It uses
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

Pluto finds the GitHub repository from `PLUTO_CMS_REPO`, from Vercel, or (in development) from
the `origin` remote of the git repository. Set `PLUTO_CMS_REPO` only for a build elsewhere.

## Local layers (Pluto development)

By default, the site uses the npm packages. To work on Pluto, set `PLUTO_LOCAL_ROOT=..` in
`.env`. The `plutoLayer` helper in `nuxt.config.ts` then uses the local checkouts next to the
site (`../nuxt-content`, `../pluto`, `../utils`, and so on). `PLUTO_USE_LOCAL=false` turns it
off. `PLUTO_<NAME>_PATH` (for example `PLUTO_PLUTO_PATH`) points one layer at another folder. A
production build on Vercel has no `.env`, so it uses the npm packages.

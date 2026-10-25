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

In development, the site uses the local checkouts `../nuxt-content` and `../pluto` when they
exist next to it. `PLUTO_USE_LOCAL=false` uses the npm packages instead. `PLUTO_NUXT_CONTENT_PATH`
and `PLUTO_PLUTO_PATH` point at other folders. A production build uses the npm packages.

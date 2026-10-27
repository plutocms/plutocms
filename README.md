# Pluto documentation

The documentation site of [Pluto](https://github.com/plutocms/pluto):
[pluto.vulmix.dev](https://pluto.vulmix.dev).

The site runs on Pluto. The pages are Markdown files in `content/`, and we edit them in the Pluto
admin at `/admin` ([@plutocms/nuxt-content](https://github.com/plutocms/nuxt-content)).

## Run it

```bash
bun install
bun run dev
```

Open `http://localhost:3000/admin`. In development you are signed in as a local user, and the
admin edits the files in `content/`.

To work on the Pluto layers at the same time, set `PLUTO_LOCAL_ROOT=..` in `.env`. See
[Contributing](https://pluto.vulmix.dev/contributing/workspace#local-layers).

## Write docs

Read [Writing docs](https://pluto.vulmix.dev/contributing/writing-docs) first.

---
seo:
  title: Pluto CMS, the layerable CMS
  description: Pluto CMS is a CMS for Nuxt. You build it from layers. Use it with no database, or with Supabase.
---

::u-page-hero{class="dark:bg-gradient-to-b from-neutral-900 to-neutral-950"}
---
orientation: horizontal
---
#top
:hero-background

#title
Pluto CMS: the [layerable CMS]{.text-primary}.

#description
Pluto CMS is a CMS for [Nuxt](https://nuxt.com). You build it from layers. You install only the layers that you need. Run it with no database, or on top of Supabase.

#links
  :::u-button
  ---
  to: /getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::

  :::u-button
  ---
  icon: i-simple-icons-github
  color: neutral
  variant: outline
  size: xl
  to: https://github.com/plutocms/pluto
  target: _blank
  ---
  GitHub
  :::

#default
  :::prose-pre
  ---
  code: |
    bun create pluto@latest
  filename: Terminal
  ---

  ```bash [Terminal]
  bun create pluto@latest
  ```
  :::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
Everything a CMS needs, as layers

#description
Each layer does one job. A layer plugs into the admin with one function. You add a layer when you need it.

#features
  :::u-page-feature
  ---
  icon: i-lucide-layers
  ---
  #title
  Layer-based

  #description
  Pluto is built on Nuxt layers. The core layer gives the admin. Backend and feature layers add data, auth, and content.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-layout-dashboard
  ---
  #title
  Generated admin

  #description
  Declare a content type once. Pluto makes the list page, the form, the navigation entry, and the dashboard tile.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-shield-check
  ---
  #title
  Capabilities

  #description
  A layer declares capabilities. A user holds capabilities through roles. The admin is for staff only.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-languages
  ---
  #title
  Translated admin

  #description
  The admin speaks English and Brazilian Portuguese. A new language is a new JSON file.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-mail
  ---
  #title
  Mail built in

  #description
  Pluto sends its own emails through a mail driver. A guided setup page helps you connect Resend.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-palette
  ---
  #title
  One Tailwind build

  #description
  Your app owns the only Tailwind build. The admin keeps its own theme, so your site styles do not change it.
  :::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
Two modes

#description
Pick the mode that fits your project.

#features
  :::u-page-card
  ---
  icon: i-lucide-github
  to: /github-cms
  title: Standalone mode
  ---
  Posts are Markdown files in a GitHub repository. Editors sign in with a GitHub App. Each save is a commit. There is no database.
  :::

  :::u-page-card
  ---
  icon: i-lucide-database
  to: /supabase
  title: Supabase mode
  ---
  Supabase gives the database, the sign-in, and the roles. Feature layers add a shop, a blog, and a media library.
  :::
::

::u-page-section{class="dark:bg-gradient-to-b from-neutral-950 to-neutral-900"}
  :::u-page-c-t-a
  ---
  links:
    - label: Start building
      to: '/getting-started'
      trailingIcon: i-lucide-arrow-right
    - label: View on GitHub
      to: 'https://github.com/plutocms/pluto'
      target: _blank
      variant: subtle
      icon: i-simple-icons-github
  title: Ready to build with layers?
  description: Create a project in one command. Read the guides when you want to add your own layer.
  class: dark:bg-neutral-950
  ---

  :stars-bg
  :::
::

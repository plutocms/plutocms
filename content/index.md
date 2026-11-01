---
seo:
  title: Pluto, a small CMS with a big heart
  description: Pluto is a CMS that you build from Nuxt layers. Use it in your Nuxt app, or headless with any stack. Keep the content in Git, or add a backend layer with a database.
---

::pluto-hero
#headline
Small core. Big heart.

#title
A small CMS with a [big heart]{.text-primary}.

#description
Pluto is a layerable CMS powered by [Nuxt](https://nuxt.com). Start small, add layers as needed.

#links
  :::u-button
  ---
  to: /docs/getting-started
  size: xl
  trailing-icon: lucide:arrow-right
  ---
  Get started
  :::

  :::u-button
  ---
  icon: i-lucide-layers
  color: neutral
  variant: outline
  size: xl
  to: /layers
  ---
  Browse layers
  :::

#default
  :::code-group{sync="package-manager"}
  ```bash [npm]
  npm create pluto@latest
  ```

  ```bash [pnpm]
  pnpm create pluto@latest
  ```

  ```bash [yarn]
  yarn create pluto
  ```

  ```bash [bun]
  bun create pluto@latest
  ```

  ```bash [deno]
  deno run -A npm:create-pluto@latest
  ```
  :::

#notice
Pluto is in alpha. Expect breaking changes until the first stable release.
::

::u-page-section
#headline
  :::pluto-chip{icon="i-lucide-terminal" center}
  One command
  :::

#title
From zero to an admin in one command

#description
`create-pluto` asks a few questions, downloads a template, and installs it. Start the dev server, and your site and its admin are ready.

#default
  :::pluto-setup-demo
  :::
::

::u-page-section
#headline
  :::pluto-chip{icon="i-lucide-layers" center}
  Layers
  :::

#title
A small core. Add a layer when you need it.

#description
Each layer does one job, and it plugs into the admin with one function. Pick layers, and see the admin and the config change.

#default
  :::pluto-layers-demo
  :::
::

::u-page-section
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

::u-page-section
#headline
  :::pluto-chip{icon="i-lucide-plug" center}
  Headless
  :::

#title
Use it headless, with any stack

#description
The public API gives your published content as JSON. Read it from Next.js, Astro, a mobile app, or a script.

#default
  :::pluto-headless-demo
  :::
::

::u-page-section
#title
Your backend

#description
Keep the content in Git, or add a database. The admin is the same.

#features
  :::u-page-card
  ---
  icon: i-simple-icons-git
  to: /docs/git-cms
  title: Content in Git
  ---
  Posts are Markdown files in Git. Each save is a commit: in your local repository out of the box, in GitHub on a deployed site. There is no database.
  :::

  :::u-page-card
  ---
  icon: lucide:database
  to: /docs/getting-started/choose-a-backend
  title: A backend layer
  ---
  A backend layer gives the database, the sign-in, and the roles. Feature layers add a shop, a blog, and a media library. Supabase is the first backend layer.
  :::
#headline
::

::u-page-section
#headline
  :::pluto-chip{icon="i-lucide-blocks" center}
  The layer directory
  :::

#title
Layers for your next project

#description
Backends, features, and add-ons. Each one is a package on npm.

#default
  :::pluto-layer-showcase
  :::
::

::u-page-section
#headline
  :::pluto-chip{icon="i-lucide-telescope" center}
  Why the name?
  :::

#title
Pluto is small. People love it anyway.

#description
In 2006, Pluto lost its title of planet. It is smaller than our Moon. Then, in 2015, the New Horizons probe flew past it, and Pluto was not simple at all.

#features
  :::u-page-feature
  ---
  icon: i-lucide-heart
  ---
  #title
  It has a heart

  #description
  Pluto has a big, pale plain in the shape of a heart: Tombaugh Regio. The heart is in our logo. Pluto is free and open source, and we want it to be friendly.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-layers
  ---
  #title
  It is made of layers

  #description
  New Horizons saw more than 20 layers of haze in the air of Pluto. Pluto CMS has layers too: a small core, and one layer for each job.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-orbit
  ---
  #title
  Small is a feature

  #description
  A dwarf planet is still a world. The core is small, and you add only what you need. Your site stays light.
  :::
::

::u-page-section
  :::u-page-c-t-a
  ---
  links:
    - label: Start building
      to: '/docs/getting-started'
      trailingIcon: i-lucide-arrow-right
    - label: View on GitHub
      to: 'https://github.com/plutocms/pluto'
      target: _blank
      variant: subtle
      icon: i-simple-icons-github
  title: Ready to start small?
  description: Create a project in one command. Read the guides when you want to add your own layer. These docs run on Pluto too, and we edit them in its admin.
  ---

  :stars-bg
  :::
::

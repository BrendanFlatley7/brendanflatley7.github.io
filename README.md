# Resume

A personal resume site, statically generated with [Astro](https://astro.build) and deployed to
GitHub Pages. The same page doubles as the source for a printable PDF, generated locally.

## How it works

Resume content lives in [`src/data/resume.ts`](src/data/resume.ts) — summary, skills, experience,
projects, education — and the components render from it. Roles are nested under employers, so one
company can hold several roles, each with labeled bullet groups that render as subheadings.

Empty values disappear: a blank profile link, an absent location, or an empty section simply
doesn't render.

## Local development

```bash
npm install
npm run dev
```

## Generating the PDF

```bash
npm run pdf
```

Builds the site, renders it under the print stylesheet, and writes a PDF to `out/`.

One-time setup for the headless browser:

```bash
npx playwright install chromium
```

`out/` is gitignored and the deploy workflow never runs this script, so PDFs exist only on the
machine that generates them.

To tune pagination, edit [`src/styles/print.css`](src/styles/print.css). Chrome's print preview
(Cmd+P on the dev server) shows exactly what `npm run pdf` will produce.

## Variants

`src/data/resume.ts` is the canonical resume and the only thing the site ever renders. A *variant*
is a thin overlay in [`src/data/variants/`](src/data/variants) that re-frames the summary, re-orders
skills, and swaps a role's bullet groups, falling through to the base resume for anything it doesn't
mention — so the underlying facts are stated once.

Variants affect locally generated PDFs only:

```bash
npm run pdf -- --variant=<id>   # one variant
npm run pdf -- --all            # neutral + every variant
```

To add one, copy an existing file in `src/data/variants/` and register it in
[`src/data/resolve.ts`](src/data/resolve.ts). Name variants after the *emphasis* they carry, not
after any employer — this repo is public.

## What's gitignored

This repo is public, so a few things are kept out of it deliberately:

| Path | Why |
|---|---|
| `.env.local` | Contact details that shouldn't be scraped off the published HTML. See [Configuration](#configuration). |
| `out/` | Generated PDFs — build artifacts, and they carry the private values above. |
| `DOCS.md` | Full project documentation, including notes on what each variant targets. |

## Configuration

Values that shouldn't appear in the published HTML are read at build time from `.env.local`, which
is gitignored:

```bash
cp .env.example .env.local
```

CI has no `.env.local`, so the deployed site omits them while local builds — and therefore local
PDFs — include them.

## Deploying

Push to `main`. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and publishes
to GitHub Pages. In the repository settings, set **Pages → Source** to **GitHub Actions** once.

To serve from the domain root, the repo must be named `<username>.github.io`. Any other name makes
it a project site served from `/<repo-name>/`, which also requires setting `base` in
[`astro.config.mjs`](astro.config.mjs) to that subpath.

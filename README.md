# Resume

A personal site, statically generated with [Astro](https://astro.build) and deployed to
GitHub Pages. The same content is also the source for a printable resume PDF, generated locally.

## How it works

Content lives in [`src/data/resume.ts`](src/data/resume.ts) — summary, skills, experience,
projects, education — and the components render from it. Roles are nested under employers, so one
company can hold several roles, each with labeled bullet groups that render as subheadings.

Empty values disappear: a blank profile link, an absent location, or an empty section simply
doesn't render.

### Two surfaces, one set of components

The site and the PDF show the same facts at different depths, so
[`src/pages/index.astro`](src/pages/index.astro) branches on the build-time `isExport` flag from
[`src/data/resolve.ts`](src/data/resolve.ts) and each section component takes a mode prop rather
than being duplicated.

| | Site | PDF |
|---|---|---|
| Order | summary beside the projects, then experience, tools, education | summary, experience, projects, skills, education |
| Experience | company, role, dates, and the tools it was worked in | every bullet, plus the `exportOnly` project detail |
| Skills | one flat strip of the technical list | the full grouped grid, technical and professional |
| Projects | cards wearing each project's own logo | name, blurb, and link as text |

Only the branch that matches the build ships — `isExport` is a constant, so the other one is
dropped from the bundle.

### Project marks

The project cards show each project's own logo or wordmark, vendored into `public/projects/`:

```bash
npm run marks
```

The script downloads or screenshots each mark, trims it to its artwork, and prints the values to
paste into that project's `mark` in `src/data/resume.ts`. Run it once and commit the results;
re-run only if a project rebrands. Vendoring rather than hotlinking keeps the page free of web
fonts, keeps the build offline-capable, and lets the marks render in generated PDFs.

Tool logos beside each role come from `src/icons/`, keyed by the slugs in
[`src/data/tools.ts`](src/data/tools.ts). A slug with no artwork there falls back to its name set
in small type — which is what Tableau and SQL do, since Simple Icons carries no Tableau mark and
SQL is a language rather than a brand.

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

## What's gitignored

This repo is public, so a few things are kept out of it deliberately:

| Path | Why |
|---|---|
| `.env.local` | Contact details that shouldn't be scraped off the published HTML. See [Configuration](#configuration). |
| `out/` | Generated PDFs — build artifacts, and they carry the private values above. |
| `DOCS.md` | Full project documentation. |

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

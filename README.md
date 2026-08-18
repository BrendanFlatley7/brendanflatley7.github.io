# Resume

Personal resume site, statically generated with [Astro](https://astro.build) and deployed to
GitHub Pages. The same page is also the source for a printable PDF that is generated locally.

## Editing content

Everything lives in [`src/data/resume.ts`](src/data/resume.ts) — summary, skills, experience,
projects, education. That's the only file to touch for routine updates; the components read from it.

A few conventions:

- **Roles are nested under employers.** One company can hold several roles, including concurrent
  ones (see MetLife). Each role holds labeled bullet groups — that's how "Key Projects" and
  "Core Responsibilities" render as subheadings within a role.
- **`projects` is for personal work samples**, not employer work. Employer projects belong in the
  relevant role's bullet groups. The Projects section is hidden entirely while the array is empty.
- **`exportOnly: true` hides a bullet group from the website.** The "Key Projects" groups use this,
  so the public site stays a short overview — summary, skills, links, each role with its
  responsibilities, education — while generated PDFs carry the project detail. A role left with a
  single bullet group drops its subheading, since there's nothing to contrast it against.
- **Empty values disappear.** Blank profile links, an absent `location`, an empty `additional`
  skills list — none of them render.

## Job-specific variants

`src/data/resume.ts` is the neutral, canonical version — it's what the public site always renders.
A **variant** is a thin overlay for one application, living in
[`src/data/variants/`](src/data/variants):

| Variant | Aimed at |
|---|---|
| `content` | Netflix · Analytics Engineer 4 — Content Data Science & Engineering |
| `infra` | Netflix · Analytics Engineer 5 — Infrastructure Efficiency & Productivity |

A variant may override `summary`, `headline`, and `skills`, and may replace a specific role's
bullet groups via `roleGroups` (keyed by company, then role title). Anything it doesn't mention
falls through to the base — so the underlying facts are stated once, and a variant only re-frames,
re-orders, and selects from them.

Each variant carries its own shortlist of Key Projects — the ones that speak to that posting, not
every project you've done. That's the main thing to revisit when targeting a new role.

To add one, copy an existing file in `src/data/variants/`, then register it in
[`src/data/resolve.ts`](src/data/resolve.ts).

**The site never renders a variant, and never renders project detail.** `RESUME_VARIANT` and
`RESUME_EXPORT` are injected only by the PDF script, so `npm run dev`, `npm run build`, and the
deploy workflow all produce the neutral overview.

## Local development

```bash
npm install
npm run dev
```

## Generating the PDF

```bash
npm run pdf                       # neutral canonical resume
npm run pdf -- --variant=content  # one tailored variant
npm run pdf -- --all              # neutral + every variant
```

Builds the site, renders it under the print stylesheet, and writes to `out/` — the neutral version
as `Brendan-Flatley-Resume.pdf`, and each variant suffixed with its label, e.g.
`Brendan-Flatley-Resume-Content-DSE.pdf`.

One-time setup for the headless browser:

```bash
npx playwright install chromium
```

`out/` is gitignored, and the deploy workflow never runs this script — so the PDF exists only on
your machine. Note that this does not stop a visitor from using their browser's own print function
on the live site; it means the site publishes no PDF of its own.

To tune how the PDF paginates, edit [`src/styles/print.css`](src/styles/print.css). Chrome's print
preview (Cmd+P on the dev server) shows exactly what `npm run pdf` will produce, which makes it the
fastest way to iterate.

### Phone number

The phone number is deliberately kept out of the published site. It's read at build time from
`.env.local`, which is gitignored:

```bash
cp .env.example .env.local   # then fill in RESUME_PHONE
```

CI has no `.env.local`, so the deployed HTML contains no phone number; your local build does, so the
PDF does. Verify any time with:

```bash
npm run build && grep -c "your-number" dist/index.html
```

## Deploying

Push to `main`. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and publishes
to GitHub Pages. In the repository settings, set **Pages → Source** to **GitHub Actions** once.

The repo must be named `brendanflatley7.github.io` — matching the GitHub account exactly — for the
site to serve from the domain root at <https://brendanflatley7.github.io/>. Any other name makes it a
project site served from `/<repo-name>/`, which additionally requires setting `base` in
[`astro.config.mjs`](astro.config.mjs) to that subpath.

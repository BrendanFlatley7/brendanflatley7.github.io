/**
 * Local-only capture of the personal projects' own brand marks.
 *
 * The site shows each project the way it presents itself, so the marks are
 * vendored into public/projects/ rather than hotlinked or re-typeset. That
 * keeps the page free of web fonts (My Little Gambler's wordmark is set in
 * Unbounded, which this site does not otherwise load), keeps the build
 * offline-capable, and lets the marks render in generated PDFs.
 *
 * Run once and commit the results; re-run only if a project rebrands.
 *
 *   npm run marks
 */

import { chromium } from "playwright";
import { mkdir, writeFile, readFile, stat } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join("public", "projects");

/** Longest edge of a written mark. 2x the widest card it can land in. */
const MAX_EDGE = 1200;

/** Output encoding is driven by each mark's file extension. */
const MIME = { png: "image/png", webp: "image/webp" };

/**
 * `download` takes the asset as the project serves it; `element` screenshots a
 * live element instead. Either way the result is trimmed to the mark itself.
 * `sample` names the element whose background colour becomes the card plaque
 * in src/data/resume.ts.
 */
const MARKS = [
  {
    name: "Hi / Lo",
    url: "https://hi-lo-psi.vercel.app/",
    // Already a raster logo on their side, but served as a 1536x1024 canvas
    // with the mark floating in a cream field — the trim below recovers it.
    download: "https://hi-lo-psi.vercel.app/hi-lo-logo.png",
    // Textured artwork on a flat field: WebP holds it at a fifth of PNG's size.
    file: "hi-lo.webp",
    sample: 'img[alt*="logo" i]',
  },
  {
    name: "My Little Gambler",
    url: "https://my-little-gambler.vercel.app/",
    // A text wordmark (Unbounded 700). The element box runs the full width of
    // its container, so most of the shot is transparent padding — trimmed.
    element: "h1",
    file: "my-little-gambler.png",
    sample: "h1",
  },
];

/**
 * Crops a PNG down to its mark: transparent margins where the image has an
 * alpha channel, otherwise the flat corner colour. Keeps a small proportional
 * margin so the mark doesn't sit flush against the card plaque, and caps the
 * longest edge so a 1536px source doesn't ship as a 380 KB asset.
 */
const TRIM = async ([dataUrl, maxEdge, mime]) => {
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });

  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, c.width, c.height);

  const at = (x, y) => (y * c.width + x) * 4;
  const corner = data.slice(at(0, 0), at(0, 0) + 4);
  // An alpha channel is the reliable mask; a flat opaque field is not, so fall
  // back to "differs from the corner colour by more than a JPEG-ish wobble".
  const hasAlpha = corner[3] < 250;
  const isInk = (i) =>
    hasAlpha
      ? data[i + 3] > 12
      : Math.abs(data[i] - corner[0]) +
          Math.abs(data[i + 1] - corner[1]) +
          Math.abs(data[i + 2] - corner[2]) >
        24;

  let top = c.height, left = c.width, right = -1, bottom = -1;
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      if (!isInk(at(x, y))) continue;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
      if (x < left) left = x;
      if (x > right) right = x;
    }
  }
  if (right < 0)
    return { dataUrl, width: c.width, height: c.height, trimmed: false };

  const pad = Math.round(Math.max(right - left, bottom - top) * 0.03);
  left = Math.max(0, left - pad);
  top = Math.max(0, top - pad);
  right = Math.min(c.width - 1, right + pad);
  bottom = Math.min(c.height - 1, bottom + pad);

  const w = right - left + 1;
  const h = bottom - top + 1;
  const scale = Math.min(1, maxEdge / Math.max(w, h));

  const out = document.createElement("canvas");
  out.width = Math.round(w * scale);
  out.height = Math.round(h * scale);
  const octx = out.getContext("2d");
  octx.imageSmoothingQuality = "high";
  octx.drawImage(c, left, top, w, h, 0, 0, out.width, out.height);

  const toHex = (r, g, b) =>
    "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");

  return {
    dataUrl: out.toDataURL(mime, 0.92),
    width: out.width,
    height: out.height,
    trimmed: true,
    // An opaque mark brings its own field with it, and that — not whatever the
    // project's page sets behind the element — is the colour the card plaque
    // has to match, or a seam shows around the image.
    field: hasAlpha ? null : toHex(corner[0], corner[1], corner[2]),
  };
};

/** Walks up from the element until it hits a non-transparent background. */
const PROBE = (selector) => {
  const el = document.querySelector(selector);
  if (!el) return null;
  const toHex = (v) => {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const ctx = c.getContext("2d");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
  };
  let node = el;
  let plaque = null;
  while (node && node !== document.documentElement) {
    const bg = getComputedStyle(node).backgroundColor;
    if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) {
      plaque = toHex(bg);
      break;
    }
    node = node.parentElement;
  }
  return { plaque, ink: toHex(getComputedStyle(el).color) };
};

async function capture(browser, scratch, mark) {
  const outPath = path.join(OUT_DIR, mark.file);
  const page = await browser.newPage({ deviceScaleFactor: 3 });
  try {
    await page.goto(mark.url, { waitUntil: "networkidle" });

    const raw = mark.download
      ? await (await page.request.get(mark.download)).body()
      : await page.locator(mark.element).first().screenshot({ omitBackground: true });

    // Trimmed on a blank page: the projects' own pages may carry an img-src
    // policy that refuses to decode a data: URL.
    const mime = MIME[path.extname(mark.file).slice(1)];
    if (!mime) throw new Error(`Unsupported output format for ${mark.file}`);

    const result = await scratch.evaluate(TRIM, [
      "data:image/png;base64," + raw.toString("base64"),
      MAX_EDGE,
      mime,
    ]);
    await writeFile(outPath, Buffer.from(result.dataUrl.split(",")[1], "base64"));

    const probe = await page.evaluate(PROBE, mark.sample);
    const { size } = await stat(outPath);

    console.log(`\n→ ${mark.name}`);
    console.log(`  ✓ ${outPath}  (${(size / 1024).toFixed(0)} KB)`);
    console.log(
      `    mark       ${result.width}×${result.height}${result.trimmed ? "" : "  (nothing to trim)"}`,
    );
    console.log(
      `    plaque     ${result.field ?? probe?.plaque ?? "(none found)"}` +
        (result.field ? "  (the mark's own field)" : "  (from the page behind it)"),
    );
    if (probe) console.log(`    ink        ${probe.ink}`);
    console.log("    → copy these into the project's `mark` in src/data/resume.ts");
  } finally {
    await page.close();
  }
}

let browser;
try {
  await mkdir(OUT_DIR, { recursive: true });
  browser = await chromium.launch();
  const scratch = await browser.newPage();
  for (const mark of MARKS) {
    await capture(browser, scratch, mark);
  }
  console.log("");
} catch (error) {
  if (String(error).includes("Executable doesn't exist")) {
    console.error(
      "\n  ! Playwright's Chromium isn't installed. Run once:\n" +
        "    npx playwright install chromium\n",
    );
    process.exitCode = 1;
  } else {
    throw error;
  }
} finally {
  await browser?.close();
}

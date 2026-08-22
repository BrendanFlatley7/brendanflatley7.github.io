/**
 * Local-only PDF generator.
 *
 * Builds the site, serves it, and renders it to a PDF with print media
 * emulation — so the output matches what Chrome's print preview shows.
 *
 * This never runs in CI. The output lands in a gitignored directory, so the
 * generated PDFs are not published anywhere.
 *
 *   npm run pdf                          # neutral canonical resume
 *   npm run pdf -- --variant=content     # tailored to a specific posting
 *   npm run pdf -- --all                 # neutral + every variant
 */

import { build, preview } from "astro";
import { chromium } from "playwright";
import { existsSync } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

import { contentVariant } from "../src/data/variants/content.ts";
import { infraVariant } from "../src/data/variants/infra.ts";

const VARIANTS = Object.fromEntries(
  [contentVariant, infraVariant].map((v) => [v.id, v])
);

const OUT_DIR = "out";
const BASE_NAME = "Brendan-Flatley-Resume";

// --- arguments ------------------------------------------------------------

const argv = process.argv.slice(2);
const all = argv.includes("--all");
const variantArg = argv
  .find((a) => a.startsWith("--variant"))
  ?.split("=")[1]
  ?.trim();

if (variantArg && !VARIANTS[variantArg]) {
  console.error(
    `\n  ! Unknown variant "${variantArg}".\n` +
      `    Available: ${Object.keys(VARIANTS).join(", ")}\n`
  );
  process.exit(1);
}

/** null means the neutral, canonical resume. */
const targets = all
  ? [null, ...Object.keys(VARIANTS)]
  : [variantArg ?? null];

if (!existsSync(".env.local")) {
  console.warn(
    "\n  ! .env.local not found — PDFs will be generated without your phone number.\n" +
      "    Create it with:  cp .env.example .env.local\n"
  );
}

// --- render ---------------------------------------------------------------

async function renderPdf(browser, id) {
  const variant = id ? VARIANTS[id] : null;
  const fileName = variant
    ? `${BASE_NAME}-${variant.label}.pdf`
    : `${BASE_NAME}.pdf`;
  const outPath = path.join(OUT_DIR, fileName);

  console.log(`\n→ ${variant ? variant.label : "Neutral (canonical)"}`);
  console.log("  building…");

  await build({
    logLevel: "error",
    vite: {
      // Baked in at build time so src/data/resolve.ts picks the right overlay.
      define: {
        "import.meta.env.RESUME_VARIANT": JSON.stringify(id ?? undefined),
        // Unlocks the `exportOnly` bullet groups (Key Projects). The site
        // build never sets this, so project detail stays out of the public page.
        "import.meta.env.RESUME_EXPORT": "true",
      },
    },
  });

  const server = await preview({ logLevel: "error" });
  try {
    const page = await browser.newPage();
    await page.goto(`http://${server.host ?? "localhost"}:${server.port}/`, {
      waitUntil: "networkidle",
    });

    // The whole point: lay the page out under the print stylesheet, not the
    // screen one, so the PDF and Cmd+P produce the same document.
    await page.emulateMedia({ media: "print" });

    await mkdir(OUT_DIR, { recursive: true });
    await page.pdf({
      path: outPath,
      printBackground: true,
      // Let the @page rule in print.css decide paper size and margins.
      preferCSSPageSize: true,
      tagged: true,
    });
    await page.close();

    const { size } = await stat(outPath);
    console.log(`  ✓ ${outPath}  (${(size / 1024).toFixed(0)} KB)`);
  } finally {
    await server.stop();
  }
}

let browser;
try {
  browser = await chromium.launch();
  for (const id of targets) {
    await renderPdf(browser, id);
  }
  console.log("");
} catch (error) {
  if (String(error).includes("Executable doesn't exist")) {
    console.error(
      "\n  ! Playwright's Chromium isn't installed. Run once:\n" +
        "    npx playwright install chromium\n"
    );
    process.exitCode = 1;
  } else {
    throw error;
  }
} finally {
  await browser?.close();
}

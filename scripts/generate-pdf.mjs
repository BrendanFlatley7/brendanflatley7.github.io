/**
 * Local-only PDF generator.
 *
 * Builds the site, serves it, and renders it to a PDF with print media
 * emulation — so the output matches what Chrome's print preview shows.
 *
 * This never runs in CI. The output lands in a gitignored directory, so the
 * generated PDFs are not published anywhere.
 *
 *   npm run pdf
 */

import { build, preview } from "astro";
import { chromium } from "playwright";
import { existsSync } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = "out";
const OUT_PATH = path.join(OUT_DIR, "Brendan-Flatley-Resume.pdf");

if (!existsSync(".env.local")) {
  console.warn(
    "\n  ! .env.local not found — PDFs will be generated without your phone number.\n" +
      "    Create it with:  cp .env.example .env.local\n"
  );
}

// --- render ---------------------------------------------------------------

async function renderPdf(browser) {
  console.log("\n  building…");

  await build({
    logLevel: "error",
    vite: {
      define: {
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
      path: OUT_PATH,
      printBackground: true,
      // Let the @page rule in print.css decide paper size and margins.
      preferCSSPageSize: true,
      tagged: true,
    });
    await page.close();

    const { size } = await stat(OUT_PATH);
    console.log(`  ✓ ${OUT_PATH}  (${(size / 1024).toFixed(0)} KB)`);
  } finally {
    await server.stop();
  }
}

let browser;
try {
  browser = await chromium.launch();
  await renderPdf(browser);
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

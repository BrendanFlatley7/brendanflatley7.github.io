/**
 * Tools that can appear beside a role on the site.
 *
 * A slug with a matching file in src/icons/ renders as that brand mark in the
 * brand's own colour; anything else falls back to its name in small type —
 * which is what SQL does, being a language rather than a brand.
 *
 * Typing `Role.tools` against these keys makes a typo in resume.ts a build
 * error rather than a silently missing icon.
 */
export interface Tool {
  /** Accessible name, and the text shown when there is no mark. */
  name: string;
  /**
   * The brand's own colour, from the Simple Icons dataset — those marks are
   * single flattened paths that have to be tinted. Omit it for a mark that
   * carries its own fills.
   */
  hex?: string;
  /**
   * Multiplier on the shared icon size, for a mark whose ink coverage is far
   * off the others'. Tableau's lattice of hairlines is the only one so far
   * that needs it — at the common size it reads as a smudge beside solid
   * glyphs like dbt's.
   */
  scale?: number;
  /**
   * Stand-in for `hex` on a dark ground. Several of these brands are drawn in
   * near-black or a deep blue that all but disappears against #121215; the
   * value here is the same hue carried up to where the glyph still reads.
   */
  darkHex?: string;
}

export const TOOLS = {
  dbt: { name: "dbt", hex: "#FF694B" },
  // Simple Icons dropped Tableau's mark after v13, so the geometry is vendored
  // from there — but flattened to one path, as that set always is. The nine
  // plus signs have been split back apart and given the logo's real colours,
  // sampled per-plus from the public-domain wordmark on Wikimedia Commons. So,
  // like Python, no hex: it colours itself.
  tableau: { name: "Tableau", scale: 1.3 },
  // No hex: this one is the official two-tone mark, blue and yellow snakes and
  // all, so it brings its own colours rather than being tinted flat.
  python: { name: "Python" },
  sql: { name: "SQL" },
  prefect: { name: "Prefect", hex: "#070E10", darkHex: "#E4E6EA" },
  snowflake: { name: "Snowflake", hex: "#29B5E8" },
  docker: { name: "Docker", hex: "#2496ED" },
  // Matillion's mint green is drawn for dark backgrounds and all but vanishes
  // on this one, so light mode gets it a few steps deeper.
  matillion: { name: "Matillion", hex: "#0F9E57", darkHex: "#19E57F" },
  qlik: { name: "Qlik Replicate", hex: "#009848", darkHex: "#12BC5E" },
  sap: { name: "SAP", hex: "#0FAAFF" },
  github: { name: "GitHub", hex: "#181717", darkHex: "#E4E6EA" },
  jira: { name: "Jira", hex: "#0052CC", darkHex: "#4C9AFF" },
} as const satisfies Record<string, Tool>;

export type ToolSlug = keyof typeof TOOLS;

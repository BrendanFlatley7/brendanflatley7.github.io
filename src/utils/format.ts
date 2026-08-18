const MONTHS: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

/**
 * "Sep 2022" -> "2022-09", for the machine-readable `datetime` attribute.
 * Returns undefined if the label isn't a recognizable Month YYYY.
 */
export function toISOMonth(label: string): string | undefined {
  const match = /^([A-Za-z]{3})[a-z]*\s+(\d{4})$/.exec(label.trim());
  if (!match) return undefined;
  const month = MONTHS[match[1]!.toLowerCase()];
  return month ? `${match[2]}-${month}` : undefined;
}

/** "https://github.com/foo/" -> "github.com/foo" for compact link display. */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

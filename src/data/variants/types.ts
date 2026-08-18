import type { BulletGroup, SkillGroup } from "../resume";

/**
 * A job-specific overlay on the canonical resume.
 *
 * Only the fields that need to change are listed. Anything omitted falls
 * through to the base resume, so there is still exactly one copy of the
 * underlying facts — a variant re-frames and re-orders them, it does not
 * restate them.
 */
export interface Variant {
  /** CLI value: `npm run pdf -- --variant=<id>` */
  id: string;
  /** Goes into the PDF filename. */
  label: string;
  /** What this variant is aimed at, for your own reference. */
  target: string;

  headline?: string;
  summary?: string;
  skills?: { technical: SkillGroup[]; additional: SkillGroup[] };

  /**
   * Replace a role's bullet groups, keyed by company then role title.
   * Roles not named here keep their base content untouched.
   */
  roleGroups?: Record<string, Record<string, BulletGroup[]>>;
}

import { resume as base, type Resume } from "./resume";
import type { Variant } from "./variants/types";
import { contentVariant } from "./variants/content";
import { infraVariant } from "./variants/infra";

export const variants: Record<string, Variant> = {
  [contentVariant.id]: contentVariant,
  [infraVariant.id]: infraVariant,
};

export function applyVariant(resume: Resume, variant: Variant): Resume {
  return {
    ...resume,
    headline: variant.headline ?? resume.headline,
    summary: variant.summary ?? resume.summary,
    skills: variant.skills ?? resume.skills,
    experience: resume.experience.map((job) => {
      const overridesForCompany = variant.roleGroups?.[job.company];
      if (!overridesForCompany) return job;
      return {
        ...job,
        roles: job.roles.map((role) => {
          const groups = overridesForCompany[role.title];
          return groups ? { ...role, groups } : role;
        }),
      };
    }),
  };
}

/**
 * Strip groups marked `exportOnly` — the site shows roles and responsibilities,
 * not project detail. PDF builds keep them.
 */
function stripExportOnly(resume: Resume): Resume {
  return {
    ...resume,
    experience: resume.experience.map((job) => ({
      ...job,
      roles: job.roles.map((role) => ({
        ...role,
        groups: role.groups.filter((group) => !group.exportOnly),
      })),
    })),
  };
}

/**
 * Both are set only by scripts/generate-pdf.mjs. `npm run dev`, `npm run build`
 * and the deploy workflow leave them unset, so the public site always renders
 * the neutral canonical version with no project detail.
 */
const selected = import.meta.env.RESUME_VARIANT;

/**
 * True only inside a PDF build. The two surfaces have diverged past bullet
 * filtering — the site is a short personal page and the PDF is the full
 * resume — so index.astro branches its section order on this, and the section
 * components take it as a mode. It is a build-time constant, so whichever
 * branch is unused gets dropped from the bundle.
 */
export const isExport = import.meta.env.RESUME_EXPORT === true;

if (selected && !variants[selected]) {
  throw new Error(
    `Unknown RESUME_VARIANT "${selected}". Known variants: ${Object.keys(variants).join(", ")}`
  );
}

const resolved = selected ? applyVariant(base, variants[selected]!) : base;

export const resume: Resume = isExport ? resolved : stripExportOnly(resolved);

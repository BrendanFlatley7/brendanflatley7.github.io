import { resume as base, type Resume } from "./resume";

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
 * True only inside a PDF build. Set by scripts/generate-pdf.mjs and nothing
 * else, so `npm run dev`, `npm run build` and the deploy workflow all leave it
 * unset and the public site never renders project detail.
 *
 * The two surfaces have diverged past bullet filtering — the site is a short
 * personal page and the PDF is the full resume — so index.astro branches its
 * section order on this, and the section components take it as a mode. It is a
 * build-time constant, so whichever branch is unused gets dropped from the
 * bundle.
 */
export const isExport = import.meta.env.RESUME_EXPORT === true;

export const resume: Resume = isExport ? base : stripExportOnly(base);

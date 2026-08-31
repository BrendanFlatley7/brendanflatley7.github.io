/**
 * Single source of truth for the resume.
 *
 * This is the only file you need to edit for routine content updates.
 * Both the web page and the generated PDF render from it.
 */

import type { ToolSlug } from "./tools";

export interface BulletGroup {
  /** Optional subheading, e.g. "Key Projects". Omit for ungrouped lead bullets. */
  label?: string;
  /**
   * Render only in generated PDFs, never on the public site. Used for project
   * detail: the site stays a short overview of roles and responsibilities,
   * while an exported resume carries the projects relevant to that posting.
   */
  exportOnly?: boolean;
  bullets: string[];
}

export interface Role {
  title: string;
  start: string;
  /**
   * Tools used in this role, shown as brand marks beside it on the site only —
   * the PDF carries the bullets instead. Keep it to the handful that actually
   * characterise the work; see src/data/tools.ts for the valid slugs.
   */
  tools?: ToolSlug[];
  /** Omit for a role that is still current. */
  end?: string;
  /** e.g. "Contract" */
  type?: string;
  /** Clarifying line rendered under the title, e.g. for concurrent roles. */
  note?: string;
  groups: BulletGroup[];
}

export interface Job {
  company: string;
  location?: string;
  /** One employer, one or more roles. Concurrent roles stay under a single company. */
  roles: Role[];
}

/** Personal work samples. Unrelated to `experience` — these are your own projects. */
export interface Project {
  name: string;
  blurb: string;
  /** Live demo or write-up. */
  url?: string;
  /** Source repository. */
  repo?: string;
  tech: string[];
  /**
   * The project's own logo or wordmark, shown on the site's project cards so
   * each one reads the way it does on its own site. Vendored into
   * public/projects/ by `npm run marks`; that script prints every value here.
   * Omit and the card falls back to the project name set in type.
   */
  mark?: {
    src: string;
    width: number;
    height: number;
    /** Card background behind the mark, sampled from the live site. */
    plaque: string;
    /**
     * "inset" floats the mark on the plaque with room around it — right for a
     * wordmark. "bleed" runs it edge to edge, which is what artwork carrying
     * its own textured field needs: no flat colour can match a gradient, so
     * any inset would show a seam.
     */
    fit?: "inset" | "bleed";
  };
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface School {
  school: string;
  location?: string;
  degree: string;
  minor?: string;
}

export interface Resume {
  name: string;
  headline: string;
  /** Where he lives now. */
  location: string;
  /** Where he is from. Omit to render the location line on its own. */
  hometown?: string;
  email: string;
  phone: string | undefined;
  links: { github: string; linkedin: string; website: string };
  summary: string;
  skills: { technical: SkillGroup[] };
  experience: Job[];
  projects: Project[];
  education: School[];
}

/**
 * Read at build time only. Absent from CI builds (no .env.local in the repo),
 * so the phone number never appears in the deployed HTML — only in the local PDF.
 */
const phone: string | undefined = import.meta.env.RESUME_PHONE;

/** The canonical resume — the single source for both the site and the PDF. */
export const resume: Resume = {
  name: "Brendan Flatley",
  headline: "Analytics Engineer",
  location: "Los Angeles, CA",
  hometown: "Erie, Pennsylvania",
  email: "brendanflatley@icloud.com",
  phone,

  // Empty values are simply not rendered.
  links: {
    github: "https://github.com/BrendanFlatley7",
    linkedin: "https://www.linkedin.com/in/brendan-flatley/",
    website: "",
  },

  summary:
    "Analytics engineer who owns the full path from data model to business decision using primarily Python, Prefect, dbt, and Tableau. Partnering closely with business stakeholders to scope and define data products from automated file transmissions to self-service exported marketing materials. Eight years operating with minimal process in a high-ambiguity environment, including a stretch as interim director of data science during a technology leadership transition.",

  skills: {
    technical: [
      {
        group: "Languages & Tools",
        items: [
          "SQL (Advanced)",
          "Python",
          "Tableau",
          "dbt",
          "Prefect",
          "Git",
          "Docker",
          "Spark",
        ],
      },
      {
        group: "Data Modeling",
        items: [
          "Dimensional (Kimball)",
          "Incremental pipelines",
          "CDC",
          "SCD",
        ],
      },
      {
        group: "Analysis",
        items: [
          "Time series",
          "Cohort",
          "Forecasting",
          "Clustering & segmentation",
          "Regression",
        ],
      },
      {
        group: "Platforms",
        items: ["Redshift", "S3", "Azure", "Snowflake"],
      },
    ] as SkillGroup[],
  },

  /**
   * Employer history. Each role's "Key Projects" and "Core Responsibilities"
   * live here as labeled bullet groups within that role.
   */
  experience: [
    {
      company: "MetLife Legal Plans, Inc.",
      roles: [
        {
          title: "Analytics Engineer",
          start: "Sep 2022",
          tools: ["sql", "python", "dbt", "tableau", "prefect"],
          groups: [
            {
              bullets: [
                "Lead the team's dbt implementation, replacing legacy data preparation with a version-controlled transformation layer of ~60 analytics-ready models, and own the architecture, business logic, and standards the team builds against",
                "Built Tableau dashboards and export templates that replaced a legacy reporting interface, letting account and operations teams self-serve utilization and membership data for 2,000+ customers and cutting report generation time by 90%",
                "Deliver time series and cohort analysis on claim volume, claim mix, and member retention across plan tiers, defining the metrics account and operations teams reference in pricing decisions",
                "Built lookup tools the call center depends on daily to meet service level agreements",
                "Scope incoming requests for feasibility and architectural fit, and review and approve modeling work from four data team members",
              ],
            },
            {
              label: "Key Projects",
              exportOnly: true,
              bullets: [
                "Modeled claims data as one of the first models deployed in the new dbt environment, identified and corrected logic errors in the inherited process, updated the estimated member savings calculation with refined logic for claim subtypes such as Chapter 7 versus Chapter 13 bankruptcy, and presented the correction and its impact on previously reported totals to the executive team",
                "Designed and implemented a process to identify lapsing members, feeding a new product campaign that reaches ~40,000 members monthly and generated over $1M in revenue in its first year",
                "Own the member data feeding a daily transfer to a third-party service supporting ~200,000 monthly members, including enrollment workflows, monthly reporting, and invoicing",
                "Re-engineered a fragile, application-critical pipeline in Python and Prefect: replaced a full production-table rebuild running every 15 minutes (~7-minute runtime, intermittent unavailability) with an incremental load and indexing strategy, eliminating the outage window and reducing query latency",
              ],
            },
],
        },
        {
          title: "Interim Director, Data Science",
          start: "Mar 2024",
          end: "Sep 2025",
          note: "Additional responsibility held concurrently with the Analytics Engineer role above, during a leadership transition",
          groups: [
            {
              bullets: [
                "Stepped into the interim director role during a broader technology leadership transition, maintaining team continuity and project delivery",
                "Built the case for reprioritizing the team's roadmap toward a dbt-based analytics foundation and self-service reporting, surfacing risks to team capacity and project timelines with the executive team to gain alignment",
                "Led the team through a shift toward analytics engineering practices, holding three weekly working sessions to coach non-technical analysts on SQL, Tableau, and data modeling standards ahead of the dbt migration",
                "Identified operational risk in legacy data flows feeding production application features and drove their migration off the team's prior integration tool",
              ],
            },
          ],
        },
      ],
    },
    {
      company: "KAR Global",
      roles: [
        {
          title: "Business Intelligence Developer",
          type: "Contract",
          start: "Jun 2022",
          end: "Sep 2022",
          tools: ["sql", "tableau"],
          groups: [
            {
              bullets: [
                "Replaced redundant custom SQL embedded across multiple Tableau workbooks with standardized database views, consolidating reporting onto a single governed data source",
                "Regression-tested aggregations against prior outputs to verify accuracy through the migration, and documented the new source for the reporting team",
              ],
            },
          ],
        },
      ],
    },
    {
      company: "Bradford White Corporation",
      roles: [
        {
          title: "Business Intelligence Developer",
          start: "Mar 2020",
          end: "Jun 2022",
          tools: ["sql", "snowflake", "qlik", "tableau", "matillion"],
          groups: [
            {
              bullets: [
                "Facilitated meetings, research, and documentation for defining existing processes and business logic",
                "Modeled source data into curated views in Snowflake, establishing the reporting layer that downstream Tableau dashboards were built on",
                "Configured and implemented ETL workflows using Qlik Replicate and Matillion",
              ],
            },
            {
              label: "Key Projects",
              exportOnly: true,
              bullets: [
                "Developed sales forecasting and benchmarking reports combining internal data with economic indicators and academic research, giving leadership a demand view beyond historical sales",
                "Built a product relationship data model that improved projected lead-time analysis across the product catalog",
                "Developed internal expense tracking data model and real-time Tableau visualization for executive team",
              ],
            },
],
        },
      ],
    },
    {
      company: "AmeriHealth Administrators",
      roles: [
        {
          title: "Business Analyst",
          type: "Contract",
          start: "Oct 2019",
          end: "Mar 2020",
          tools: ["sql", "tableau"],
          groups: [
            {
              bullets: [
                "Five month contract during peak enrollment season to assist in updating plans and enrolling new customers",
              ],
            },
          ],
        },
      ],
    },
    {
      company: "msg global solutions",
      roles: [
        {
          title: "Associate Consultant",
          start: "Jun 2018",
          end: "Oct 2019",
          tools: ["sap", "sql"],
          groups: [
            {
              bullets: [
                "Supported SAP implementation and migration programs as a project management officer for Fortune 500 insurance clients",
              ],
            },
          ],
        },
      ],
    },
  ] as Job[],

  /**
   * Personal projects / work samples — your own work, not tied to an employer.
   * The section is hidden entirely while this array is empty.
   *
   * `tech` renders as tags beneath the blurb; leave it empty to omit them.
   * Add `repo` alongside `url` if you ever make the source public.
   * `mark` values come straight from `npm run marks`.
   */
  projects: [
    {
      name: "My Little Gambler",
      blurb:
        "Built an end-to-end NFL odds pipeline: sourced and modeled historical odds and results, with daily cron jobs tracking line movement and surfacing hedging opportunities on open positions.",
      url: "https://my-little-gambler.vercel.app",
      tech: [],
      mark: {
        src: "/projects/my-little-gambler.png",
        width: 1200,
        height: 109,
        plaque: "#fefefe",
      },
    },
    {
      name: "Hi / Lo",
      blurb:
        "Tracks a 2v2 golf side game.",
      url: "https://hi-lo-psi.vercel.app/game/new",
      tech: [],
      mark: {
        src: "/projects/hi-lo.webp",
        width: 840,
        height: 320,
        plaque: "#efeddc",
        fit: "bleed",
      },
    },
  ] as Project[],

  education: [
    {
      school: "Temple University",
      location: "Philadelphia, PA",
      degree: "Bachelor of Business Administration, Risk Management & Insurance",
      minor: "Management Information Systems (MIS)",
    },
  ] as School[],
};

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
  skills: { technical: SkillGroup[]; additional: SkillGroup[] };
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
    "Analyst and data modeler driving MetLife Legal Plans' organization-wide dbt implementation, modeling the data and setting the standards analysts, engineers, and business users rely on. Own data projects from feasibility to delivery and, as project lead, the business logic behind every model that ships.",

  skills: {
    technical: [
      {
        group: "Programming & Query Languages",
        items: ["SQL (Advanced)", "Python", "Spark"],
      },
      {
        group: "Analysis & Modeling",
        items: [
          "Regression",
          "Time series",
          "Cohort analysis",
          "Clustering & segmentation",
          "Forecasting",
        ],
      },
      {
        group: "Data Platforms",
        items: ["Redshift", "S3", "Azure", "Snowflake"],
      },
      {
        group: "Data Engineering & Transformation",
        items: ["Prefect", "dbt", "Tableau Prep", "Matillion"],
      },
      {
        group: "Data Modeling & Warehousing",
        items: [
          "Dimensional Modeling (Kimball)",
          "Incremental Pipelines",
          "CDC",
          "SCD",
        ],
      },
      {
        group: "Tools & Workflow",
        items: [
          "Tableau Cloud",
          "Tableau Desktop",
          "GitHub",
          "Docker",
          "DBeaver",
          "JIRA",
        ],
      },
    ] as SkillGroup[],

    // TODO(Brendan): review and edit. Drafted from what the experience below
    // already demonstrates — nothing here is invented.
    additional: [
      {
        group: "Partnership & Communication",
        items: [
          "Stakeholder facilitation & requirements gathering",
          "Translating business questions into analysis",
          "Executive-level risk communication",
        ],
      },
      {
        group: "Leadership & Ownership",
        items: [
          "Interim team leadership",
          "Roadmap prioritization",
          "Technical review & mentorship",
          "Data governance & access management",
        ],
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
                "Review and approve modeling work from four data team members, verifying business logic before it ships",
                "Scope incoming requests for feasibility and architectural fit, including redirecting operational workflows that did not belong downstream in the warehouse to the teams that own them",
              ],
            },
            {
              label: "Key Projects",
              exportOnly: true,
              bullets: [
                "Re-modeled the claims data preparation process as one of the first models deployed in the new dbt environment, identifying and correcting logic errors in the inherited process, rebuilding the estimated member savings calculation with refined logic for claim subtypes such as Chapter 7 versus Chapter 13 bankruptcy, and presenting the correction and its impact on previously reported totals to the executive team",
                "Designed and implemented a process to identify lapsing members by comparing membership state across snapshots over time, feeding a new product campaign that reached ~40,000 members monthly and generated over $1M in revenue in its first year",
                "Own the member data feeding a daily transfer to a third-party service supporting ~200,000 monthly members, including daily enrollment workflows and monthly reporting and invoicing processes",
                "Rebuilt a fragile, application-critical data pipeline using Python and Prefect. The prior process fully rebuilt a production table every 15 minutes with a ~7-minute runtime, causing intermittent unavailability; replaced it with an incremental load and added indexing, making the table consistently available and faster to query",
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
                "Stepped into the interim director role following the simultaneous departure of the data science director and CTO, maintaining team continuity and project delivery during an extended leadership vacuum",
                "Met regularly with the executive team to surface risks impacting the team and project timelines, and advised on rebuilding technical leadership — leadership validated this guidance by hiring a new director who adopted the team's direction",
                "Reprioritized the team's roadmap to focus on building a dbt-based analytics foundation and moving toward self-service, deprioritizing competing initiatives; identified at-risk legacy data flows feeding production application features that needed to be migrated off the team's prior data integration tool",
                "Chose to return to a hands-on technical focus rather than continue on a people-management track once new leadership was in place",
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
                "Designed and built database views to replace redundant custom SQL embedded across multiple Tableau workbooks, refactoring reports to a standardized data source, regression-testing aggregations for accuracy, and updating documentation",
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
          tools: ["sql", "qlik", "tableau", "matillion"],
          groups: [
            {
              bullets: [
                "Configured and implemented ETL workflows using Qlik Replicate and Matillion",
                "Facilitated meetings, research, and documentation for defining existing processes and business logic",
              ],
            },
            {
              label: "Key Projects",
              exportOnly: true,
              bullets: [
                "Designed benchmarking and sales forecasting reports using academic research, economic indicators, and internal data",
                "Built product relationship data model to improve projected lead-time analysis",
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
                // TODO(Brendan): the LinkedIn entry continues past this — it
                // goes on about documenting requirements in client meetings.
                // Finish the sentence in your own words.
                "Facilitated updates and new enrollment of client business insurance plans and coverages",
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
                "Supported SAP implementation and migration projects as a Project Management Officer for multiple Fortune 500 companies in the insurance industry",
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
        "Sourced and created historical data source for NFL odds and results for prediction model, including daily cron jobs to track odds changes and hedging opportunities on current bets.",
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

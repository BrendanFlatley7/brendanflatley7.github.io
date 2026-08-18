/**
 * Single source of truth for the resume.
 *
 * This is the only file you need to edit for routine content updates.
 * Both the web page and the generated PDF render from it.
 */

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
  location: string;
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

/**
 * The neutral, canonical resume. This is what the public site renders.
 * Job-specific PDFs layer overrides on top — see src/data/variants/.
 */
export const resume: Resume = {
  name: "Brendan Flatley",
  headline: "Analytics Engineer",
  location: "Los Angeles, CA",
  email: "brendanflatley@icloud.com",
  phone,

  // Empty values are simply not rendered.
  links: {
    github: "https://github.com/BrendanFlatley7",
    linkedin: "https://www.linkedin.com/in/brendan-flatley/",
    website: "",
  },

  summary:
    "6+ years of experience partnering with business stakeholders to provide meaningful analysis and develop data-driven solutions. Strong technical foundation, business acumen, and SQL expertise with a proven track record of delivering production-grade metrics and reporting in Tableau. Thrive on turning ideas and questions into carefully reasoned analysis and clear communication of insights.",

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
          groups: [
            {
              bullets: [
                "Sole owner of the team's dbt implementation, replacing legacy data preparation processes with a structured, version-controlled transformation layer — architecting the data models, developing the pipeline, and managing the team's analytics flows end-to-end",
              ],
            },
            {
              bullets: [
                "Administer Tableau Cloud site, managing governance, permissions, licenses, and self-serve data access for 300+ users",
                "Facilitate stakeholder meetings to gather requirements, define business logic, and deliver reporting",
                "Own and maintain the analytics layer by developing new data models and reviewing contributions from other data team members",
              ],
            },
            {
              label: "Key Projects",
              exportOnly: true,
              bullets: [
                "Rebuilt a fragile, application-critical data pipeline using Python and Prefect — the prior process fully rebuilt a production table every 15 minutes with a ~7-minute runtime, causing intermittent unavailability; replaced it with an incremental load and added indexing, making the table consistently available and faster to query",
                "Developed automated daily SFTP pipelines to securely transfer member PII to a third-party service supporting ~200,000 monthly members, and created monthly reporting processes and visualizations for performance metrics and invoicing",
                "Designed and implemented a process to identify lapsing members for a new product campaign, reaching ~40,000 members monthly and generating over $1M in revenue in its first year",
                "Created file templates and corresponding Tableau workbooks to export approved marketing materials, leading to a 90% reduction in report generation time",
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
  ] as Job[],

  /**
   * Personal projects / work samples — your own work, not tied to an employer.
   * The section is hidden entirely while this array is empty.
   *
   * `tech` renders as tags beneath the blurb; leave it empty to omit them.
   * Add `repo` alongside `url` if you ever make the source public.
   */
  projects: [
    {
      name: "My Little Gambler",
      blurb:
        "Sourced and created historical data source for NFL odds and results for prediction model, including daily cron jobs to track odds changes and hedging opportunities on current bets.",
      url: "https://my-little-gambler.vercel.app",
      tech: [],
    },
    {
      name: "Hi / Lo",
      blurb:
        "Tracks the High / Low side game for a golf round between 4 players.",
      url: "https://hi-lo-psi.vercel.app/game/new",
      tech: [],
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

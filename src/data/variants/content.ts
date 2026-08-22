import type { Variant } from "./types";

/**
 * Emphasis: stakeholder-facing analysis and metrics — analysis technique,
 * BI fluency, and communicating results to technical and non-technical
 * audiences.
 *
 * Every fact below already appears in the base resume. This variant changes
 * emphasis and ordering, not substance.
 */
export const contentVariant: Variant = {
  id: "content",
  label: "Content",

  summary:
    "Analytics engineer with 6+ years turning business questions into trusted metrics and analysis. Partner directly with stakeholders to define what's worth measuring, build the models and pipelines behind it, and translate the results into decisions — including a member-targeting analysis that reached ~40,000 members monthly and generated over $1M in its first year, and forecasting work built on economic indicators and internal data. Advanced SQL and Python, sole owner of a production dbt transformation layer, and administrator of a 300+ user Tableau environment.",

  skills: {
    technical: [
      {
        group: "Programming & Query Languages",
        items: ["SQL (Advanced)", "Python", "Spark"],
      },
      {
        group: "Analysis & Insight",
        items: [
          "Regression",
          "Time series",
          "Cohort analysis",
          "Clustering & segmentation",
          "Forecasting",
          "Benchmarking",
        ],
      },
      {
        group: "Data Platforms",
        items: ["Redshift", "Snowflake", "S3", "Azure"],
      },
      {
        group: "Pipelines & Transformation",
        items: ["dbt", "Prefect", "Matillion", "Tableau Prep"],
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
        group: "BI & Visualization",
        items: ["Tableau Cloud", "Tableau Desktop"],
      },
      {
        group: "Tools & Workflow",
        items: ["GitHub", "Docker", "DBeaver", "JIRA"],
      },
    ],
    additional: [
      {
        group: "Partnership & Communication",
        items: [
          "Stakeholder facilitation & requirements gathering",
          "Translating business questions into analysis",
          "Executive-level communication",
        ],
      },
      {
        group: "Ways of Working",
        items: [
          "Autonomous, low-process environments",
          "Cross-functional project ownership",
          "Technical review & mentorship",
        ],
      },
    ],
  },

  roleGroups: {
    // Lead with business impact and stakeholder-facing analysis.
    "MetLife Legal Plans, Inc.": {
      "Analytics Engineer": [
        {
          bullets: [
            "Sole owner of the team's dbt implementation, replacing legacy data preparation processes with a structured, version-controlled transformation layer — architecting the data models, developing the pipeline, and managing the team's analytics flows end-to-end",
          ],
        },
        {
          bullets: [
            "Facilitate stakeholder meetings to gather requirements, define business logic, and deliver reporting",
            "Own and maintain the analytics layer by developing new data models and reviewing contributions from other data team members",
            "Administer Tableau Cloud site, managing governance, permissions, licenses, and self-serve data access for 300+ users",
          ],
        },
        {
          label: "Key Projects",
          exportOnly: true,
          bullets: [
            "Designed and implemented a process to identify lapsing members for a new product campaign, reaching ~40,000 members monthly and generating over $1M in revenue in its first year",
            "Rebuilt a fragile, application-critical data pipeline using Python and Prefect — the prior process fully rebuilt a production table every 15 minutes with a ~7-minute runtime, causing intermittent unavailability; replaced it with an incremental load and added indexing, making the table consistently available and faster to query",
            "Created file templates and corresponding Tableau workbooks to export approved marketing materials, leading to a 90% reduction in report generation time",
          ],
        },
],
    },
    // Lead with the analysis-technique work.
    "Bradford White Corporation": {
      "Business Intelligence Developer": [
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
          ],
        },
],
    },
  },
};

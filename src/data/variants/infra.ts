import type { Variant } from "./types";

/**
 * Emphasis: owning cost/usage/efficiency metrics and metric frameworks —
 * self-sufficiency across the full analytics loop, turning slow manual
 * analysis into reusable insight, and working with little process.
 *
 * Every fact below already appears in the base resume. This variant changes
 * emphasis and ordering, not substance.
 */
export const infraVariant: Variant = {
  id: "infra",
  label: "Infrastructure",

  summary:
    "Analytics engineer with 6+ years owning metrics end to end — defining them with stakeholders, building the pipelines beneath them, and making them legible to executives. Much of that work has been efficiency work: rebuilding a production pipeline from a full 7-minute reload into an incremental load, cutting report generation time by 90%, and building the expense-tracking model and real-time visualization the executive team used to track spend. Sole owner of a production dbt transformation layer, advanced in SQL and Python, and used to operating with little process and minimal oversight.",

  skills: {
    technical: [
      {
        group: "Programming & Query Languages",
        items: ["SQL (Advanced)", "Python", "Spark"],
      },
      {
        group: "Metrics & Efficiency",
        items: [
          "Metric definition & ownership",
          "Cost & usage reporting",
          "Pipeline performance optimization",
          "Forecasting",
        ],
      },
      {
        group: "Analysis & Modeling",
        items: [
          "Regression",
          "Time series",
          "Cohort analysis",
          "Clustering & segmentation",
        ],
      },
      {
        group: "Data Platforms",
        items: ["Redshift", "Snowflake", "S3", "Azure"],
      },
      {
        group: "Pipelines & Orchestration",
        items: ["Prefect", "dbt", "Matillion", "Tableau Prep"],
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
        group: "Communication & Influence",
        items: [
          "Executive-level risk communication",
          "Stakeholder facilitation & requirements gathering",
          "Data storytelling for technical and non-technical audiences",
        ],
      },
      {
        group: "Ownership",
        items: [
          "Interim team leadership",
          "Roadmap prioritization",
          "Data governance & access management",
          "Technical review & mentorship",
        ],
      },
    ],
  },

  roleGroups: {
    // Lead with performance, cost and automation work.
    "MetLife Legal Plans, Inc.": {
      "Analytics Engineer": [
        {
          bullets: [
            "Sole owner of the team's dbt implementation, replacing legacy data preparation processes with a structured, version-controlled transformation layer — architecting the data models, developing the pipeline, and managing the team's analytics flows end-to-end",
          ],
        },
        {
          bullets: [
            "Own and maintain the analytics layer by developing new data models and reviewing contributions from other data team members",
            "Administer Tableau Cloud site, managing governance, permissions, licenses, and self-serve data access for 300+ users",
            "Facilitate stakeholder meetings to gather requirements, define business logic, and deliver reporting",
          ],
        },
        {
          label: "Key Projects",
          exportOnly: true,
          bullets: [
            "Rebuilt a fragile, application-critical data pipeline using Python and Prefect — the prior process fully rebuilt a production table every 15 minutes with a ~7-minute runtime, causing intermittent unavailability; replaced it with an incremental load and added indexing, making the table consistently available and faster to query",
            "Created file templates and corresponding Tableau workbooks to export approved marketing materials, leading to a 90% reduction in report generation time",
            "Developed automated daily SFTP pipelines to securely transfer member PII to a third-party service supporting ~200,000 monthly members, and created monthly reporting processes and visualizations for performance metrics and invoicing",
          ],
        },
],
    },
    // Lead with the executive-facing spend visibility work.
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
            "Developed internal expense tracking data model and real-time Tableau visualization for executive team",
            "Designed benchmarking and sales forecasting reports using academic research, economic indicators, and internal data",
          ],
        },
],
    },
  },
};

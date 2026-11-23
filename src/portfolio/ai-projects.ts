import { worldMeritDocuments } from "./world-merit-documents.ts";

export type ProjectLink = { label: string; href: `https://${string}` };
export type ProjectImage = {
  id: string;
  name: string;
  src: `/artwork/${string}`;
  alt: string;
  width: number;
  height: number;
  source: { label: string; href?: ProjectLink["href"] };
};

type Project = {
  id: string;
  folder: string;
  subtitle: string;
  name: string;
  dates: string;
  status: string;
  overview: string;
  technology: readonly string[];
  contributors?: readonly string[];
  contributions: readonly string[];
  notes: readonly string[];
  links?: readonly ProjectLink[];
  images?: readonly ProjectImage[];
  concept?: true;
  documents?: readonly { id: string; name: string; text: string }[];
};

const records = [
  {
    id: "farefit",
    folder: "FareFit",
    subtitle: "Live Website",
    name: "FareFit",
    dates: "October 2025–Present (public GitHub history begins October 2025)",
    status: "Live / Active · Team project",
    overview:
      "A fitness and nutrition tracker for tracking workouts, meals and personal goals. The dashboard shows FareScore for longer-term consistency and a separate 0–100 daily points score for exercise, nutrition and goals.",
    technology: [
      "React 18",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "shadcn/ui and Radix UI",
      "Firebase Auth and Firestore",
      "Recharts",
      "Gemini",
      "vite-plugin-pwa",
      "Vercel",
    ],
    contributors: [
      "Giovanni Carrion",
      "John Ortega",
      "Tanvir Islam",
      "Wendy Gutierrez",
    ],
    contributions: [
      "Worked on UI, Firebase-backed data flows, meal and workout logging, AI-related functionality and the scoring experience with the team.",
      "Public commits show changes to macro-goal initialization, calorie and meal logging views, photo-based food analysis, the timeline UI and contextual tip generation.",
    ],
    notes: [
      "The repository documents email sign-in, onboarding, dashboards, achievements and fitness tracking. Source includes manual meal entry, barcode lookup through Open Food Facts, and a Gemini image-analysis implementation.",
      "The live public demo displayed a 300–850 FareScore range and a separate daily score out of 100. Account-gated workflows and production AI availability were outside that check.",
    ],
    images: [
      {
        id: "dashboard",
        name: "FareFit Dashboard.webp",
        src: "/artwork/ai-projects/farefit-demo.webp",
        alt: "FareFit public demo dashboard showing sample scoring and tracking cards",
        width: 1200,
        height: 769,
        source: {
          label: "FareFit public demo",
          href: "https://www.farefit.fit/",
        },
      },
    ],
    links: [
      { label: "Visit Website", href: "https://www.farefit.fit/" },
      { label: "GitHub", href: "https://github.com/itsjustgiio/FareFit" },
      {
        label: "Demo Video",
        href: "https://www.youtube.com/watch?v=PPqStVtc8bU",
      },
      {
        label: "Contribution history",
        href: "https://github.com/itsjustgiio/FareFit/commits/main/?author=itsjustgiio",
      },
    ],
  },
  {
    id: "world-merit",
    folder: "World Merit",
    subtitle: "Internship",
    name: "World Merit RAG Pipeline",
    dates: "July 2025 – October 2025",
    status: "Internship project · AI Agent Systems Intern",
    overview:
      "Contributed to a retrieval-augmented AI agent workflow that collected information from approximately 20 websites, stored data in Firebase, and answered natural-language questions with Ollama-powered workflows.",
    technology: [
      "Ollama",
      "Firebase",
      "Retrieval-augmented generation",
      "AI agent workflows",
      "Website data retrieval",
    ],
    contributions: [
      "Evaluated generated answers against source material and flagged inaccuracies and missing context.",
      "Investigated retrieval gaps and recommended improvements to prompts and retrieval.",
      "Tested workflows, troubleshot behavior and documented findings with an international development team.",
    ],
    notes: [
      "The technical writeups are based on the portfolio owner's account of the internship.",
    ],
    documents: worldMeritDocuments,
    links: [{ label: "World Merit Website", href: "https://worldmerit.org/" }],
  },
  {
    id: "serenescape",
    folder: "SereneScape",
    subtitle: "Project",
    name: "SereneScape — AI-Powered Wellness App",
    dates: "June 2025 – August 2025",
    status: "Completed team project",
    overview:
      "A wellness app with mood check-ins, journaling-style reflection, mood trends and personalized mindfulness suggestions.",
    technology: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Gemini",
      "Supabase authentication and profile data",
      "Firebase-hosted media (documented)",
      "Recharts (repository dependency)",
    ],
    contributors: ["Giovanni Carrion", "John Ortega", "Lindan Thillanayagam"],
    contributions: [
      "Public commits attributed to Giovanni modify the Gemini and mood-classification routes, and update the profile picture uploader and app layout.",
    ],
    notes: [
      "The public README describes Gemini for reflection and recommendations. The public code and README provide evidence for Gemini; the README's charting description differs from the dependency manifest.",
    ],
    images: [
      {
        id: "mood-check-in",
        name: "SereneScape Dashboard.webp",
        src: "/artwork/ai-projects/serenescape-demo.webp",
        alt: "SereneScape demo dashboard with a mood check-in and mindfulness options",
        width: 721,
        height: 460,
        source: {
          label: "SereneScape video, dashboard at 0:18",
          href: "https://www.youtube.com/watch?v=0lZ8QidDQrE&t=18s",
        },
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/itsjustgiio/SereneScape" },
      {
        label: "Demo Video",
        href: "https://www.youtube.com/watch?v=0lZ8QidDQrE",
      },
      {
        label: "Contribution history",
        href: "https://github.com/itsjustgiio/SereneScape/commits/main/?author=itsjustgiio",
      },
    ],
  },
  {
    id: "bridgecoach",
    folder: "BridgeCoach",
    subtitle: "Project",
    name: "BridgeCoach",
    dates: "April 2025",
    status: "Hackathon prototype",
    overview:
      "Built during the IBM SkillsBuild CUNY Student Hackathon at the IBM NYC Innovation Studio. The team prototyped an agent to help incoming CUNY students with financial aid, course planning, registration, campus resources and student support.",
    technology: [
      "IBM watsonx",
      "watsonx Orchestrate",
      "watsonx Agents",
      "IBM sandbox",
      "Prompt engineering",
    ],
    contributors: ["Giovanni Carrion", "Anas Ahmed", "Brian Hernandez"],
    contributions: [
      "Contributed to a team prototype developed and tested within the IBM environment and presented to IBM and CUNY representatives.",
    ],
    notes: [
      "The Team 7 hackathon slide describes a BridgeCoach AI guide for FAFSA/TAP, registration, first-day preparation, coursework, textbooks and finding advisors.",
      "The prototype also proposed a CUNY Class Advisor using student reviews, a Computer Science schedule recommender that accounts for prerequisites and credit limits, and a Lehman College agent for department-specific questions.",
      "The team expected better preparation and less pressure on student support. The slide describes intended benefits. The full pitch deck remains pending.",
    ],
    images: [
      {
        id: "team-7-slide",
        name: "BridgeCoach Team 7.webp",
        src: "/artwork/ai-projects/bridgecoach-team-7.webp",
        alt: "BridgeCoach Team 7 hackathon slide describing the prototype and its intended benefits",
        width: 960,
        height: 540,
        source: { label: "Owner-supplied hackathon slide" },
      },
    ],
  },
  {
    id: "automotive-diagnostics",
    folder: "OBD-II AI Concept",
    subtitle: "Concept",
    name: "Automotive AI Diagnostics",
    dates: "October 2026 (owner-supplied)",
    status: "Architecture concept only",
    overview:
      "A personal interview showcase proposal for AI-assisted OBD-II diagnostics. Proposed agents would help technicians investigate engine, electrical, transmission and thermal issues by combining diagnostic codes, vehicle time series and retrieved documentation.",
    technology: [
      "Google Vertex AI and Gemini",
      "OBD-II",
      "Multi-agent orchestration",
      "Retrieval-augmented generation",
      "Docker",
      "IAM and access controls",
      "Audit logging",
      "Input validation",
    ],
    contributions: [
      "Designed the proposed architecture and a technician review step before any conclusion or action.",
    ],
    notes: [
      "Proposed workflow: specialized agents review diagnostic trouble codes, sensor readings and vehicle details, flag unusual readings and open a temporary case.",
      "The case would look up prior records by exact vehicle identifier or compare similar models and symptoms. Gemini would use retrieved repair cases and manufacturer service records to suggest possible causes, supporting evidence and inspections, with missing information and uncertainties called out.",
      "A technician would test and review each recommendation. Approved cases could inform driver guidance and be added to the verified repair knowledge base. Unapproved findings would return for revision.",
      "Technologies describe a proposal. Implementation and deployment are outside the scope of this concept.",
    ],
    images: [
      {
        id: "workflow",
        name: "Solution Workflow.webp",
        src: "/artwork/ai-projects/obd-ii-workflow.webp",
        alt: "Proposed OBD-II workflow from vehicle data and Gemini recommendations to technician approval",
        width: 1033,
        height: 586,
        source: { label: "Owner-supplied concept diagram" },
      },
      {
        id: "monitoring",
        name: "Monitoring Agents.webp",
        src: "/artwork/ai-projects/obd-ii-vehicle-data.webp",
        alt: "Proposed monitoring agents analyzing fault codes, sensor readings and vehicle details",
        width: 588,
        height: 500,
        source: { label: "Owner-supplied concept diagram" },
      },
      {
        id: "retrieval",
        name: "Repair Record Retrieval.webp",
        src: "/artwork/ai-projects/obd-ii-retrieval.webp",
        alt: "Proposed diagnostic case retrieval and evidence requirements for Gemini recommendations",
        width: 993,
        height: 481,
        source: { label: "Owner-supplied concept diagram" },
      },
    ],
    concept: true,
  },
] as const satisfies readonly Project[];

export type AiProjectId = (typeof records)[number]["id"];
export const aiProjects: readonly (Project & { id: AiProjectId })[] = records;

export function getAiProject(id: string) {
  return aiProjects.find((project) => project.id === id);
}

export function documentsFor(project: Project) {
  if (project.documents) return project.documents;
  const about = {
    id: "about",
    name: project.concept ? "Concept.txt" : "About.txt",
    text: [
      project.name,
      project.dates,
      project.status,
      project.overview,
      `${project.concept ? "Proposed technology" : "Technology"}\n${project.technology.join(", ")}`,
      ...(project.contributors
        ? [
            `Contributors (repository credits or owner-supplied)\n${project.contributors.join(", ")}`,
          ]
        : []),
      `Giovanni's contributions\n${project.contributions.map((text) => "- " + text).join("\n")}`,
      ...project.notes,
    ].join("\n\n"),
  };
  return [about];
}

export type AiFileAppId =
  `ai-text:${AiProjectId}:${string}` | `ai-image:${AiProjectId}:${string}`;

export function getAiFile(id: string) {
  const [kind, projectId, fileId, extra] = id.split(":");
  if (extra !== undefined || (kind !== "ai-text" && kind !== "ai-image"))
    return;
  const project = getAiProject(projectId);
  if (!project) return;
  if (kind === "ai-text") {
    const file = documentsFor(project).find(({ id }) => id === fileId);
    if (file) return { kind: "text" as const, project, file };
  } else {
    const file = project.images?.find(({ id }) => id === fileId);
    if (file) return { kind: "image" as const, project, file };
  }
}

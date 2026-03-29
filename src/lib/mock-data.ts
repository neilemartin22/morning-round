import type { Article } from "./types";

export const MOCK_SESSION_ARTICLES: Article[] = [
  {
    id: "pubmed-1",
    stream: "literature",
    title:
      "Neoadjuvant Short-Course Radiotherapy Versus Chemoradiotherapy for Locally Advanced Rectal Cancer: Updated RAPIDO Results",
    authors: "van der Valk et al.",
    journal: "J Clin Oncol",
    publishedAt: "Mar 28",
    excerpt:
      "Updated results from the RAPIDO trial demonstrate that short-course radiotherapy followed by preoperative chemotherapy improves disease-free survival compared with standard chemoradiotherapy in locally advanced rectal cancer.",
    tags: ["rectal", "chemoradiation", "phase III"],
    readingTimeMin: 15,
    hasFullText: true,
    status: "unread",
  },
  {
    id: "pubmed-2",
    stream: "literature",
    title:
      "Stereotactic Body Radiation Therapy for Hepatocellular Carcinoma: NRG Oncology/RTOG 1112 Phase III Results",
    authors: "Dawson et al.",
    journal: "Lancet Oncol",
    publishedAt: "Mar 27",
    excerpt:
      "SBRT added to sorafenib significantly improved overall survival compared with sorafenib alone in patients with locally advanced hepatocellular carcinoma not amenable to standard therapies.",
    tags: ["HCC", "SBRT", "phase III"],
    readingTimeMin: 18,
    hasFullText: false,
    status: "unread",
  },
  {
    id: "leadership-1",
    stream: "leadership",
    title: "The Real Work of Leadership Is Emotional Labor",
    authors: "Marcus Buckingham",
    journal: "First Round Review",
    publishedAt: "Mar 26",
    excerpt:
      "What distinguishes effective leaders isn't strategic vision — it's the willingness to sit with ambiguity and hold space for their team's uncertainty during periods of change.",
    tags: ["emotional intelligence", "management"],
    readingTimeMin: 8,
    hasFullText: true,
    status: "unread",
  },
  {
    id: "lesson-1",
    stream: "lesson",
    title: "Anatomy of a Flow — Triggers, Actions, and Connections",
    publishedAt: "Module 1",
    excerpt:
      "Understand the three building blocks that every Power Automate flow is made of, and learn to read any flow at a glance.",
    tags: [],
    readingTimeMin: 20,
    hasFullText: true,
    status: "unread",
    module: "Module 1: Foundations",
    lessonNumber: 1,
    totalLessonsInModule: 3,
  },
  {
    id: "pubmed-3",
    stream: "literature",
    title:
      "Large Language Models for Clinical Decision Support in Radiation Oncology: A Multi-Institutional Validation Study",
    authors: "Chen et al.",
    journal: "Nat Med",
    publishedAt: "Mar 25",
    excerpt:
      "A prospective validation of GPT-4-based clinical decision support across five academic medical centers showed concordance with expert tumor board recommendations in 87% of cases.",
    tags: ["AI", "clinical decision support", "validation"],
    readingTimeMin: 12,
    hasFullText: true,
    status: "completed",
  },
];

/**
 * Simple JSON file-based article store.
 *
 * Stores fetched PubMed articles to disk with deduplication by PMID.
 * Tracks read/unread/saved status. Will be replaced by a real DB later.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import type { Article, ArticleStatus } from "./types";
import type { FetchedArticle } from "./pubmed";

// ---------------------------------------------------------------------------
// Storage location
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json");

// ---------------------------------------------------------------------------
// Internal record type (superset of Article with PubMed-specific fields)
// ---------------------------------------------------------------------------

interface StoredArticle extends Article {
  pmid?: string;
  pmcid?: string;
  diseaseQuery?: string;
  fetchedAt: string;
  completedAt?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // directory already exists — fine
  }
}

async function readStore(): Promise<StoredArticle[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(ARTICLES_FILE, "utf-8");
    return JSON.parse(raw) as StoredArticle[];
  } catch {
    return [];
  }
}

async function writeStore(articles: StoredArticle[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2), "utf-8");
}

// ---------------------------------------------------------------------------
// Convert a FetchedArticle (from PubMed) to our Article type
// ---------------------------------------------------------------------------

function estimateReadingTime(abstract?: string): number {
  if (!abstract) return 5;
  const words = abstract.split(/\s+/).length;
  // Abstract reading ~250 wpm, but the full paper is longer.
  return Math.max(5, Math.round(words / 250) + 10);
}

function toStoredArticle(fa: FetchedArticle): StoredArticle {
  const tags: string[] = [fa.diseaseLabel.toLowerCase()];

  // Add some common tags from the title.
  const titleLower = fa.title.toLowerCase();
  if (titleLower.includes("phase iii") || titleLower.includes("phase 3"))
    tags.push("phase III");
  if (titleLower.includes("sbrt")) tags.push("SBRT");
  if (titleLower.includes("meta-analysis")) tags.push("meta-analysis");
  if (
    titleLower.includes("machine learning") ||
    titleLower.includes("deep learning") ||
    titleLower.includes("artificial intelligence")
  )
    tags.push("AI");

  return {
    id: `pubmed-${fa.pmid}`,
    stream: "literature",
    title: fa.title,
    authors: fa.authors,
    journal: fa.journal,
    publishedAt: fa.pubDate,
    excerpt: fa.abstract
      ? fa.abstract.slice(0, 300) + (fa.abstract.length > 300 ? "..." : "")
      : "No abstract available.",
    abstract: fa.abstract,
    tags,
    readingTimeMin: estimateReadingTime(fa.abstract),
    hasFullText: fa.hasFullText,
    url: fa.doi
      ? `https://doi.org/${fa.doi}`
      : `https://pubmed.ncbi.nlm.nih.gov/${fa.pmid}/`,
    status: "unread",
    pmid: fa.pmid,
    pmcid: fa.pmcid,
    diseaseQuery: fa.diseaseQuery,
    fetchedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Upsert fetched articles into the store, deduplicating by PMID.
 * Returns the count of newly added articles.
 */
export async function upsertArticles(
  fetched: FetchedArticle[]
): Promise<number> {
  const existing = await readStore();
  const existingPmids = new Set(existing.map((a) => a.pmid).filter(Boolean));

  let added = 0;
  for (const fa of fetched) {
    if (existingPmids.has(fa.pmid)) continue;
    existing.push(toStoredArticle(fa));
    existingPmids.add(fa.pmid);
    added++;
  }

  await writeStore(existing);
  return added;
}

/**
 * Get all articles, optionally filtered for the current session (last 7 days).
 */
export async function getSessionArticles(): Promise<Article[]> {
  const all = await readStore();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString();

  return all
    .filter((a) => a.fetchedAt >= weekAgoStr)
    .map(toArticle);
}

/**
 * Get all stored articles (no date filter).
 */
export async function getAllArticles(): Promise<Article[]> {
  const all = await readStore();
  return all.map(toArticle);
}

/**
 * Get saved articles.
 */
export async function getSavedArticles(): Promise<Article[]> {
  const all = await readStore();
  return all.filter((a) => a.status === "saved").map(toArticle);
}

/**
 * Update the status of an article by its id.
 */
export async function updateStatus(
  articleId: string,
  status: ArticleStatus
): Promise<Article | null> {
  const all = await readStore();
  const idx = all.findIndex((a) => a.id === articleId);
  if (idx === -1) return null;

  all[idx].status = status;

  if (status === "saved") {
    all[idx].savedAt = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  if (status === "completed") {
    all[idx].completedAt = new Date().toISOString();
  }

  await writeStore(all);
  return toArticle(all[idx]);
}

/**
 * Convenience: mark an article as completed.
 */
export async function markComplete(articleId: string): Promise<Article | null> {
  return updateStatus(articleId, "completed");
}

/**
 * Convenience: mark an article as saved.
 */
export async function markSaved(articleId: string): Promise<Article | null> {
  return updateStatus(articleId, "saved");
}

/**
 * Convenience: mark an article as in-progress.
 */
export async function markInProgress(
  articleId: string
): Promise<Article | null> {
  return updateStatus(articleId, "in_progress");
}

/**
 * Get a single article by id.
 */
export async function getArticle(articleId: string): Promise<Article | null> {
  const all = await readStore();
  const found = all.find((a) => a.id === articleId);
  return found ? toArticle(found) : null;
}

/**
 * Get articles matching a specific disease query id.
 */
export async function getArticlesByQuery(queryId: string): Promise<Article[]> {
  const all = await readStore();
  return all.filter((a) => a.diseaseQuery === queryId).map(toArticle);
}

/**
 * Clear all articles from the store.
 */
export async function clearAll(): Promise<void> {
  await ensureDataDir();
  await writeStore([]);
}

// ---------------------------------------------------------------------------
// Strip internal fields when returning Article to consumers
// ---------------------------------------------------------------------------

function toArticle(stored: StoredArticle): Article {
  return {
    id: stored.id,
    stream: stored.stream,
    title: stored.title,
    authors: stored.authors,
    journal: stored.journal,
    publishedAt: stored.publishedAt,
    excerpt: stored.excerpt,
    abstract: stored.abstract,
    tags: stored.tags,
    readingTimeMin: stored.readingTimeMin,
    hasFullText: stored.hasFullText,
    fullText: stored.fullText,
    url: stored.url,
    status: stored.status,
    addedByUser: stored.addedByUser,
    savedAt: stored.savedAt,
    pmcid: stored.pmcid,
    module: stored.module,
    lessonNumber: stored.lessonNumber,
    totalLessonsInModule: stored.totalLessonsInModule,
  };
}

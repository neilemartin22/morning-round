/**
 * Article store backed by Turso (libSQL).
 */

import { getDb } from "./db";
import type { Article, ArticleStatus } from "./types";
import type { FetchedArticle } from "./pubmed";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface ArticleRow {
  id: string;
  stream: string;
  title: string;
  authors: string | null;
  journal: string | null;
  published_at: string | null;
  excerpt: string | null;
  abstract: string | null;
  full_text: string | null;
  tags: string;
  reading_time_min: number;
  has_full_text: number;
  url: string | null;
  status: string;
  added_by_user: number;
  saved_at: string | null;
  pmid: string | null;
  pmcid: string | null;
  disease_query: string | null;
  fetched_at: string | null;
  completed_at: string | null;
  module: string | null;
  lesson_number: number | null;
  total_lessons_in_module: number | null;
}

function rowToArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    stream: row.stream as Article["stream"],
    title: row.title,
    authors: row.authors ?? undefined,
    journal: row.journal ?? undefined,
    publishedAt: row.published_at ?? "",
    excerpt: row.excerpt ?? "",
    abstract: row.abstract ?? undefined,
    fullText: row.full_text ?? undefined,
    tags: JSON.parse(row.tags || "[]"),
    readingTimeMin: row.reading_time_min,
    hasFullText: row.has_full_text === 1,
    url: row.url ?? undefined,
    status: row.status as ArticleStatus,
    addedByUser: row.added_by_user === 1,
    savedAt: row.saved_at ?? undefined,
    pmcid: row.pmcid ?? undefined,
    module: row.module ?? undefined,
    lessonNumber: row.lesson_number ?? undefined,
    totalLessonsInModule: row.total_lessons_in_module ?? undefined,
  };
}

function estimateReadingTime(abstract?: string): number {
  if (!abstract) return 5;
  const words = abstract.split(/\s+/).length;
  return Math.max(5, Math.round(words / 250) + 10);
}

// ---------------------------------------------------------------------------
// Convert PubMed fetch results
// ---------------------------------------------------------------------------

function toInsertParams(fa: FetchedArticle) {
  const tags: string[] = [fa.diseaseLabel.toLowerCase()];
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

  const excerpt = fa.abstract
    ? fa.abstract.slice(0, 300) + (fa.abstract.length > 300 ? "..." : "")
    : "No abstract available.";

  return {
    id: `pubmed-${fa.pmid}`,
    stream: "literature",
    title: fa.title,
    authors: fa.authors || null,
    journal: fa.journal || null,
    published_at: fa.pubDate,
    excerpt,
    abstract: fa.abstract || null,
    tags: JSON.stringify(tags),
    reading_time_min: estimateReadingTime(fa.abstract),
    has_full_text: fa.hasFullText ? 1 : 0,
    url: fa.doi
      ? `https://doi.org/${fa.doi}`
      : `https://pubmed.ncbi.nlm.nih.gov/${fa.pmid}/`,
    status: "unread",
    pmid: fa.pmid,
    pmcid: fa.pmcid || null,
    disease_query: fa.diseaseQuery,
    fetched_at: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function upsertArticles(
  fetched: FetchedArticle[]
): Promise<number> {
  const db = await getDb();
  let added = 0;

  for (const fa of fetched) {
    const p = toInsertParams(fa);
    const result = await db.execute({
      sql: `INSERT OR IGNORE INTO articles (id, stream, title, authors, journal, published_at, excerpt, abstract, tags, reading_time_min, has_full_text, url, status, pmid, pmcid, disease_query, fetched_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        p.id, p.stream, p.title, p.authors, p.journal, p.published_at,
        p.excerpt, p.abstract, p.tags, p.reading_time_min, p.has_full_text,
        p.url, p.status, p.pmid, p.pmcid, p.disease_query, p.fetched_at,
      ],
    });
    if (result.rowsAffected > 0) added++;
  }

  return added;
}

export async function getSessionArticles(): Promise<Article[]> {
  const db = await getDb();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const result = await db.execute({
    sql: `SELECT * FROM articles WHERE fetched_at >= ? ORDER BY fetched_at DESC`,
    args: [weekAgo.toISOString()],
  });
  return (result.rows as unknown as ArticleRow[]).map(rowToArticle);
}

export async function getAllArticles(): Promise<Article[]> {
  const db = await getDb();
  const result = await db.execute(
    `SELECT * FROM articles ORDER BY fetched_at DESC`
  );
  return (result.rows as unknown as ArticleRow[]).map(rowToArticle);
}

export async function getSavedArticles(): Promise<Article[]> {
  const db = await getDb();
  const result = await db.execute(
    `SELECT * FROM articles WHERE status = 'saved' ORDER BY saved_at DESC`
  );
  return (result.rows as unknown as ArticleRow[]).map(rowToArticle);
}

export async function updateStatus(
  articleId: string,
  status: ArticleStatus
): Promise<Article | null> {
  const db = await getDb();

  const extra: string[] = [];
  const args: (string | null)[] = [status];

  if (status === "saved") {
    extra.push("saved_at = ?");
    args.push(
      new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );
  }
  if (status === "completed") {
    extra.push("completed_at = ?");
    args.push(new Date().toISOString());
  }

  args.push(articleId);

  const setClauses = ["status = ?", ...extra].join(", ");
  await db.execute({
    sql: `UPDATE articles SET ${setClauses} WHERE id = ?`,
    args,
  });

  return getArticle(articleId);
}

export async function markComplete(articleId: string): Promise<Article | null> {
  return updateStatus(articleId, "completed");
}

export async function markSaved(articleId: string): Promise<Article | null> {
  return updateStatus(articleId, "saved");
}

export async function markInProgress(
  articleId: string
): Promise<Article | null> {
  return updateStatus(articleId, "in_progress");
}

export async function getArticle(articleId: string): Promise<Article | null> {
  const db = await getDb();
  const result = await db.execute({
    sql: `SELECT * FROM articles WHERE id = ?`,
    args: [articleId],
  });
  if (result.rows.length === 0) return null;
  return rowToArticle(result.rows[0] as unknown as ArticleRow);
}

export async function getArticlesByQuery(queryId: string): Promise<Article[]> {
  const db = await getDb();
  const result = await db.execute({
    sql: `SELECT * FROM articles WHERE disease_query = ? ORDER BY fetched_at DESC`,
    args: [queryId],
  });
  return (result.rows as unknown as ArticleRow[]).map(rowToArticle);
}

export async function clearAll(): Promise<void> {
  const db = await getDb();
  await db.execute(`DELETE FROM articles`);
}

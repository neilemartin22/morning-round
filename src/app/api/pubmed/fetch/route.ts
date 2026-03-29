import { NextResponse } from "next/server";
import { fetchAllQueries } from "@/lib/pubmed";
import { upsertArticles, getSessionArticles } from "@/lib/articles-store";

/**
 * POST /api/pubmed/fetch
 *
 * Triggers a full fetch cycle: runs all configured disease-site queries
 * against PubMed, stores new articles, and returns the current session.
 */
export async function POST() {
  try {
    const fetched = await fetchAllQueries();
    const newCount = await upsertArticles(fetched);
    const session = await getSessionArticles();

    return NextResponse.json({
      ok: true,
      fetched: fetched.length,
      newArticles: newCount,
      sessionArticles: session,
    });
  } catch (err) {
    console.error("PubMed fetch failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pubmed/fetch
 *
 * Returns the current session articles without triggering a new fetch.
 */
export async function GET() {
  try {
    const session = await getSessionArticles();
    return NextResponse.json({ ok: true, articles: session });
  } catch (err) {
    console.error("Failed to read session articles:", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  getSessionArticles,
  getAllArticles,
  getSavedArticles,
} from "@/lib/articles-store";

/**
 * GET /api/articles
 *
 * Returns articles. Query params:
 *   ?view=session  (default) — current session (last 7 days)
 *   ?view=archive  — all articles
 *   ?view=saved    — saved articles only
 */
export async function GET(request: NextRequest) {
  try {
    const view = request.nextUrl.searchParams.get("view") ?? "session";

    let articles;
    switch (view) {
      case "archive":
        articles = await getAllArticles();
        break;
      case "saved":
        articles = await getSavedArticles();
        break;
      default:
        articles = await getSessionArticles();
    }

    return NextResponse.json({ ok: true, articles });
  } catch (err) {
    console.error("Failed to fetch articles:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

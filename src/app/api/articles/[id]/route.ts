import { NextRequest, NextResponse } from "next/server";
import { getArticle, updateStatus } from "@/lib/articles-store";
import type { ArticleStatus } from "@/lib/types";

/**
 * GET /api/articles/[id]
 *
 * Returns a single article by ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const article = await getArticle(id);
    if (!article) {
      return NextResponse.json(
        { ok: false, error: "Article not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, article });
  } catch (err) {
    console.error(`Failed to fetch article ${id}:`, err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

const VALID_STATUSES: ArticleStatus[] = [
  "unread",
  "in_progress",
  "completed",
  "saved",
];

/**
 * PATCH /api/articles/[id]
 *
 * Updates an article's status.
 * Body: { status: "completed" | "saved" | "unread" | "in_progress" }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body as { status: ArticleStatus };

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { ok: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const article = await updateStatus(id, status);
    if (!article) {
      return NextResponse.json(
        { ok: false, error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, article });
  } catch (err) {
    console.error(`Failed to update article ${id}:`, err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

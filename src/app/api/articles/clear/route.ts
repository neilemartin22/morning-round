import { NextResponse } from "next/server";
import { clearAll } from "@/lib/articles-store";

/**
 * POST /api/articles/clear
 *
 * Clears all article history.
 */
export async function POST() {
  try {
    await clearAll();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to clear articles:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

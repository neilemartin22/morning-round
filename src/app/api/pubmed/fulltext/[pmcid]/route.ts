import { NextRequest, NextResponse } from "next/server";
import { efetchFullText } from "@/lib/pubmed";

/**
 * GET /api/pubmed/fulltext/[pmcid]
 *
 * Fetches the full text of an open-access PMC article, parses the JATS XML,
 * and returns readable HTML.
 *
 * NOTE: In Next.js 16, route params are async and must be awaited.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pmcid: string }> }
) {
  const { pmcid } = await params;

  if (!pmcid) {
    return NextResponse.json(
      { ok: false, error: "Missing pmcid parameter" },
      { status: 400 }
    );
  }

  try {
    const html = await efetchFullText(pmcid);

    return NextResponse.json({
      ok: true,
      pmcid,
      html,
    });
  } catch (err) {
    console.error(`Full text fetch failed for ${pmcid}:`, err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

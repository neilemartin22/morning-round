import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * GET /api/pdf/[id]
 *
 * Serves a stored PDF file.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = await getDb();

  const result = await db.execute({
    sql: `SELECT filename, pdf_data FROM pdf_queue WHERE id = ?`,
    args: [id],
  });

  if (result.rows.length === 0) {
    return NextResponse.json(
      { ok: false, error: "PDF not found" },
      { status: 404 }
    );
  }

  const row = result.rows[0] as unknown as {
    filename: string;
    pdf_data: ArrayBuffer;
  };

  return new NextResponse(row.pdf_data, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${row.filename}"`,
    },
  });
}

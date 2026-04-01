import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function generateId(): string {
  return `pdf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function titleFromFilename(name: string): string {
  return name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No files provided" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const results: { id: string; title: string; error?: string }[] = [];

    for (const file of files) {
      if (!file.name.endsWith(".pdf") && file.type !== "application/pdf") {
        results.push({
          id: "",
          title: file.name,
          error: "Only PDF files are supported",
        });
        continue;
      }

      try {
        const id = generateId();
        const title = titleFromFilename(file.name);
        const buffer = Buffer.from(await file.arrayBuffer());

        await db.execute({
          sql: `INSERT INTO pdf_queue (id, title, filename, pdf_data, status, queued_at)
                VALUES (?, ?, ?, ?, 'queued', ?)`,
          args: [id, title, file.name, buffer, new Date().toISOString()],
        });

        results.push({ id, title });
      } catch (err) {
        results.push({
          id: "",
          title: file.name,
          error: err instanceof Error ? err.message : "Failed to store file",
        });
      }
    }

    // Count remaining in queue
    const countResult = await db.execute(
      `SELECT COUNT(*) as cnt FROM pdf_queue WHERE status = 'queued'`
    );
    const queued = (countResult.rows[0] as unknown as { cnt: number }).cnt;

    return NextResponse.json({ ok: true, results, queued });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

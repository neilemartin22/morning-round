import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function generateId(): string {
  return `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function extractTitle(text: string, fileName: string): string {
  // Try first non-empty line as title
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length > 0 && lines[0].length < 200) {
    return lines[0];
  }
  // Fall back to filename without extension
  return fileName.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
}

function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(3, Math.round(words / 230));
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
      try {
        let text = "";
        let title = "";

        if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
          const { extractText } = await import("unpdf");
          const arrayBuffer = await file.arrayBuffer();
          const result = await extractText(new Uint8Array(arrayBuffer));
          text = Array.isArray(result.text) ? result.text.join("\n") : result.text;
          title = extractTitle(text, file.name);
        } else if (
          file.type === "text/html" ||
          file.name.endsWith(".html") ||
          file.name.endsWith(".htm")
        ) {
          const html = await file.text();
          // Extract title from <title> tag
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          title = titleMatch ? titleMatch[1].trim() : extractTitle("", file.name);
          // Strip HTML tags for body text
          text = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        } else if (
          file.type === "text/plain" ||
          file.name.endsWith(".txt") ||
          file.name.endsWith(".md")
        ) {
          text = await file.text();
          title = extractTitle(text, file.name);
        } else {
          results.push({
            id: "",
            title: file.name,
            error: `Unsupported file type: ${file.type || file.name.split(".").pop()}`,
          });
          continue;
        }

        if (!text.trim()) {
          results.push({
            id: "",
            title: file.name,
            error: "Could not extract text from file",
          });
          continue;
        }

        const id = generateId();
        const excerpt =
          text.slice(0, 300) + (text.length > 300 ? "..." : "");
        const readingTime = estimateReadingTime(text);

        await db.execute({
          sql: `INSERT INTO articles (id, stream, title, excerpt, abstract, full_text, tags, reading_time_min, has_full_text, status, added_by_user, fetched_at)
                VALUES (?, 'leadership', ?, ?, ?, ?, '[]', ?, 1, 'unread', 1, ?)`,
          args: [
            id,
            title,
            excerpt,
            text.slice(0, 2000),
            text,
            readingTime,
            new Date().toISOString(),
          ],
        });

        results.push({ id, title });
      } catch (err) {
        results.push({
          id: "",
          title: file.name,
          error: err instanceof Error ? err.message : "Failed to process file",
        });
      }
    }

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

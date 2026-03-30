"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BottomActionBar } from "@/components/BottomActionBar";
import { findArticleById, getNextArticleId } from "@/lib/mock-data";
import type { Article } from "@/lib/types";

const STREAM_LABELS: Record<string, string> = {
  literature: "LITERATURE",
  leadership: "LEADERSHIP",
  lesson: "LESSON",
};

const STREAM_COLORS: Record<string, string> = {
  literature: "text-umber",
  leadership: "text-sage",
  lesson: "text-ink-secondary",
};

function useArticle(id: string) {
  const [article, setArticle] = useState<Article | undefined>(
    () => findArticleById(id)
  );
  const [nextId] = useState<string | null>(
    () => getNextArticleId(id)
  );
  const [fullTextLoading, setFullTextLoading] = useState(false);

  useEffect(() => {
    async function fetchFromApi() {
      try {
        const res = await fetch(`/api/articles/${id}`);
        const data = await res.json();
        if (data.ok && data.article) {
          setArticle(data.article);

          // If article has a PMCID but no cached full text, fetch it
          if (data.article.hasFullText && data.article.pmcid && !data.article.fullText) {
            setFullTextLoading(true);
            try {
              const ftRes = await fetch(`/api/pubmed/fulltext/${data.article.pmcid}`);
              const ftData = await ftRes.json();
              if (ftData.ok && ftData.html) {
                setArticle((prev) =>
                  prev ? { ...prev, fullText: ftData.html } : prev
                );
              }
            } catch {
              // Full text fetch failed — abstract is still available
            } finally {
              setFullTextLoading(false);
            }
          }
        }
      } catch {
        // API unavailable — keep mock data
      }

      // Mark as in_progress
      try {
        await fetch(`/api/articles/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "in_progress" }),
        });
      } catch {
        // Mock mode — fine
      }
    }

    fetchFromApi();
  }, [id]);

  return { article, nextId, fullTextLoading };
}

export default function ReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { article, nextId, fullTextLoading } = useArticle(id);
  const [viewMode, setViewMode] = useState<"abstract" | "fulltext">(
    "abstract"
  );

  if (!article) {
    return (
      <main className="mx-auto max-w-[65ch] w-full px-8 py-16">
        <p className="font-sans text-sm text-ink-tertiary text-center">
          Article not found.
        </p>
        <Link
          href="/"
          className="block text-center mt-4 font-sans text-sm text-umber hover:underline"
        >
          Back to session
        </Link>
      </main>
    );
  }

  const streamLabel = STREAM_LABELS[article.stream] ?? "ARTICLE";
  const streamColor = STREAM_COLORS[article.stream] ?? "text-ink-secondary";

  const showToggle = article.abstract && article.fullText;
  const bodyContent =
    viewMode === "fulltext" && article.fullText
      ? article.fullText
      : article.abstract ?? article.excerpt;

  return (
    <>
      <ScrollProgress />

      <main className="mx-auto max-w-[65ch] w-full px-8 pt-8 pb-24">
        {/* Back link */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="font-sans text-sm text-ink-secondary hover:text-ink transition-colors"
          >
            &larr; Back to session
          </Link>
        </div>

        {/* Stream label */}
        <p
          className={`font-sans text-xs tracking-[0.1em] uppercase ${streamColor} mb-4`}
        >
          {streamLabel}
          {article.module && (
            <span className="text-ink-tertiary">
              {" "}
              &middot; {article.module}
            </span>
          )}
        </p>

        {/* Title */}
        <h1 className="font-serif text-3xl font-bold leading-snug text-ink mb-4">
          {article.title}
        </h1>

        {/* Metadata */}
        <p className="font-sans text-sm text-ink-secondary mb-6">
          {article.journal && <span>{article.journal}</span>}
          {article.authors && <span> &middot; {article.authors}</span>}
          {article.publishedAt && (
            <span> &middot; {article.publishedAt}</span>
          )}
          <span>
            {" "}
            &middot; {article.readingTimeMin} min read
          </span>
          {article.url && (
            <span>
              {" "}
              &middot;{" "}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-umber underline underline-offset-2 hover:text-umber-light"
              >
                View source
              </a>
            </span>
          )}
          {article.lessonNumber && article.totalLessonsInModule && (
            <span>
              {" "}
              &middot; Step {article.lessonNumber} of{" "}
              {article.totalLessonsInModule}
            </span>
          )}
        </p>

        {/* Divider */}
        <hr className="border-border-subtle mb-6" />

        {/* Abstract / Full Text toggle */}
        {(showToggle || fullTextLoading) && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setViewMode("abstract")}
              className={`font-sans text-sm pb-0.5 transition-colors ${
                viewMode === "abstract"
                  ? "text-umber border-b border-umber"
                  : "text-ink-secondary hover:text-ink"
              }`}
            >
              Abstract
            </button>
            <button
              onClick={() => setViewMode("fulltext")}
              disabled={fullTextLoading}
              className={`font-sans text-sm pb-0.5 transition-colors ${
                viewMode === "fulltext"
                  ? "text-umber border-b border-umber"
                  : "text-ink-secondary hover:text-ink"
              }`}
            >
              {fullTextLoading ? "Loading full text\u2026" : "Full text"}
            </button>
          </div>
        )}

        {/* Article body */}
        <article className="prose-morning font-serif text-lg leading-relaxed text-ink">
          {bodyContent.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={i}>
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={i}>
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }
            if (paragraph.startsWith("- ")) {
              const items = paragraph.split("\n").filter((l) => l.startsWith("- "));
              return (
                <ul key={i} className="list-disc pl-6 mb-4 space-y-1">
                  {items.map((item, j) => (
                    <li key={j}>{item.replace(/^- \*\*(.+?)\*\*(.*)$/, (_, bold, rest) => `${bold}${rest}`).replace("- ", "")}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{paragraph}</p>;
          })}
        </article>

        {/* Tags */}
        {article.tags.length > 0 && (
          <p className="font-sans text-xs text-ink-tertiary mt-8">
            {article.tags.join(" \u00B7 ")}
          </p>
        )}
      </main>

      <BottomActionBar
        articleId={article.id}
        nextArticleId={nextId}
        initialSaved={article.status === "saved"}
      />
    </>
  );
}

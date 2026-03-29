"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { StreamFilter, type FilterValue } from "@/components/StreamFilter";
import { useArticles } from "@/lib/use-articles";
import type { Article } from "@/lib/types";

const STREAM_CONFIG = {
  literature: { label: "Literature", borderColor: "border-umber" },
  leadership: { label: "Leadership", borderColor: "border-sage" },
  lesson: { label: "Lesson", borderColor: "border-ink-secondary" },
} as const;

function SavedCard({ article }: { article: Article }) {
  const stream = STREAM_CONFIG[article.stream];

  return (
    <Link href={`/read/${article.id}`}>
      <article className="bg-bone-warm border border-border-subtle rounded-sm p-5 hover:border-border transition-colors duration-150 cursor-pointer">
        <div className={`border-l-[3px] ${stream.borderColor} pl-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs tracking-[0.1em] uppercase text-ink-tertiary">
              {stream.label}
            </span>
            <span className="font-sans text-xs text-ink-tertiary">
              {article.readingTimeMin} min
              {article.savedAt && (
                <span> &middot; Saved {article.savedAt}</span>
              )}
            </span>
          </div>

          <h2 className="font-serif text-xl font-semibold text-ink leading-snug mb-1.5 line-clamp-2">
            {article.title}
          </h2>

          {article.journal && (
            <p className="font-sans text-sm text-ink-secondary mb-2">
              {article.journal}
              {article.authors && <span> &middot; {article.authors}</span>}
              <span> &middot; {article.publishedAt}</span>
            </p>
          )}

          {article.excerpt && (
            <p className="font-sans text-sm text-ink-secondary line-clamp-2">
              {article.excerpt}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

export default function SavedPage() {
  const { articles, loading } = useArticles("saved");
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return articles;
    return articles.filter((a) => a.stream === filter);
  }, [articles, filter]);

  return (
    <>
      <Header />

      <main className="mx-auto max-w-[720px] w-full px-8 pb-16 mt-4">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink mb-6">
          Saved
        </h1>

        <StreamFilter active={filter} onChange={setFilter} />

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-bone-warm border border-border-subtle rounded-sm p-5 h-32 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="font-sans text-sm text-ink-tertiary text-center py-12">
            Nothing here.
          </p>
        ) : (
          <section className="flex flex-col gap-3">
            {filtered.map((article) => (
              <SavedCard key={article.id} article={article} />
            ))}
          </section>
        )}
      </main>

      <footer className="mt-auto py-6 text-center">
        <span className="font-sans text-xs text-ink-tertiary">
          Morning Round
        </span>
      </footer>
    </>
  );
}

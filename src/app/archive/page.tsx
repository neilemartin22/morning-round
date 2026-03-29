"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { ArticleCard } from "@/components/ArticleCard";
import { StreamFilter, type FilterValue } from "@/components/StreamFilter";
import { useArticles } from "@/lib/use-articles";

export default function ArchivePage() {
  const { articles, loading } = useArticles("archive");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = articles;

    if (filter !== "all") {
      result = result.filter((a) => a.stream === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.journal?.toLowerCase().includes(q) ||
          a.authors?.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [articles, filter, search]);

  return (
    <>
      <Header />

      <main className="mx-auto max-w-[720px] w-full px-8 pb-16 mt-4">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink mb-6">
          Archive
        </h1>

        <StreamFilter active={filter} onChange={setFilter} />

        <input
          type="text"
          placeholder="Search past articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full font-sans text-base bg-transparent border-b border-border-subtle focus:border-umber outline-none py-2 mb-6 text-ink placeholder:text-ink-tertiary"
        />

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
              <ArticleCard key={article.id} article={article} />
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

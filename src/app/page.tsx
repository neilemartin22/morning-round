"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { ProgressBar } from "@/components/ProgressBar";
import { ArticleCard } from "@/components/ArticleCard";
import { useArticles } from "@/lib/use-articles";

function formatDate(): string {
  const now = new Date();
  return now
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning.";
  return "Good afternoon.";
}

export default function Home() {
  const { articles, loading, updateStatus, usingMockData, refresh } =
    useArticles("session");
  const [fetching, setFetching] = useState(false);

  async function handleFetchPubMed() {
    setFetching(true);
    try {
      await fetch("/api/pubmed/fetch", { method: "POST" });
      await refresh();
    } catch {
      // silent
    } finally {
      setFetching(false);
    }
  }

  const completed = articles.filter((a) => a.status === "completed");
  const active = articles.filter((a) => a.status !== "completed");
  const totalMinutes = active.reduce((sum, a) => sum + a.readingTimeMin, 0);

  const articleCount = active.filter((a) => a.stream !== "lesson").length;
  const lessonCount = active.filter((a) => a.stream === "lesson").length;

  const summaryParts = [];
  if (articleCount > 0)
    summaryParts.push(
      `${articleCount} article${articleCount !== 1 ? "s" : ""}`
    );
  if (lessonCount > 0)
    summaryParts.push(
      `${lessonCount} lesson${lessonCount !== 1 ? "s" : ""}`
    );

  const allDone = active.length === 0 && completed.length > 0;

  return (
    <>
      <ProgressBar completed={completed.length} total={articles.length} />

      <Header />

      <main className="mx-auto max-w-[720px] w-full px-8 pb-16 mt-4">
        {/* Session header */}
        <section className="mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-ink">
            {formatDate()}
          </h1>
          {loading ? (
            <p className="font-sans text-sm text-ink-tertiary mt-1">
              Loading session&hellip;
            </p>
          ) : allDone ? (
            <p className="font-sans text-sm text-ink-secondary mt-1">
              Session complete. {completed.length} of {completed.length} items
              finished.
            </p>
          ) : (
            <p className="font-sans text-sm text-ink-secondary mt-1">
              {getGreeting()}{" "}
              {summaryParts.join(" + ")} &middot; ~{totalMinutes} min remaining
            </p>
          )}
        </section>

        {/* Fetch real articles prompt */}
        {!loading && usingMockData && (
          <section className="mb-6 border border-border-subtle rounded-sm p-4">
            <p className="font-sans text-sm text-ink-secondary mb-2">
              Showing sample articles.
            </p>
            <button
              onClick={handleFetchPubMed}
              disabled={fetching}
              className="font-sans text-sm text-umber hover:underline underline-offset-2 disabled:text-ink-tertiary"
            >
              {fetching
                ? "Fetching from PubMed\u2026"
                : "Fetch real articles from PubMed"}
            </button>
          </section>
        )}

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-bone-warm border border-border-subtle rounded-sm p-5 h-32 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Active items */}
        {!loading && active.length > 0 && (
          <section className="flex flex-col gap-3">
            {active.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onStatusChange={updateStatus}
              />
            ))}
          </section>
        )}

        {/* Completed items */}
        {!loading && completed.length > 0 && (
          <section className="mt-8">
            <p className="font-sans text-xs tracking-[0.1em] uppercase text-ink-tertiary mb-3">
              Completed today ({completed.length})
            </p>
            <div className="flex flex-col">
              {completed.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Load more prompt when session is complete */}
        {allDone && (
          <section className="mt-8 text-center">
            <p className="font-sans text-sm text-ink-tertiary">
              Want more? Additional articles are available in the archive.
            </p>
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

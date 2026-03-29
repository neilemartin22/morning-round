"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { ProgressBar } from "@/components/ProgressBar";
import { ArticleCard } from "@/components/ArticleCard";
import { MOCK_SESSION_ARTICLES } from "@/lib/mock-data";

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
  if (hour < 12) return "Good morning";
  return "Good afternoon";
}

export default function Home() {
  const [articles] = useState(MOCK_SESSION_ARTICLES);

  const completed = articles.filter((a) => a.status === "completed");
  const active = articles.filter((a) => a.status !== "completed");
  const totalMinutes = active.reduce((sum, a) => sum + a.readingTimeMin, 0);

  const articleCount = active.filter(
    (a) => a.stream !== "lesson"
  ).length;
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
          <p className="font-sans text-sm text-ink-secondary mt-1">
            {summaryParts.join(" + ")} &middot; ~{totalMinutes} min remaining
          </p>
        </section>

        {/* Active items */}
        <section className="flex flex-col gap-3">
          {active.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </section>

        {/* Completed items */}
        {completed.length > 0 && (
          <section className="mt-8">
            <p className="font-sans text-xs tracking-[0.1em] uppercase text-ink-tertiary mb-3">
              Completed today
            </p>
            <div className="flex flex-col">
              {completed.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
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

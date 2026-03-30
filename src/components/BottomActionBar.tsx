"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface BottomActionBarProps {
  articleId: string;
  nextArticleId: string | null;
  initialSaved?: boolean;
  onMarkComplete?: () => void;
}

export function BottomActionBar({
  articleId,
  nextArticleId,
  initialSaved = false,
  onMarkComplete,
}: BottomActionBarProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);

  const markComplete = useCallback(async () => {
    try {
      await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
    } catch {
      // silent
    }
    if (onMarkComplete) onMarkComplete();
  }, [articleId, onMarkComplete]);

  const handleNext = useCallback(() => {
    markComplete();
    if (nextArticleId) {
      router.push(`/read/${nextArticleId}`);
    } else {
      router.push("/");
    }
  }, [markComplete, nextArticleId, router]);

  const handleSave = useCallback(() => {
    setSaved((prev) => {
      const newSaved = !prev;
      fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newSaved ? "saved" : "in_progress" }),
      }).catch(() => {});
      return newSaved;
    });
  }, [articleId]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "j" || e.key === "n") {
        handleNext();
      }
      if (e.key === "s") {
        handleSave();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNext, handleSave]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-bone/95 backdrop-blur-sm border-t border-border-subtle z-40">
      <div className="mx-auto max-w-[65ch] w-full px-8 py-3 flex items-center justify-between">
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 font-sans text-sm transition-colors ${
            saved
              ? "text-umber"
              : "text-ink-secondary hover:text-ink"
          }`}
        >
          {saved ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </svg>
          )}
          {saved ? "Saved" : "Save for later"}
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 font-sans text-sm text-ink hover:text-umber transition-colors"
        >
          {nextArticleId ? "Next" : "Done"}
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

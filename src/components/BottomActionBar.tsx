"use client";

import { useState } from "react";
import Link from "next/link";

interface BottomActionBarProps {
  nextArticleId: string | null;
  onMarkComplete?: () => void;
}

export function BottomActionBar({
  nextArticleId,
  onMarkComplete,
}: BottomActionBarProps) {
  const [completed, setCompleted] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-bone/95 backdrop-blur-sm border-t border-border-subtle z-40">
      <div className="mx-auto max-w-[65ch] w-full px-8 py-3 flex items-center justify-between">
        <button
          onClick={() => {
            setCompleted(!completed);
            if (!completed && onMarkComplete) onMarkComplete();
          }}
          className={`flex items-center gap-1.5 font-sans text-sm transition-colors ${
            completed
              ? "text-sage"
              : "text-ink-secondary hover:text-ink"
          }`}
        >
          {completed ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
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
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          )}
          {completed ? "Completed" : "Mark complete"}
        </button>

        <button
          onClick={() => setSaved(!saved)}
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

        {nextArticleId ? (
          <Link
            href={`/read/${nextArticleId}`}
            className="flex items-center gap-1 font-sans text-sm text-ink-secondary hover:text-ink transition-colors"
          >
            Next article
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
          </Link>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-1 font-sans text-sm text-ink-secondary hover:text-ink transition-colors"
          >
            Back to session
          </Link>
        )}
      </div>
    </div>
  );
}

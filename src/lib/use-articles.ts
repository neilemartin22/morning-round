"use client";

import { useState, useEffect, useCallback } from "react";
import type { Article, ArticleStatus } from "./types";
import {
  MOCK_SESSION_ARTICLES,
  MOCK_ARCHIVE_ARTICLES,
  MOCK_SAVED_ARTICLES,
} from "./mock-data";

type View = "session" | "archive" | "saved";

interface UseArticlesResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  updateStatus: (id: string, status: ArticleStatus) => Promise<void>;
  refresh: () => Promise<void>;
  usingMockData: boolean;
}

const MOCK_MAP: Record<View, Article[]> = {
  session: MOCK_SESSION_ARTICLES,
  archive: MOCK_ARCHIVE_ARTICLES,
  saved: MOCK_SAVED_ARTICLES,
};

export function useArticles(view: View = "session"): UseArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/articles?view=${view}`);
      const data = await res.json();

      if (data.ok && data.articles.length > 0) {
        setArticles(data.articles);
        setUsingMockData(false);
      } else {
        // No real articles yet — use mock data
        setArticles(MOCK_MAP[view]);
        setUsingMockData(true);
      }
    } catch {
      // API unavailable — use mock data
      setArticles(MOCK_MAP[view]);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  }, [view]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const updateArticleStatus = useCallback(
    async (id: string, status: ArticleStatus) => {
      // Optimistic update
      setArticles((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status,
                ...(status === "saved"
                  ? {
                      savedAt: new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      }),
                    }
                  : {}),
              }
            : a
        )
      );

      if (!usingMockData) {
        try {
          await fetch(`/api/articles/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          });
        } catch {
          // Revert on failure
          await fetchArticles();
        }
      }
    },
    [usingMockData, fetchArticles]
  );

  return {
    articles,
    loading,
    error,
    updateStatus: updateArticleStatus,
    refresh: fetchArticles,
    usingMockData,
  };
}

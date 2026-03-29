import type { Article } from "@/lib/types";
import Link from "next/link";

const STREAM_CONFIG = {
  literature: { label: "Literature", borderColor: "border-umber" },
  leadership: { label: "Leadership", borderColor: "border-sage" },
  lesson: { label: "Lesson", borderColor: "border-ink-secondary" },
};

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const stream = STREAM_CONFIG[article.stream];

  if (article.status === "completed") {
    return <CompletedCard article={article} />;
  }

  return (
    <Link href={`/read/${article.id}`}>
      <article className="bg-bone-warm border border-border-subtle rounded-sm p-5 hover:border-border transition-colors duration-150 cursor-pointer">
        <div className={`border-l-[3px] ${stream.borderColor} pl-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs tracking-[0.1em] uppercase text-ink-tertiary">
              {stream.label}
              {article.module && (
                <span> &middot; {article.module}</span>
              )}
            </span>
            <span className="font-sans text-xs text-ink-tertiary">
              {article.readingTimeMin} min
              {article.hasFullText && <span> &middot; Full text</span>}
              {article.lessonNumber && article.totalLessonsInModule && (
                <span>
                  {" "}&middot; Step {article.lessonNumber} of{" "}
                  {article.totalLessonsInModule}
                </span>
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
            <p className="font-sans text-sm text-ink-secondary line-clamp-2 mb-2">
              {article.excerpt}
            </p>
          )}

          {article.addedByUser && (
            <p className="font-sans text-xs text-umber mb-2">Added by you</p>
          )}

          {article.tags.length > 0 && (
            <p className="font-sans text-xs text-ink-tertiary">
              {article.tags.join(" \u00B7 ")}
            </p>
          )}

          {article.status === "in_progress" && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-umber mt-2" />
          )}
        </div>
      </article>
    </Link>
  );
}

function CompletedCard({ article }: { article: Article }) {
  return (
    <div className="flex items-center gap-3 py-2 opacity-50">
      <svg
        className="w-4 h-4 text-sage flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      <span className="font-sans text-sm text-ink-secondary line-through truncate">
        {article.title}
      </span>
      <span className="font-sans text-xs text-ink-tertiary ml-auto flex-shrink-0">
        {article.journal && <>{article.journal} &middot; </>}
        {article.publishedAt}
      </span>
    </div>
  );
}

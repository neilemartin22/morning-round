export type ContentStream = "literature" | "leadership" | "lesson";

export type ArticleStatus = "unread" | "in_progress" | "completed" | "saved";

export interface Article {
  id: string;
  stream: ContentStream;
  title: string;
  authors?: string;
  journal?: string;
  publishedAt: string;
  excerpt: string;
  tags: string[];
  readingTimeMin: number;
  hasFullText: boolean;
  fullText?: string;
  abstract?: string;
  url?: string;
  status: ArticleStatus;
  addedByUser?: boolean;
  savedAt?: string;
  // Lesson-specific
  module?: string;
  lessonNumber?: number;
  totalLessonsInModule?: number;
}

export interface Session {
  date: string;
  articles: Article[];
  totalMinutes: number;
}

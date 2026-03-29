import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let initialized = false;

export async function getDb() {
  if (!initialized) {
    await client.batch([
      `CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        stream TEXT NOT NULL DEFAULT 'literature',
        title TEXT NOT NULL,
        authors TEXT,
        journal TEXT,
        published_at TEXT,
        excerpt TEXT,
        abstract TEXT,
        full_text TEXT,
        tags TEXT DEFAULT '[]',
        reading_time_min INTEGER DEFAULT 10,
        has_full_text INTEGER DEFAULT 0,
        url TEXT,
        status TEXT DEFAULT 'unread',
        added_by_user INTEGER DEFAULT 0,
        saved_at TEXT,
        pmid TEXT,
        pmcid TEXT,
        disease_query TEXT,
        fetched_at TEXT,
        completed_at TEXT,
        module TEXT,
        lesson_number INTEGER,
        total_lessons_in_module INTEGER
      )`,
      `CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status)`,
      `CREATE INDEX IF NOT EXISTS idx_articles_pmid ON articles(pmid)`,
      `CREATE INDEX IF NOT EXISTS idx_articles_fetched ON articles(fetched_at)`,
    ]);
    initialized = true;
  }
  return client;
}

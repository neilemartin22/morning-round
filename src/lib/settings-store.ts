import { getDb } from "./db";

export interface Settings {
  pubmed: {
    apiKey: string;
    journals: string[];
    journalEnabled: boolean[];
  };
  leadership: {
    readingFolder: string;
    rssSources: string[];
    rssEnabled: boolean[];
  };
  schedule: {
    weekdayTime: string;
    weekendTime: string;
    weekdayArticles: number;
    weekendArticles: number;
    includeLessonsWeekday: boolean;
    includeLessonsWeekend: boolean;
  };
  lessons: {
    pace: string;
  };
}

const DEFAULT_JOURNALS = [
  "Int J Radiat Oncol Biol Phys (Red Journal)",
  "Radiother Oncol (Green Journal)",
  "J Clin Oncol",
  "Lancet Oncol",
  "Pract Radiat Oncol",
  "Int J Radiat Oncol",
  "Nat Med",
  "JAMA Oncol",
  "N Engl J Med",
  "Cancer",
  "Br J Cancer",
  "Clin Cancer Res",
  "Phys Med Biol",
  "Med Phys",
  "Adv Radiat Oncol",
  "Brachytherapy",
  "J Radiat Res",
  "Strahlenther Onkol",
  "Radiat Oncol",
  "Semin Radiat Oncol",
];

const DEFAULT_RSS = [
  "Harvard Business Review",
  "MIT Sloan Management Review",
  "McKinsey Quarterly",
  "First Round Review",
  "Stanford GSB Insights",
  "Wharton Knowledge",
  "INSEAD Knowledge",
  "Strategy+Business",
  "Kellogg Insight",
  "London Business School Review",
];

export const DEFAULT_SETTINGS: Settings = {
  pubmed: {
    apiKey: "",
    journals: DEFAULT_JOURNALS,
    journalEnabled: DEFAULT_JOURNALS.map(() => true),
  },
  leadership: {
    readingFolder: "~/HBR-Reading",
    rssSources: DEFAULT_RSS,
    rssEnabled: DEFAULT_RSS.map(() => true),
  },
  schedule: {
    weekdayTime: "07:00",
    weekendTime: "13:00",
    weekdayArticles: 3,
    weekendArticles: 5,
    includeLessonsWeekday: true,
    includeLessonsWeekend: true,
  },
  lessons: {
    pace: "1 lesson per session",
  },
};

export async function loadSettings(): Promise<Settings> {
  const db = await getDb();
  const result = await db.execute(
    `SELECT key, value FROM settings`
  );

  if (result.rows.length === 0) return DEFAULT_SETTINGS;

  const stored: Record<string, unknown> = {};
  for (const row of result.rows) {
    const key = row.key as string;
    const value = row.value as string;
    try {
      stored[key] = JSON.parse(value);
    } catch {
      stored[key] = value;
    }
  }

  return {
    pubmed: {
      ...DEFAULT_SETTINGS.pubmed,
      ...(stored.pubmed as Partial<Settings["pubmed"]> | undefined),
    },
    leadership: {
      ...DEFAULT_SETTINGS.leadership,
      ...(stored.leadership as Partial<Settings["leadership"]> | undefined),
    },
    schedule: {
      ...DEFAULT_SETTINGS.schedule,
      ...(stored.schedule as Partial<Settings["schedule"]> | undefined),
    },
    lessons: {
      ...DEFAULT_SETTINGS.lessons,
      ...(stored.lessons as Partial<Settings["lessons"]> | undefined),
    },
  };
}

export async function saveSettings(settings: Settings): Promise<void> {
  const db = await getDb();
  const sections = ["pubmed", "leadership", "schedule", "lessons"] as const;

  await db.batch(
    sections.map((key) => ({
      sql: `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
      args: [key, JSON.stringify(settings[key])],
    }))
  );
}

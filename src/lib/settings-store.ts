import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

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

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // already exists
  }
}

export async function loadSettings(): Promise<Settings> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf-8");
    const saved = JSON.parse(raw) as Partial<Settings>;
    // Merge with defaults so new fields are always present
    return {
      pubmed: { ...DEFAULT_SETTINGS.pubmed, ...saved.pubmed },
      leadership: { ...DEFAULT_SETTINGS.leadership, ...saved.leadership },
      schedule: { ...DEFAULT_SETTINGS.schedule, ...saved.schedule },
      lessons: { ...DEFAULT_SETTINGS.lessons, ...saved.lessons },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
}

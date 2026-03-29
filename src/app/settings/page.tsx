"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import type { Settings } from "@/lib/settings-store";

function SavedIndicator({ show }: { show: boolean }) {
  return (
    <span
      className={`font-sans text-xs text-ink-tertiary transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      Saved
    </span>
  );
}

function useSavedFlash() {
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback(() => {
    setShow(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShow(false), 1500);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { show, flash };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showJournalList, setShowJournalList] = useState(false);
  const [showRssList, setShowRssList] = useState(false);
  const [apiKeyRevealed, setApiKeyRevealed] = useState(false);

  const saveFlash = useSavedFlash();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load settings on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.ok) {
          setSettings(data.settings);
        }
      } catch {
        // Fall back to defaults — they'll be created on first save
      }
      setLoading(false);
    }
    load();
  }, []);

  // Auto-save with debounce
  const persistSettings = useCallback(
    (updated: Settings) => {
      setSettings(updated);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        try {
          await fetch("/api/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
          });
          saveFlash.flash();
        } catch {
          // Silent failure
        }
      }, 500);
    },
    [saveFlash]
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  if (loading || !settings) {
    return (
      <>
        <header className="flex items-center h-12 px-8 max-w-[720px] mx-auto w-full">
          <Link
            href="/"
            className="font-serif text-base font-semibold text-ink hover:text-ink-secondary transition-colors"
          >
            Morning Round
          </Link>
        </header>
        <main className="mx-auto max-w-[720px] w-full px-8 pb-16 mt-4">
          <p className="font-sans text-sm text-ink-tertiary">
            Loading settings&hellip;
          </p>
        </main>
      </>
    );
  }

  const weekdayMinutes =
    settings.schedule.weekdayArticles * 8 +
    (settings.schedule.includeLessonsWeekday ? 20 : 0);
  const weekendMinutes =
    settings.schedule.weekendArticles * 8 +
    (settings.schedule.includeLessonsWeekend ? 20 : 0);

  function update(fn: (s: Settings) => Settings) {
    if (!settings) return;
    persistSettings(fn(settings));
  }

  return (
    <>
      <header className="flex items-center h-12 px-8 max-w-[720px] mx-auto w-full">
        <Link
          href="/"
          className="font-serif text-base font-semibold text-ink hover:text-ink-secondary transition-colors"
        >
          Morning Round
        </Link>
        <SavedIndicator show={saveFlash.show} />
      </header>

      <main className="mx-auto max-w-[720px] w-full px-8 pb-16 mt-4">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink mb-8">
          Settings
        </h1>

        {/* PubMed Literature */}
        <section id="pubmed" className="mb-10">
          <h2 className="font-serif text-xl font-semibold text-ink mb-1">
            PubMed Literature
          </h2>
          <hr className="border-border-subtle mb-5" />

          <label className="block font-sans text-sm text-ink-secondary mb-1.5">
            NCBI API key
          </label>
          <div className="flex items-center gap-3 mb-2">
            <input
              type={apiKeyRevealed ? "text" : "password"}
              value={settings.pubmed.apiKey}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  pubmed: { ...s.pubmed, apiKey: e.target.value },
                }))
              }
              placeholder="Paste your API key"
              className="flex-1 font-mono text-sm bg-transparent border-b border-border focus:border-umber outline-none py-1.5 text-ink placeholder:text-ink-tertiary"
            />
            <button
              onClick={() => setApiKeyRevealed(!apiKeyRevealed)}
              className="font-sans text-xs text-ink-tertiary hover:text-ink-secondary transition-colors"
            >
              {apiKeyRevealed ? "Hide" : "Reveal"}
            </button>
            {settings.pubmed.apiKey && (
              <span className="font-sans text-xs text-sage">
                &#10003; Connected
              </span>
            )}
          </div>
          <p className="font-sans text-xs text-ink-tertiary mb-4">
            An API key removes rate limits on PubMed queries.{" "}
            <a
              href="https://ncbi.nlm.nih.gov/account/settings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-umber underline underline-offset-2"
            >
              Get one at ncbi.nlm.nih.gov/account/settings
            </a>{" "}
            (free, takes 30 seconds).
          </p>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-sans text-sm text-ink-secondary">
              Journal selection
            </span>
            <span className="font-sans text-xs text-ink-tertiary">
              Monitoring{" "}
              {settings.pubmed.journalEnabled.filter(Boolean).length} journals.
            </span>
            <button
              onClick={() => setShowJournalList(!showJournalList)}
              className="font-sans text-xs text-umber hover:underline underline-offset-2"
            >
              {showJournalList ? "Hide list" : "View list"}
            </button>
          </div>
          <p className="font-sans text-xs text-ink-tertiary mb-3">
            Selected for radiation oncology relevance. Add or remove journals
            anytime.
          </p>

          {showJournalList && (
            <div className="mb-4 pl-1 space-y-1.5">
              {settings.pubmed.journals.map((j, i) => (
                <label
                  key={j}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={settings.pubmed.journalEnabled[i]}
                    onChange={() =>
                      update((s) => {
                        const next = [...s.pubmed.journalEnabled];
                        next[i] = !next[i];
                        return {
                          ...s,
                          pubmed: { ...s.pubmed, journalEnabled: next },
                        };
                      })
                    }
                    className="accent-umber"
                  />
                  <span className="font-sans text-sm text-ink-secondary">
                    {j}
                  </span>
                </label>
              ))}
              <input
                type="text"
                placeholder="Add a journal by ISSN or NLM abbreviation"
                className="w-full font-sans text-sm bg-transparent border-b border-border-subtle focus:border-umber outline-none py-1.5 mt-2 text-ink placeholder:text-ink-tertiary"
              />
            </div>
          )}
        </section>

        {/* Leadership Reading */}
        <section id="reading-folder" className="mb-10">
          <h2 className="font-serif text-xl font-semibold text-ink mb-1">
            Leadership Reading
          </h2>
          <hr className="border-border-subtle mb-5" />

          <label className="block font-sans text-sm text-ink-secondary mb-1.5">
            Reading folder
          </label>
          <div className="flex items-center gap-3 mb-2">
            <input
              type="text"
              value={settings.leadership.readingFolder}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  leadership: {
                    ...s.leadership,
                    readingFolder: e.target.value,
                  },
                }))
              }
              className="flex-1 font-mono text-sm bg-transparent border-b border-border focus:border-umber outline-none py-1.5 text-ink"
            />
            <button className="font-sans text-xs text-umber border border-border-subtle rounded-sm px-2.5 py-1 hover:border-border transition-colors">
              Browse
            </button>
          </div>
          <p className="font-sans text-xs text-ink-tertiary mb-4">
            Drop PDFs or saved web pages into the{" "}
            <span className="font-mono">inbox/</span> subfolder. The app will
            index them and add them to your reading queue.
          </p>
          <p className="font-sans text-xs text-ink-tertiary mb-4">
            <span className="font-mono">inbox/</span> &middot;{" "}
            <span className="font-mono">processed/</span> &middot;{" "}
            <span className="font-mono">failed/</span>
          </p>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-sans text-sm text-ink-secondary">
              RSS discovery feeds
            </span>
            <span className="font-sans text-xs text-ink-tertiary">
              {settings.leadership.rssEnabled.filter(Boolean).length} sources
              active.
            </span>
            <button
              onClick={() => setShowRssList(!showRssList)}
              className="font-sans text-xs text-umber hover:underline underline-offset-2"
            >
              {showRssList ? "Hide list" : "View list"}
            </button>
          </div>

          {showRssList && (
            <div className="mb-4 pl-1 space-y-1.5">
              {settings.leadership.rssSources.map((feed, i) => (
                <label
                  key={feed}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={settings.leadership.rssEnabled[i]}
                    onChange={() =>
                      update((s) => {
                        const next = [...s.leadership.rssEnabled];
                        next[i] = !next[i];
                        return {
                          ...s,
                          leadership: { ...s.leadership, rssEnabled: next },
                        };
                      })
                    }
                    className="accent-umber"
                  />
                  <span className="font-sans text-sm text-ink-secondary">
                    {feed}
                  </span>
                </label>
              ))}
              <p className="font-sans text-xs text-ink-tertiary mt-2">
                RSS feeds provide article summaries for discovery. Drop the full
                articles you want to read into your inbox folder.
              </p>
            </div>
          )}
        </section>

        {/* Schedule */}
        <section id="schedule" className="mb-10">
          <h2 className="font-serif text-xl font-semibold text-ink mb-1">
            Schedule
          </h2>
          <hr className="border-border-subtle mb-5" />

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm text-ink-secondary">
                Weekday session
              </span>
              <input
                type="time"
                value={settings.schedule.weekdayTime}
                onChange={(e) =>
                  update((s) => ({
                    ...s,
                    schedule: { ...s.schedule, weekdayTime: e.target.value },
                  }))
                }
                className="font-sans text-sm bg-transparent border-b border-border-subtle focus:border-umber outline-none py-0.5 text-ink"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm text-ink-secondary">
                Weekend session
              </span>
              <input
                type="time"
                value={settings.schedule.weekendTime}
                onChange={(e) =>
                  update((s) => ({
                    ...s,
                    schedule: { ...s.schedule, weekendTime: e.target.value },
                  }))
                }
                className="font-sans text-sm bg-transparent border-b border-border-subtle focus:border-umber outline-none py-0.5 text-ink"
              />
            </div>
          </div>

          <p className="font-sans text-xs text-ink-tertiary mb-6">
            Content is prepared before your session time so it is ready when you
            open the app.
          </p>

          <p className="font-sans text-sm text-ink-secondary mb-3">
            Session size
          </p>
          <div className="space-y-2 mb-2">
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm text-ink-secondary">
                Weekday
              </span>
              <span className="font-sans text-sm text-ink-secondary">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={settings.schedule.weekdayArticles}
                  onChange={(e) =>
                    update((s) => ({
                      ...s,
                      schedule: {
                        ...s.schedule,
                        weekdayArticles: Number(e.target.value),
                      },
                    }))
                  }
                  className="w-10 text-center bg-transparent border-b border-border-subtle focus:border-umber outline-none text-ink"
                />{" "}
                articles
                {settings.schedule.includeLessonsWeekday ? " + 1 lesson" : ""}
                <span className="text-ink-tertiary ml-3">
                  ~{weekdayMinutes} min
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm text-ink-secondary">
                Weekend
              </span>
              <span className="font-sans text-sm text-ink-secondary">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={settings.schedule.weekendArticles}
                  onChange={(e) =>
                    update((s) => ({
                      ...s,
                      schedule: {
                        ...s.schedule,
                        weekendArticles: Number(e.target.value),
                      },
                    }))
                  }
                  className="w-10 text-center bg-transparent border-b border-border-subtle focus:border-umber outline-none text-ink"
                />{" "}
                articles
                {settings.schedule.includeLessonsWeekend ? " + 1 lesson" : ""}
                <span className="text-ink-tertiary ml-3">
                  ~{weekendMinutes} min
                </span>
              </span>
            </div>
          </div>

          <p className="font-sans text-xs text-ink-tertiary mt-4">
            Adjust these if your morning routine changes.
          </p>
        </section>

        {/* Power Automate Lessons */}
        <section id="lessons" className="mb-10">
          <h2 className="font-serif text-xl font-semibold text-ink mb-1">
            Power Automate Lessons
          </h2>
          <hr className="border-border-subtle mb-5" />

          <div className="mb-4">
            <p className="font-sans text-sm text-ink-secondary mb-1">
              Progress
            </p>
            <p className="font-sans text-sm text-ink">
              Lesson 1 of 25 complete &middot; Module 1: Foundations
            </p>
          </div>

          <div className="mb-4">
            <p className="font-sans text-sm text-ink-secondary mb-1">Pace</p>
            <select
              value={settings.lessons.pace}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  lessons: { ...s.lessons, pace: e.target.value },
                }))
              }
              className="font-sans text-sm bg-transparent border-b border-border-subtle focus:border-umber outline-none py-0.5 text-ink"
            >
              <option>1 lesson per session</option>
              <option>1 lesson every other session</option>
              <option>2 lessons per session</option>
            </select>
          </div>

          <p className="font-sans text-sm text-ink-secondary mb-2">
            Lesson scheduling
          </p>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.schedule.includeLessonsWeekday}
                onChange={() =>
                  update((s) => ({
                    ...s,
                    schedule: {
                      ...s.schedule,
                      includeLessonsWeekday:
                        !s.schedule.includeLessonsWeekday,
                    },
                  }))
                }
                className="accent-umber"
              />
              <span className="font-sans text-sm text-ink-secondary">
                Include in weekday sessions
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.schedule.includeLessonsWeekend}
                onChange={() =>
                  update((s) => ({
                    ...s,
                    schedule: {
                      ...s.schedule,
                      includeLessonsWeekend:
                        !s.schedule.includeLessonsWeekend,
                    },
                  }))
                }
                className="accent-umber"
              />
              <span className="font-sans text-sm text-ink-secondary">
                Include in weekend sessions
              </span>
            </label>
          </div>
        </section>

        {/* About */}
        <section id="about" className="mb-10">
          <h2 className="font-serif text-xl font-semibold text-ink mb-1">
            About
          </h2>
          <hr className="border-border-subtle mb-5" />

          <p className="font-sans text-sm text-ink-secondary mb-1">
            Morning Round v0.1.0
          </p>
          <p className="font-sans text-xs text-ink-tertiary mb-6">
            Data stored locally.
          </p>

          <div className="space-y-2">
            <button
              onClick={async () => {
                if (!confirm("Clear all reading history? This cannot be undone.")) return;
                try {
                  await fetch("/api/articles/clear", { method: "POST" });
                  saveFlash.flash();
                } catch { /* silent */ }
              }}
              className="font-sans text-sm text-clay hover:underline underline-offset-2"
            >
              Clear all reading history
            </button>
            <br />
            <button
              onClick={async () => {
                if (!confirm("Reset all settings to defaults?")) return;
                try {
                  const res = await fetch("/api/settings", { method: "DELETE" });
                  const data = await res.json();
                  if (data.ok) {
                    setSettings(data.settings);
                    saveFlash.flash();
                  }
                } catch { /* silent */ }
              }}
              className="font-sans text-sm text-clay hover:underline underline-offset-2"
            >
              Reset to defaults
            </button>
          </div>
        </section>
      </main>

      <footer className="mt-auto py-6 text-center">
        <Link
          href="/"
          className="font-sans text-xs text-ink-tertiary hover:text-ink-secondary transition-colors"
        >
          Back to today
        </Link>
      </footer>
    </>
  );
}

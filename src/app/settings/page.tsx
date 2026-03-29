"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";

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
  const [apiKey, setApiKey] = useState("");
  const [apiKeyRevealed, setApiKeyRevealed] = useState(false);
  const [readingFolder, setReadingFolder] = useState("~/HBR-Reading");
  const [weekdayTime, setWeekdayTime] = useState("07:00");
  const [weekendTime, setWeekendTime] = useState("13:00");
  const [weekdayArticles, setWeekdayArticles] = useState(3);
  const [weekendArticles, setWeekendArticles] = useState(5);
  const [includeLessonsWeekday, setIncludeLessonsWeekday] = useState(true);
  const [includeLessonsWeekend, setIncludeLessonsWeekend] = useState(true);
  const [showJournalList, setShowJournalList] = useState(false);
  const [showRssList, setShowRssList] = useState(false);

  const apiKeySaved = useSavedFlash();
  const scheduleSaved = useSavedFlash();
  const folderSaved = useSavedFlash();

  const weekdayMinutes = weekdayArticles * 8 + (includeLessonsWeekday ? 20 : 0);
  const weekendMinutes = weekendArticles * 8 + (includeLessonsWeekend ? 20 : 0);

  const journals = [
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

  const rssFeeds = [
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

  const [journalChecks, setJournalChecks] = useState<boolean[]>(
    () => journals.map(() => true)
  );
  const [rssChecks, setRssChecks] = useState<boolean[]>(
    () => rssFeeds.map(() => true)
  );

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
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                apiKeySaved.flash();
              }}
              placeholder="Paste your API key"
              className="flex-1 font-mono text-sm bg-transparent border-b border-border focus:border-umber outline-none py-1.5 text-ink placeholder:text-ink-tertiary"
            />
            <button
              onClick={() => setApiKeyRevealed(!apiKeyRevealed)}
              className="font-sans text-xs text-ink-tertiary hover:text-ink-secondary transition-colors"
            >
              {apiKeyRevealed ? "Hide" : "Reveal"}
            </button>
            {apiKey && (
              <span className="font-sans text-xs text-sage">
                &#10003; Connected
              </span>
            )}
            <SavedIndicator show={apiKeySaved.show} />
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
              Monitoring {journalChecks.filter(Boolean).length} journals.
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
              {journals.map((j, i) => (
                <label key={j} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={journalChecks[i]}
                    onChange={() => {
                      const next = [...journalChecks];
                      next[i] = !next[i];
                      setJournalChecks(next);
                    }}
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
              value={readingFolder}
              onChange={(e) => {
                setReadingFolder(e.target.value);
                folderSaved.flash();
              }}
              className="flex-1 font-mono text-sm bg-transparent border-b border-border focus:border-umber outline-none py-1.5 text-ink"
            />
            <button className="font-sans text-xs text-umber border border-border-subtle rounded-sm px-2.5 py-1 hover:border-border transition-colors">
              Browse
            </button>
            <SavedIndicator show={folderSaved.show} />
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
              {rssChecks.filter(Boolean).length} sources active.
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
              {rssFeeds.map((feed, i) => (
                <label
                  key={feed}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={rssChecks[i]}
                    onChange={() => {
                      const next = [...rssChecks];
                      next[i] = !next[i];
                      setRssChecks(next);
                    }}
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
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={weekdayTime}
                  onChange={(e) => {
                    setWeekdayTime(e.target.value);
                    scheduleSaved.flash();
                  }}
                  className="font-sans text-sm bg-transparent border-b border-border-subtle focus:border-umber outline-none py-0.5 text-ink"
                />
                <SavedIndicator show={scheduleSaved.show} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm text-ink-secondary">
                Weekend session
              </span>
              <input
                type="time"
                value={weekendTime}
                onChange={(e) => {
                  setWeekendTime(e.target.value);
                  scheduleSaved.flash();
                }}
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
                  value={weekdayArticles}
                  onChange={(e) => {
                    setWeekdayArticles(Number(e.target.value));
                    scheduleSaved.flash();
                  }}
                  className="w-10 text-center bg-transparent border-b border-border-subtle focus:border-umber outline-none text-ink"
                />{" "}
                articles
                {includeLessonsWeekday ? " + 1 lesson" : ""}
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
                  value={weekendArticles}
                  onChange={(e) => {
                    setWeekendArticles(Number(e.target.value));
                    scheduleSaved.flash();
                  }}
                  className="w-10 text-center bg-transparent border-b border-border-subtle focus:border-umber outline-none text-ink"
                />{" "}
                articles
                {includeLessonsWeekend ? " + 1 lesson" : ""}
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
            <select className="font-sans text-sm bg-transparent border-b border-border-subtle focus:border-umber outline-none py-0.5 text-ink">
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
                checked={includeLessonsWeekday}
                onChange={() => setIncludeLessonsWeekday(!includeLessonsWeekday)}
                className="accent-umber"
              />
              <span className="font-sans text-sm text-ink-secondary">
                Include in weekday sessions
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLessonsWeekend}
                onChange={() => setIncludeLessonsWeekend(!includeLessonsWeekend)}
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
            <button className="font-sans text-sm text-clay hover:underline underline-offset-2">
              Clear all reading history
            </button>
            <br />
            <button className="font-sans text-sm text-clay hover:underline underline-offset-2">
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

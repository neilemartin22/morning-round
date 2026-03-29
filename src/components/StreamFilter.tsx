"use client";

import type { ContentStream } from "@/lib/types";

export type FilterValue = "all" | ContentStream;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "literature", label: "Literature" },
  { value: "leadership", label: "Leadership" },
  { value: "lesson", label: "Lessons" },
];

interface StreamFilterProps {
  active: FilterValue;
  onChange: (value: FilterValue) => void;
}

export function StreamFilter({ active, onChange }: StreamFilterProps) {
  return (
    <div className="flex gap-5 mb-4">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`font-sans text-sm pb-0.5 transition-colors ${
            active === value
              ? "text-ink border-b border-umber"
              : "text-ink-secondary hover:text-ink"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

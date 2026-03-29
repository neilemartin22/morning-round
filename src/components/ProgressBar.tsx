"use client";

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percent = total > 0 ? (completed / total) * 100 : 0;
  const isDone = completed === total && total > 0;

  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 bg-border-subtle z-50">
      <div
        className={`h-full transition-all duration-700 ease-out ${
          isDone ? "bg-sage" : "bg-umber"
        }`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

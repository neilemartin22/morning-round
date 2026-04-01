"use client";

import { useState, useCallback } from "react";

interface DropZoneProps {
  onUploadComplete?: () => void;
}

export function DropZone({ onUploadComplete }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      setUploading(true);
      setResult(null);

      const formData = new FormData();
      for (const file of files) {
        formData.append("files", file);
      }

      try {
        const res = await fetch("/api/articles/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.ok) {
          const added = data.results.filter(
            (r: { error?: string }) => !r.error
          );
          const failed = data.results.filter(
            (r: { error?: string }) => r.error
          );
          let msg = `${added.length} article${added.length !== 1 ? "s" : ""} added.`;
          if (failed.length > 0) {
            msg += ` ${failed.length} failed.`;
          }
          setResult(msg);
          if (added.length > 0 && onUploadComplete) {
            onUploadComplete();
          }
        } else {
          setResult(data.error || "Upload failed.");
        }
      } catch {
        setResult("Upload failed.");
      } finally {
        setUploading(false);
        setTimeout(() => setResult(null), 4000);
      }
    },
    [onUploadComplete]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-sm p-6 text-center transition-colors ${
        dragging
          ? "border-umber bg-umber-wash"
          : "border-border-subtle hover:border-border"
      }`}
    >
      <p className="font-sans text-sm text-ink-secondary">
        {uploading
          ? "Processing\u2026"
          : result
            ? result
            : "Drop PDFs, HTML, or text files here"}
      </p>
      <p className="font-sans text-xs text-ink-tertiary mt-1">
        PDFs are queued and presented one per session
      </p>
    </div>
  );
}

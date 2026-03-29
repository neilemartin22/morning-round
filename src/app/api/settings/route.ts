import { NextRequest, NextResponse } from "next/server";
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from "@/lib/settings-store";
import type { Settings } from "@/lib/settings-store";

/**
 * GET /api/settings
 *
 * Returns current settings.
 */
export async function GET() {
  try {
    const settings = await loadSettings();
    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    console.error("Failed to load settings:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings
 *
 * Saves settings.
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = body as Settings;
    await saveSettings(settings);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to save settings:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/settings
 *
 * Resets settings to defaults.
 */
export async function DELETE() {
  try {
    await saveSettings(DEFAULT_SETTINGS);
    return NextResponse.json({ ok: true, settings: DEFAULT_SETTINGS });
  } catch (err) {
    console.error("Failed to reset settings:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

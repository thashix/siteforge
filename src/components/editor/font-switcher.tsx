"use client";

import { FONT_PAIRINGS } from "@/core/theme";

// =============================================================================
// FONT SWITCHER
// =============================================================================
// Dropdown to switch font pairings in preview mode.
// =============================================================================

interface FontSwitcherProps {
  currentFont: string;
  onChangeFont: (fontKey: string) => void;
}

export function FontSwitcher({
  currentFont,
  onChangeFont,
}: FontSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[var(--sf-app-text-muted)] hidden sm:inline">
        Polices :
      </span>
      <select
        value={currentFont}
        onChange={(e) => onChangeFont(e.target.value)}
        className="
          text-xs px-2 py-1.5 rounded-md
          bg-[var(--sf-app-surface)]
          border border-[var(--sf-app-border)]
          text-[var(--sf-app-text)]
          cursor-pointer outline-none
          focus:ring-1 focus:ring-[var(--sf-app-accent)]
        "
      >
        {Object.entries(FONT_PAIRINGS).map(([key, pair]) => {
          // Extract clean names from CSS font-family string
          const headingName = pair.heading.replace(/'/g, "").split(",")[0];
          const bodyName = pair.body.replace(/'/g, "").split(",")[0];
          return (
            <option key={key} value={key}>
              {headingName} + {bodyName}
            </option>
          );
        })}
      </select>
    </div>
  );
}

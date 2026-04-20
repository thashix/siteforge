"use client";

import { PALETTES } from "@/core/theme";

// =============================================================================
// THEME SWITCHER
// =============================================================================
// Compact palette picker shown in the preview toolbar.
// Clicking a palette swatch changes the site theme instantly.
// =============================================================================

interface ThemeSwitcherProps {
  currentPalette: string;
  onChangePalette: (paletteKey: string) => void;
}

export function ThemeSwitcher({
  currentPalette,
  onChangePalette,
}: ThemeSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[var(--sf-app-text-muted)] hidden sm:inline">
        Thème :
      </span>
      <div className="flex gap-1.5">
        {Object.entries(PALETTES).map(([key, palette]) => (
          <button
            key={key}
            onClick={() => onChangePalette(key)}
            title={key}
            className={`
              w-6 h-6 rounded-full border-2 transition-all duration-150 cursor-pointer
              hover:scale-110
              ${
                key === currentPalette
                  ? "border-[var(--sf-app-accent)] scale-110 ring-2 ring-[var(--sf-app-accent)]/30"
                  : "border-transparent opacity-70 hover:opacity-100"
              }
            `}
            style={{
              background: `linear-gradient(135deg, ${palette.primary} 50%, ${palette.background} 50%)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

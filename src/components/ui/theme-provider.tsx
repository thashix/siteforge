"use client";

import { useMemo } from "react";
import type { ThemeConfig } from "@/types";

// =============================================================================
// ThemeProvider
// =============================================================================
// Converts a ThemeConfig into CSS custom properties applied to a wrapper div.
// Every section component reads colors/fonts from these CSS variables,
// ensuring full theme consistency without prop-drilling.
// =============================================================================

interface ThemeProviderProps {
  theme: ThemeConfig;
  children: React.ReactNode;
  className?: string;
}

export function ThemeProvider({ theme, children, className }: ThemeProviderProps) {
  const cssVars = useMemo(() => {
    const { colors, fonts, borderRadius } = theme;

    const radiusMap = {
      none: "0px",
      sm: "4px",
      md: "8px",
      lg: "16px",
      full: "9999px",
    };

    return {
      "--sf-primary": colors.primary,
      "--sf-secondary": colors.secondary,
      "--sf-background": colors.background,
      "--sf-surface": colors.surface,
      "--sf-text": colors.text,
      "--sf-text-muted": colors.textMuted,
      "--sf-accent": colors.accent,
      "--sf-border": colors.border,
      "--sf-font-heading": fonts.heading,
      "--sf-font-body": fonts.body,
      "--sf-font-heading-weight": String(fonts.headingWeight),
      "--sf-font-body-weight": String(fonts.bodyWeight),
      "--sf-radius": radiusMap[borderRadius],
    } as React.CSSProperties;
  }, [theme]);

  return (
    <div
      style={cssVars}
      className={className}
      data-theme={theme.paletteKey}
    >
      {children}
    </div>
  );
}

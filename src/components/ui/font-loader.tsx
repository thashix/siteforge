"use client";

import { useEffect } from "react";
import type { FontPairing } from "@/types";

// =============================================================================
// FONT LOADER
// =============================================================================
// Dynamically loads Google Fonts / Fontshare fonts at runtime based on
// the site's ThemeConfig. Injects <link> tags into <head>.
//
// Why runtime loading instead of next/font?
// Because the font pairing is determined by AI at generation time,
// not at build time. We need to load fonts dynamically.
//
// Sources:
// - Google Fonts: most pairings
// - Fontshare (by Indian Type Foundry): Clash Display, Cabinet Grotesk
// =============================================================================

/** Maps CSS font-family names to their Google Fonts / Fontshare identifiers */
const FONT_SOURCE_MAP: Record<string, { source: "google" | "fontshare"; id: string }> = {
  // Google Fonts
  "Playfair Display": { source: "google", id: "Playfair+Display" },
  "Lato": { source: "google", id: "Lato" },
  "Space Grotesk": { source: "google", id: "Space+Grotesk" },
  "DM Sans": { source: "google", id: "DM+Sans" },
  "Cormorant Garamond": { source: "google", id: "Cormorant+Garamond" },
  "Montserrat": { source: "google", id: "Montserrat" },
  "Sora": { source: "google", id: "Sora" },
  "Inter": { source: "google", id: "Inter" },
  "Fraunces": { source: "google", id: "Fraunces" },
  "Outfit": { source: "google", id: "Outfit" },
  // Fontshare
  "Clash Display": { source: "fontshare", id: "clash-display" },
  "Cabinet Grotesk": { source: "fontshare", id: "cabinet-grotesk" },
};

/** Extract the actual font family name from CSS font-family string */
function extractFontName(cssFontFamily: string): string {
  // "'Playfair Display', serif" → "Playfair Display"
  return cssFontFamily.replace(/^'|'$/g, "").split("',")[0].trim();
}

/** Build Google Fonts URL for one or more font families */
function buildGoogleFontsUrl(fontIds: string[], weights: number[]): string {
  const weightStr = weights.join(";");
  const families = fontIds.map((id) => `family=${id}:wght@${weightStr}`).join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

/** Build Fontshare URL */
function buildFontshareUrl(fontId: string): string {
  return `https://api.fontshare.com/v2/css?f[]=${fontId}@400,500,600,700&display=swap`;
}

/** Inject a stylesheet link into the document head */
function injectStylesheet(href: string, id: string): void {
  // Don't inject duplicates
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

interface FontLoaderProps {
  fonts: FontPairing;
}

/**
 * FontLoader component — drop into any page that renders a generated site.
 * Loads the correct fonts based on the theme's FontPairing.
 */
export function FontLoader({ fonts }: FontLoaderProps) {
  useEffect(() => {
    const headingName = extractFontName(fonts.heading);
    const bodyName = extractFontName(fonts.body);

    const allWeights = [
      300, 400, 500, 600, 700,
    ];

    // Collect Google Fonts to load in a single request
    const googleFontIds: string[] = [];
    const fontshareIds: string[] = [];

    for (const name of [headingName, bodyName]) {
      const source = FONT_SOURCE_MAP[name];
      if (!source) {
        console.warn(`[FontLoader] Unknown font: "${name}" — skipping`);
        continue;
      }
      if (source.source === "google") {
        if (!googleFontIds.includes(source.id)) {
          googleFontIds.push(source.id);
        }
      } else {
        if (!fontshareIds.includes(source.id)) {
          fontshareIds.push(source.id);
        }
      }
    }

    // Inject Google Fonts
    if (googleFontIds.length > 0) {
      const url = buildGoogleFontsUrl(googleFontIds, allWeights);
      injectStylesheet(url, "sf-google-fonts");
    }

    // Inject Fontshare fonts (one link per font)
    fontshareIds.forEach((id) => {
      const url = buildFontshareUrl(id);
      injectStylesheet(url, `sf-fontshare-${id}`);
    });
  }, [fonts]);

  // This component renders nothing — it's a side-effect-only component
  return null;
}

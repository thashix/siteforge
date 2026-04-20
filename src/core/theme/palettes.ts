import type { ColorPalette, FontPairing, ThemeConfig } from "@/types";

// =============================================================================
// THEME ENGINE — Palettes & Font Pairings
// =============================================================================
// Central registry of all available visual themes.
// The Site Composer picks from these based on the AI-analyzed brief.
//
// Design principles:
// - Each palette is tested for contrast & accessibility
// - Font pairings combine a distinctive display font + readable body font
// - All palettes work for both light hero sections and standard content
// =============================================================================

// -- COLOR PALETTES -----------------------------------------------------------

export const PALETTES: Record<string, ColorPalette> = {
  "noir-gold": {
    primary: "#C8A45C",
    secondary: "#1A1A1A",
    background: "#0D0D0D",
    surface: "#1A1A1A",
    text: "#F5F0E8",
    textMuted: "#A69E8E",
    accent: "#C8A45C",
    border: "#2A2520",
  },
  "ocean-blue": {
    primary: "#2563EB",
    secondary: "#0F172A",
    background: "#FAFBFF",
    surface: "#FFFFFF",
    text: "#0F172A",
    textMuted: "#64748B",
    accent: "#2563EB",
    border: "#E2E8F0",
  },
  "sage-natural": {
    primary: "#5B7553",
    secondary: "#2C3E2D",
    background: "#F8F6F1",
    surface: "#FFFFFF",
    text: "#2C3E2D",
    textMuted: "#6B7B6E",
    accent: "#5B7553",
    border: "#D9D4C7",
  },
  "warm-terracotta": {
    primary: "#C45D3E",
    secondary: "#2D1F1A",
    background: "#FBF7F4",
    surface: "#FFFFFF",
    text: "#2D1F1A",
    textMuted: "#8B7167",
    accent: "#C45D3E",
    border: "#E8DDD6",
  },
  "modern-slate": {
    primary: "#6366F1",
    secondary: "#1E1B4B",
    background: "#FAFAFA",
    surface: "#FFFFFF",
    text: "#1E1B4B",
    textMuted: "#6B7280",
    accent: "#6366F1",
    border: "#E5E7EB",
  },
  "soft-blush": {
    primary: "#D4708F",
    secondary: "#3D2B33",
    background: "#FDF8F9",
    surface: "#FFFFFF",
    text: "#3D2B33",
    textMuted: "#8B7680",
    accent: "#D4708F",
    border: "#ECDFE3",
  },
  "arctic-white": {
    primary: "#0EA5E9",
    secondary: "#0C4A6E",
    background: "#FFFFFF",
    surface: "#F8FAFC",
    text: "#0C4A6E",
    textMuted: "#64748B",
    accent: "#0EA5E9",
    border: "#E2E8F0",
  },
  "dark-emerald": {
    primary: "#10B981",
    secondary: "#064E3B",
    background: "#0A0F0D",
    surface: "#111916",
    text: "#E8F5F0",
    textMuted: "#6EAA95",
    accent: "#10B981",
    border: "#1C2E26",
  },
};

// -- FONT PAIRINGS ------------------------------------------------------------

export const FONT_PAIRINGS: Record<string, FontPairing> = {
  "playfair-lato": {
    heading: "'Playfair Display', serif",
    body: "'Lato', sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
  },
  "space-dm": {
    heading: "'Space Grotesk', sans-serif",
    body: "'DM Sans', sans-serif",
    headingWeight: 600,
    bodyWeight: 400,
  },
  "cormorant-montserrat": {
    heading: "'Cormorant Garamond', serif",
    body: "'Montserrat', sans-serif",
    headingWeight: 600,
    bodyWeight: 400,
  },
  "sora-inter": {
    heading: "'Sora', sans-serif",
    body: "'Inter', sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
  },
  "fraunces-outfit": {
    heading: "'Fraunces', serif",
    body: "'Outfit', sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
  },
  "clash-cabinet": {
    heading: "'Clash Display', sans-serif",
    body: "'Cabinet Grotesk', sans-serif",
    headingWeight: 600,
    bodyWeight: 400,
  },
};

// -- SECTOR → PALETTE/FONT RECOMMENDATIONS ------------------------------------

/** Sensible defaults per sector. The AI can override these. */
export const SECTOR_DEFAULTS: Record<
  string,
  { palettes: string[]; fonts: string[]; tone: string }
> = {
  beauty: {
    palettes: ["noir-gold", "soft-blush"],
    fonts: ["playfair-lato", "cormorant-montserrat"],
    tone: "elegant",
  },
  restaurant: {
    palettes: ["warm-terracotta", "noir-gold"],
    fonts: ["fraunces-outfit", "playfair-lato"],
    tone: "warm",
  },
  health: {
    palettes: ["sage-natural", "ocean-blue"],
    fonts: ["sora-inter", "space-dm"],
    tone: "minimal",
  },
  legal: {
    palettes: ["modern-slate", "arctic-white"],
    fonts: ["space-dm", "sora-inter"],
    tone: "corporate",
  },
  creative: {
    palettes: ["modern-slate", "dark-emerald"],
    fonts: ["clash-cabinet", "fraunces-outfit"],
    tone: "bold",
  },
  coaching: {
    palettes: ["ocean-blue", "sage-natural"],
    fonts: ["sora-inter", "space-dm"],
    tone: "warm",
  },
  tech: {
    palettes: ["modern-slate", "dark-emerald"],
    fonts: ["space-dm", "clash-cabinet"],
    tone: "bold",
  },
  realestate: {
    palettes: ["arctic-white", "modern-slate"],
    fonts: ["playfair-lato", "sora-inter"],
    tone: "elegant",
  },
  education: {
    palettes: ["ocean-blue", "sage-natural"],
    fonts: ["sora-inter", "space-dm"],
    tone: "warm",
  },
  retail: {
    palettes: ["soft-blush", "warm-terracotta"],
    fonts: ["fraunces-outfit", "clash-cabinet"],
    tone: "playful",
  },
  other: {
    palettes: ["modern-slate", "ocean-blue"],
    fonts: ["space-dm", "sora-inter"],
    tone: "minimal",
  },
};

// -- THEME BUILDER ------------------------------------------------------------

export function buildThemeConfig(
  paletteKey: string,
  fontPairingKey: string,
  overrides?: Partial<Pick<ThemeConfig, "borderRadius" | "spacingScale">>
): ThemeConfig {
  const palette = PALETTES[paletteKey] ?? PALETTES["modern-slate"];
  const fonts = FONT_PAIRINGS[fontPairingKey] ?? FONT_PAIRINGS["space-dm"];

  return {
    paletteKey,
    fontPairingKey,
    colors: palette,
    fonts,
    borderRadius: overrides?.borderRadius ?? "md",
    spacingScale: overrides?.spacingScale ?? 1,
  };
}

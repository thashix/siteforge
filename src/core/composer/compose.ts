import type { SiteBrief, SiteConfig, SectionConfig, SectionType, AnimationPreset } from "@/types";
import { buildThemeConfig } from "@/core/theme";
import { getAnimationPresetForTone } from "@/core/animations";
import { SECTION_VARIANTS } from "@/sections/registry";

// =============================================================================
// SITE COMPOSER
// =============================================================================
// Pure, deterministic function: SiteBrief → SiteConfig
// No AI involved — this is the structured bridge between analysis and rendering.
//
// Responsibilities:
// 1. Build ThemeConfig from palette/font keys
// 2. Pick animation preset from tone
// 3. Assign variants to each section (sector-aware)
// 4. Build ordered SectionConfig array
// 5. Generate unique IDs
// =============================================================================

/** Variant selection preferences by sector */
const SECTOR_VARIANT_PREFS: Partial<Record<string, Partial<Record<SectionType, string>>>> = {
  beauty: { hero: "centered", services: "grid", testimonials: "cards", about: "split" },
  restaurant: { hero: "split", services: "rows", testimonials: "large", about: "simple" },
  creative: { hero: "split", services: "grid", gallery: "masonry", testimonials: "large" },
  tech: { hero: "centered", services: "grid", testimonials: "cards", about: "split" },
  coaching: { hero: "centered", services: "rows", testimonials: "cards", cta: "banner" },
  health: { hero: "centered", services: "grid", testimonials: "cards", about: "split" },
  legal: { hero: "split", services: "rows", testimonials: "large", about: "simple" },
};

/** Compose a full SiteConfig from an analyzed SiteBrief */
export function composeSite(brief: SiteBrief): SiteConfig {
  const siteId = generateId();

  // 1. Build theme
  const theme = buildThemeConfig(brief.paletteKey, brief.fontPairingKey);

  // 2. Pick animation preset
  const animationPreset: AnimationPreset = getAnimationPresetForTone(brief.tone);

  // 3. Build sections
  const sections: SectionConfig[] = brief.sections.map((sectionType) => {
    const variant = pickVariant(sectionType, brief.sector);
    const content = brief.sectionContents[sectionType];

    return {
      id: `section-${sectionType}-${generateShortId()}`,
      type: sectionType,
      variant,
      content: content || { type: sectionType },
    };
  });

  // 4. Assemble SiteConfig
  return {
    id: siteId,
    meta: {
      title: `${brief.businessName} — ${brief.tagline}`,
      description: brief.tagline,
      language: brief.meta.language || "fr",
    },
    theme,
    sections,
    animationPreset,
  };
}

/** Pick the best variant for a section based on sector preferences */
function pickVariant(sectionType: SectionType, sector: string): string {
  // Check sector-specific preferences
  const sectorPrefs = SECTOR_VARIANT_PREFS[sector];
  if (sectorPrefs && sectorPrefs[sectionType]) {
    return sectorPrefs[sectionType]!;
  }

  // Default: pick first available variant
  const available = SECTION_VARIANTS[sectionType];
  return available?.[0] || "default";
}

/** Generate a UUID-like ID */
function generateId(): string {
  // Simple ID generation without external deps
  return `sf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateShortId(): string {
  return Math.random().toString(36).slice(2, 8);
}

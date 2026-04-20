import type {
  SiteBrief,
  SiteConfig,
  SectionConfig,
  PageConfig,
  SectionType,
  AnimationPreset,
  FooterContent,
} from "@/types";
import { buildThemeConfig } from "@/core/theme";
import { getAnimationPresetForTone } from "@/core/animations";
import { SECTION_VARIANTS } from "@/sections/registry";

// =============================================================================
// SITE COMPOSER — Multi-Page
// =============================================================================
// Pure, deterministic function: SiteBrief → SiteConfig
// Supports both multi-page briefs (5 pages) and legacy single-page.
// =============================================================================

const SECTOR_VARIANT_PREFS: Partial<Record<string, Partial<Record<SectionType, string>>>> = {
  beauty: { hero: "centered", services: "grid", testimonials: "cards", about: "split" },
  restaurant: { hero: "split", services: "rows", testimonials: "large", about: "simple" },
  creative: { hero: "split", services: "grid", gallery: "masonry", testimonials: "large" },
  tech: { hero: "centered", services: "grid", testimonials: "cards", about: "split" },
  coaching: { hero: "centered", services: "rows", testimonials: "cards", cta: "banner" },
  health: { hero: "centered", services: "grid", testimonials: "cards", about: "split" },
  legal: { hero: "split", services: "rows", testimonials: "large", about: "simple" },
};

export function composeSite(brief: SiteBrief): SiteConfig {
  const siteId = generateId();
  const theme = buildThemeConfig(brief.paletteKey, brief.fontPairingKey);
  const animationPreset: AnimationPreset = getAnimationPresetForTone(brief.tone);

  // Multi-page mode
  if (brief.pages && brief.pages.length > 0) {
    return composeMultiPage(siteId, brief, theme, animationPreset);
  }

  // Legacy single-page mode
  return composeSinglePage(siteId, brief, theme, animationPreset);
}

// -- Multi-page composition ---------------------------------------------------

function composeMultiPage(
  siteId: string,
  brief: SiteBrief,
  theme: ReturnType<typeof buildThemeConfig>,
  animationPreset: AnimationPreset
): SiteConfig {
  // Build footer section (shared across all pages)
  const footerSection: SectionConfig | null = brief.sharedFooter
    ? {
        id: `section-footer-${generateShortId()}`,
        type: "footer" as SectionType,
        variant: "default",
        content: brief.sharedFooter,
      }
    : null;

  // Build each page
  const pages: PageConfig[] = brief.pages!.map((briefPage) => {
    // Build sections for this page
    const sections: SectionConfig[] = briefPage.sections.map((sectionType, idx) => {
      const variant = pickVariant(sectionType, brief.sector);

      // For multi-page, each section type can appear multiple times per site
      // so we key the content by type + index for uniqueness
      const contentKey = sectionType;
      const content = briefPage.sectionContents[contentKey];

      return {
        id: `section-${briefPage.slug}-${sectionType}-${idx}-${generateShortId()}`,
        type: sectionType,
        variant,
        content: content || { type: sectionType },
      };
    });

    // Add footer to every page
    if (footerSection) {
      sections.push({ ...footerSection, id: `section-footer-${briefPage.slug}-${generateShortId()}` });
    }

    return {
      id: `page-${briefPage.slug}-${generateShortId()}`,
      name: briefPage.name,
      slug: briefPage.slug,
      sections,
    };
  });

  // Flatten all sections for legacy compatibility
  const allSections = pages.flatMap((p) => p.sections);

  return {
    id: siteId,
    meta: {
      title: `${brief.businessName} — ${brief.tagline}`,
      description: brief.tagline,
      language: brief.meta.language || "fr",
    },
    theme,
    pages,
    sections: allSections,
    animationPreset,
  };
}

// -- Legacy single-page composition -------------------------------------------

function composeSinglePage(
  siteId: string,
  brief: SiteBrief,
  theme: ReturnType<typeof buildThemeConfig>,
  animationPreset: AnimationPreset
): SiteConfig {
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

// -- Helpers ------------------------------------------------------------------

function pickVariant(sectionType: SectionType, sector: string): string {
  const sectorPrefs = SECTOR_VARIANT_PREFS[sector];
  if (sectorPrefs && sectorPrefs[sectionType]) {
    return sectorPrefs[sectionType]!;
  }
  const available = SECTION_VARIANTS[sectionType];
  return available?.[0] || "default";
}

function generateId(): string {
  return `sf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateShortId(): string {
  return Math.random().toString(36).slice(2, 8);
}

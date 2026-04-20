"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SiteConfig, SectionConfig } from "@/types";
import { ANIMATION_PRESETS } from "@/core/animations";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { FontLoader } from "@/components/ui/font-loader";
import { SiteNav } from "@/components/ui/site-nav";
import { renderSection } from "@/sections/registry";

// =============================================================================
// SITE RENDERER
// =============================================================================
// Renders a full website from SiteConfig.
// Supports both single-page (legacy) and multi-page modes.
// In multi-page mode, shows a navigation bar and page transitions.
// =============================================================================

interface SiteRendererProps {
  config: SiteConfig;
}

export function SiteRenderer({ config }: SiteRendererProps) {
  const { theme, animationPreset } = config;
  const animConfig = ANIMATION_PRESETS[animationPreset];
  const isMultiPage = config.pages && config.pages.length > 1;

  const [activePageId, setActivePageId] = useState<string>(
    config.pages?.[0]?.id ?? "__legacy__"
  );

  // Determine which sections to render
  const sections: SectionConfig[] = (() => {
    if (config.pages && config.pages.length > 0) {
      const page = config.pages.find((p) => p.id === activePageId) ?? config.pages[0];
      return page.sections;
    }
    return config.sections;
  })();

  // Extract business name from footer or hero for nav
  const businessName = (() => {
    const allSections = config.pages
      ? config.pages.flatMap((p) => p.sections)
      : config.sections;
    const footer = allSections.find((s) => s.type === "footer");
    if (footer && "businessName" in footer.content) {
      return (footer.content as { businessName: string }).businessName;
    }
    return config.meta.title.split("—")[0]?.trim();
  })();

  return (
    <ThemeProvider theme={theme} className="sf-site min-h-screen">
      <FontLoader fonts={theme.fonts} />

      {/* Navigation (multi-page only) */}
      {isMultiPage && config.pages && (
        <SiteNav
          pages={config.pages}
          activePageId={activePageId}
          onNavigate={(id) => {
            setActivePageId(id);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          businessName={businessName}
        />
      )}

      {/* Page content with transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePageId}
          initial={isMultiPage ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={isMultiPage ? { opacity: 0, y: -10 } : undefined}
          transition={{ duration: 0.3 }}
        >
          {sections.map((section) =>
            renderSection(
              section.type,
              section.content,
              section.variant,
              animConfig.scrollReveal,
              section.id
            )
          )}
        </motion.div>
      </AnimatePresence>
    </ThemeProvider>
  );
}

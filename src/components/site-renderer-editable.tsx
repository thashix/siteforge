"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { SiteConfig, SectionContent } from "@/types";
import { ANIMATION_PRESETS } from "@/core/animations";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { FontLoader } from "@/components/ui/font-loader";
import { renderSection } from "@/sections/registry";
import { SectionOverlay } from "@/components/editor/section-overlay";
import { AddSectionButton } from "@/components/editor/add-section";
import { SectionAIChat } from "@/components/editor/section-ai-chat";
import type { SiteEditor } from "@/components/editor/use-site-editor";

// =============================================================================
// SITE RENDERER (EDITABLE MODE)
// =============================================================================
// Each section has:
//   - Overlay controls (move, variant, edit, delete)
//   - ✨ AI chat button that opens a mini-chat to modify the section
//   - "+" buttons between sections to add new ones
// =============================================================================

interface SiteRendererEditableProps {
  editor: SiteEditor;
  onBuyCredits: () => void;
}

export function SiteRendererEditable({ editor, onBuyCredits }: SiteRendererEditableProps) {
  const { config, activeSections } = editor;
  const { theme, animationPreset } = config;
  const animConfig = ANIMATION_PRESETS[animationPreset];

  const [aiChatSectionId, setAiChatSectionId] = useState<string | null>(null);

  // Extract site context for AI
  const siteContext = {
    businessName: config.meta.title.split("—")[0]?.trim() || "Mon entreprise",
    sector: "general",
    tone: "professional",
  };

  // Try to extract sector/tone from brief if available
  const allSections = config.pages
    ? config.pages.flatMap((p) => p.sections)
    : config.sections;
  const footerSection = allSections.find((s) => s.type === "footer");
  if (footerSection && "businessName" in footerSection.content) {
    siteContext.businessName = (footerSection.content as { businessName: string }).businessName;
  }

  function handleAIUpdate(sectionId: string, content: SectionContent) {
    editor.updateSectionContent(sectionId, content);
  }

  return (
    <ThemeProvider theme={theme} className="sf-site min-h-screen">
      <FontLoader fonts={theme.fonts} />

      {/* Add section button at the very top */}
      <AddSectionButton onAdd={(type, content) => editor.addSection(0, type, content)} />

      {activeSections.map((section, index) => (
        <div key={section.id}>
          <div className="relative group">
            {/* Section overlay controls */}
            <SectionOverlay
              section={section}
              index={index}
              total={activeSections.length}
              isSelected={editor.selectedSectionId === section.id}
              onSelect={() => editor.selectSection(section.id)}
              onMoveUp={() => editor.moveSectionUp(section.id)}
              onMoveDown={() => editor.moveSectionDown(section.id)}
              onRemove={() => editor.removeSection(section.id)}
              onChangeVariant={(v) => editor.changeSectionVariant(section.id, v)}
              onAIChat={() =>
                setAiChatSectionId(
                  aiChatSectionId === section.id ? null : section.id
                )
              }
            />

            {/* AI Chat overlay */}
            <AnimatePresence>
              {aiChatSectionId === section.id && (
                <SectionAIChat
                  section={section}
                  siteContext={siteContext}
                  onUpdate={(content) => handleAIUpdate(section.id, content)}
                  onClose={() => setAiChatSectionId(null)}
                  onBuyCredits={onBuyCredits}
                />
              )}
            </AnimatePresence>

            {/* Actual section render */}
            {renderSection(
              section.type,
              section.content,
              section.variant,
              animConfig.scrollReveal,
              section.id
            )}
          </div>

          {/* Add section button between sections */}
          <AddSectionButton
            onAdd={(type, content) => editor.addSection(index + 1, type, content)}
          />
        </div>
      ))}
    </ThemeProvider>
  );
}

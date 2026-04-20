"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { SiteConfig } from "@/types";
import { composeSite } from "@/core/composer";
import { MOCK_BRIEFS, getMockBrief } from "@/lib/mock-briefs";
import { SiteRenderer } from "@/components/site-renderer";
import { SiteRendererEditable } from "@/components/site-renderer-editable";
import { SectionEditorPanel } from "@/components/editor/section-editor-panel";
import { ThemeSwitcher } from "@/components/editor/theme-switcher";
import { FontSwitcher } from "@/components/editor/font-switcher";
import { useSiteEditor } from "@/components/editor/use-site-editor";
import { PageTabs } from "@/components/editor/page-tabs";
import { downloadSiteHTML } from "@/lib/export-html";

// =============================================================================
// DEMO PREVIEW
// =============================================================================
// Access at: /preview/demo
// No API key needed. Loads mock briefs to test the entire pipeline:
// composition, theming, sections, animations, and editing.
//
// Switch between "coiffeur" and "restaurant" demos via buttons.
// =============================================================================

type ViewMode = "edit" | "preview" | "debug";

export default function DemoPreviewPage() {
  const [briefKey, setBriefKey] = useState<string>("coiffeur");
  const brief = getMockBrief(briefKey);
  const initialConfig = useMemo(() => composeSite(brief), [brief]);

  return (
    <DemoEditor
      key={briefKey}
      brief={brief}
      briefKey={briefKey}
      initialConfig={initialConfig}
      onChangeBrief={setBriefKey}
    />
  );
}

function DemoEditor({
  brief,
  briefKey,
  initialConfig,
  onChangeBrief,
}: {
  brief: ReturnType<typeof getMockBrief>;
  briefKey: string;
  initialConfig: SiteConfig;
  onChangeBrief: (key: string) => void;
}) {
  const editor = useSiteEditor(initialConfig);
  const [viewMode, setViewMode] = useState<ViewMode>("preview");

  return (
    <div className="min-h-screen bg-[var(--sf-app-bg)]">
      {/* Toolbar */}
      <header className="sticky top-0 z-50 border-b border-[var(--sf-app-border)] bg-[var(--sf-app-bg)]/90 backdrop-blur-md">
        {/* Row 1 */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] transition-colors"
            >
              ← Dashboard
            </Link>
            <span className="text-[var(--sf-app-border)]">|</span>
            <h1 className="font-semibold text-sm">{brief.businessName}</h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
              DEMO
            </span>
            {editor.isDirty && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-medium">
                Modifié
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Demo switcher */}
            <div className="hidden sm:flex items-center gap-1.5 mr-2">
              {Object.keys(MOCK_BRIEFS).map((key) => (
                <button
                  key={key}
                  onClick={() => onChangeBrief(key)}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-colors cursor-pointer capitalize ${
                    key === briefKey
                      ? "bg-[var(--sf-app-accent)]/10 text-[var(--sf-app-accent)]"
                      : "text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)]"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Undo */}
            {editor.canUndo && (
              <button
                onClick={editor.undo}
                title="Annuler"
                className="p-2 rounded-lg text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] hover:bg-[var(--sf-app-surface)] transition-colors cursor-pointer"
              >
                <UndoIcon />
              </button>
            )}

            {/* Export */}
            <button
              onClick={() => downloadSiteHTML(editor.config, `${brief.businessName}.html`)}
              title="Télécharger en HTML"
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--sf-app-border)] text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] hover:border-[var(--sf-app-accent)]/30 transition-colors cursor-pointer"
            >
              ↓ Exporter
            </button>

            {/* Mode toggle */}
            <div className="flex rounded-lg border border-[var(--sf-app-border)] overflow-hidden">
              {(["edit", "preview", "debug"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setViewMode(mode);
                    if (mode !== "edit") editor.selectSection(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    viewMode === mode
                      ? "bg-[var(--sf-app-accent)] text-white"
                      : "text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)]"
                  }`}
                >
                  {mode === "edit" ? "Éditer" : mode === "preview" ? "Aperçu" : "Debug"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Theme controls */}
        {viewMode !== "debug" && (
          <div className="flex items-center gap-6 px-4 sm:px-6 py-2 border-t border-[var(--sf-app-border)]/50">
            <ThemeSwitcher
              currentPalette={editor.config.theme.paletteKey}
              onChangePalette={editor.changePalette}
            />
            <FontSwitcher
              currentFont={editor.config.theme.fontPairingKey}
              onChangeFont={editor.changeFont}
            />
            <div className="flex-1" />
            <span className="text-[10px] text-[var(--sf-app-text-muted)]">
              {editor.activeSections.length} sections
            </span>
          </div>
        )}

        {/* Row 3: Page tabs */}
        {viewMode === "edit" && (
          <div className="flex items-center gap-3 px-4 sm:px-6 py-2 border-t border-[var(--sf-app-border)]/50 overflow-x-auto">
            <span className="text-[10px] text-[var(--sf-app-text-muted)] flex-shrink-0">Pages :</span>
            <PageTabs editor={editor} />
          </div>
        )}
      </header>

      {/* Content */}
      {viewMode === "edit" && (
        <>
          <SiteRendererEditable editor={editor} onBuyCredits={() => {}} />
          <SectionEditorPanel
            section={editor.selectedSection}
            onClose={() => editor.selectSection(null)}
            onSave={editor.updateSectionContent}
          />
        </>
      )}

      {viewMode === "preview" && (
        <motion.div
          key={`${editor.config.theme.paletteKey}-${editor.config.theme.fontPairingKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SiteRenderer config={editor.config} />
        </motion.div>
      )}

      {viewMode === "debug" && (
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
          <details className="rounded-xl border border-[var(--sf-app-border)] bg-[var(--sf-app-surface)] overflow-hidden" open>
            <summary className="px-5 py-4 cursor-pointer text-sm font-medium">
              SiteBrief (mock: {briefKey})
            </summary>
            <pre className="text-xs text-[var(--sf-app-text-muted)] whitespace-pre-wrap font-mono bg-[var(--sf-app-bg)] m-4 p-4 rounded-lg overflow-auto max-h-[500px]">
              {JSON.stringify(brief, null, 2)}
            </pre>
          </details>
          <details className="rounded-xl border border-[var(--sf-app-border)] bg-[var(--sf-app-surface)] overflow-hidden">
            <summary className="px-5 py-4 cursor-pointer text-sm font-medium">
              SiteConfig ({editor.config.sections.length} sections)
            </summary>
            <pre className="text-xs text-[var(--sf-app-text-muted)] whitespace-pre-wrap font-mono bg-[var(--sf-app-bg)] m-4 p-4 rounded-lg overflow-auto max-h-[500px]">
              {JSON.stringify(editor.config, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

function UndoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  );
}

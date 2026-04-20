"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { SiteBrief, SiteConfig } from "@/types";
import { composeSite } from "@/core/composer";
import { SiteRenderer } from "@/components/site-renderer";
import { SiteRendererEditable } from "@/components/site-renderer-editable";
import { SectionEditorPanel } from "@/components/editor/section-editor-panel";
import { ThemeSwitcher } from "@/components/editor/theme-switcher";
import { FontSwitcher } from "@/components/editor/font-switcher";
import { useSiteEditor } from "@/components/editor/use-site-editor";

// =============================================================================
// Preview Page — Full Editor
// =============================================================================
// Three modes:
//   "edit"    — Editable site with section overlays + editor panel
//   "preview" — Clean preview without edit controls
//   "debug"   — Raw JSON view
// =============================================================================

type ViewMode = "edit" | "preview" | "debug";

export default function PreviewDraftPage() {
  const [brief, setBrief] = useState<SiteBrief | null>(null);
  const [initialConfig, setInitialConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");

  useEffect(() => {
    const stored = sessionStorage.getItem("siteforge_brief");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SiteBrief;
        setBrief(parsed);
        setInitialConfig(composeSite(parsed));
      } catch {
        console.error("Failed to parse stored brief");
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--sf-app-bg)]">
        <div className="w-8 h-8 border-2 border-[var(--sf-app-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!brief || !initialConfig) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[var(--sf-app-bg)]">
        <p className="text-[var(--sf-app-text-muted)]">
          Aucun brief trouvé. Commencez par décrire votre site.
        </p>
        <Link
          href="/generate"
          className="px-5 py-2.5 bg-[var(--sf-app-accent)] text-white rounded-lg text-sm font-medium"
        >
          Créer un site
        </Link>
      </div>
    );
  }

  return (
    <EditorView
      brief={brief}
      initialConfig={initialConfig}
      viewMode={viewMode}
      setViewMode={setViewMode}
    />
  );
}

// -- Editor View (needs hooks so extracted as component) ----------------------

function EditorView({
  brief,
  initialConfig,
  viewMode,
  setViewMode,
}: {
  brief: SiteBrief;
  initialConfig: SiteConfig;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}) {
  const editor = useSiteEditor(initialConfig);

  return (
    <div className="min-h-screen bg-[var(--sf-app-bg)]">
      {/* Toolbar */}
      <header className="sticky top-0 z-50 border-b border-[var(--sf-app-border)] bg-[var(--sf-app-bg)]/90 backdrop-blur-md">
        {/* Row 1 */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5">
          <div className="flex items-center gap-3">
            <Link
              href="/generate"
              className="text-sm text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] transition-colors"
            >
              ← Retour
            </Link>
            <span className="text-[var(--sf-app-border)]">|</span>
            <h1 className="font-semibold text-sm truncate max-w-[180px]">
              {brief.businessName}
            </h1>
            {editor.isDirty && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-medium">
                Modifié
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Undo */}
            {editor.canUndo && (
              <button
                onClick={editor.undo}
                title="Annuler (Ctrl+Z)"
                className="p-2 rounded-lg text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] hover:bg-[var(--sf-app-surface)] transition-colors cursor-pointer"
              >
                <UndoIcon />
              </button>
            )}

            {/* Mode toggle */}
            <div className="flex rounded-lg border border-[var(--sf-app-border)] overflow-hidden">
              {(["edit", "preview", "debug"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setViewMode(mode);
                    if (mode !== "edit") editor.selectSection(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer capitalize ${
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

        {/* Row 2: Theme controls (in edit or preview mode) */}
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
              {editor.config.sections.length} sections
            </span>
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
              SiteBrief (AI output)
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

// -- Icons --------------------------------------------------------------------

function UndoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  );
}

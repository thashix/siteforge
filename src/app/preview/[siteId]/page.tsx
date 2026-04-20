"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import type { SiteConfig } from "@/types";
import { getSiteById, updateSiteConfig, deleteSite, type StoredSite } from "@/lib/site-storage";
import { downloadSiteHTML } from "@/lib/export-html";
import { SiteRenderer } from "@/components/site-renderer";
import { SiteRendererEditable } from "@/components/site-renderer-editable";
import { SectionEditorPanel } from "@/components/editor/section-editor-panel";
import { ThemeSwitcher } from "@/components/editor/theme-switcher";
import { FontSwitcher } from "@/components/editor/font-switcher";
import { useSiteEditor } from "@/components/editor/use-site-editor";
import { PageTabs } from "@/components/editor/page-tabs";
import { CreditBadge } from "@/components/editor/credit-badge";
import { BuyCreditsModal } from "@/components/editor/buy-credits-modal";
import { useToast } from "@/components/ui/toast";
import { hasCredits, useCredits } from "@/lib/credits";

// =============================================================================
// PREVIEW PAGE — /preview/[siteId]
// =============================================================================
// Loads a saved site from storage, renders it with the full editor.
// Save button persists changes back to storage.
// =============================================================================

type ViewMode = "edit" | "preview" | "debug";

export default function SitePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.siteId as string;

  const [site, setSite] = useState<StoredSite | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (siteId && siteId !== "draft") {
      const found = getSiteById(siteId);
      setSite(found);
    }
    setLoading(false);
  }, [siteId]);

  // Fallback for old /preview/draft route
  if (siteId === "draft") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[var(--sf-app-bg)]">
        <p className="text-[var(--sf-app-text-muted)]">
          Cette page a été mise à jour. Vos sites sont maintenant sauvegardés automatiquement.
        </p>
        <Link href="/generate" className="px-5 py-2.5 bg-[var(--sf-app-accent)] text-white rounded-lg text-sm font-medium">
          Créer un nouveau site
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--sf-app-bg)]">
        <div className="w-8 h-8 border-2 border-[var(--sf-app-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[var(--sf-app-bg)]">
        <p className="text-[var(--sf-app-text-muted)]">Site introuvable.</p>
        <Link href="/dashboard" className="px-5 py-2.5 bg-[var(--sf-app-accent)] text-white rounded-lg text-sm font-medium">
          Retour au dashboard
        </Link>
      </div>
    );
  }

  return <SiteEditorView site={site} />;
}

// -- Editor View --------------------------------------------------------------

function SiteEditorView({ site }: { site: StoredSite }) {
  const router = useRouter();
  const editor = useSiteEditor(site.config as SiteConfig);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showBuyModal, setShowBuyModal] = useState(false);
  const { toast, ToastContainer } = useToast();

  function handleSave() {
    setSaveStatus("saving");
    updateSiteConfig(site.id, editor.config);
    setTimeout(() => {
      setSaveStatus("saved");
      toast("Site sauvegardé !", "success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 300);
  }

  function handleExport() {
    if (!hasCredits("export")) {
      setShowBuyModal(true);
      toast("Crédits insuffisants pour exporter", "error");
      return;
    }
    useCredits("export");
    downloadSiteHTML(editor.config, `${site.name}.html`);
    toast("HTML exporté — 3 crédits utilisés", "success");
  }

  function handleDelete() {
    if (window.confirm(`Supprimer "${site.name}" ? Cette action est irréversible.`)) {
      deleteSite(site.id);
      router.push("/dashboard");
    }
  }

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
            <h1 className="font-semibold text-sm truncate max-w-[180px]">
              {site.name}
            </h1>
            {editor.isDirty && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-medium">
                Non sauvegardé
              </span>
            )}
            {saveStatus === "saved" && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium"
              >
                ✓ Sauvegardé
              </motion.span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Credits */}
            <CreditBadge onClickBuy={() => setShowBuyModal(true)} />

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

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={!editor.isDirty || saveStatus === "saving"}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                editor.isDirty
                  ? "bg-[var(--sf-app-accent)] text-white hover:bg-[var(--sf-app-accent-hover)]"
                  : "bg-[var(--sf-app-surface)] text-[var(--sf-app-text-muted)] cursor-not-allowed"
              }`}
            >
              {saveStatus === "saving" ? "..." : "Sauvegarder"}
            </button>

            {/* Export HTML */}
            <button
              onClick={handleExport}
              title="Télécharger en HTML"
              className="px-4 py-1.5 text-xs font-medium rounded-lg border border-[var(--sf-app-border)] text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] hover:border-[var(--sf-app-accent)]/30 transition-colors cursor-pointer"
            >
              ↓ Exporter
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              title="Supprimer ce site"
              className="p-2 rounded-lg text-[var(--sf-app-text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <TrashIcon />
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

        {/* Row 3: Page tabs (edit mode) */}
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
          <SiteRendererEditable editor={editor} onBuyCredits={() => setShowBuyModal(true)} />
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
              SiteConfig ({editor.config.sections.length} sections)
            </summary>
            <pre className="text-xs text-[var(--sf-app-text-muted)] whitespace-pre-wrap font-mono bg-[var(--sf-app-bg)] m-4 p-4 rounded-lg overflow-auto max-h-[500px]">
              {JSON.stringify(editor.config, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Modals */}
      <BuyCreditsModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
      />
      <ToastContainer />
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

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

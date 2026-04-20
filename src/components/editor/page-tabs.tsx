"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PageConfig } from "@/types";
import type { SiteEditor } from "./use-site-editor";

// =============================================================================
// PAGE TABS
// =============================================================================
// Tab bar shown in the editor toolbar when multi-page is active.
// - Click tab to switch pages
// - "+" to add a new page
// - Right-click or long-press to rename/delete
// - "Activer multi-pages" button if not yet enabled
// =============================================================================

interface PageTabsProps {
  editor: SiteEditor;
}

export function PageTabs({ editor }: PageTabsProps) {
  const { config, activePageId, setActivePage, addPage, removePage, renamePage } = editor;
  const pages = config.pages;
  const isMultiPage = pages && pages.length > 0;

  const [isAdding, setIsAdding] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  function handleAddPage() {
    if (newPageName.trim()) {
      addPage(newPageName.trim());
      setNewPageName("");
      setIsAdding(false);
    }
  }

  function startRename(page: PageConfig) {
    setEditingPageId(page.id);
    setEditingName(page.name);
  }

  function commitRename() {
    if (editingPageId && editingName.trim()) {
      renamePage(editingPageId, editingName.trim());
    }
    setEditingPageId(null);
  }

  if (!isMultiPage) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => editor.enableMultiPage()}
          className="px-3 py-1.5 text-[10px] font-medium rounded-lg border border-dashed border-[var(--sf-app-border)] text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-accent)] hover:border-[var(--sf-app-accent)]/30 transition-colors cursor-pointer"
        >
          + Activer multi-pages
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
      {pages!.map((page) => (
        <div key={page.id} className="relative flex-shrink-0 group/tab">
          {editingPageId === page.id ? (
            <input
              autoFocus
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setEditingPageId(null);
              }}
              className="px-3 py-1.5 text-xs bg-[var(--sf-app-surface)] border border-[var(--sf-app-accent)] rounded-lg text-[var(--sf-app-text)] outline-none w-24"
            />
          ) : (
            <button
              onClick={() => setActivePage(page.id)}
              onDoubleClick={() => startRename(page)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap
                ${
                  page.id === activePageId
                    ? "bg-[var(--sf-app-accent)]/10 text-[var(--sf-app-accent)] border border-[var(--sf-app-accent)]/20"
                    : "text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] hover:bg-[var(--sf-app-surface)]"
                }
              `}
            >
              {page.name}
              {page.slug === "index" && (
                <span className="ml-1 text-[8px] opacity-50">●</span>
              )}
            </button>
          )}

          {/* Delete button on hover (not for home page if it's the only page) */}
          {pages!.length > 1 && page.id === activePageId && editingPageId !== page.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Supprimer la page "${page.name}" ?`)) {
                  removePage(page.id);
                }
              }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500/80 text-white text-[8px] flex items-center justify-center opacity-0 group-hover/tab:opacity-100 transition-opacity cursor-pointer hover:bg-red-500"
            >
              ×
            </button>
          )}
        </div>
      ))}

      {/* Add page */}
      <AnimatePresence>
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center gap-1 flex-shrink-0"
          >
            <input
              autoFocus
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddPage();
                if (e.key === "Escape") { setIsAdding(false); setNewPageName(""); }
              }}
              placeholder="Nom de la page..."
              className="px-2 py-1 text-xs bg-[var(--sf-app-surface)] border border-[var(--sf-app-border)] rounded-md text-[var(--sf-app-text)] outline-none w-28 focus:border-[var(--sf-app-accent)]"
            />
            <button
              onClick={handleAddPage}
              className="px-2 py-1 text-xs bg-[var(--sf-app-accent)] text-white rounded-md cursor-pointer"
            >
              OK
            </button>
            <button
              onClick={() => { setIsAdding(false); setNewPageName(""); }}
              className="px-1.5 py-1 text-xs text-[var(--sf-app-text-muted)] cursor-pointer"
            >
              ×
            </button>
          </motion.div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-accent)] hover:bg-[var(--sf-app-accent)]/10 transition-colors cursor-pointer text-sm"
            title="Ajouter une page"
          >
            +
          </button>
        )}
      </AnimatePresence>
    </div>
  );
}

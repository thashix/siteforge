"use client";

import { useState, useCallback, useRef } from "react";
import type { SiteConfig, SectionConfig, SectionContent, SectionType, PageConfig } from "@/types";
import { buildThemeConfig } from "@/core/theme";

// =============================================================================
// useSiteEditor Hook — Multi-page aware
// =============================================================================

interface EditorState {
  config: SiteConfig;
  isDirty: boolean;
}

export interface SiteEditor {
  config: SiteConfig;
  isDirty: boolean;
  /** Currently active page ID (null = legacy single-page) */
  activePageId: string | null;
  setActivePage: (pageId: string | null) => void;
  /** Sections for the current active page */
  activeSections: SectionConfig[];
  /** Page operations */
  addPage: (name: string) => void;
  removePage: (pageId: string) => void;
  renamePage: (pageId: string, name: string) => void;
  movePageUp: (pageId: string) => void;
  movePageDown: (pageId: string) => void;
  enableMultiPage: () => void;
  /** Section operations (target active page) */
  moveSectionUp: (sectionId: string) => void;
  moveSectionDown: (sectionId: string) => void;
  removeSection: (sectionId: string) => void;
  addSection: (index: number, type: SectionType, content: SectionContent) => void;
  updateSectionContent: (sectionId: string, content: SectionContent) => void;
  changeSectionVariant: (sectionId: string, variant: string) => void;
  /** Theme operations */
  changePalette: (paletteKey: string) => void;
  changeFont: (fontKey: string) => void;
  /** Undo */
  undo: () => void;
  canUndo: boolean;
  /** Section selection */
  selectedSectionId: string | null;
  selectSection: (sectionId: string | null) => void;
  selectedSection: SectionConfig | null;
}

const MAX_UNDO = 20;

function genId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

function toSlug(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "page";
}

export function useSiteEditor(initialConfig: SiteConfig): SiteEditor {
  const [state, setState] = useState<EditorState>({
    config: initialConfig,
    isDirty: false,
  });
  const undoStack = useRef<SiteConfig[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [activePageId, setActivePageId] = useState<string | null>(
    initialConfig.pages?.[0]?.id ?? null
  );

  // -- Core helpers -----------------------------------------------------------

  const pushUndo = useCallback(() => {
    undoStack.current = [state.config, ...undoStack.current.slice(0, MAX_UNDO - 1)];
  }, [state.config]);

  const updateConfig = useCallback(
    (updater: (prev: SiteConfig) => SiteConfig) => {
      pushUndo();
      setState((prev) => ({ config: updater(prev.config), isDirty: true }));
    },
    [pushUndo]
  );

  /** Update sections on the active page (or legacy sections) */
  const updateActiveSections = useCallback(
    (updater: (sections: SectionConfig[]) => SectionConfig[]) => {
      updateConfig((config) => {
        if (config.pages && config.pages.length > 0 && activePageId) {
          return {
            ...config,
            pages: config.pages.map((p) =>
              p.id === activePageId ? { ...p, sections: updater(p.sections) } : p
            ),
          };
        }
        return { ...config, sections: updater(config.sections) };
      });
    },
    [updateConfig, activePageId]
  );

  // -- Derived state ----------------------------------------------------------

  const activeSections: SectionConfig[] = (() => {
    const c = state.config;
    if (c.pages && c.pages.length > 0 && activePageId) {
      return c.pages.find((p) => p.id === activePageId)?.sections ?? [];
    }
    return c.sections;
  })();

  // -- Page operations --------------------------------------------------------

  const enableMultiPage = useCallback(() => {
    updateConfig((config) => {
      if (config.pages && config.pages.length > 0) return config;
      const id = genId("page");
      setActivePageId(id);
      return {
        ...config,
        pages: [{ id, name: "Accueil", slug: "index", sections: [...config.sections] }],
        sections: [],
      };
    });
  }, [updateConfig]);

  const addPage = useCallback(
    (name: string) => {
      updateConfig((config) => {
        const newPage: PageConfig = { id: genId("page"), name, slug: toSlug(name), sections: [] };

        if (!config.pages || config.pages.length === 0) {
          const homeId = genId("page");
          setActivePageId(homeId);
          return {
            ...config,
            pages: [
              { id: homeId, name: "Accueil", slug: "index", sections: [...config.sections] },
              newPage,
            ],
            sections: [],
          };
        }
        return { ...config, pages: [...config.pages, newPage] };
      });
    },
    [updateConfig]
  );

  const removePage = useCallback(
    (pageId: string) => {
      updateConfig((config) => {
        const pages = (config.pages || []).filter((p) => p.id !== pageId);
        if (pages.length === 0) {
          const removed = (config.pages || []).find((p) => p.id === pageId);
          setActivePageId(null);
          return { ...config, pages: undefined, sections: removed?.sections || [] };
        }
        if (activePageId === pageId) setActivePageId(pages[0].id);
        return { ...config, pages };
      });
    },
    [updateConfig, activePageId]
  );

  const renamePage = useCallback(
    (pageId: string, name: string) => {
      updateConfig((config) => ({
        ...config,
        pages: (config.pages || []).map((p) =>
          p.id === pageId
            ? { ...p, name, slug: p.slug === "index" ? "index" : toSlug(name) }
            : p
        ),
      }));
    },
    [updateConfig]
  );

  const movePageUp = useCallback(
    (pageId: string) => {
      updateConfig((config) => {
        const pages = [...(config.pages || [])];
        const idx = pages.findIndex((p) => p.id === pageId);
        if (idx <= 0) return config;
        [pages[idx - 1], pages[idx]] = [pages[idx], pages[idx - 1]];
        return { ...config, pages };
      });
    },
    [updateConfig]
  );

  const movePageDown = useCallback(
    (pageId: string) => {
      updateConfig((config) => {
        const pages = [...(config.pages || [])];
        const idx = pages.findIndex((p) => p.id === pageId);
        if (idx < 0 || idx >= pages.length - 1) return config;
        [pages[idx], pages[idx + 1]] = [pages[idx + 1], pages[idx]];
        return { ...config, pages };
      });
    },
    [updateConfig]
  );

  // -- Section operations -----------------------------------------------------

  const moveSectionUp = useCallback(
    (sectionId: string) => {
      updateActiveSections((sections) => {
        const idx = sections.findIndex((s) => s.id === sectionId);
        if (idx <= 0) return sections;
        const arr = [...sections];
        [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
        return arr;
      });
    },
    [updateActiveSections]
  );

  const moveSectionDown = useCallback(
    (sectionId: string) => {
      updateActiveSections((sections) => {
        const idx = sections.findIndex((s) => s.id === sectionId);
        if (idx < 0 || idx >= sections.length - 1) return sections;
        const arr = [...sections];
        [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
        return arr;
      });
    },
    [updateActiveSections]
  );

  const removeSection = useCallback(
    (sectionId: string) => {
      updateActiveSections((s) => s.filter((x) => x.id !== sectionId));
      if (selectedSectionId === sectionId) setSelectedSectionId(null);
    },
    [updateActiveSections, selectedSectionId]
  );

  const addSection = useCallback(
    (index: number, type: SectionType, content: SectionContent) => {
      updateActiveSections((sections) => {
        const arr = [...sections];
        arr.splice(index, 0, {
          id: `section-${type}-${Math.random().toString(36).slice(2, 8)}`,
          type,
          variant: "default",
          content,
        });
        return arr;
      });
    },
    [updateActiveSections]
  );

  const updateSectionContent = useCallback(
    (sectionId: string, content: SectionContent) => {
      updateActiveSections((s) => s.map((x) => (x.id === sectionId ? { ...x, content } : x)));
    },
    [updateActiveSections]
  );

  const changeSectionVariant = useCallback(
    (sectionId: string, variant: string) => {
      updateActiveSections((s) => s.map((x) => (x.id === sectionId ? { ...x, variant } : x)));
    },
    [updateActiveSections]
  );

  // -- Theme ------------------------------------------------------------------

  const changePalette = useCallback(
    (paletteKey: string) => {
      updateConfig((c) => ({ ...c, theme: buildThemeConfig(paletteKey, c.theme.fontPairingKey) }));
    },
    [updateConfig]
  );

  const changeFont = useCallback(
    (fontKey: string) => {
      updateConfig((c) => ({ ...c, theme: buildThemeConfig(c.theme.paletteKey, fontKey) }));
    },
    [updateConfig]
  );

  // -- Undo -------------------------------------------------------------------

  const undo = useCallback(() => {
    const prev = undoStack.current.shift();
    if (prev) setState({ config: prev, isDirty: undoStack.current.length > 0 });
  }, []);

  // -- Selection --------------------------------------------------------------

  const selectedSection = selectedSectionId
    ? activeSections.find((s) => s.id === selectedSectionId) ?? null
    : null;

  return {
    config: state.config,
    isDirty: state.isDirty,
    activePageId,
    setActivePage: setActivePageId,
    activeSections,
    addPage,
    removePage,
    renamePage,
    movePageUp,
    movePageDown,
    enableMultiPage,
    moveSectionUp,
    moveSectionDown,
    removeSection,
    addSection,
    updateSectionContent,
    changeSectionVariant,
    changePalette,
    changeFont,
    undo,
    canUndo: undoStack.current.length > 0,
    selectedSectionId,
    selectSection: setSelectedSectionId,
    selectedSection,
  };
}

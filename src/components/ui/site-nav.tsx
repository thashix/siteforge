"use client";

import type { PageConfig } from "@/types";

// =============================================================================
// SITE NAV
// =============================================================================
// Navigation bar displayed in generated sites when multi-page is active.
// Styled using the site's theme CSS variables.
// =============================================================================

interface SiteNavProps {
  pages: PageConfig[];
  activePageId: string;
  onNavigate: (pageId: string) => void;
  businessName?: string;
}

export function SiteNav({ pages, activePageId, onNavigate, businessName }: SiteNavProps) {
  if (pages.length <= 1) return null;

  return (
    <nav
      className="sticky top-0 z-40 w-full backdrop-blur-md border-b"
      style={{
        backgroundColor: "color-mix(in srgb, var(--sf-background) 85%, transparent)",
        borderColor: "var(--sf-border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 flex items-center justify-between h-14">
        {/* Brand */}
        {businessName && (
          <button
            onClick={() => {
              const home = pages.find((p) => p.slug === "index") || pages[0];
              onNavigate(home.id);
            }}
            className="font-semibold text-sm cursor-pointer"
            style={{
              fontFamily: "var(--sf-font-heading)",
              color: "var(--sf-text)",
            }}
          >
            {businessName}
          </button>
        )}

        {/* Page links */}
        <div className="flex items-center gap-1">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => onNavigate(page.id)}
              className="px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer"
              style={{
                fontFamily: "var(--sf-font-body)",
                color: page.id === activePageId ? "var(--sf-primary)" : "var(--sf-text-muted)",
                backgroundColor: page.id === activePageId ? "color-mix(in srgb, var(--sf-primary) 10%, transparent)" : "transparent",
              }}
            >
              {page.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

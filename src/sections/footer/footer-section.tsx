"use client";

import type { FooterContent } from "@/types";
import type { SectionProps } from "../types";

// =============================================================================
// FOOTER SECTION
// =============================================================================
// Single variant: clean footer with business info, links, copyright
// =============================================================================

export function FooterSection({
  content,
  sectionId,
}: SectionProps<FooterContent>) {
  return (
    <footer
      id={sectionId}
      className="py-12 md:py-16"
      style={{
        backgroundColor: "var(--sf-secondary)",
        borderTop: "1px solid var(--sf-border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3
              className="text-lg font-semibold mb-1"
              style={{
                fontFamily: "var(--sf-font-heading)",
                color: "var(--sf-text)",
              }}
            >
              {content.businessName}
            </h3>
            {content.tagline && (
              <p
                className="text-sm"
                style={{
                  fontFamily: "var(--sf-font-body)",
                  color: "var(--sf-text-muted)",
                }}
              >
                {content.tagline}
              </p>
            )}
          </div>

          {/* Links */}
          {content.links && content.links.length > 0 && (
            <nav className="flex flex-wrap justify-center gap-6">
              {content.links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="text-sm transition-colors duration-150 hover:underline"
                  style={{
                    fontFamily: "var(--sf-font-body)",
                    color: "var(--sf-text-muted)",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* Copyright */}
        {content.copyright && (
          <div
            className="mt-10 pt-6 text-center"
            style={{ borderTop: "1px solid var(--sf-border)" }}
          >
            <p
              className="text-xs"
              style={{
                fontFamily: "var(--sf-font-body)",
                color: "var(--sf-text-muted)",
              }}
            >
              {content.copyright}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}

"use client";

import type { AboutContent } from "@/types";
import type { SectionProps } from "../types";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionWrapper } from "@/components/ui/section-wrapper";

// =============================================================================
// ABOUT SECTION
// =============================================================================
// Variants:
//   "simple" — Centered text block
//   "split"  — Text left, highlights cards right
// =============================================================================

export function AboutSection({
  content,
  variant = "split",
  animation,
  sectionId,
}: SectionProps<AboutContent>) {
  if (variant === "simple") {
    return <AboutSimple content={content} animation={animation} sectionId={sectionId} />;
  }
  return <AboutSplit content={content} animation={animation} sectionId={sectionId} />;
}

// -- Variant: Simple ----------------------------------------------------------

function AboutSimple({
  content,
  animation,
  sectionId,
}: {
  content: AboutContent;
  animation: SectionProps["animation"];
  sectionId?: string;
}) {
  return (
    <SectionWrapper id={sectionId} background="default">
      <ScrollReveal config={animation}>
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-[var(--sf-font-heading-weight)] tracking-tight mb-8"
            style={{ fontFamily: "var(--sf-font-heading)", color: "var(--sf-text)" }}
          >
            {content.title}
          </h2>
          <p
            className="text-lg leading-relaxed mb-8"
            style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)" }}
          >
            {content.text}
          </p>
          {content.highlights && content.highlights.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {content.highlights.map((highlight, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{
                    borderColor: "var(--sf-primary)",
                    color: "var(--sf-primary)",
                    fontFamily: "var(--sf-font-body)",
                  }}
                >
                  {highlight}
                </span>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
}

// -- Variant: Split -----------------------------------------------------------

function AboutSplit({
  content,
  animation,
  sectionId,
}: {
  content: AboutContent;
  animation: SectionProps["animation"];
  sectionId?: string;
}) {
  return (
    <SectionWrapper id={sectionId} background="default">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Text */}
        <ScrollReveal config={animation}>
          <div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-[var(--sf-font-heading-weight)] tracking-tight mb-6"
              style={{ fontFamily: "var(--sf-font-heading)", color: "var(--sf-text)" }}
            >
              {content.title}
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)" }}
            >
              {content.text}
            </p>
          </div>
        </ScrollReveal>

        {/* Highlights */}
        {content.highlights && content.highlights.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.highlights.map((highlight, i) => (
              <ScrollReveal key={i} config={animation} index={i + 1}>
                <div
                  className="p-5 rounded-xl border"
                  style={{
                    borderColor: "var(--sf-border)",
                    backgroundColor: "var(--sf-surface)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mb-3"
                    style={{
                      backgroundColor: "var(--sf-primary)",
                      color: "var(--sf-background)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <p
                    className="text-sm font-medium"
                    style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text)" }}
                  >
                    {highlight}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

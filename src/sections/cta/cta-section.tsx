"use client";

import type { CtaContent } from "@/types";
import type { SectionProps } from "../types";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

// =============================================================================
// CTA SECTION
// =============================================================================
// Variants:
//   "banner"  — Full-width gradient banner with centered text
//   "minimal" — Clean, understated CTA on default background
// =============================================================================

export function CtaSection({
  content,
  variant = "banner",
  animation,
  sectionId,
}: SectionProps<CtaContent>) {
  if (variant === "minimal") {
    return <CtaMinimal content={content} animation={animation} sectionId={sectionId} />;
  }
  return <CtaBanner content={content} animation={animation} sectionId={sectionId} />;
}

// -- Variant: Banner ----------------------------------------------------------

function CtaBanner({
  content,
  animation,
  sectionId,
}: {
  content: CtaContent;
  animation: SectionProps["animation"];
  sectionId?: string;
}) {
  return (
    <section
      id={sectionId}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: "var(--sf-primary)" }}
    >
      {/* Decorative overlay */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ backgroundColor: "var(--sf-accent)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[80px]"
          style={{ backgroundColor: "var(--sf-secondary)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal config={animation}>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-[var(--sf-font-heading-weight)] tracking-tight mb-4"
            style={{
              fontFamily: "var(--sf-font-heading)",
              color: "var(--sf-background)",
            }}
          >
            {content.headline}
          </h2>

          {content.subheadline && (
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 opacity-80"
              style={{
                fontFamily: "var(--sf-font-body)",
                color: "var(--sf-background)",
              }}
            >
              {content.subheadline}
            </p>
          )}

          <a
            href={content.buttonLink || "#contact"}
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-[var(--sf-radius)] transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              backgroundColor: "var(--sf-background)",
              color: "var(--sf-primary)",
              fontFamily: "var(--sf-font-body)",
            }}
          >
            {content.buttonText}
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

// -- Variant: Minimal ---------------------------------------------------------

function CtaMinimal({
  content,
  animation,
  sectionId,
}: {
  content: CtaContent;
  animation: SectionProps["animation"];
  sectionId?: string;
}) {
  return (
    <section
      id={sectionId}
      className="py-20 md:py-28"
      style={{ backgroundColor: "var(--sf-background)" }}
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <ScrollReveal config={animation}>
          <h2
            className="text-3xl sm:text-4xl font-[var(--sf-font-heading-weight)] tracking-tight mb-4"
            style={{ fontFamily: "var(--sf-font-heading)", color: "var(--sf-text)" }}
          >
            {content.headline}
          </h2>
          {content.subheadline && (
            <p
              className="text-lg max-w-xl mx-auto mb-8"
              style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)" }}
            >
              {content.subheadline}
            </p>
          )}
          <a
            href={content.buttonLink || "#contact"}
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-[var(--sf-radius)] transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: "var(--sf-primary)",
              color: "var(--sf-background)",
              fontFamily: "var(--sf-font-body)",
            }}
          >
            {content.buttonText}
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

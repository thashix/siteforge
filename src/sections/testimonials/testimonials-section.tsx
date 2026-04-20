"use client";

import type { TestimonialsContent } from "@/types";
import type { SectionProps } from "../types";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionWrapper } from "@/components/ui/section-wrapper";

// =============================================================================
// TESTIMONIALS SECTION
// =============================================================================
// Variants:
//   "cards"  — Testimonial cards in a grid
//   "large"  — Single large quotes stacked vertically
// =============================================================================

export function TestimonialsSection({
  content,
  variant = "cards",
  animation,
  sectionId,
}: SectionProps<TestimonialsContent>) {
  if (variant === "large") {
    return <TestimonialsLarge content={content} animation={animation} sectionId={sectionId} />;
  }
  return <TestimonialsCards content={content} animation={animation} sectionId={sectionId} />;
}

// -- Variant: Cards -----------------------------------------------------------

function TestimonialsCards({
  content,
  animation,
  sectionId,
}: {
  content: TestimonialsContent;
  animation: SectionProps["animation"];
  sectionId?: string;
}) {
  return (
    <SectionWrapper id={sectionId} background="surface">
      <ScrollReveal config={animation}>
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-[var(--sf-font-heading-weight)] tracking-tight"
            style={{ fontFamily: "var(--sf-font-heading)", color: "var(--sf-text)" }}
          >
            {content.title}
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.items.map((item, i) => (
          <ScrollReveal key={i} config={animation} index={i + 1}>
            <div
              className="p-8 rounded-2xl border h-full flex flex-col"
              style={{
                backgroundColor: "var(--sf-background)",
                borderColor: "var(--sf-border)",
              }}
            >
              {/* Quote mark */}
              <div
                className="text-4xl leading-none mb-4 opacity-30"
                style={{ color: "var(--sf-primary)", fontFamily: "Georgia, serif" }}
              >
                &ldquo;
              </div>

              {/* Quote text */}
              <p
                className="text-base leading-relaxed flex-1 mb-6"
                style={{
                  fontFamily: "var(--sf-font-body)",
                  color: "var(--sf-text)",
                  fontStyle: "italic",
                }}
              >
                {item.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: "var(--sf-primary)",
                    color: "var(--sf-background)",
                  }}
                >
                  {item.author.charAt(0)}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--sf-text)", fontFamily: "var(--sf-font-body)" }}
                  >
                    {item.author}
                  </p>
                  {item.role && (
                    <p
                      className="text-xs"
                      style={{ color: "var(--sf-text-muted)", fontFamily: "var(--sf-font-body)" }}
                    >
                      {item.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  );
}

// -- Variant: Large -----------------------------------------------------------

function TestimonialsLarge({
  content,
  animation,
  sectionId,
}: {
  content: TestimonialsContent;
  animation: SectionProps["animation"];
  sectionId?: string;
}) {
  return (
    <SectionWrapper id={sectionId} background="default">
      <ScrollReveal config={animation}>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-[var(--sf-font-heading-weight)] tracking-tight text-center mb-20"
          style={{ fontFamily: "var(--sf-font-heading)", color: "var(--sf-text)" }}
        >
          {content.title}
        </h2>
      </ScrollReveal>

      <div className="max-w-3xl mx-auto space-y-16">
        {content.items.map((item, i) => (
          <ScrollReveal key={i} config={animation} index={i}>
            <blockquote className="text-center">
              <p
                className="text-2xl sm:text-3xl leading-relaxed mb-6"
                style={{
                  fontFamily: "var(--sf-font-heading)",
                  color: "var(--sf-text)",
                  fontStyle: "italic",
                }}
              >
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer>
                <p
                  className="text-base font-semibold"
                  style={{ color: "var(--sf-primary)", fontFamily: "var(--sf-font-body)" }}
                >
                  {item.author}
                </p>
                {item.role && (
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--sf-text-muted)", fontFamily: "var(--sf-font-body)" }}
                  >
                    {item.role}
                  </p>
                )}
              </footer>
            </blockquote>
            {i < content.items.length - 1 && (
              <div
                className="w-12 h-px mx-auto mt-16"
                style={{ backgroundColor: "var(--sf-border)" }}
              />
            )}
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  );
}

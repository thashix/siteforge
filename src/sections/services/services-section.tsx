"use client";

import type { ServicesContent } from "@/types";
import type { SectionProps } from "../types";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionWrapper } from "@/components/ui/section-wrapper";

// =============================================================================
// SERVICES SECTION
// =============================================================================
// Variants:
//   "grid"  — Cards in a responsive grid (3 cols)
//   "rows"  — Alternating icon-left/icon-right rows
// =============================================================================

export function ServicesSection({
  content,
  variant = "grid",
  animation,
  sectionId,
}: SectionProps<ServicesContent>) {
  if (variant === "rows") {
    return <ServicesRows content={content} animation={animation} sectionId={sectionId} />;
  }
  return <ServicesGrid content={content} animation={animation} sectionId={sectionId} />;
}

// -- Variant: Grid ------------------------------------------------------------

function ServicesGrid({
  content,
  animation,
  sectionId,
}: {
  content: ServicesContent;
  animation: SectionProps["animation"];
  sectionId?: string;
}) {
  return (
    <SectionWrapper id={sectionId} background="surface">
      <ScrollReveal config={animation}>
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-[var(--sf-font-heading-weight)] tracking-tight mb-4"
            style={{ fontFamily: "var(--sf-font-heading)", color: "var(--sf-text)" }}
          >
            {content.title}
          </h2>
          {content.subtitle && (
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)" }}
            >
              {content.subtitle}
            </p>
          )}
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {content.items.map((item, i) => (
          <ScrollReveal key={i} config={animation} index={i + 1}>
            <div
              className="group p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border"
              style={{
                backgroundColor: "var(--sf-background)",
                borderColor: "var(--sf-border)",
              }}
            >
              {item.icon && (
                <div className="text-4xl mb-5">{item.icon}</div>
              )}
              <h3
                className="text-xl font-semibold mb-3"
                style={{ fontFamily: "var(--sf-font-heading)", color: "var(--sf-text)" }}
              >
                {item.title}
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)" }}
              >
                {item.description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  );
}

// -- Variant: Rows ------------------------------------------------------------

function ServicesRows({
  content,
  animation,
  sectionId,
}: {
  content: ServicesContent;
  animation: SectionProps["animation"];
  sectionId?: string;
}) {
  return (
    <SectionWrapper id={sectionId} background="default">
      <ScrollReveal config={animation}>
        <div className="text-center mb-20">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-[var(--sf-font-heading-weight)] tracking-tight mb-4"
            style={{ fontFamily: "var(--sf-font-heading)", color: "var(--sf-text)" }}
          >
            {content.title}
          </h2>
          {content.subtitle && (
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)" }}
            >
              {content.subtitle}
            </p>
          )}
        </div>
      </ScrollReveal>

      <div className="space-y-16 lg:space-y-24">
        {content.items.map((item, i) => (
          <ScrollReveal key={i} config={animation} index={i}>
            <div
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Icon / visual block */}
              <div
                className="flex-shrink-0 w-20 h-20 lg:w-28 lg:h-28 rounded-2xl flex items-center justify-center text-4xl lg:text-5xl"
                style={{ backgroundColor: "var(--sf-surface)" }}
              >
                {item.icon || "✦"}
              </div>

              {/* Text */}
              <div className="text-center lg:text-left">
                <h3
                  className="text-2xl font-semibold mb-2"
                  style={{ fontFamily: "var(--sf-font-heading)", color: "var(--sf-text)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-base leading-relaxed max-w-lg"
                  style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)" }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  );
}

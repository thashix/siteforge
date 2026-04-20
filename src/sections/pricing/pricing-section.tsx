"use client";

import type { PricingContent } from "@/types";
import type { SectionProps } from "../types";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionWrapper } from "@/components/ui/section-wrapper";

// =============================================================================
// PRICING SECTION
// =============================================================================
// Single variant for MVP: clean pricing cards with highlight support
// =============================================================================

export function PricingSection({
  content,
  animation,
  sectionId,
}: SectionProps<PricingContent>) {
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

      <div
        className={`grid gap-6 lg:gap-8 mx-auto ${
          content.plans.length === 2
            ? "grid-cols-1 md:grid-cols-2 max-w-3xl"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl"
        }`}
      >
        {content.plans.map((plan, i) => (
          <ScrollReveal key={i} config={animation} index={i + 1}>
            <div
              className={`relative p-8 rounded-2xl border flex flex-col h-full transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted ? "ring-2" : ""
              }`}
              style={{
                backgroundColor: plan.highlighted
                  ? "var(--sf-primary)"
                  : "var(--sf-background)",
                borderColor: plan.highlighted
                  ? "var(--sf-primary)"
                  : "var(--sf-border)",
                ...(plan.highlighted ? { ["--card-text" as string]: "var(--sf-background)" } : {}),
              }}
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: "var(--sf-accent)",
                    color: "var(--sf-background)",
                  }}
                >
                  Populaire
                </div>
              )}

              <h3
                className="text-xl font-semibold mb-2"
                style={{
                  fontFamily: "var(--sf-font-heading)",
                  color: plan.highlighted ? "var(--sf-background)" : "var(--sf-text)",
                }}
              >
                {plan.name}
              </h3>

              <p
                className="text-3xl sm:text-4xl font-bold mb-6"
                style={{
                  fontFamily: "var(--sf-font-heading)",
                  color: plan.highlighted ? "var(--sf-background)" : "var(--sf-primary)",
                }}
              >
                {plan.price}
              </p>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature, fi) => (
                  <li
                    key={fi}
                    className="flex items-start gap-2 text-sm"
                    style={{
                      fontFamily: "var(--sf-font-body)",
                      color: plan.highlighted
                        ? "var(--sf-background)"
                        : "var(--sf-text-muted)",
                    }}
                  >
                    <CheckIcon highlighted={plan.highlighted} />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="block w-full py-3 text-center text-sm font-semibold rounded-[var(--sf-radius)] transition-all duration-200 hover:scale-[1.02]"
                style={{
                  backgroundColor: plan.highlighted
                    ? "var(--sf-background)"
                    : "var(--sf-primary)",
                  color: plan.highlighted
                    ? "var(--sf-primary)"
                    : "var(--sf-background)",
                  fontFamily: "var(--sf-font-body)",
                }}
              >
                Choisir
              </a>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  );
}

function CheckIcon({ highlighted }: { highlighted?: boolean }) {
  return (
    <svg
      className="w-4 h-4 mt-0.5 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        color: highlighted ? "var(--sf-background)" : "var(--sf-primary)",
      }}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

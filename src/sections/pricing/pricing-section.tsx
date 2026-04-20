"use client";

import type { PricingContent } from "@/types";
import type { SectionProps } from "../types";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function PricingSection({ content, sectionId }: SectionProps<PricingContent>) {
  return (
    <section id={sectionId} className="py-20 sm:py-28" style={{ backgroundColor: "var(--sf-background)" }}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <ScrollReveal>
          <h2 className="text-center text-[clamp(1.8rem,4vw,2.8rem)] leading-tight tracking-[-0.02em] mb-4" style={{ fontFamily: "var(--sf-font-heading)", fontWeight: "var(--sf-font-heading-weight)" as string, color: "var(--sf-text)" }}>
            {content.title}
          </h2>
        </ScrollReveal>
        {content.subtitle && (
          <ScrollReveal delay={0.1}>
            <p className="text-center text-base max-w-lg mx-auto mb-4" style={{ color: "var(--sf-text-muted)", fontWeight: 300 }}>{content.subtitle}</p>
          </ScrollReveal>
        )}
        <ScrollReveal delay={0.15}><div className="w-12 h-px mx-auto mb-14" style={{ backgroundColor: "var(--sf-primary)" }} /></ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {content.plans.map((plan, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div
                className="relative p-7 sm:p-8 rounded-lg border text-center transition-all duration-300"
                style={{
                  backgroundColor: plan.highlighted ? "var(--sf-primary)" : "var(--sf-surface)",
                  borderColor: plan.highlighted ? "var(--sf-primary)" : "var(--sf-border)",
                  color: plan.highlighted ? "var(--sf-background)" : "var(--sf-text)",
                  transform: plan.highlighted ? "scale(1.02)" : "scale(1)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = plan.highlighted ? "scale(1.04) translateY(-4px)" : "translateY(-4px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = plan.highlighted ? "scale(1.02)" : "scale(1)"; }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-[9px] font-bold tracking-[0.08em] uppercase rounded-full"
                    style={{ backgroundColor: "var(--sf-text)", color: "var(--sf-background)" }}>
                    Populaire
                  </div>
                )}

                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--sf-font-heading)" }}>{plan.name}</h3>
                <div className="text-4xl font-bold mb-6" style={{ fontFamily: "var(--sf-font-heading)", color: plan.highlighted ? "var(--sf-background)" : "var(--sf-primary)" }}>
                  {plan.price}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="text-sm" style={{ color: plan.highlighted ? "color-mix(in srgb, var(--sf-background) 75%, transparent)" : "var(--sf-text-muted)", fontWeight: 300 }}>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className="w-full py-3 text-[12px] font-bold tracking-[0.05em] uppercase rounded transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: plan.highlighted ? "var(--sf-background)" : "transparent",
                    color: plan.highlighted ? "var(--sf-primary)" : "var(--sf-primary)",
                    border: plan.highlighted ? "none" : "1px solid var(--sf-primary)",
                  }}
                  onMouseEnter={(e) => {
                    if (!plan.highlighted) { e.currentTarget.style.backgroundColor = "var(--sf-primary)"; e.currentTarget.style.color = "var(--sf-background)"; }
                  }}
                  onMouseLeave={(e) => {
                    if (!plan.highlighted) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--sf-primary)"; }
                  }}
                >
                  Choisir
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

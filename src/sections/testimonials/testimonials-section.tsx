"use client";

import type { TestimonialsContent } from "@/types";
import type { SectionProps } from "../types";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function TestimonialsSection({ content, variant = "cards", sectionId }: SectionProps<TestimonialsContent>) {
  if (variant === "large") return <TestimonialsLarge content={content} sectionId={sectionId} />;
  return <TestimonialsCards content={content} sectionId={sectionId} />;
}

function TestimonialsCards({ content, sectionId }: { content: TestimonialsContent; sectionId?: string }) {
  return (
    <section id={sectionId} className="py-20 sm:py-28" style={{ backgroundColor: "var(--sf-surface)" }}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <ScrollReveal>
          <h2 className="text-center text-[clamp(1.8rem,4vw,2.8rem)] leading-tight tracking-[-0.02em] mb-4" style={{ fontFamily: "var(--sf-font-heading)", fontWeight: "var(--sf-font-heading-weight)" as string, color: "var(--sf-text)" }}>
            {content.title}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}><div className="w-12 h-px mx-auto mb-14" style={{ backgroundColor: "var(--sf-primary)" }} /></ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.items.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <div
                className="p-7 sm:p-8 rounded-lg border transition-all duration-300"
                style={{ backgroundColor: "var(--sf-background)", borderColor: "var(--sf-border)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--sf-primary) 30%, transparent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--sf-border)"; }}
              >
                {/* Quote mark */}
                <div className="text-4xl leading-none mb-4 opacity-20" style={{ color: "var(--sf-primary)", fontFamily: "Georgia, serif" }}>&ldquo;</div>

                {/* Quote text */}
                <p className="text-sm sm:text-base leading-[1.8] mb-6 italic" style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text)", fontWeight: 300 }}>
                  {item.quote}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: "var(--sf-primary)", color: "var(--sf-background)" }}
                  >
                    {item.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--sf-primary)", fontFamily: "var(--sf-font-body)" }}>{item.author}</p>
                    {item.role && <p className="text-[11px]" style={{ color: "var(--sf-text-muted)" }}>{item.role}</p>}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsLarge({ content, sectionId }: { content: TestimonialsContent; sectionId?: string }) {
  return (
    <section id={sectionId} className="py-20 sm:py-28" style={{ backgroundColor: "var(--sf-surface)" }}>
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <ScrollReveal>
          <h2 className="text-center text-[clamp(1.8rem,4vw,2.8rem)] leading-tight tracking-[-0.02em] mb-4" style={{ fontFamily: "var(--sf-font-heading)", fontWeight: "var(--sf-font-heading-weight)" as string, color: "var(--sf-text)" }}>
            {content.title}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}><div className="w-12 h-px mx-auto mb-14" style={{ backgroundColor: "var(--sf-primary)" }} /></ScrollReveal>

        <div className="space-y-10">
          {content.items.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="text-center">
                <div className="text-5xl leading-none mb-5 opacity-15" style={{ color: "var(--sf-primary)", fontFamily: "Georgia, serif" }}>&ldquo;</div>
                <p className="text-lg sm:text-xl leading-[1.8] mb-6 italic" style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text)", fontWeight: 300 }}>{item.quote}</p>
                <p className="text-sm font-semibold" style={{ color: "var(--sf-primary)" }}>{item.author}</p>
                {item.role && <p className="text-xs mt-1" style={{ color: "var(--sf-text-muted)" }}>{item.role}</p>}
                {i < content.items.length - 1 && <div className="w-8 h-px mx-auto mt-10" style={{ backgroundColor: "var(--sf-border)" }} />}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import type { AboutContent } from "@/types";
import type { SectionProps } from "../types";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function AboutSection({ content, variant = "split", sectionId }: SectionProps<AboutContent>) {
  if (variant === "simple") return <AboutSimple content={content} sectionId={sectionId} />;
  return <AboutSplit content={content} sectionId={sectionId} />;
}

function AboutSplit({ content, sectionId }: { content: AboutContent; sectionId?: string }) {
  return (
    <section id={sectionId} className="py-20 sm:py-28" style={{ backgroundColor: "var(--sf-background)" }}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* Visual */}
        <ScrollReveal>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--sf-primary) 0%, color-mix(in srgb, var(--sf-primary) 50%, var(--sf-accent)) 100%)", opacity: 0.15 }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "color-mix(in srgb, var(--sf-primary) 15%, transparent)" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--sf-primary)" }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
                </svg>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Text */}
        <div>
          <ScrollReveal delay={0.1}>
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] leading-tight tracking-[-0.02em] mb-5" style={{ fontFamily: "var(--sf-font-heading)", fontWeight: "var(--sf-font-heading-weight)" as string, color: "var(--sf-text)" }}>
              {content.title}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-base leading-[1.9] mb-8" style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)", fontWeight: 300 }}>
              {content.text}
            </p>
          </ScrollReveal>

          {content.highlights && content.highlights.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {content.highlights.map((h, i) => (
                <ScrollReveal key={i} delay={0.25 + i * 0.06}>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--sf-surface)" }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "color-mix(in srgb, var(--sf-primary) 15%, transparent)" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: "var(--sf-primary)" }}><path d="M20 6L9 17l-5-5" /></svg>
                    </div>
                    <span className="text-sm" style={{ color: "var(--sf-text)", fontFamily: "var(--sf-font-body)" }}>{h}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function AboutSimple({ content, sectionId }: { content: AboutContent; sectionId?: string }) {
  return (
    <section id={sectionId} className="py-20 sm:py-28" style={{ backgroundColor: "var(--sf-background)" }}>
      <div className="mx-auto max-w-3xl px-6 sm:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] leading-tight tracking-[-0.02em] mb-5" style={{ fontFamily: "var(--sf-font-heading)", fontWeight: "var(--sf-font-heading-weight)" as string, color: "var(--sf-text)" }}>{content.title}</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}><div className="w-12 h-px mx-auto mb-8" style={{ backgroundColor: "var(--sf-primary)" }} /></ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="text-base sm:text-lg leading-[1.9]" style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)", fontWeight: 300 }}>{content.text}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}

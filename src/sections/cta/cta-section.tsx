"use client";

import type { CtaContent } from "@/types";
import type { SectionProps } from "../types";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function CtaSection({ content, variant = "banner", sectionId }: SectionProps<CtaContent>) {
  if (variant === "minimal") return <CtaMinimal content={content} sectionId={sectionId} />;
  return <CtaBanner content={content} sectionId={sectionId} />;
}

function CtaBanner({ content, sectionId }: { content: CtaContent; sectionId?: string }) {
  return (
    <section id={sectionId} className="relative py-20 sm:py-28 overflow-hidden" style={{ backgroundColor: "var(--sf-primary)" }}>
      {/* Decorative orbs */}
      <div className="absolute -top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-10" style={{ backgroundColor: "var(--sf-background)" }} />
      <div className="absolute -bottom-[40%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-5" style={{ backgroundColor: "var(--sf-background)" }} />

      <div className="relative z-10 mx-auto max-w-3xl px-6 sm:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] leading-tight tracking-[-0.02em] mb-4" style={{ fontFamily: "var(--sf-font-heading)", fontWeight: "var(--sf-font-heading-weight)" as string, color: "var(--sf-background)" }}>
            {content.headline}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-base sm:text-lg mb-8 leading-relaxed" style={{ fontFamily: "var(--sf-font-body)", color: "color-mix(in srgb, var(--sf-background) 70%, transparent)", fontWeight: 300 }}>
            {content.subheadline}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <a
            href={content.buttonLink || "#contact"}
            className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 text-[12px] sm:text-[13px] font-bold tracking-[0.08em] uppercase transition-all duration-300 hover:-translate-y-[2px]"
            style={{
              backgroundColor: "var(--sf-background)",
              color: "var(--sf-primary)",
              fontFamily: "var(--sf-font-body)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
          >
            {content.buttonText}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

function CtaMinimal({ content, sectionId }: { content: CtaContent; sectionId?: string }) {
  return (
    <section id={sectionId} className="py-20 sm:py-28" style={{ backgroundColor: "var(--sf-background)" }}>
      <div className="mx-auto max-w-2xl px-6 sm:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] leading-tight tracking-[-0.02em] mb-4" style={{ fontFamily: "var(--sf-font-heading)", color: "var(--sf-text)" }}>{content.headline}</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-base mb-6" style={{ color: "var(--sf-text-muted)", fontWeight: 300 }}>{content.subheadline}</p>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <a href={content.buttonLink || "#contact"} className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-[var(--sf-radius)] transition-all duration-300 hover:-translate-y-[2px]" style={{ backgroundColor: "var(--sf-primary)", color: "var(--sf-background)" }}>
            {content.buttonText}
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

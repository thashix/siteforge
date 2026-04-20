"use client";

import { motion } from "framer-motion";
import type { ServicesContent } from "@/types";
import type { SectionProps } from "../types";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function ServicesSection({ content, variant = "grid", sectionId }: SectionProps<ServicesContent>) {
  if (variant === "rows") return <ServicesRows content={content} sectionId={sectionId} />;
  return <ServicesGrid content={content} sectionId={sectionId} />;
}

function ServicesGrid({ content, sectionId }: { content: ServicesContent; sectionId?: string }) {
  return (
    <section id={sectionId} className="py-20 sm:py-28" style={{ backgroundColor: "var(--sf-surface)" }}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <ScrollReveal>
          <div className="text-center mb-4">
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] leading-tight tracking-[-0.02em]" style={{ fontFamily: "var(--sf-font-heading)", fontWeight: "var(--sf-font-heading-weight)" as string, color: "var(--sf-text)" }}>
              {content.title}
            </h2>
          </div>
        </ScrollReveal>
        {content.subtitle && (
          <ScrollReveal delay={0.1}>
            <p className="text-center text-base sm:text-lg max-w-lg mx-auto mb-4 leading-relaxed" style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)", fontWeight: 300 }}>
              {content.subtitle}
            </p>
          </ScrollReveal>
        )}
        <ScrollReveal delay={0.15}>
          <div className="w-12 h-px mx-auto mb-14" style={{ backgroundColor: "var(--sf-primary)" }} />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.items.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <div
                className="group p-7 sm:p-8 rounded-lg border transition-all duration-400 cursor-default"
                style={{ backgroundColor: "var(--sf-background)", borderColor: "var(--sf-border)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "color-mix(in srgb, var(--sf-primary) 40%, transparent)";
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--sf-border)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {item.icon && <span className="text-3xl block mb-5">{item.icon}</span>}
                <h3 className="text-lg font-semibold mb-2.5" style={{ fontFamily: "var(--sf-font-heading)", color: "var(--sf-text)" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-[1.8]" style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)", fontWeight: 300 }}>
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesRows({ content, sectionId }: { content: ServicesContent; sectionId?: string }) {
  return (
    <section id={sectionId} className="py-20 sm:py-28" style={{ backgroundColor: "var(--sf-surface)" }}>
      <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
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

        <div className="space-y-6">
          {content.items.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <div className="flex gap-5 p-6 rounded-lg border transition-all duration-300" style={{ backgroundColor: "var(--sf-background)", borderColor: "var(--sf-border)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--sf-primary) 30%, transparent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--sf-border)"; }}
              >
                {item.icon && <span className="text-2xl flex-shrink-0 mt-1">{item.icon}</span>}
                <div>
                  <h3 className="text-base font-semibold mb-1.5" style={{ fontFamily: "var(--sf-font-heading)", color: "var(--sf-text)" }}>{item.title}</h3>
                  <p className="text-sm leading-[1.8]" style={{ color: "var(--sf-text-muted)", fontWeight: 300 }}>{item.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

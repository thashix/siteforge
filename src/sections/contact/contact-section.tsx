"use client";

import type { ContactContent } from "@/types";
import type { SectionProps } from "../types";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionWrapper } from "@/components/ui/section-wrapper";

// =============================================================================
// CONTACT SECTION
// =============================================================================
// Single variant: split layout with info left, form right
// =============================================================================

export function ContactSection({
  content,
  animation,
  sectionId,
}: SectionProps<ContactContent>) {
  return (
    <SectionWrapper id={sectionId ?? "contact"} background="surface">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto">
        {/* Info */}
        <ScrollReveal config={animation} index={1}>
          <div className="space-y-6">
            {content.email && (
              <ContactInfo
                icon={<EmailIcon />}
                label="Email"
                value={content.email}
                href={`mailto:${content.email}`}
              />
            )}
            {content.phone && (
              <ContactInfo
                icon={<PhoneIcon />}
                label="Téléphone"
                value={content.phone}
                href={`tel:${content.phone.replace(/\s/g, "")}`}
              />
            )}
            {content.address && (
              <ContactInfo
                icon={<MapIcon />}
                label="Adresse"
                value={content.address}
              />
            )}
          </div>
        </ScrollReveal>

        {/* Form */}
        <ScrollReveal config={animation} index={2}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Votre nom"
                className="w-full px-4 py-3 rounded-[var(--sf-radius)] border text-sm outline-none transition-colors duration-150"
                style={{
                  backgroundColor: "var(--sf-background)",
                  borderColor: "var(--sf-border)",
                  color: "var(--sf-text)",
                  fontFamily: "var(--sf-font-body)",
                }}
              />
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-4 py-3 rounded-[var(--sf-radius)] border text-sm outline-none transition-colors duration-150"
                style={{
                  backgroundColor: "var(--sf-background)",
                  borderColor: "var(--sf-border)",
                  color: "var(--sf-text)",
                  fontFamily: "var(--sf-font-body)",
                }}
              />
            </div>
            <input
              type="text"
              placeholder="Sujet"
              className="w-full px-4 py-3 rounded-[var(--sf-radius)] border text-sm outline-none transition-colors duration-150"
              style={{
                backgroundColor: "var(--sf-background)",
                borderColor: "var(--sf-border)",
                color: "var(--sf-text)",
                fontFamily: "var(--sf-font-body)",
              }}
            />
            <textarea
              rows={5}
              placeholder="Votre message"
              className="w-full px-4 py-3 rounded-[var(--sf-radius)] border text-sm outline-none resize-none transition-colors duration-150"
              style={{
                backgroundColor: "var(--sf-background)",
                borderColor: "var(--sf-border)",
                color: "var(--sf-text)",
                fontFamily: "var(--sf-font-body)",
              }}
            />
            <button
              type="button"
              className="w-full py-3.5 text-sm font-semibold rounded-[var(--sf-radius)] transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: "var(--sf-primary)",
                color: "var(--sf-background)",
                fontFamily: "var(--sf-font-body)",
              }}
            >
              Envoyer le message
            </button>
          </div>
        </ScrollReveal>
      </div>
    </SectionWrapper>
  );
}

function ContactInfo({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const Wrapper = href ? "a" : "div";
  return (
    <Wrapper
      {...(href ? { href } : {})}
      className="flex items-start gap-4 group"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "var(--sf-background)" }}
      >
        {icon}
      </div>
      <div>
        <p
          className="text-xs uppercase tracking-wider mb-1"
          style={{ color: "var(--sf-text-muted)", fontFamily: "var(--sf-font-body)" }}
        >
          {label}
        </p>
        <p
          className="text-base font-medium group-hover:underline"
          style={{ color: "var(--sf-text)", fontFamily: "var(--sf-font-body)" }}
        >
          {value}
        </p>
      </div>
    </Wrapper>
  );
}

// -- Icons --------------------------------------------------------------------

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--sf-primary)" }}>
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--sf-primary)" }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--sf-primary)" }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

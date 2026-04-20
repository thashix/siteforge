"use client";

import type { FooterContent } from "@/types";
import type { SectionProps } from "../types";

// =============================================================================
// FOOTER SECTION — PREMIUM
// =============================================================================
// Variants:
//   "default"  — Full 4-column footer with brand, nav, services, contact
//   "simple"   — Compact single-row footer
// =============================================================================

export function FooterSection({
  content,
  variant = "default",
  sectionId,
}: SectionProps<FooterContent>) {
  if (variant === "simple") return <FooterSimple content={content} sectionId={sectionId} />;
  return <FooterColumns content={content} sectionId={sectionId} />;
}

// -- Variant: Columns (Premium) -----------------------------------------------

function FooterColumns({ content, sectionId }: { content: FooterContent; sectionId?: string }) {
  // Split links into navigation and services
  const navLinks = content.links?.slice(0, 4) || [];
  const serviceLinks = content.links?.slice(4) || [];

  return (
    <footer
      id={sectionId}
      style={{ backgroundColor: "var(--sf-secondary)", borderTop: "1px solid var(--sf-border)" }}
    >
      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3
              className="text-xl font-bold mb-3"
              style={{ fontFamily: "var(--sf-font-heading)", color: "var(--sf-primary)" }}
            >
              {content.businessName}
            </h3>
            {content.tagline && (
              <p
                className="text-sm leading-relaxed mb-5 max-w-xs"
                style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)" }}
              >
                {content.tagline}
              </p>
            )}
            {/* Social icons */}
            <div className="flex gap-3">
              <SocialIcon type="facebook" />
              <SocialIcon type="instagram" />
              <SocialIcon type="linkedin" />
              <SocialIcon type="twitter" />
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4
              className="text-xs font-semibold tracking-[0.15em] uppercase mb-4"
              style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text)" }}
            >
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {(navLinks.length > 0 ? navLinks : defaultNavLinks()).map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:underline"
                    style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--sf-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--sf-text-muted)"; }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4
              className="text-xs font-semibold tracking-[0.15em] uppercase mb-4"
              style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text)" }}
            >
              Services
            </h4>
            <ul className="space-y-2.5">
              {(serviceLinks.length > 0 ? serviceLinks : defaultServiceLinks()).map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href || "#"}
                    className="text-sm transition-colors duration-200"
                    style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--sf-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--sf-text-muted)"; }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact / Newsletter */}
          <div>
            <h4
              className="text-xs font-semibold tracking-[0.15em] uppercase mb-4"
              style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text)" }}
            >
              Contact
            </h4>
            <div className="space-y-3 text-sm" style={{ color: "var(--sf-text-muted)", fontFamily: "var(--sf-font-body)" }}>
              <p className="flex items-start gap-2">
                <MailIcon />
                <span>contact@{slugify(content.businessName)}.com</span>
              </p>
              <p className="flex items-start gap-2">
                <PhoneIcon />
                <span>+32 XXX XX XX XX</span>
              </p>
              <p className="flex items-start gap-2">
                <PinIcon />
                <span>Mons, Belgique</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-5"
        style={{ borderTop: "1px solid var(--sf-border)" }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-xs"
            style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)" }}
          >
            {content.copyright || `© ${new Date().getFullYear()} ${content.businessName}. Tous droits réservés.`}
          </p>
          <div className="flex gap-5">
            <a
              href="#"
              className="text-[11px] transition-colors duration-200"
              style={{ color: "var(--sf-text-muted)", fontFamily: "var(--sf-font-body)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--sf-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--sf-text-muted)"; }}
            >
              Mentions légales
            </a>
            <a
              href="#"
              className="text-[11px] transition-colors duration-200"
              style={{ color: "var(--sf-text-muted)", fontFamily: "var(--sf-font-body)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--sf-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--sf-text-muted)"; }}
            >
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// -- Variant: Simple ----------------------------------------------------------

function FooterSimple({ content, sectionId }: { content: FooterContent; sectionId?: string }) {
  return (
    <footer
      id={sectionId}
      style={{ backgroundColor: "var(--sf-secondary)", borderTop: "1px solid var(--sf-border)" }}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span
              className="text-lg font-bold"
              style={{ fontFamily: "var(--sf-font-heading)", color: "var(--sf-primary)" }}
            >
              {content.businessName}
            </span>
            {content.tagline && (
              <span className="hidden sm:inline text-sm" style={{ color: "var(--sf-text-muted)" }}>
                — {content.tagline}
              </span>
            )}
          </div>

          {content.links && content.links.length > 0 && (
            <nav className="flex flex-wrap justify-center gap-6">
              {content.links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="text-sm transition-colors duration-200"
                  style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--sf-primary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--sf-text-muted)"; }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          <div className="flex gap-3">
            <SocialIcon type="facebook" />
            <SocialIcon type="instagram" />
            <SocialIcon type="linkedin" />
          </div>
        </div>

        <div className="mt-6 pt-5 text-center" style={{ borderTop: "1px solid var(--sf-border)" }}>
          <p className="text-xs" style={{ color: "var(--sf-text-muted)", fontFamily: "var(--sf-font-body)" }}>
            {content.copyright || `© ${new Date().getFullYear()} ${content.businessName}. Tous droits réservés.`}
          </p>
        </div>
      </div>
    </footer>
  );
}

// -- Default links fallbacks --------------------------------------------------

function defaultNavLinks() {
  return [
    { label: "Accueil", href: "#" },
    { label: "À propos", href: "#" },
    { label: "Services", href: "#" },
    { label: "Contact", href: "#" },
  ];
}

function defaultServiceLinks() {
  return [
    { label: "Nos prestations", href: "#" },
    { label: "Tarifs", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Blog", href: "#" },
  ];
}

function slugify(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// -- Social Icons -------------------------------------------------------------

function SocialIcon({ type }: { type: "facebook" | "instagram" | "linkedin" | "twitter" }) {
  const paths: Record<string, string> = {
    facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
    instagram: "M16 4H8C5.79 4 4 5.79 4 8v8c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z",
    linkedin: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
    twitter: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
  };

  return (
    <a
      href="#"
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
      style={{
        backgroundColor: "color-mix(in srgb, var(--sf-primary) 10%, transparent)",
        color: "var(--sf-text-muted)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--sf-primary)";
        e.currentTarget.style.color = "var(--sf-background)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--sf-primary) 10%, transparent)";
        e.currentTarget.style.color = "var(--sf-text-muted)";
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={paths[type]} />
      </svg>
    </a>
  );
}

// -- Contact Icons ------------------------------------------------------------

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0" style={{ color: "var(--sf-primary)" }}>
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0" style={{ color: "var(--sf-primary)" }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0" style={{ color: "var(--sf-primary)" }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

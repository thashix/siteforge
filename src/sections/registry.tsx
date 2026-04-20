"use client";

import type { SectionType, SectionContent, AnimationConfig } from "@/types";
import type { SectionProps } from "./types";

// Section imports
import { HeroSection } from "./hero/hero-section";
import { ServicesSection } from "./services/services-section";
import { AboutSection } from "./about/about-section";
import { GallerySection } from "./gallery/gallery-section";
import { TestimonialsSection } from "./testimonials/testimonials-section";
import { CtaSection } from "./cta/cta-section";
import { PricingSection } from "./pricing/pricing-section";
import { FaqSection } from "./faq/faq-section";
import { ContactSection } from "./contact/contact-section";
import { FooterSection } from "./footer/footer-section";

// =============================================================================
// SECTION REGISTRY
// =============================================================================
// Central mapping from section type → React component.
// The render engine uses this to dynamically compose a full site.
//
// To add a new section type:
// 1. Create the component in src/sections/<type>/
// 2. Add the import above
// 3. Add the entry to SECTION_REGISTRY below
// 4. Add available variants to SECTION_VARIANTS
// =============================================================================

// Using `any` here is intentional — the registry needs to accept all section content types
// and each component internally casts to its specific content type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SectionComponent = React.ComponentType<SectionProps<any>>;

export const SECTION_REGISTRY: Record<SectionType, SectionComponent> = {
  hero: HeroSection,
  services: ServicesSection,
  about: AboutSection,
  gallery: GallerySection,
  testimonials: TestimonialsSection,
  cta: CtaSection,
  pricing: PricingSection,
  faq: FaqSection,
  contact: ContactSection,
  footer: FooterSection,
};

/** Available variants per section type — used by the composer to pick */
export const SECTION_VARIANTS: Record<SectionType, string[]> = {
  hero: ["centered", "split"],
  services: ["grid", "rows"],
  about: ["split", "simple"],
  gallery: ["grid", "masonry"],
  testimonials: ["cards", "large"],
  cta: ["banner", "minimal"],
  pricing: ["default"],
  faq: ["default"],
  contact: ["default"],
  footer: ["default"],
};

/** Render a single section by type */
export function renderSection(
  type: SectionType,
  content: SectionContent,
  variant: string,
  animation: AnimationConfig["scrollReveal"],
  sectionId: string
): React.ReactNode {
  const Component = SECTION_REGISTRY[type];

  if (!Component) {
    console.warn(`[Registry] Unknown section type: ${type}`);
    return null;
  }

  return (
    <Component
      key={sectionId}
      content={content}
      variant={variant}
      animation={animation}
      sectionId={sectionId}
    />
  );
}

"use client";

import type { GalleryContent } from "@/types";
import type { SectionProps } from "../types";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionWrapper } from "@/components/ui/section-wrapper";

// =============================================================================
// GALLERY SECTION
// =============================================================================
// Displays real images (src) when available, gradient placeholders otherwise.
// Variants: "grid" (uniform) and "masonry" (alternating heights)
// =============================================================================

export function GallerySection({
  content,
  variant = "grid",
  animation,
  sectionId,
}: SectionProps<GalleryContent>) {
  if (variant === "masonry") {
    return <GalleryMasonry content={content} animation={animation} sectionId={sectionId} />;
  }
  return <GalleryGrid content={content} animation={animation} sectionId={sectionId} />;
}

function placeholderGradient(index: number): string {
  const angles = [135, 225, 180, 45, 315, 90];
  return `linear-gradient(${angles[index % angles.length]}deg, var(--sf-primary), var(--sf-secondary))`;
}

/** Renders either a real image or a gradient placeholder */
function GalleryImage({
  src,
  alt,
  index,
  className,
}: {
  src?: string;
  alt: string;
  index: number;
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${className || ""}`}
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={`absolute inset-0 transition-transform duration-500 group-hover:scale-110 ${className || ""}`}
      style={{ background: placeholderGradient(index), opacity: 0.7 }}
    />
  );
}

// -- Variant: Grid ------------------------------------------------------------

function GalleryGrid({
  content,
  animation,
  sectionId,
}: {
  content: GalleryContent;
  animation: SectionProps["animation"];
  sectionId?: string;
}) {
  return (
    <SectionWrapper id={sectionId} background="default">
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
        {content.images.map((img, i) => (
          <ScrollReveal key={i} config={animation} index={i + 1}>
            <div
              className="aspect-square rounded-2xl overflow-hidden group cursor-pointer relative"
              title={img.alt}
            >
              <GalleryImage src={img.src} alt={img.alt} index={i} />
              <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p
                  className="text-sm font-medium"
                  style={{ color: "#fff", fontFamily: "var(--sf-font-body)" }}
                >
                  {img.alt}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  );
}

// -- Variant: Masonry ---------------------------------------------------------

function GalleryMasonry({
  content,
  animation,
  sectionId,
}: {
  content: GalleryContent;
  animation: SectionProps["animation"];
  sectionId?: string;
}) {
  return (
    <SectionWrapper id={sectionId} background="default">
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

      <div className="columns-2 md:columns-3 gap-4 lg:gap-6 space-y-4 lg:space-y-6">
        {content.images.map((img, i) => (
          <ScrollReveal key={i} config={animation} index={i + 1}>
            <div
              className={`rounded-2xl overflow-hidden group cursor-pointer relative break-inside-avoid ${
                i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"
              }`}
              title={img.alt}
            >
              <GalleryImage src={img.src} alt={img.alt} index={i} />
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  );
}

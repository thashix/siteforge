"use client";

import type { GalleryContent } from "@/types";
import type { SectionProps } from "../types";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function GallerySection({ content, variant = "grid", sectionId }: SectionProps<GalleryContent>) {
  return <GalleryGrid content={content} sectionId={sectionId} />;
}

function GalleryGrid({ content, sectionId }: { content: GalleryContent; sectionId?: string }) {
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {content.images.map((img, i) => (
            <ScrollReveal key={i} delay={i * 0.06}>
              <div
                className="group aspect-square rounded-lg overflow-hidden relative cursor-pointer"
                style={{ backgroundColor: "var(--sf-surface)" }}
              >
                {/* Image or gradient placeholder */}
                {img.src ? (
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div
                    className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{
                      background: `linear-gradient(${135 + i * 30}deg, color-mix(in srgb, var(--sf-primary) ${30 + i * 8}%, var(--sf-surface)), color-mix(in srgb, var(--sf-accent) ${20 + i * 5}%, var(--sf-background)))`,
                    }}
                  />
                )}

                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5"
                  style={{ background: "linear-gradient(transparent 30%, rgba(0,0,0,0.6))" }}
                >
                  <span className="text-white text-sm font-light">{img.alt}</span>
                </div>

                {/* Upload indicator (edit mode will show this) */}
                {!img.src && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity">
                    <div className="flex flex-col items-center gap-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--sf-text-muted)" }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
                      </svg>
                      <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--sf-text-muted)" }}>Image</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

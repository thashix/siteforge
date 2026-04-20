"use client";

import { motion } from "framer-motion";
import type { HeroContent } from "@/types";
import type { SectionProps } from "../types";

// =============================================================================
// HERO SECTION
// =============================================================================
// Variants:
//   "centered" — Full-width centered text with gradient background
//   "split"    — Text on left, decorative visual on right
// =============================================================================

export function HeroSection({
  content,
  variant = "centered",
  sectionId,
}: SectionProps<HeroContent>) {
  if (variant === "split") return <HeroSplit content={content} sectionId={sectionId} />;
  return <HeroCentered content={content} sectionId={sectionId} />;
}

// -- Variant: Centered --------------------------------------------------------

function HeroCentered({
  content,
  sectionId,
}: {
  content: HeroContent;
  sectionId?: string;
}) {
  return (
    <section
      id={sectionId}
      className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[var(--sf-background)]"
    >
      {/* Background gradient orb */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-15 blur-[120px]"
          style={{ backgroundColor: "var(--sf-primary)" }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-[80px]"
          style={{ backgroundColor: "var(--sf-accent)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-[var(--sf-font-heading-weight)] leading-[1.05] tracking-tight mb-6"
          style={{
            fontFamily: "var(--sf-font-heading)",
            color: "var(--sf-text)",
          }}
        >
          {content.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{
            fontFamily: "var(--sf-font-body)",
            color: "var(--sf-text-muted)",
          }}
        >
          {content.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <a
            href={content.ctaLink || "#contact"}
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-[var(--sf-radius)] transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              backgroundColor: "var(--sf-primary)",
              color: "var(--sf-background)",
              fontFamily: "var(--sf-font-body)",
            }}
          >
            {content.ctaText}
            <ArrowIcon />
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
            style={{ borderColor: "var(--sf-text-muted)" }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--sf-text-muted)" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// -- Variant: Split -----------------------------------------------------------

function HeroSplit({
  content,
  sectionId,
}: {
  content: HeroContent;
  sectionId?: string;
}) {
  return (
    <section
      id={sectionId}
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-[var(--sf-background)]"
    >
      <div className="mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Text */}
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-[var(--sf-font-heading-weight)] leading-[1.05] tracking-tight mb-6"
            style={{
              fontFamily: "var(--sf-font-heading)",
              color: "var(--sf-text)",
            }}
          >
            {content.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-lg sm:text-xl max-w-lg mb-8 leading-relaxed"
            style={{
              fontFamily: "var(--sf-font-body)",
              color: "var(--sf-text-muted)",
            }}
          >
            {content.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <a
              href={content.ctaLink || "#contact"}
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-[var(--sf-radius)] transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                backgroundColor: "var(--sf-primary)",
                color: "var(--sf-background)",
                fontFamily: "var(--sf-font-body)",
              }}
            >
              {content.ctaText}
              <ArrowIcon />
            </a>
          </motion.div>
        </div>

        {/* Decorative visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative hidden lg:block"
        >
          <div className="aspect-square rounded-3xl overflow-hidden relative">
            {/* Gradient placeholder — replaced by real image in future */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, var(--sf-primary) 0%, var(--sf-secondary) 50%, var(--sf-accent) 100%)`,
                opacity: 0.8,
              }}
            />
            {/* Decorative floating shapes */}
            <motion.div
              animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-32 h-32 rounded-2xl border-2 opacity-30"
              style={{ borderColor: "var(--sf-background)" }}
            />
            <motion.div
              animate={{ y: [10, -10, 10], rotate: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute bottom-1/4 right-1/4 w-20 h-20 rounded-full border-2 opacity-20"
              style={{ borderColor: "var(--sf-background)" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// -- Icons --------------------------------------------------------------------

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
    </svg>
  );
}

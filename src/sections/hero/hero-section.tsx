"use client";

import { motion } from "framer-motion";
import type { HeroContent } from "@/types";
import type { SectionProps } from "../types";

// =============================================================================
// HERO SECTION — PREMIUM
// =============================================================================
// Variants:
//   "centered" — Fullscreen, gradient orbs, eyebrow, scroll indicator
//   "split"    — Text left, decorative visual/image right
//   "minimal"  — Clean centered, no decorative effects
// =============================================================================

export function HeroSection({
  content,
  variant = "centered",
  sectionId,
}: SectionProps<HeroContent>) {
  if (variant === "split") return <HeroSplit content={content} sectionId={sectionId} />;
  if (variant === "minimal") return <HeroMinimal content={content} sectionId={sectionId} />;
  return <HeroCentered content={content} sectionId={sectionId} />;
}

// -- Variant: Centered (Premium Fullscreen) -----------------------------------

function HeroCentered({ content, sectionId }: { content: HeroContent; sectionId?: string }) {
  return (
    <section
      id={sectionId}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--sf-background)" }}
    >
      {/* Gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[150px]"
          style={{ backgroundColor: "var(--sf-primary)", opacity: 0.08 }}
        />
        <div
          className="absolute top-[20%] right-[15%] w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ backgroundColor: "var(--sf-accent)", opacity: 0.05 }}
        />
        <div
          className="absolute bottom-[15%] left-[10%] w-[300px] h-[300px] rounded-full blur-[80px]"
          style={{ backgroundColor: "var(--sf-primary)", opacity: 0.04 }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[200px]"
          style={{ background: `linear-gradient(transparent, var(--sf-background))` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-8 text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[11px] sm:text-xs tracking-[0.25em] uppercase mb-6 sm:mb-8"
          style={{
            fontFamily: "var(--sf-font-body)",
            color: "var(--sf-primary)",
            fontWeight: 400,
          }}
        >
          ✦ &ensp; {content.subheadline.split(".")[0] || content.subheadline}
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] tracking-[-0.02em] mb-6 sm:mb-8"
          style={{
            fontFamily: "var(--sf-font-heading)",
            fontWeight: "var(--sf-font-heading-weight)" as string,
            color: "var(--sf-text)",
          }}
        >
          {formatHeadline(content.headline)}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-10 sm:mb-12 leading-[1.8]"
          style={{
            fontFamily: "var(--sf-font-body)",
            color: "var(--sf-text-muted)",
            fontWeight: 300,
          }}
        >
          {content.subheadline}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a
            href={content.ctaLink || "#contact"}
            className="group inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-[18px] text-[12px] sm:text-[13px] font-bold tracking-[0.08em] uppercase transition-all duration-400 hover:-translate-y-[3px]"
            style={{
              backgroundColor: "var(--sf-primary)",
              color: "var(--sf-background)",
              fontFamily: "var(--sf-font-body)",
              boxShadow: "0 4px 20px color-mix(in srgb, var(--sf-primary) 30%, transparent)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 40px color-mix(in srgb, var(--sf-primary) 40%, transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 20px color-mix(in srgb, var(--sf-primary) 30%, transparent)";
            }}
          >
            {content.ctaText}
            <ArrowIcon />
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span
          className="text-[9px] tracking-[0.2em] uppercase"
          style={{ color: "var(--sf-text-muted)", fontFamily: "var(--sf-font-body)" }}
        >
          Découvrir
        </span>
        <div
          className="w-px h-10"
          style={{ background: `linear-gradient(var(--sf-primary), transparent)` }}
        />
      </motion.div>
    </section>
  );
}

// -- Variant: Split (Image + Text) --------------------------------------------

function HeroSplit({ content, sectionId }: { content: HeroContent; sectionId?: string }) {
  return (
    <section
      id={sectionId}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "var(--sf-background)" }}
    >
      <div className="mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-20 lg:py-0">
        {/* Text */}
        <div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[11px] tracking-[0.2em] uppercase mb-6"
            style={{ color: "var(--sf-primary)", fontFamily: "var(--sf-font-body)" }}
          >
            ✦ &ensp; {content.ctaText}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.08] tracking-[-0.02em] mb-6"
            style={{
              fontFamily: "var(--sf-font-heading)",
              fontWeight: "var(--sf-font-heading-weight)" as string,
              color: "var(--sf-text)",
            }}
          >
            {formatHeadline(content.headline)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-base sm:text-lg max-w-lg mb-8 leading-[1.8]"
            style={{
              fontFamily: "var(--sf-font-body)",
              color: "var(--sf-text-muted)",
              fontWeight: 300,
            }}
          >
            {content.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href={content.ctaLink || "#contact"}
              className="inline-flex items-center gap-2 px-8 py-4 text-[12px] font-bold tracking-[0.08em] uppercase transition-all duration-300 hover:-translate-y-[2px]"
              style={{
                backgroundColor: "var(--sf-primary)",
                color: "var(--sf-background)",
                fontFamily: "var(--sf-font-body)",
              }}
            >
              {content.ctaText}
              <ArrowIcon />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-8 py-4 text-[12px] font-bold tracking-[0.08em] uppercase transition-all duration-300 hover:-translate-y-[2px] border"
              style={{
                borderColor: "var(--sf-primary)",
                color: "var(--sf-primary)",
                fontFamily: "var(--sf-font-body)",
                backgroundColor: "transparent",
              }}
            >
              Nos services
            </a>
          </motion.div>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative hidden lg:block"
        >
          <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, var(--sf-primary) 0%, color-mix(in srgb, var(--sf-primary) 60%, var(--sf-accent)) 50%, var(--sf-accent) 100%)`,
                opacity: 0.75,
              }}
            />
            {/* Floating decorative elements */}
            <motion.div
              animate={{ y: [-8, 8, -8], rotate: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-[20%] left-[20%] w-24 h-24 rounded-2xl border-2 opacity-25"
              style={{ borderColor: "var(--sf-background)" }}
            />
            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute bottom-[25%] right-[15%] w-16 h-16 rounded-full border-2 opacity-15"
              style={{ borderColor: "var(--sf-background)" }}
            />
            {/* Accent dot */}
            <div
              className="absolute top-[60%] left-[60%] w-3 h-3 rounded-full"
              style={{ backgroundColor: "var(--sf-background)", opacity: 0.5 }}
            />
          </div>
          {/* Floating stat card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute -bottom-4 -left-6 px-5 py-3 rounded-xl backdrop-blur-sm border"
            style={{
              backgroundColor: "color-mix(in srgb, var(--sf-surface) 90%, transparent)",
              borderColor: "var(--sf-border)",
            }}
          >
            <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: "var(--sf-text-muted)" }}>Clients satisfaits</p>
            <p className="text-xl font-bold" style={{ color: "var(--sf-primary)", fontFamily: "var(--sf-font-heading)" }}>500+</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// -- Variant: Minimal ---------------------------------------------------------

function HeroMinimal({ content, sectionId }: { content: HeroContent; sectionId?: string }) {
  return (
    <section
      id={sectionId}
      className="relative flex items-center justify-center overflow-hidden py-28 sm:py-36 md:py-44"
      style={{ backgroundColor: "var(--sf-background)" }}
    >
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-[clamp(2rem,5vw,4rem)] leading-[1.1] tracking-[-0.02em] mb-5"
          style={{
            fontFamily: "var(--sf-font-heading)",
            fontWeight: "var(--sf-font-heading-weight)" as string,
            color: "var(--sf-text)",
          }}
        >
          {content.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-base sm:text-lg max-w-xl mx-auto mb-8 leading-[1.8]"
          style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)", fontWeight: 300 }}
        >
          {content.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <a
            href={content.ctaLink || "#contact"}
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-[2px] rounded-[var(--sf-radius)]"
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
    </section>
  );
}

// -- Helpers ------------------------------------------------------------------

/** Highlight the last word or words after a line break in the headline */
function formatHeadline(headline: string) {
  // If headline contains a line break indicator, split and color the second part
  const parts = headline.split(/\n|—|–/);
  if (parts.length > 1) {
    return (
      <>
        {parts[0].trim()}
        <br />
        <span style={{ color: "var(--sf-primary)" }}>{parts.slice(1).join(" ").trim()}</span>
      </>
    );
  }

  // Otherwise, color the last 1-2 significant words
  const words = headline.trim().split(/\s+/);
  if (words.length > 3) {
    const accent = words.slice(-2).join(" ");
    const rest = words.slice(0, -2).join(" ");
    return (
      <>
        {rest}{" "}
        <span style={{ color: "var(--sf-primary)" }}>{accent}</span>
      </>
    );
  }

  return headline;
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
    </svg>
  );
}

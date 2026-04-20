"use client";

import { useRef } from "react";
import { motion, useInView, type Variant } from "framer-motion";
import type { AnimationConfig } from "@/types";

// =============================================================================
// ScrollReveal
// =============================================================================
// Wraps any content with a scroll-triggered entrance animation.
// Used by every section component in generated sites.
// Respects the site's animation preset via the config prop.
// =============================================================================

interface ScrollRevealProps {
  children: React.ReactNode;
  config: AnimationConfig["scrollReveal"];
  /** Delay multiplier for staggered children (0, 1, 2...) */
  index?: number;
  className?: string;
}

const VARIANTS_MAP: Record<
  AnimationConfig["scrollReveal"]["type"],
  { hidden: Variant; visible: Variant }
> = {
  "fade-up": {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
};

export function ScrollReveal({
  children,
  config,
  index = 0,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const variants = VARIANTS_MAP[config.type];
  const delay = config.delay + index * config.stagger;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration: config.duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

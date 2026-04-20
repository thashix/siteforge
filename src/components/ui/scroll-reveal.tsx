"use client";

import { useRef } from "react";
import { motion, useInView, type Variant } from "framer-motion";
import type { AnimationConfig } from "@/types";

// =============================================================================
// ScrollReveal — supports two usage modes:
//   1. Simple: <ScrollReveal delay={0.2}>...</ScrollReveal>
//   2. Full:   <ScrollReveal config={animConfig} index={3}>...</ScrollReveal>
// =============================================================================

export interface ScrollRevealProps {
  children: React.ReactNode;
  config?: AnimationConfig["scrollReveal"];
  index?: number;
  delay?: number;
  className?: string;
}

const VARIANTS_MAP: Record<
  AnimationConfig["scrollReveal"]["type"],
  { hidden: Variant; visible: Variant }
> = {
  "fade-up": { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
  "fade-in": { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  "slide-left": { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  "slide-right": { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
};

const DEFAULT_CONFIG: AnimationConfig["scrollReveal"] = {
  type: "fade-up",
  duration: 0.7,
  delay: 0,
  stagger: 0.08,
};

export function ScrollReveal({
  children,
  config,
  index = 0,
  delay: delayProp,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const cfg = config || DEFAULT_CONFIG;
  const variants = VARIANTS_MAP[cfg.type];
  const computedDelay = delayProp ?? (cfg.delay + index * cfg.stagger);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration: cfg.duration,
        delay: computedDelay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

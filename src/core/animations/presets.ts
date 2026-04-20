import type { AnimationConfig, AnimationPreset } from "@/types";

// =============================================================================
// ANIMATION PRESETS
// =============================================================================
// Three tiers of animation intensity.
// The AI picks the preset based on the site tone:
//   elegant/luxurious → subtle
//   warm/minimal/corporate → moderate
//   bold/playful → expressive
// =============================================================================

export const ANIMATION_PRESETS: Record<AnimationPreset, AnimationConfig> = {
  subtle: {
    scrollReveal: {
      type: "fade-up",
      duration: 0.6,
      delay: 0,
      stagger: 0.08,
    },
    hover: {
      scale: 1.02,
      duration: 0.2,
    },
    pageTransition: {
      type: "fade",
      duration: 0.3,
    },
  },
  moderate: {
    scrollReveal: {
      type: "fade-up",
      duration: 0.7,
      delay: 0.05,
      stagger: 0.1,
    },
    hover: {
      scale: 1.03,
      duration: 0.25,
    },
    pageTransition: {
      type: "slide-up",
      duration: 0.4,
    },
  },
  expressive: {
    scrollReveal: {
      type: "scale",
      duration: 0.8,
      delay: 0.1,
      stagger: 0.12,
    },
    hover: {
      scale: 1.05,
      duration: 0.3,
    },
    pageTransition: {
      type: "slide-up",
      duration: 0.5,
    },
  },
};

/** Map tone to animation preset */
export function getAnimationPresetForTone(
  tone: string
): AnimationPreset {
  switch (tone) {
    case "elegant":
    case "luxurious":
      return "subtle";
    case "bold":
    case "playful":
      return "expressive";
    default:
      return "moderate";
  }
}

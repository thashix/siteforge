import type { AnimationConfig, SectionContent } from "@/types";

// =============================================================================
// Section Component Props
// =============================================================================
// Standard interface that every section component must accept.
// This enables the Section Registry to render any section generically.
// =============================================================================

export interface SectionProps<T extends SectionContent = SectionContent> {
  /** The section content data */
  content: T;
  /** Which visual variant to render */
  variant: string;
  /** Animation config from the site's preset */
  animation: AnimationConfig["scrollReveal"];
  /** Section ID for anchor links */
  sectionId?: string;
}

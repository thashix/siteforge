// =============================================================================
// SITEFORGE — Core Domain Types
// =============================================================================
// These types define the entire data flow of the product:
//   UserBrief → SiteBrief → SiteConfig → Rendered Site
//
// Every module in the project depends on these types.
// Modify with extreme care.
// =============================================================================

// -----------------------------------------------------------------------------
// 1. USER BRIEF — Raw input from the user
// -----------------------------------------------------------------------------

/** What the user provides via the brief wizard */
export interface UserBrief {
  /** Free-text description of what they want */
  description: string;
  /** Optional: business name */
  businessName?: string;
  /** Optional: explicit style preferences */
  stylePreferences?: string;
  /** Optional: explicit color preferences */
  colorPreferences?: string;
}

// -----------------------------------------------------------------------------
// 2. SITE BRIEF — Structured output from AI analysis
// -----------------------------------------------------------------------------

/** The AI-analyzed, normalized version of the user's brief */
export interface SiteBrief {
  /** Detected business sector */
  sector: BusinessSector;
  /** Business name (extracted or provided) */
  businessName: string;
  /** Short tagline / slogan */
  tagline: string;
  /** Visual tone of the site */
  tone: SiteTone;
  /** Suggested color palette key */
  paletteKey: string;
  /** Suggested font pairing key */
  fontPairingKey: string;
  /** Ordered list of section types to include */
  sections: SectionType[];
  /** Generated content for each section */
  sectionContents: Record<string, SectionContent>;
  /** Additional metadata */
  meta: BriefMeta;
}

export type BusinessSector =
  | "beauty"
  | "restaurant"
  | "health"
  | "legal"
  | "creative"
  | "coaching"
  | "tech"
  | "realestate"
  | "education"
  | "retail"
  | "other";

export type SiteTone =
  | "elegant"
  | "bold"
  | "minimal"
  | "warm"
  | "playful"
  | "corporate"
  | "luxurious";

export interface BriefMeta {
  /** City / location if mentioned */
  location?: string;
  /** Target audience description */
  targetAudience?: string;
  /** Key services / offerings */
  services?: string[];
  /** Language of the site */
  language: string;
}

// -----------------------------------------------------------------------------
// 3. SECTION TYPES & CONTENT
// -----------------------------------------------------------------------------

export type SectionType =
  | "hero"
  | "services"
  | "about"
  | "gallery"
  | "testimonials"
  | "cta"
  | "pricing"
  | "faq"
  | "contact"
  | "footer";

/** Base content shared by all sections */
interface BaseSectionContent {
  type: SectionType;
}

export interface HeroContent extends BaseSectionContent {
  type: "hero";
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink?: string;
}

export interface ServicesContent extends BaseSectionContent {
  type: "services";
  title: string;
  subtitle?: string;
  items: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface AboutContent extends BaseSectionContent {
  type: "about";
  title: string;
  text: string;
  highlights?: string[];
}

export interface GalleryContent extends BaseSectionContent {
  type: "gallery";
  title: string;
  subtitle?: string;
  /** Images — can be placeholder gradients or real uploaded images */
  images: Array<{
    alt: string;
    placeholder: string;
    /** Base64 data URL or external URL of the real image */
    src?: string;
  }>;
}

export interface TestimonialsContent extends BaseSectionContent {
  type: "testimonials";
  title: string;
  items: Array<{
    quote: string;
    author: string;
    role?: string;
  }>;
}

export interface CtaContent extends BaseSectionContent {
  type: "cta";
  headline: string;
  subheadline?: string;
  buttonText: string;
  buttonLink?: string;
}

export interface PricingContent extends BaseSectionContent {
  type: "pricing";
  title: string;
  subtitle?: string;
  plans: Array<{
    name: string;
    price: string;
    features: string[];
    highlighted?: boolean;
  }>;
}

export interface FaqContent extends BaseSectionContent {
  type: "faq";
  title: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ContactContent extends BaseSectionContent {
  type: "contact";
  title: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface FooterContent extends BaseSectionContent {
  type: "footer";
  businessName: string;
  tagline?: string;
  links?: Array<{ label: string; href: string }>;
  copyright?: string;
}

/** Union of all section content types */
export type SectionContent =
  | HeroContent
  | ServicesContent
  | AboutContent
  | GalleryContent
  | TestimonialsContent
  | CtaContent
  | PricingContent
  | FaqContent
  | ContactContent
  | FooterContent;

// -----------------------------------------------------------------------------
// 4. SITE CONFIG — Complete renderable site definition
// -----------------------------------------------------------------------------

/** A single page within a site */
export interface PageConfig {
  /** Unique page ID */
  id: string;
  /** Page display name (shown in nav) */
  name: string;
  /** URL slug (e.g. "a-propos") — "index" for the home page */
  slug: string;
  /** Ordered list of sections on this page */
  sections: SectionConfig[];
}

/** The complete configuration needed to render a site */
export interface SiteConfig {
  /** Unique site identifier */
  id: string;
  /** Site metadata */
  meta: SiteMeta;
  /** Theme configuration */
  theme: ThemeConfig;
  /** Pages of the site — if empty/undefined, use legacy `sections` field */
  pages?: PageConfig[];
  /** Ordered list of sections with their config (legacy single-page mode) */
  sections: SectionConfig[];
  /** Animation preset */
  animationPreset: AnimationPreset;
}

export interface SiteMeta {
  title: string;
  description: string;
  language: string;
  favicon?: string;
}

/** Individual section within a site */
export interface SectionConfig {
  /** Unique ID for this section instance */
  id: string;
  /** Section type */
  type: SectionType;
  /** Which visual variant to use */
  variant: string;
  /** Content for this section */
  content: SectionContent;
  /** Optional per-section style overrides */
  styleOverrides?: Record<string, string>;
}

// -----------------------------------------------------------------------------
// 5. THEME CONFIG
// -----------------------------------------------------------------------------

export interface ThemeConfig {
  /** Palette identifier */
  paletteKey: string;
  /** Resolved color values */
  colors: ColorPalette;
  /** Font pairing identifier */
  fontPairingKey: string;
  /** Resolved font values */
  fonts: FontPairing;
  /** Border radius scale */
  borderRadius: "none" | "sm" | "md" | "lg" | "full";
  /** Spacing scale multiplier (1 = default) */
  spacingScale: number;
}

export interface ColorPalette {
  /** Primary brand color */
  primary: string;
  /** Secondary accent */
  secondary: string;
  /** Background color */
  background: string;
  /** Surface/card background */
  surface: string;
  /** Primary text color */
  text: string;
  /** Muted/secondary text */
  textMuted: string;
  /** Accent for CTAs and highlights */
  accent: string;
  /** Border color */
  border: string;
}

export interface FontPairing {
  /** Display / heading font family */
  heading: string;
  /** Body text font family */
  body: string;
  /** Heading font weight */
  headingWeight: number;
  /** Body font weight */
  bodyWeight: number;
}

// -----------------------------------------------------------------------------
// 6. ANIMATION CONFIG
// -----------------------------------------------------------------------------

export type AnimationPreset = "subtle" | "moderate" | "expressive";

export interface AnimationConfig {
  /** Scroll reveal animation */
  scrollReveal: {
    type: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale";
    duration: number;
    delay: number;
    stagger: number;
  };
  /** Hover effects on interactive elements */
  hover: {
    scale: number;
    duration: number;
  };
  /** Page transition */
  pageTransition: {
    type: "fade" | "slide-up";
    duration: number;
  };
}

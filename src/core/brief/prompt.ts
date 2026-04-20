// =============================================================================
// BRIEF ANALYZER — System Prompt
// =============================================================================
// This prompt is the brain of SiteForge. It instructs Claude to transform
// a free-text user brief into a structured SiteBrief JSON.
//
// CRITICAL: Any change here directly impacts generation quality.
// Test with multiple briefs after any modification.
// =============================================================================

import { PALETTES, FONT_PAIRINGS } from "@/core/theme";

const AVAILABLE_PALETTES = Object.keys(PALETTES);
const AVAILABLE_FONTS = Object.keys(FONT_PAIRINGS);

/** Palette descriptions for the AI to make informed choices */
const PALETTE_DESCRIPTIONS: Record<string, string> = {
  "noir-gold": "Dark luxurious theme — black background, gold accents. Best for: beauty, luxury, upscale.",
  "ocean-blue": "Clean professional blue on white. Best for: tech, corporate, health, coaching.",
  "sage-natural": "Warm natural green on cream. Best for: wellness, organic, eco, coaching.",
  "warm-terracotta": "Warm earthy terracotta on light. Best for: restaurant, artisan, handmade.",
  "soft-blush": "Soft pink feminine on white. Best for: beauty, fashion, wedding, lifestyle.",
  "modern-slate": "Modern indigo-purple on white. Best for: tech, startup, creative agency.",
  "arctic-white": "Crisp sky-blue on pure white. Best for: medical, dental, clean services.",
  "dark-emerald": "Dark theme with emerald accents. Best for: tech, finance, modern luxury.",
};

const FONT_DESCRIPTIONS: Record<string, string> = {
  "playfair-lato": "Elegant serif headings + clean sans body. Classic luxury feel.",
  "space-dm": "Geometric modern sans. Tech-forward, clean.",
  "cormorant-montserrat": "Refined thin serif + structured sans. Sophisticated, editorial.",
  "sora-inter": "Rounded modern sans duo. Friendly, professional.",
  "fraunces-outfit": "Characterful serif + geometric sans. Warm, distinctive.",
  "clash-cabinet": "Bold display sans duo. Punchy, creative, contemporary.",
};

export function buildAnalysisPrompt(): string {
  return `You are the AI engine of SiteForge, a SaaS that generates professional websites.

Your job: analyze a user's brief (free-text description of their business/site needs) and produce a structured JSON object called SiteBrief.

## STRICT RULES

1. Output ONLY valid JSON. No markdown, no backticks, no explanation, no preamble.
2. Every field must be populated — never leave required fields empty.
3. Generate realistic, professional content in the SAME LANGUAGE as the user's brief.
4. Content must feel written by a real copywriter — not generic AI filler.
5. Adapt the tone, vocabulary and style to the business sector.
6. Choose sections that make sense for the specific business — not every site needs every section.
7. Always include: hero, at least 2 middle sections, contact, footer (minimum 5 sections).
8. Maximum 10 sections. Typical: 6-8 sections.
9. Section order must follow conversion-oriented logic: hero first, footer last, CTA before contact.

## AVAILABLE PALETTES
${AVAILABLE_PALETTES.map((k) => `- "${k}": ${PALETTE_DESCRIPTIONS[k] || k}`).join("\n")}

## AVAILABLE FONT PAIRINGS
${AVAILABLE_FONTS.map((k) => `- "${k}": ${FONT_DESCRIPTIONS[k] || k}`).join("\n")}

## OUTPUT SCHEMA

{
  "sector": one of: "beauty" | "restaurant" | "health" | "legal" | "creative" | "coaching" | "tech" | "realestate" | "education" | "retail" | "other",
  "businessName": "string — extracted from brief or invented if not provided",
  "tagline": "string — short catchy tagline for the business (max 15 words)",
  "tone": one of: "elegant" | "bold" | "minimal" | "warm" | "playful" | "corporate" | "luxurious",
  "paletteKey": one of: ${JSON.stringify(AVAILABLE_PALETTES)},
  "fontPairingKey": one of: ${JSON.stringify(AVAILABLE_FONTS)},
  "sections": ["hero", ...ordered section types..., "footer"],
  "sectionContents": {
    "hero": {
      "type": "hero",
      "headline": "string — powerful main headline (5-10 words)",
      "subheadline": "string — supporting text (15-25 words)",
      "ctaText": "string — call-to-action button text (2-4 words)"
    },
    "services": {
      "type": "services",
      "title": "string",
      "subtitle": "string (optional)",
      "items": [
        { "title": "string", "description": "string (1-2 sentences)", "icon": "string (emoji)" }
      ] // 3-6 items
    },
    "about": {
      "type": "about",
      "title": "string",
      "text": "string (2-4 sentences about the business)",
      "highlights": ["string", "string", "string"] // 3-4 key strengths
    },
    "gallery": {
      "type": "gallery",
      "title": "string",
      "subtitle": "string (optional)",
      "images": [
        { "alt": "string — description of what image should show", "placeholder": "gradient" }
      ] // 4-6 items
    },
    "testimonials": {
      "type": "testimonials",
      "title": "string",
      "items": [
        { "quote": "string (1-2 sentences, realistic)", "author": "string (first name + last initial)", "role": "string (optional)" }
      ] // 3-4 items
    },
    "cta": {
      "type": "cta",
      "headline": "string — compelling call to action",
      "subheadline": "string (optional)",
      "buttonText": "string (2-4 words)"
    },
    "pricing": {
      "type": "pricing",
      "title": "string",
      "subtitle": "string (optional)",
      "plans": [
        { "name": "string", "price": "string (e.g. '29€/mois')", "features": ["string"], "highlighted": boolean }
      ] // 2-3 plans
    },
    "faq": {
      "type": "faq",
      "title": "string",
      "items": [
        { "question": "string", "answer": "string (1-3 sentences)" }
      ] // 4-6 items
    },
    "contact": {
      "type": "contact",
      "title": "string",
      "subtitle": "string (optional)",
      "email": "string (optional, realistic placeholder)",
      "phone": "string (optional)",
      "address": "string (optional, use location from brief if available)"
    },
    "footer": {
      "type": "footer",
      "businessName": "string",
      "tagline": "string (optional — reuse or shorten the main tagline)",
      "copyright": "string (e.g. '© 2025 BusinessName. Tous droits réservés.')"
    }
  },
  "meta": {
    "location": "string or null — city/region if mentioned",
    "targetAudience": "string or null — who the site targets",
    "services": ["string"] — list of key services/offerings extracted,
    "language": "string — language code (fr, en, nl, etc.)"
  }
}

IMPORTANT:
- Only include sections listed in the "sections" array in "sectionContents"
- The keys in "sectionContents" must match the items in "sections"
- Choose palette and fonts that genuinely match the business and requested style
- If the user mentions specific colors (e.g. "noir et or"), pick the closest matching palette
- Generate content that is specific to THIS business, not generic templates
- For services items, use relevant emojis as icons (💇, 🍽️, 💪, etc.)
- Testimonial quotes should feel authentic — varied lengths, natural language
- FAQ answers should be genuinely helpful for the specific business type`;
}

/** Build the user message for the AI call */
export function buildUserMessage(brief: {
  description: string;
  businessName?: string;
  stylePreferences?: string;
  colorPreferences?: string;
}): string {
  let message = `Analyze this brief and generate the SiteBrief JSON:\n\n`;
  message += `DESCRIPTION: ${brief.description}\n`;

  if (brief.businessName) {
    message += `BUSINESS NAME: ${brief.businessName}\n`;
  }
  if (brief.stylePreferences) {
    message += `STYLE PREFERENCES: ${brief.stylePreferences}\n`;
  }
  if (brief.colorPreferences) {
    message += `COLOR PREFERENCES: ${brief.colorPreferences}\n`;
  }

  return message;
}

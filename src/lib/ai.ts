// =============================================================================
// AI SERVICE — Anthropic Claude Integration
// =============================================================================
// Handles all communication with the Anthropic API.
// Currently used for brief analysis. Designed to be extended for
// content refinement, section suggestions, etc.
// =============================================================================

import type { SiteBrief, UserBrief } from "@/types";
import { siteBriefSchema } from "@/core/brief/schemas";
import { buildAnalysisPrompt, buildUserMessage } from "@/core/brief/prompt";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 4096;

interface AnalysisResult {
  success: true;
  data: SiteBrief;
}

interface AnalysisError {
  success: false;
  error: string;
}

export type BriefAnalysisResult = AnalysisResult | AnalysisError;

/**
 * Analyze a user brief using Claude and return a structured SiteBrief.
 *
 * Flow:
 * 1. Build system prompt (includes available palettes, fonts, schema)
 * 2. Build user message from the brief
 * 3. Call Anthropic API
 * 4. Extract JSON from response
 * 5. Validate with Zod schema
 * 6. Return typed SiteBrief
 */
export async function analyzeBrief(
  userBrief: UserBrief
): Promise<BriefAnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "ANTHROPIC_API_KEY is not configured",
    };
  }

  const systemPrompt = buildAnalysisPrompt();
  const userMessage = buildUserMessage(userBrief);

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[AI] Anthropic API error:", response.status, errorBody);
      return {
        success: false,
        error: `API error: ${response.status}`,
      };
    }

    const data = await response.json();

    // Extract text content from Claude's response
    const textContent = data.content?.find(
      (block: { type: string }) => block.type === "text"
    );

    if (!textContent?.text) {
      return {
        success: false,
        error: "No text content in AI response",
      };
    }

    // Parse JSON from the response
    const rawJson = extractJson(textContent.text);

    if (!rawJson) {
      console.error("[AI] Failed to extract JSON from response:", textContent.text.substring(0, 500));
      return {
        success: false,
        error: "Failed to parse AI response as JSON",
      };
    }

    // Sanitize data before validation — fix common AI mistakes
    sanitizeBriefData(rawJson);

    // Validate against our schema
    const validation = siteBriefSchema.safeParse(rawJson);

    if (!validation.success) {
      console.error("[AI] Schema validation failed:", validation.error.issues);
      return {
        success: false,
        error: `Validation failed: ${validation.error.issues.map((e: { message: string }) => e.message).join(", ")}`,
      };
    }

    return {
      success: true,
      data: validation.data as SiteBrief,
    };
  } catch (err) {
    console.error("[AI] Unexpected error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Extract JSON from a string that might contain markdown fences or preamble.
 * Tries multiple strategies:
 * 1. Direct parse (if response is pure JSON)
 * 2. Extract from ```json ... ``` blocks
 * 3. Find first { ... last } in the string
 */
function extractJson(text: string): Record<string, unknown> | null {
  const trimmed = text.trim();

  // Strategy 1: Direct parse
  try {
    return JSON.parse(trimmed);
  } catch {
    // Continue to next strategy
  }

  // Strategy 2: Extract from code fences
  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // Continue
    }
  }

  // Strategy 3: Find outermost braces
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    } catch {
      // All strategies failed
    }
  }

  return null;
}

/**
 * Fix common AI output issues before Zod validation.
 * The AI sometimes returns values that are close but not exact matches.
 */
function sanitizeBriefData(data: Record<string, unknown>): void {
  const VALID_TONES = ["elegant", "bold", "minimal", "warm", "playful", "corporate", "luxurious"];
  const VALID_SECTORS = ["beauty", "restaurant", "health", "legal", "creative", "coaching", "tech", "realestate", "education", "retail", "other"];
  const VALID_PALETTES = ["noir-gold", "ocean-blue", "sage-natural", "warm-terracotta", "soft-blush", "modern-slate", "arctic-white", "dark-emerald"];
  const VALID_FONTS = ["playfair-lato", "space-dm", "cormorant-montserrat", "sora-inter", "fraunces-outfit", "clash-cabinet"];

  // Fix tone
  if (typeof data.tone === "string" && !VALID_TONES.includes(data.tone)) {
    const toneMap: Record<string, string> = {
      professional: "corporate",
      modern: "bold",
      luxury: "luxurious",
      fun: "playful",
      friendly: "warm",
      clean: "minimal",
      classic: "elegant",
      sophisticated: "elegant",
      dark: "luxurious",
      tech: "bold",
      creative: "bold",
    };
    data.tone = toneMap[data.tone.toLowerCase()] || "elegant";
  }

  // Fix sector
  if (typeof data.sector === "string" && !VALID_SECTORS.includes(data.sector)) {
    data.sector = "other";
  }

  // Fix palette
  if (typeof data.paletteKey === "string" && !VALID_PALETTES.includes(data.paletteKey)) {
    data.paletteKey = "modern-slate";
  }

  // Fix font
  if (typeof data.fontPairingKey === "string" && !VALID_FONTS.includes(data.fontPairingKey)) {
    data.fontPairingKey = "space-dm";
  }

  // Ensure sections array exists (even if empty for multi-page)
  if (!Array.isArray(data.sections)) {
    data.sections = [];
  }

  // Ensure sectionContents exists
  if (!data.sectionContents || typeof data.sectionContents !== "object") {
    data.sectionContents = {};
  }

  // Ensure meta exists
  if (!data.meta || typeof data.meta !== "object") {
    data.meta = { language: "fr" };
  }
}

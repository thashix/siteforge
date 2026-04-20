import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// POST /api/generate/modify
// =============================================================================
// Optimized: AI returns JSON patches (search/replace) instead of full HTML.
// This is 5-10x faster and more reliable than rewriting 15000 tokens.
//
// Flow:
// 1. Send HTML + instruction to Claude
// 2. Claude returns an array of {search, replace} patches
// 3. We apply them sequentially to the HTML
// 4. Return the modified HTML
// =============================================================================

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

export async function POST(request: NextRequest) {
  try {
    const { html, instruction } = await request.json();

    if (!html || !instruction) {
      return NextResponse.json({ success: false, error: "HTML and instruction required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "AI service not configured" }, { status: 500 });
    }

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: MODIFY_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `CURRENT HTML:\n\n${html}\n\n---\n\nINSTRUCTION: ${instruction}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[Modify] API error:", response.status, err);
      return NextResponse.json({ success: false, error: `API error: ${response.status}` }, { status: 422 });
    }

    const data = await response.json();
    const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
    if (!textBlock?.text) {
      return NextResponse.json({ success: false, error: "No response from AI" }, { status: 422 });
    }

    // Try to parse as JSON patches first
    const patches = extractPatches(textBlock.text);

    if (patches && patches.length > 0) {
      // Apply patches
      let modifiedHtml = html;
      let appliedCount = 0;

      for (const patch of patches) {
        if (patch.search && modifiedHtml.includes(patch.search)) {
          modifiedHtml = modifiedHtml.replace(patch.search, patch.replace);
          appliedCount++;
        }
      }

      if (appliedCount > 0) {
        return NextResponse.json({
          success: true,
          html: modifiedHtml,
          message: `${appliedCount} modification${appliedCount > 1 ? "s" : ""} appliquée${appliedCount > 1 ? "s" : ""}`,
        });
      }
    }

    // Fallback: if patches didn't work, try to extract full HTML
    const fullHtml = extractHtml(textBlock.text);
    if (fullHtml) {
      return NextResponse.json({ success: true, html: fullHtml, message: "Site modifié" });
    }

    return NextResponse.json({ success: false, error: "Impossible d'appliquer les modifications" }, { status: 422 });

  } catch (err) {
    console.error("[Modify] Error:", err);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}

const MODIFY_SYSTEM_PROMPT = `You are modifying an existing HTML website based on the user's instruction.

## OUTPUT FORMAT
Output a JSON array of search/replace patches. Each patch replaces a specific string in the HTML.

Format:
[
  {
    "search": "exact string to find in the HTML",
    "replace": "new string to replace it with"
  }
]

## RULES
1. Output ONLY the JSON array. No markdown, no backticks, no explanation.
2. The "search" value must be an EXACT substring from the current HTML (copy it precisely).
3. Make the minimum number of patches needed. Don't rewrite everything.
4. Each search string must be unique enough to match only once.
5. Keep all existing functionality (animations, menu, accordion).
6. For color changes, patch the CSS custom properties in the :root { } block.
7. For text changes, patch only the specific text elements.
8. For adding new elements, find the right insertion point and include surrounding context in "search".
9. For image changes, use Unsplash URLs: https://images.unsplash.com/photo-{id}?w=1200&h=800&fit=crop&q=80
10. Write content in the same language as the existing site.

## EXAMPLES

User: "Change the main title to 'Bienvenue chez nous'"
Output:
[{"search": "<h1 class=\\"hero-title\\">L'Excellence au bout des doigts</h1>", "replace": "<h1 class=\\"hero-title\\">Bienvenue chez nous</h1>"}]

User: "Change the accent color to blue"
Output:
[{"search": "--accent: #C8A45C;", "replace": "--accent: #3B82F6;"},{"search": "--accent-light: #E8D5A8;", "replace": "--accent-light: #93C5FD;"}]

User: "Add a new service: Consulting"
Output:
[{"search": "</div>\\n    <!-- end services grid -->", "replace": "<div class=\\"service-card\\">\\n<div class=\\"service-icon\\">💼</div>\\n<h3>Consulting</h3>\\n<p>Accompagnement stratégique personnalisé pour votre entreprise.</p>\\n</div>\\n</div>\\n<!-- end services grid -->"}]`;

function extractPatches(text: string): Array<{ search: string; replace: string }> | null {
  const trimmed = text.trim();

  // Direct JSON parse
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].search !== undefined) {
      return parsed;
    }
  } catch {}

  // Extract from code fences
  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    try {
      const parsed = JSON.parse(fenceMatch[1].trim());
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }

  // Find array in text
  const first = trimmed.indexOf("[");
  const last = trimmed.lastIndexOf("]");
  if (first !== -1 && last > first) {
    try {
      const parsed = JSON.parse(trimmed.slice(first, last + 1));
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }

  return null;
}

function extractHtml(text: string): string | null {
  const trimmed = text.trim();
  if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html") || trimmed.startsWith("<!doctype")) {
    return trimmed;
  }
  const fenceMatch = trimmed.match(/```(?:html)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) return fenceMatch[1].trim();
  const docIdx = trimmed.indexOf("<!DOCTYPE");
  const htmlIdx = trimmed.indexOf("<html");
  const start = docIdx !== -1 ? docIdx : htmlIdx;
  if (start !== -1) {
    const end = trimmed.lastIndexOf("</html>");
    if (end !== -1) return trimmed.slice(start, end + 7);
    return trimmed.slice(start);
  }
  return null;
}

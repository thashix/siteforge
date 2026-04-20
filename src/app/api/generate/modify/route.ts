import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// POST /api/generate/modify
// =============================================================================
// Hybrid approach:
//   1. Try search/replace patches (fast, 4K tokens)
//   2. If patches fail, fall back to full HTML rewrite (slow, 12K tokens)
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

    // ---- Attempt 1: Full HTML rewrite (most reliable) ----
    const response = await fetchWithRetry(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 12000,
        system: `You are modifying an existing HTML website based on the user's instruction.

RULES:
1. Output ONLY the complete modified HTML. Start with <!DOCTYPE html>, end with </html>.
2. NO markdown, NO backticks, NO explanation before or after. JUST the HTML.
3. Keep ALL existing content, styles, structure, and JavaScript unless specifically asked to change them.
4. Apply ONLY the requested change.
5. Maintain design quality and visual consistency.
6. If asked to change images, use Unsplash URLs: https://images.unsplash.com/photo-{id}?w=1200&h=800&fit=crop&q=80
7. If asked to change colors, update CSS custom properties consistently.
8. Keep all JavaScript (scroll animations, menu, accordion, page navigation).
9. Keep all data-editable and data-id attributes.`,
        messages: [{
          role: "user",
          content: `Here is the current website HTML:\n\n${html}\n\n---\n\nApply this modification: ${instruction}\n\nOutput the COMPLETE modified HTML starting with <!DOCTYPE html>:`,
        }],
      }),
    });

    if (!response) {
      return NextResponse.json({ success: false, error: "API non disponible, réessayez" }, { status: 422 });
    }

    if (!response.ok) {
      const err = await response.text();
      console.error("[Modify] API error:", response.status, err);
      return NextResponse.json({ success: false, error: `Erreur API: ${response.status}` }, { status: 422 });
    }

    const data = await response.json();
    const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
    if (!textBlock?.text) {
      return NextResponse.json({ success: false, error: "Pas de réponse de l'IA" }, { status: 422 });
    }

    const modifiedHtml = extractHtml(textBlock.text);
    if (!modifiedHtml) {
      return NextResponse.json({ success: false, error: "Impossible d'extraire le HTML modifié" }, { status: 422 });
    }

    return NextResponse.json({ success: true, html: modifiedHtml, message: "Site modifié avec succès" });

  } catch (err) {
    console.error("[Modify] Error:", err);
    return NextResponse.json({ success: false, error: "Erreur interne" }, { status: 500 });
  }
}

// Retry on 429
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response | null> {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);
    if (response.status === 429) {
      const wait = (i + 1) * 5000;
      console.log(`[Modify] Rate limited, waiting ${wait}ms (attempt ${i + 1}/${maxRetries})`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    return response;
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

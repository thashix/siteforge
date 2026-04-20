import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// POST /api/generate/modify
// =============================================================================
// Takes existing HTML + instruction, returns modified HTML.
// Used by the AI chat panel to make changes to generated sites.
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
        max_tokens: 16000,
        system: `You are a web designer modifying an existing HTML website based on a user's instruction.

RULES:
1. Output ONLY the complete modified HTML. Start with <!DOCTYPE html>, end with </html>.
2. NO markdown, NO backticks, NO explanation. JUST the full HTML.
3. Keep ALL existing content, styles, and structure unless the user specifically asks to change them.
4. Apply ONLY the requested change. Don't remove or alter anything else.
5. Maintain the same design quality and visual consistency.
6. If asked to change images, use Unsplash URLs: https://images.unsplash.com/photo-{id}?w=1200&h=800&fit=crop&q=80
7. If asked to change colors, update the CSS custom properties consistently throughout.
8. Keep all JavaScript functionality (scroll animations, menu, accordion, etc.).`,
        messages: [
          {
            role: "user",
            content: `Here is the current website HTML:\n\n${html}\n\n---\n\nUser instruction: ${instruction}\n\nOutput the COMPLETE modified HTML:`,
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

    // Extract HTML
    const modifiedHtml = extractHtml(textBlock.text);
    if (!modifiedHtml) {
      return NextResponse.json({ success: false, error: "Failed to extract modified HTML" }, { status: 422 });
    }

    return NextResponse.json({ success: true, html: modifiedHtml });
  } catch (err) {
    console.error("[Modify] Error:", err);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
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

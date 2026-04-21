import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// POST /api/generate/modify — Gemini Flash
// =============================================================================

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function POST(request: NextRequest) {
  try {
    const { html, instruction } = await request.json();

    if (!html || !instruction) {
      return NextResponse.json({ success: false, error: "HTML and instruction required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Gemini API key not configured" }, { status: 500 });
    }

    const prompt = `You are modifying an existing HTML website based on the user's instruction.

RULES:
1. Output ONLY the complete modified HTML. Start with <!DOCTYPE html>, end with </html>.
2. NO markdown, NO backticks, NO explanation. JUST the full HTML.
3. Keep ALL existing content, styles, structure, and JavaScript unless specifically asked to change.
4. Apply ONLY the requested change. Don't remove or alter anything else.
5. Maintain design quality and visual consistency.
6. If changing images, use Unsplash: https://images.unsplash.com/photo-{id}?w=1200&h=800&fit=crop&q=80
7. If changing colors, update CSS custom properties consistently.
8. Keep all JavaScript (animations, menu, accordion).
9. Keep all data-editable attributes.
10. Write in the same language as the existing site.

CURRENT HTML:
${html}

---

INSTRUCTION: ${instruction}

Output the COMPLETE modified HTML starting with <!DOCTYPE html>:`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 20000,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[Modify] Gemini error:", response.status, err);
      return NextResponse.json({ success: false, error: `Erreur: ${response.status}` }, { status: 422 });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json({ success: false, error: "Pas de réponse" }, { status: 422 });
    }

    const modifiedHtml = extractHtml(text);
    if (!modifiedHtml) {
      return NextResponse.json({ success: false, error: "HTML invalide" }, { status: 422 });
    }

    return NextResponse.json({ success: true, html: modifiedHtml, message: "Site modifié avec succès" });

  } catch (err) {
    console.error("[Modify] Error:", err);
    return NextResponse.json({ success: false, error: "Erreur interne" }, { status: 500 });
  }
}

function extractHtml(text: string): string | null {
  const t = text.trim();
  if (t.startsWith("<!DOCTYPE") || t.startsWith("<!doctype") || t.startsWith("<html")) return t;
  const m = t.match(/```(?:html)?\s*\n?([\s\S]*?)\n?```/);
  if (m) return m[1].trim();
  const s = Math.max(t.indexOf("<!DOCTYPE"), t.indexOf("<!doctype"), t.indexOf("<html"));
  if (s !== -1) {
    const e = t.lastIndexOf("</html>");
    return e !== -1 ? t.slice(s, e + 7) : t.slice(s);
  }
  return null;
}
